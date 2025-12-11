const express = require('express');
const router = express.Router();
const Account = require('../models/accounts');

// Đăng ký
//http://localhost:3000/accounts/register
router.post('/register', async (req, res) => {
    try {
  const { Email, Password, FullName } = req.body;
  const newAccount = new Account({ Email, Password, FullName });
    const account = await newAccount.save();
    if (!account) {
            return res.status(400).json({ message: 'Đăng ký thất bại' });
    } 
        res.json({ message: 'Đăng ký thành công', account });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đăng nhập
//http://localhost:3000/accounts/login
router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const account = await Account.findOne({ Email, Password });
        if (!account) return res.status(400).json({ message: 'Sai Email hoặc Password' });
        res.json({ message: 'Đăng nhập thành công', account });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cập nhật thông tin
//http://localhost:3000/accounts/id
router.put('/:id', async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Cập nhật thành công', account });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
