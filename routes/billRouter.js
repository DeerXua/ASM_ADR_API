const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bill = require('../models/bills');
const Product = require('../models/products');

// ================= CART =================

// Thêm sản phẩm vào giỏ hàng
// POST http://localhost:3000/bills/cart/add
router.post('/cart/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        console.log('>>> /bills/cart/add body = ', req.body);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('>>> userId KHÔNG hợp lệ:', userId);
            return res.status(400).json({ message: 'userId không hợp lệ' });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.log('>>> productId KHÔNG hợp lệ:', productId);
            return res.status(400).json({ message: 'productId không hợp lệ' });
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'quantity phải > 0' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            console.log('>>> Product không tồn tại:', productId);
            return res.status(404).json({ message: 'Product không tồn tại' });
        }

        let bill = await Bill.findOne({ user: userId, status: 'Cart' });
        if (!bill) {
            bill = new Bill({ user: userId, items: [], total: 0, status: 'Cart' });
        }

        const index = bill.items.findIndex(i => i.product.toString() === productId);
        if (index > -1) {
            bill.items[index].quantity += quantity;
        } else {
            bill.items.push({ product: productId, quantity });
        }

        const populatedBill = await bill.populate('items.product');
        bill.total = populatedBill.items.reduce((sum, item) =>
            sum + item.product.price * item.quantity, 0
        );

        await bill.save();
        console.log('>>> Thêm giỏ hàng OK, bill id = ', bill._id);
        res.json({ message: 'Thêm vào giỏ hàng thành công', bill });
    } catch (error) {
        console.error('ERROR /bills/cart/add:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lấy giỏ hàng của user
// GET http://localhost:3000/bills/cart/:userId
router.get('/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('>>> /bills/cart/:userId = ', userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('>>> userId KHÔNG hợp lệ:', userId);
            return res.status(400).json({ message: 'userId không hợp lệ' });
        }

        const bill = await Bill.findOne({ user: userId, status: 'Cart' })
            .populate('items.product');

        if (!bill) {
            console.log('>>> Chưa có bill giỏ hàng cho user:', userId);
            return res.json({ items: [], total: 0 });
        }

        console.log('>>> Trả bill giỏ hàng, items = ', bill.items.length);
        res.json(bill);
    } catch (error) {
        console.error('ERROR /bills/cart/:userId:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Xóa sản phẩm khỏi giỏ hàng
// DELETE http://localhost:3000/bills/cart/remove
router.delete('/cart/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        console.log('>>> /bills/cart/remove body = ', req.body);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'userId không hợp lệ' });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'productId không hợp lệ' });
        }

        const bill = await Bill.findOne({ user: userId, status: 'Cart' });
        if (!bill) return res.status(404).json({ message: 'Giỏ hàng trống' });

        bill.items = bill.items.filter(i => i.product.toString() !== productId);

        const populatedBill = await bill.populate('items.product');
        bill.total = populatedBill.items.reduce((sum, item) =>
            sum + item.product.price * item.quantity, 0
        );

        await bill.save();
        res.json({ message: 'Xóa sản phẩm thành công', bill });
    } catch (error) {
        console.error('ERROR /bills/cart/remove:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Checkout
router.post('/checkout', async (req, res) => {
    try {
        const { userId } = req.body;
        console.log('>>> /bills/checkout body = ', req.body);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'userId không hợp lệ' });
        }

        const bill = await Bill.findOne({ user: userId, status: 'Cart' })
            .populate('items.product');

        if (!bill || bill.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        bill.status = 'Pending';
        await bill.save();

        res.json({ message: 'Checkout thành công', bill });
    } catch (error) {
        console.error('ERROR /bills/checkout:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Lịch sử order
router.get('/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('>>> /bills/orders/:userId = ', userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'userId không hợp lệ' });
        }

        const bills = await Bill.find({ user: userId, status: { $ne: 'Cart' } })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json(bills);
    } catch (error) {
        console.error('ERROR /bills/orders:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
