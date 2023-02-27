const router = require("express").Router();
const { login, register, me, cart, showProducts } = require("../controllers/auth.controller");
const authValidation = require("../middlewares/validations/auth.validation");
const {tokenCheck} = require("../middlewares/auth")
const productmodel = require("../models/product.model")

router.post("/login", authValidation.login, login);

router.post("/register", authValidation.register, register);

router.get("/me", tokenCheck, me)

router.get("/products", tokenCheck, showProducts)

router.post("/cart", tokenCheck, cart)

router.post("/insertproduct", async(req, res) => {
    const newproduct = new productmodel(req.body);
    try {
        await newproduct.save()
        res.status(200).json({
            message: "Product inserted successfully!"
        })
    } catch (error) {
        res.status(500).json({
            message: "Couldn't insert product!"
        })
    }
})

module.exports = router;
