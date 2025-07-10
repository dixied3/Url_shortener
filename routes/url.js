const express = require('express') ; 
const router = express.Router() ; 
const {validateUrlFormat} = require("../middleware") ; 
const urlController = require("../controllers/url") ; 
const URL = require("../models/url") ; 

// GET /url — show form and all existing URLs
router.get('/', urlController.index) ; 

router.post("/url" , validateUrlFormat , urlController.getNewURL) ; 

router.get("/url/:id", urlController.showURL);

router.delete("/url/:shortId/delete" , urlController.deleteEntry ) ; 

module.exports = router ; 