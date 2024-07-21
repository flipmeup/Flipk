const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/productModel'); // Import the Product model
const UpiData = require('./models/upiData'); // Import the UPI data model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uri = 'mongodb+srv://flipkart:123flipkart%231@cluster0.oo1tbmj.mongodb.net/Flipkart?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
    
app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

// Routes for products
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id); // Ensure the id is parsed as an integer
        const product = await Product.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const {
            id,
            image,
            name,
            mrp,
            sellingPrice,
            assuredImage,
            description,
            sizes,
            variant,
            carousel_images,
            colors
        } = req.body;

        const newProduct = new Product({
            id,
            image,
            name,
            mrp,
            sellingPrice,
            assuredImage,
            description,
            sizes,
            variant,
            carousel_images,
            colors
        });

        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id); // Ensure the id is parsed as an integer
        const updatedProduct = await Product.findOneAndUpdate({ id: productId }, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id); // Ensure the id is parsed as an integer
        const deletedProduct = await Product.findOneAndDelete({ id: productId });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch UPI data
app.get('/api/upi', async (req, res) => {
    try {
        const upiData = await UpiData.find({});
        res.json(upiData);
    } catch (err) {
        console.error('Error fetching UPI data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update UPI data
app.put('/api/upi/:id', async (req, res) => {
    try {
        const upiId = req.params.id;
        const { upi_id, upi_name, payment_options } = req.body;

        // Find and update UPI data
        const updatedUpiData = await UpiData.findByIdAndUpdate(
            upiId, { upi_id, upi_name, payment_options },
            { new: true } // Return the updated document
        );

        if (!updatedUpiData) {
            return res.status(404).json({ message: 'UPI data not found' });
        }

        res.json(updatedUpiData);
    } catch (err) {
        console.error('Error updating UPI data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Routes for product colors
app.get('/api/products/:id/colors', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await Product.findOne({ id: productId }, 'colors');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product.colors);
    } catch (err) {
        console.error('Error fetching colors:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/products/:id/colors', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { colors } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { id: productId },
            { colors },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct.colors);
    } catch (err) {
        console.error('Error updating colors:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
