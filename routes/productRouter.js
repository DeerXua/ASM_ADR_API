const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/products');

// ========== SEARCH THEO TÊN ==========
router.get('/search/:name', async (req, res) => {
  try {
    const keyword = req.params.name || '';
    const products = await Product.find({
      name: { $regex: keyword, $options: 'i' }
    });
    return res.status(200).json(products);
  } catch (err) {
    console.error('ERROR /products/search:', err);
    return res.status(500).json({ message: err.message });
  }
});

// ========== LẤY LIST + LỌC THEO cateID ==========
// GET /products
// GET /products?cateID=...
router.get('/', async (req, res) => {
  try {
    const { cateID } = req.query;
    let filter = {};

    console.log('>>> cateID từ client:', cateID);

    if (cateID) {
      // cateID phải là ObjectId hợp lệ
      if (!mongoose.Types.ObjectId.isValid(cateID)) {
        console.log('>>> cateID KHÔNG hợp lệ:', cateID);
        return res.status(400).json({ message: 'cateID không hợp lệ' });
      }

      filter = { category: new mongoose.Types.ObjectId(cateID) };
    }

    console.log('>>> filter dùng để find:', filter);

    const products = await Product.find(filter);

    console.log('>>> SỐ SẢN PHẨM tìm được:', products.length);
    return res.status(200).json(products);
  } catch (err) {
    console.error('ERROR /products:', err);
    return res.status(500).json({ message: err.message });
  }
});

// ========== LẤY CHI TIẾT THEO ID ==========
// GET /products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error('ERROR /products/:id:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
