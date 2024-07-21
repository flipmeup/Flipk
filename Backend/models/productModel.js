const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    image: String,
    name: String,
    mrp: Number,
    sellingPrice: Number,
    assuredImage: String,
    description: String,
    sizes: [String],
    variant: String,
    carousel_images: [String],
    colors: [{
        name: String,
        image: String
    }]
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
