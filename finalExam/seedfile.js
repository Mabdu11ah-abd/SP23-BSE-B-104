const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // To hash the password securely
const UserModel = require('./models/user.model'); // Adjust path if necessary

// MongoDB connection string
const dbURI = 'mongodb://localhost:27017/'; // Replace with your database URI

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedAdminUser();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Function to create the admin user
const seedAdminUser = async () => {
  try {
    // Check if the admin user already exists
    const existingUser = await UserModel.findOne({ email: 'abdullah@gmail.com' });
    
    if (existingUser) {
      console.log('Admin user already exists');
      mongoose.connection.close();
      return;
    }

    // Create an admin user
    const adminUser = new UserModel({
      name: 'abdullah',
      email: 'abdullah@abdullah.com',
      password: await bcrypt.hash('abdullah', 10), // Securely hash the password
      role: ['admin']
    });

    // Save the user to the database
    await adminUser.save();
    console.log('Admin user created successfully');

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
};
