const express = require("express");
const productController = require("../controllers/product");
const multer = require("multer");
const fs = require("fs");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

const productRouter = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const currDate = req.body.createdAt;
    req.date = currDate;

    !fs.existsSync(`public/products/${currDate}`) &&
      fs.mkdirSync(`public/products/${currDate}`, { recursive: true });
    cb(null, "public/products/" + currDate);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const upload = multer({ storage });

const type = upload.any([{ name: "productImages", maxCount: 10 }]);

productRouter.post("/", isAdmin, type, productController.createProduct);
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.put("/:id", isAdmin, type, productController.updateProduct);
productRouter.delete("/:id", isAdmin, productController.deleteProduct);

module.exports = productRouter;
