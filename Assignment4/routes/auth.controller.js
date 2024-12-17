const express = require("express");
router = express()
const User = require("../models/user.model");

router.get("/login", (req,res)=>{
    return res.render("login");
})
router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
      const newUser = new User({
        name,
        email,
        password,
        role: [role]  // You can add more roles if needed
      });
  
      newUser.save();
      res.send('User created successfully!');
      res.redirect("homepage");
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Error during sign-up');
    }

  });
  
module.exports = router;