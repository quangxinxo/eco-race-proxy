// server/server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

app.post("/upload", async (req, res) => {
  try {
    const { imageBase64, name } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "Thiếu dữ liệu ảnh" });

    const form = new URLSearchParams();
    form.append("key", IMGBB_API_KEY);
    form.append("image", imageBase64);
    if (name) form.append("name", name);

    const response = await fetch(IMGBB_ENDPOINT, {
      method: "POST",
      body: form,
    });

    const data = await response.json();
    if (!data.success) return res.status(500).json({ error: "Upload thất bại", details: data });

    res.json({ url: data.data.url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy server chạy tại http://localhost:${PORT}`));
