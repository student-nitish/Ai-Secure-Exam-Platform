
require("dotenv").config();
require("./utils/examStatusUpdater");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { initSocket } = require("./socket/socket");



const cors = require("cors");
const cookieParser = require("cookie-parser");

const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

 



// Database connection
const database = require("./config/database");

// Routes
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes"); 
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes =require("./routes/dashboard");
const notificationRoutes=require("./routes/notification");
const leaderBoard=require("./routes/leaderBoard");
const UserRoutes=require("./routes/user");




// Connect DB
database.connect();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
  })
);

cloudinaryConnect();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5174", 
      "http://localhost:5173",// Vite frontend
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard",dashboardRoutes );
app.use("/api/notification",notificationRoutes);
app.use("/api/leaderboard",leaderBoard);
app.use("/api/users",UserRoutes);



// Default route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Exam Platform Backend Running 🚀",
  });
});

// Initialize socket
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

