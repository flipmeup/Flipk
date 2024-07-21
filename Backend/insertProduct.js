// insertProducts.js

const mongoose = require('mongoose');
const Product = require('./models/productModel'); // Adjust the path as needed

// Replace with your MongoDB URI
const MONGODB_URI = 'mongodb+srv://root:toor@cluster0.gqgk6wn.mongodb.net/flipkart?retryWrites=true&w=majority';

// Data to insert into database
const products = [
    {
        id: 1,
        image: "/assets/products/p1.jpg",
        name: "Arch Fit - 1 - Modern Rhythm",
        mrp: 5499,
        sellingPrice: 399,
        assuredImage: "/assets/logo/assured.png",
        description: "Product description for Modern Rhythm...",
        sizes: ["6", "7", "8", "9", "10", "11"],
        variant: "Select Size",
        carousel_images: ["/assets/products/p1.jpg", "/assets/products/p1.jpg", "/assets/products/p1.jpg"]
    },
    {
        id: 2,
        image: "/assets/products/p1.jpg",
        name: "Arch Fit - Modern Style",
        mrp: 4999,
        sellingPrice: 749,
        assuredImage: "/assets/logo/assured.png",
        description: "Product description for Modern Style...",
        sizes: ["7", "8", "9", "10", "11", "12"],
        variant: "Select Size",
        carousel_images: ["/assets/products/p1.jpg", "/assets/products/p1.jpg", "/assets/products/p1.jpg"]
    }
];

// Function to connect to MongoDB and insert products
async function insertProducts() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Product.insertMany(products);
        console.log('Products inserted successfully');
    } catch (err) {
        console.error('Error inserting products:', err);
    } finally {
        // Close the connection after inserting
        mongoose.connection.close();
    }
}

// Call the function to insert products
insertProducts();
