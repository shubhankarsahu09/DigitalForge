const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow CORS from the frontend Vite app
app.use(cors());

app.get('/download', async (req, res) => {
  try {
    const { url, format } = req.query;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid or missing YouTube URL' });
    }

    if (!['audio', 'video'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format requested' });
    }

    // Get video info to set the filename dynamically
    const info = await ytdl.getInfo(url);
    // Sanitize title to avoid issues with special characters in filenames
    const title = info.videoDetails.title.replace(/[^\w\s-]/gi, '_');

    if (format === 'audio') {
      res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
      // We stream the highest audio quality available
      ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
        .pipe(res)
        .on('error', (err) => {
          console.error('Download error:', err);
          if (!res.headersSent) res.status(500).end();
        });
    } else if (format === 'video') {
      res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
      // Stream video and audio combined
      // ytdl-core 'highest' usually provides 720p with audio, or we can use 'highestvideo' 
      // but highestvideo often doesn't have audio. 'highest' provides both if available.
      ytdl(url, { filter: 'audioandvideo', quality: 'highest' })
        .pipe(res)
        .on('error', (err) => {
          console.error('Download error:', err);
          if (!res.headersSent) res.status(500).end();
        });
    }
  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process request' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Node server is running on http://localhost:${PORT}`);
});
