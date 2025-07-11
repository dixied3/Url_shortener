const URL = require("../models/url");
const { nanoid } = require('nanoid');
const ExpressError = require("../utils/ExpressError"); 


module.exports.index = async (req, res) => {
    const allUrls = await URL.find({});
    res.render('home', { id: null, isNew: null, allUrls });
};

module.exports.getNewURL = async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url) {
            req.flash("error", "URL is required!");
            return res.redirect("/");
        }

        const existingEntry = await URL.findOne({ enteredUrl: url });

        if (existingEntry) {
            req.flash("error", "This URL was already shortened");
            return res.redirect("/") ;
        }

        const shortId = nanoid(8);
        const expiryDuration = 10 * 60 * 1000; 

        await URL.create({
            shortId,
            enteredUrl: url,
            vistHistory: [] , 
            expiresAt: Date.now() + expiryDuration
        });

        req.flash("success", "Short URL created successfully!");
        res.redirect("/");
    } catch (err) {
        next(err); // Pass error to global error handler
    }
};

// Redirects short URL to actual one
module.exports.showURL = async (req, res, next) => {
    const { id } = req.params;

    try {
        const entry = await URL.findOne({ shortId: id });

        if (!entry) {
            return next(new ExpressError(404 ,"Short URL not found"));
        }

        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            return next(new ExpressError(410, "This short URL has expired"));
        }

        entry.vistHistory.push({ timestamp: Date.now() });
        await entry.save();

        res.redirect(entry.enteredUrl);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteEntry = async (req, res) => {
    const { shortId } = req.params;

    const entry = await URL.findOne({ shortId });
    if (!entry) {
        req.flash("error", "This URL doesn't exist");
        return res.redirect("/");
    }

    await URL.deleteOne({ shortId });
    req.flash("success", "URL deleted successfully");
    res.redirect("/");
};
