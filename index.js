require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { URL } = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

{/* Project Solution starts here */}
let urlDatabase = [];
let idCounter = 1;

app.use(bodyParser.urlencoded({ extended: false }));

function isValidUrl(urlString) {
  try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
      return false;
  }
}

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  if (!isValidUrl(originalUrl)) {
      return res.json({ error: 'invalid url' });
  }

  const shortUrl = idCounter++;
  urlDatabase.push({ originalUrl, shortUrl });

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl);
  const urlEntry = urlDatabase.find(entry => entry.shortUrl === shortUrl);

  if (urlEntry) {
      res.redirect(urlEntry.originalUrl);
  } else {
      res.json({ error: 'No short URL found for the given input' });
  }
});