import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TransitOps Backend API Running 🚛",
        version: "1.0.0"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Healthy",
        timestamp: new Date().toISOString()
    });
});

app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 TransitOps Backend running on http://localhost:${PORT}`);
});
