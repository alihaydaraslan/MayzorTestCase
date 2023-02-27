const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");
const Cart = require("../models/cart.model");
const products = require("../models/product.model");

const login = async (req, res) => {
  /*
  const { userEmailPhone, password } = req.body;

  const userInfo = await user.findOne({
    $or: [
      {
        email: userEmailPhone,
      },
      {
        phone: userEmailPhone,
      },
    ],
  });

  const comparePassword = await bcrypt.compare(password, userInfo.password);

  if (!userInfo || !comparePassword)
    throw new APIError("Email, phone number or password is incorrect!", 401);
  */

  let userInfo;

  userInfo = await user.findOne({ email: req.body.email });
  if (!userInfo) userInfo = await user.findOne({ phone: req.body.phone });
  if (!userInfo)
    throw new APIError("Email, phone number or password is incorrect!", 401);

  const validatedUser = await bcrypt.compare(
    req.body.password,
    userInfo.password
  );

  if (!validatedUser)
    throw new APIError("Email, phone number or password is incorrect!", 401);

  createToken(userInfo, res);
};

const register = async (req, res) => {
  const { email, phone } = req.body;

  const emailCheck = await user.findOne({ email });
  const phoneNrCheck = await user.findOne({ phone });

  if (emailCheck || phoneNrCheck) {
    throw new APIError("Mail or phone number is already on use!", 401);
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const userSave = new user(req.body);

  await userSave
    .save()
    .then((data) => {
      return new Response(data, "Registration successfully added!").created(
        res
      );
    })
    .catch((err) => {
      throw new APIError(err, 400);
    });
};

const me = async (req, res) => {
  return new Response(req.user).success(res);
};

const showProducts = async (req, res) => {
  try {
    const showProducts = await products.find({});

    return new Response(
      showProducts,
      "The products has been successfully retrieved"
    ).success(res);
  } catch (error) {
    throw new APIError("An error occurred.", 500);
  }
};

const cart = async (req, res) => {
  const { productId, quantity } = req.body;

  const userId = req.user._id;

  let name = await products.findOne({ productId });
  let price = await products.findOne({ productId });

  name = name.name;
  price = price.price;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, quantity, name, price });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        products: [{ productId, quantity, name, price }],
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    throw new APIError("An error occurred.", 500);
  }
};

module.exports = {
  login,
  register,
  me,
  showProducts,
  cart,
};
