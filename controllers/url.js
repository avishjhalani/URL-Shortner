// Dynamic ESM-safe nanoid loader (works on Vercel / Node 18)
let nanoidFn;

async function getNanoId() {
  if (!nanoidFn) {
    const mod = await import('nanoid');
    nanoidFn = mod.nanoid;
  }
  return nanoidFn;
}

const UrlModel = require('../models/url');

// ----------------------------
// CREATE SHORT URL
// ----------------------------
async function handleGenerateNewShortURL(req, res) {
  try {
    const nanoid = await getNanoId();

    const body = req.body;

    if (!body || !body.url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let urlToShorten = body.url.trim();

    // Validate & normalize URL
    try {
      if (
        !urlToShorten.startsWith('http://') &&
        !urlToShorten.startsWith('https://')
      ) {
        urlToShorten = 'https://' + urlToShorten;
      }
      new global.URL(urlToShorten);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let shortID;
    let attempts = 0;

    // Collision-safe ID generation
    do {
      shortID = nanoid(8);
      const exists = await UrlModel.findOne({ shortID });
      if (!exists) break;
      attempts++;
    } while (attempts < 5);

    if (attempts >= 5) {
      return res.status(500).json({
        error: 'Failed to generate unique short URL',
      });
    }

    await UrlModel.create({
      shortID,
      redirectURL: urlToShorten,
      visitHistory: [],
    });

    return res.status(201).json({ id: shortID });
  } catch (err) {
    console.error('Error generating short URL:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ----------------------------
// GET ANALYTICS
// ----------------------------
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
