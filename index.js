const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());

app.get("/stream", async (req, res) => {
  const videoId = req.query.video_id;
  if (!videoId) return res.status(400).send("Missing video_id");

  const url = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highest", filter: "videoandaudio" });

    res.send(format.url); // return direct video URL
  } catch (err) {
    res.status(500).send("Failed to get stream: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
