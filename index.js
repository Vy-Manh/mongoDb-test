const express = require("express");
const bodyParser = require("body-parser");
const { connectToDb, db } = require("./db");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

// Khóa bí mật để tạo mã thông báo (giữ bí mật và không tiết lộ trong mã của bạn)
const secretKey = "khóa-bí-mật-của-bạn";

// Middleware để xác minh mã thông báo JWT (giống như trước)
const authenticateToken = (req, res, next) => {
  // ...
};

// Kết nối đến cơ sở dữ liệu trước
connectToDb((err) => {
  if (err) {
    console.error("Lỗi khi kết nối đến cơ sở dữ liệu:", err);
    return;
  }

  // Định nghĩa điểm cuối API để đăng nhập người dùng (giống như trước)
  app.post("/api/login", (req, res) => {
    // ...
  });

  // Điểm cuối API được bảo vệ yêu cầu xác thực (giống như trước)
  app.get("/api/protected", authenticateToken, (req, res) => {
    // ...
  });

  // Điểm cuối API để lấy danh sách đơn hàng kèm mô tả sản phẩm
  app.get("/api/orders", authenticateToken, async (req, res) => {
    try {
      const ordersWithDescriptions = await db.orders
        .aggregate([
          {
            $lookup: {
              from: "inventories",
              localField: "item",
              foreignField: "sku",
              as: "productInfo"
            }
          },
          {
            $unwind: "$productInfo"
          },
          {
            $project: {
              _id: 1,
              item: 1,
              price: 1,
              quantity: 1,
              productDescription: "$productInfo.description"
            }
          }
        ])
        .toArray();

      res.json(ordersWithDescriptions);
    } catch (error) {
      console.error("Lỗi khi truy vấn đơn hàng:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  });

  // Khởi động máy chủ Express sau khi kết nối cơ sở dữ liệu thành công
  app.listen(3000, () => {
    console.log("Ứng dụng đang chạy tại cổng 3000");
  });
});
