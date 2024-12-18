const express = require("express");
router = express()
let bcrypt = require('bcryptjs');
const User = require("../models/user.model");

router.get("/login", (req,res)=>{
    return res.render("login");
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  // Check password (assuming hashed passwords)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send("Invalid email or password");
  }

  // Save user data to session
  req.session.user = {
    _id: user._id,
    role: user.role, // Ensure this is correct (array)
    email: user.email,
  };
  console.log("User saved to session:", req.session.user);

  // Redirect after login
  res.redirect("/");
});


router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
      const newUser = new User({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: ["customer"]  // You can add more roles if needed
      });
      
      console.log(newUser);
      newUser.save();
      res.redirect("/");
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Error during sign-up');
    }

  });
  router.get("/logout", (req, res) => {
  req.session.user = null; // Clear the session
  res.redirect("/login"); // Redirect to login page
});
module.exports = router;