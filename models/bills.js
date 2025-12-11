const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, default: 0 },
  status: { type: String, default: 'Cart' } // Cart: giỏ hàng tạm, Pending/Confirmed: order
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);
