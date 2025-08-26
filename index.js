require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const linkSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: Number,
});

let Link = mongoose.model("Link", linkSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// create short url
app.post('/api/shorturl', function (req, res) {
  // check if url is valid
  try {
    new URL(req.body.url);
  } catch (e) {
    res.json({ error: 'invalid url' });
  }

  let url = new URL(req.body.url);

  // check if url is reachable
  dns.lookup(url.hostname, (err, address, family) => {
    if (err) {
      // url is not reachable
      res.json({ error: 'invalid url' });
    } else {
      // url is reachable
      Link.findOne({ original_url: url }, (err, data) => {
        if (err) return console.error(err);
        if (data) {
          // url already exists in database
          res.json({ original_url: data.original_url, short_url: data.short_url });
        } else {
          // url does not exist in database, create new entry
          Link.countDocuments({}, (err, count) => {
            if (err) return console.error(err);
            let newLink = new Link({
              original_url: url,
              short_url: count + 1,
            });
            newLink.save((err, data) => {
              if (err) return console.error(err);
              res.json({ original_url: data.original_url, short_url: data.short_url });
            });
          });
        }
      });
    }
  });
});

// redirect to original url
app.get('/api/shorturl/:short_url', function (req, res) {
  let short_url = req.params.short_url;
  Link.findOne({ short_url: short_url }, (err, data) => {
    if (err) return console.error(err);
    if (data) {
      res.redirect(data.original_url);
    } else {
      res.json({ error: 'No short URL found for the given input' });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
