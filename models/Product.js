const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  oldPrice: { type: Number, default: null },
  stock: { type: Number, required: true, min: 0 },
  badge: { type: String, default: '' },
  image: { type: String, default: 'https://via.placeholder.com/400x300?text=MediGo' }
}, { timestamps: true });

// Pre-delete hooks for queries
const logDeleteQuery = function(next) {
  console.log('\n========================================');
  console.log('🚨 MONGOOSE PRODUCT DELETE QUERY DETECTED!');
  console.log('Operation:', this.op);
  console.log('Filter:', this.getFilter ? this.getFilter() : 'N/A');
  console.log('Stack Trace:');
  console.log(new Error().stack);
  console.log('========================================\n');
  next();
};

productSchema.pre('deleteOne', logDeleteQuery);
productSchema.pre('deleteMany', logDeleteQuery);
productSchema.pre('findOneAndDelete', logDeleteQuery);

// Pre-delete hooks for documents
productSchema.pre('remove', function(next) {
  console.log('\n========================================');
  console.log('🚨 MONGOOSE PRODUCT DOCUMENT REMOVE DETECTED!');
  console.log('Document:', this);
  console.log('Stack Trace:');
  console.log(new Error().stack);
  console.log('========================================\n');
  next();
});

module.exports = mongoose.model('Product', productSchema);

