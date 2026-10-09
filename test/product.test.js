
import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Product from "../models/Product.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:MongoLab_2026_Xy9@localhost:27017/productdb?authSource=admin";

test("Product API CRUD integration test", async () => {
  await mongoose.connect(MONGO_URI);

  const pid = `TEST-${Date.now()}`;

  try {
    // Kiểm tra health
    const health = await request(app).get("/health");
    assert.equal(health.status, 200);

    // Thêm sản phẩm
    const created = await request(app)
      .post("/api/products")
      .send({
        pid,
        pname: "Test Guitar",
        price: 1500000,
        quantity: 5
      });

    assert.equal(created.status, 201);

    // Lấy danh sách sản phẩm
    const list = await request(app).get("/api/products");
    assert.equal(list.status, 200);

    // Lấy sản phẩm theo pid
    const found = await request(app).get(`/api/products/${pid}`);
    assert.equal(found.status, 200);

    // Cập nhật sản phẩm
    const updated = await request(app)
      .put(`/api/products/${pid}`)
      .send({
        pname: "Test Guitar Updated",
        price: 1600000,
        quantity: 7
      });

    assert.equal(updated.status, 200);

    // Kiểm tra dữ liệu sau cập nhật
    const checked = await request(app).get(`/api/products/${pid}`);
    console.log("CHECKED STATUS:", checked.status);
    console.log("CHECKED BODY:", checked.body);
    assert.equal(checked.status, 200);
    assert.equal(checked.body.data.pname, "Test Guitar Updated");
    // Xóa sản phẩm
    const deleted = await request(app).delete(`/api/products/${pid}`);
    assert.equal(deleted.status, 200);

    // Kiểm tra sản phẩm đã bị xóa
    const missing = await request(app).get(`/api/products/${pid}`);
    assert.equal(missing.status, 404);
  } finally {
    await Product.deleteOne({ pid });
  }
});

after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});