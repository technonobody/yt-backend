import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";

const app = express();
app.use(cors());

app.get("/stream", async (req, res) => {
  const videoId = req.query.video_id;
  if (!videoId) return res.status(400).send("Missing video_id");

  const url = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const info = await ytdl.getInfo(url);

    // Find first working .m3u8 format
    const format = info.formats.find(f => f.mimeType.includes("application/x-mpegURL"));

    if (!format) {
      return res.status(404).send("No playable stream format found");
    }

    res.send(format.url);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
