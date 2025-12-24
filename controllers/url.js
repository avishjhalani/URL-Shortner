const {nanoid} = require('nanoid');
const URL = require('../models/url')


async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!body || !body.url) return res.status(400).json({error:'URL is required'})

    const shortID = nanoid(8);
    await URL.create({
       shortID : shortID,
       redirectURL :  body.url,
       visitHistory :[],
    });
    return res.json({id: shortID});
}

async function handleGetAnalytics(req,res) {
    const shortID = req.params.shortID;
    const result = await URL.findOne({shortID});
    
    if (!result) {
        return res.status(404).json({error: 'Short URL not found'});
    }
    
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports ={
    handleGenerateNewShortURL,
    handleGetAnalytics,
};

