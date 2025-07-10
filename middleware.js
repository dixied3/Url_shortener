const validateUrlFormat = async(req, res, next) => {
    const { url } = req.body;

    const urlPattern = new RegExp(
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/
    );

    if (!url || !urlPattern.test(url)) {
        req.flash("error" , "Invalid URL format. Make sure it starts with http:// or https://")
        return res.redirect("/") ; 
    }

    next(); // URL is valid, continue to next handler
}


module.exports = {validateUrlFormat} ; 