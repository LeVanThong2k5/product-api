
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// CREATE: Thêm sản phẩm
router.post("/", async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;

    if (!pid || !pname || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const product = await Product.create({
      pid,
      pname,
      price,
      quantity
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Product ID already exists"
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// READ: Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// READ: Lấy một sản phẩm theo pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// UPDATE: Cập nhật sản phẩm theo pid
router.put("/:pid", async (req, res) => {
  try {
    const { pid, ...updates } = req.body;

    const allowedFields = ["pname", "price", "quantity"];
    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid update fields",
        fields: invalidFields
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields provided for update"
      });
    }

    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// DELETE: Xóa sản phẩm theo pid
router.delete("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default router;