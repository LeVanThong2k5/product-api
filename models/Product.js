import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    pid: {
      type: String,
      required: [true, "Product ID is required"],
      unique: true,
      trim: true
    },
    pname: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be non-negative"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be non-negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer"
      }
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;