const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow CORS from the frontend Vite app
app.use(cors());

app.get('/download', async (req, res) => {
  try {
    const { url, format } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Invalid or missing YouTube URL' });
    }

    if (!['audio', 'video'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format requested' });
    }

    // Get video info to set the filename dynamically
    const info = await youtubedl(url, {
      dumpJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });
    
    // Sanitize title
    const title = (info.title || 'video').replace(/[^\w\s-]/gi, '_');

    if (format === 'audio') {
      res.header('Content-Disposition', `attachment; filename="${title}.webm"`); // or .m4a
      
      const audioStream = youtubedl.exec(url, {
        format: 'bestaudio',
        output: '-', // stdout
      });
      
      audioStream.stdout.pipe(res);
      audioStream.on('error', (err) => {
        console.error('Download error:', err);
        if (!res.headersSent) res.status(500).end();
      });
    } else if (format === 'video') {
      res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
      
      const videoStream = youtubedl.exec(url, {
        format: 'best',
        output: '-', // stdout
      });
      
      videoStream.stdout.pipe(res);
      videoStream.on('error', (err) => {
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
