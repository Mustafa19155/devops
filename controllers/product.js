const Product = require("../models/product");
const fs = require("fs");
const User = require("../models/user");
const calculateDiscount = require("../middlewares/calculateDiscount");

exports.createProduct = async (req, res, next) => {
  try {
    const data = req.body;

    const productImagesUrlArray = [];

    req.files.map((file) => {
      productImagesUrlArray.push(
        file.destination.split("/")[1] +
          "/" +
          file.destination.split("/")[2] +
          "/" +
          file.filename
      );
    });

    data["productImages"] = productImagesUrlArray;

    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const user = req.user;

    const { limit, skip, type } = req.query;

    const obj = {
      type,
    };

    // if (!user?.isAdmin) {
    //   obj["quantity"] = { $gt: 0 };
    // }

    const products = await Product.find(obj)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    for (let i = 0; i < products.length; i++) {
      products[i].price = calculateDiscount(products[i], user);
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.price = calculateDiscount(product, user);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name, price, quantity, features, sizes } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const files = req.files;

    if (files.length > 0) {
      try {
        let folderPath = product.productImages[0].split("/");
        folderPath.pop();

        fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
      } catch (err) {}
    }

    const productImagesUrlArray = [];

    files.map((file) => {
      productImagesUrlArray.push(
        file.destination.split("/")[1] +
          "/" +
          file.destination.split("/")[2] +
          "/" +
          file.filename
      );
    });

    product.name = name;
    product.features = features;
    product.quantity = quantity;
    product.price = price;
    product.sizes = sizes;
    product.productImages =
      files.length > 0 ? productImagesUrlArray : product.productImages;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    try {
      let folderPath = product.productImages[0].split("/");
      folderPath.pop();

      fs.rmSync(`public/${folderPath.join("/")}`, { recursive: true });
    } catch (err) {}

    await Product.deleteOne({ _id: product._id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
