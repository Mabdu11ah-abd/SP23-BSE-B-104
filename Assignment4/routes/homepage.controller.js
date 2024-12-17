const express = require("express");
router = express()

router.get("/", (req, res) => {
    return res.render("index2");
  });


module.exports = router;