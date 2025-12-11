const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, default: '' }, 
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true } // ref tới Category
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
