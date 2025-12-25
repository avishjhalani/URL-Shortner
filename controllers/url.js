const {nanoid} = require('nanoid');
const URL = require('../models/url')


async function handleGenerateNewShortURL(req,res) {
    try {
        const body = req.body;
        if(!body || !body.url) {
            return res.status(400).json({error:'URL is required'});
        }

        // Validate URL format
        let urlToShorten = body.url.trim();
        try {
            // Ensure URL has protocol
            if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
                urlToShorten = 'https://' + urlToShorten;
            }
            new URL(urlToShorten);
        } catch (urlError) {
            return res.status(400).json({error: 'Invalid URL format'});
        }

        // Generate unique shortID (retry if duplicate)
        let shortID;
        let attempts = 0;
        const maxAttempts = 5;
        
        do {
            shortID = nanoid(8);
            const exists = await URL.findOne({ shortID });
            if (!exists) break;
            attempts++;
        } while (attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            return res.status(500).json({error: 'Failed to generate unique short URL'});
        }

        await URL.create({
           shortID : shortID,
           redirectURL : urlToShorten,
           visitHistory :[],
        });
        
        return res.json({id: shortID});
    } catch (error) {
        console.error('Error generating short URL:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

async function handleGetAnalytics(req,res) {
    try {
        const shortID = req.params.shortID;
        
        if (!shortID || shortID.length > 20) {
            return res.status(400).json({error: 'Invalid short ID'});
        }
        
        const result = await URL.findOne({shortID}).select('visitHistory -_id');
        
        if (!result) {
            return res.status(404).json({error: 'Short URL not found'});
        }
        
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error('Error getting analytics:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

module.exports ={
    handleGenerateNewShortURL,
    handleGetAnalytics,
};

