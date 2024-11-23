// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const app = express();
// const port = 3000;

// // Cấu hình CORS và cung cấp các tài nguyên tĩnh từ thư mục 'public'
// app.use(cors());
// app.use(express.static("public"));  // Đảm bảo rằng thư mục 'public' được sử dụng để cung cấp các tài nguyên tĩnh

// // Đảm bảo rằng đường dẫn đến file data.json đúng
// const dataPath = path.join(__dirname, "data.json");
// const data = require(dataPath);

// // API trả về dữ liệu từ file data.json
// app.get("/api/landmarks", (req, res) => {
//     console.log("Dữ liệu danh lam:", data); // Kiểm tra dữ liệu
//     res.json(data);
// });

// // Khởi chạy server tại port 3000
// app.listen(port, () => {
//     console.log(`Server đang chạy tại http://localhost:${port}`);
// });



// const express = require('express');
// const app = express();
// const path = require('path');

// // Serve static files from the "public" folder
// app.use(express.static(path.join(__dirname, '../public')));

// // Route to return data.json
// app.get('/data', (req, res) => {
//     const data = require('./data.json');
//     res.json(data);
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });




const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

// Cấu hình CORS và cung cấp các tài nguyên tĩnh từ thư mục 'public'
app.use(cors());
app.use(express.static("public"));  // Đảm bảo rằng thư mục 'public' được sử dụng để cung cấp các tài nguyên tĩnh

// Đảm bảo rằng đường dẫn đến file data.json đúng
const dataPath = path.join(__dirname, "data.json");
const data = require(dataPath);

// API trả về dữ liệu từ file data.json
app.get("/api/landmarks", (req, res) => {
    console.log("Dữ liệu danh lam:", data); // Kiểm tra dữ liệu
    res.json(data);
});

// Khởi chạy server tại port 3000
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});