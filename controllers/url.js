let nanoid;

async function getNanoId() {
  if (!nanoid) {
    ({ nanoid } = await import('nanoid'));
  }
  return nanoid;
}

const UrlModel = require('../models/url'); // ✅ renamed

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    if (!body || !body.url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let urlToShorten = body.url.trim();

    // ✅ Use global URL constructor safely
    try {
      if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
        urlToShorten = 'https://' + urlToShorten;
      }
      new global.URL(urlToShorten);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let shortID;
    let attempts = 0;

    do {
      shortID = nanoid(8);
      const exists = await UrlModel.findOne({ shortID });
      if (!exists) break;
      attempts++;
    } while (attempts < 5);

    if (attempts >= 5) {
      return res.status(500).json({ error: 'Failed to generate unique short URL' });
    }

    await UrlModel.create({
      shortID,
      redirectURL: urlToShorten,
      visitHistory: [],
    });

    return res.json({ id: shortID });
  } catch (err) {
    console.error('Error generating short URL:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const { shortID } = req.params;

    if (!shortID || shortID.length > 20) {
      return res.status(400).json({ error: 'Invalid short ID' });
    }

    const result = await UrlModel
      .findOne({ shortID })
      .select('visitHistory -_id');

    if (!result) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (err) {
    console.error('Error getting analytics:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
