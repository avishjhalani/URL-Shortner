const express  = require("express");
const urlRoute = require('./routes/url');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');

const app =  express();
const PORT = 8001;

// Middleware to parse JSON bodies
app.use(express.json({ strict: false }));
 
connectToMongoDB('mongodb://localhost:27017/URLSHORT')
.then(()=> console.log('Mongodb connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/url',urlRoute);

app.get('/:shortID',async(req,res)=>{
    const shortID =req.params.shortID;
    const entry = await URL.findOneAndUpdate({
        shortID
    },{$push : {
        visitHistory :{
            timestamp :Date.now(),
        }
    },
}
);
req.redirect(entry.redirectURL)
});
app.listen(PORT ,()=>console.log(`Server Started at port ${PORT}`))