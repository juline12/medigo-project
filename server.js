require('dotenv').config();
const dns = require('dns');

dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
  '1.1.1.1'
]);

const path = require('path');
const fs = require('fs');
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const MONGO_URI = process.env.MONGO_URI;

// Trust the first proxy (needed for req.secure to work correctly)
app.set('trust proxy', 1);

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env file');
  process.exit(1);
}

fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Request Logger Middleware ──────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ─── HTTP → HTTPS Redirect ───────────────────────────────────────────────────
// Redirect any plain-HTTP request to the HTTPS equivalent (if FORCE_HTTPS is true)
app.use((req, res, next) => {
  if (process.env.FORCE_HTTPS === 'true' && !req.secure) {
    const httpsPort = process.env.HTTPS_PORT || 3443;
    const host = req.hostname;
    const httpsUrl = `https://${host}:${httpsPort}${req.url}`;
    return res.redirect(301, httpsUrl);
  }
  next();
});

// ─── Security Headers (HTTPS best practices) ─────────────────────────────────
app.use((req, res, next) => {
  // HSTS: tell browsers to always use HTTPS for 1 year
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Block site from being embedded in iframes (clickjacking protection)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Basic XSS filter for older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'medigo_secret_123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: 'auto',
    maxAge: 1000 * 60 * 60 * 2 // 2 hours
  }
}));

async function seedData() {
  const adminEmail = 'admin@medigo.com';
  
  // Find or create admin@medigo.com
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: await bcrypt.hash('medigo.pharamacy', 10),
      role: 'admin'
    });
  } else {
    // Force role: 'admin' and hash password just in case it was changed
    admin.role = 'admin';
    admin.password = await bcrypt.hash('medigo.pharamacy', 10);
    await admin.save();
  }

  // Downgrade any other users with role 'admin' to 'user'
  await User.updateMany(
    { email: { $ne: adminEmail }, role: 'admin' },
    { $set: { role: 'user' } }
  );

  // Ahmed User check
  const ahmedUser = await User.findOne({ email: 'user@medigo.eg' });
  if (!ahmedUser) {
    await User.create({
      name: 'Ahmed User',
      email: 'user@medigo.eg',
      password: await bcrypt.hash('user1234', 10),
      phone: '01012345678',
      role: 'user'
    });
  }

  const count = await Product.countDocuments();

  if (count === 0) {
    await Product.insertMany([
      {
        name: 'Paracetamol 500mg',
        brand: 'Adwia',
        category: 'pain',
        price: 25,
        oldPrice: 35,
        stock: 80,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70'
      },
      {
        name: 'Vitamin C 1000mg',
        brand: 'Pharco',
        category: 'vitamins',
        price: 89,
        stock: 50,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&auto=format&fit=crop&q=70'
      },
      {
        name: 'Cetaphil Cleanser',
        brand: 'Cetaphil',
        category: 'skin',
        price: 210,
        oldPrice: 250,
        stock: 30,
        badge: 'Sale',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&auto=format&fit=crop&q=70'
      },
      {
        name: 'Baby Lotion',
        brand: 'Johnson',
        category: 'baby',
        price: 65,
        stock: 120,
        badge: '',
        image: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&auto=format&fit=crop&q=70'
      },
      {
        name: 'Cough Syrup',
        brand: 'Eva Pharma',
        category: 'cold',
        price: 48,
        stock: 5,
        badge: 'Rx',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=70'
      }
    ]);
  }

  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany([
      { key: 'pain', title: 'Pain Relief', ar: 'مسكنات الألم', fr: 'Antidouleurs', icon: '✚', sub: '' },
      { key: 'vitamins', title: 'Vitamins', ar: 'فيتامينات', fr: 'Vitamines', icon: '🍋', sub: '' },
      { key: 'skin', title: 'Skin Care', ar: 'العناية بالبشرة', fr: 'Soin de peau', icon: '🌿', sub: '' },
      { key: 'baby', title: 'Baby Care', ar: 'العناية بالأطفال', fr: 'Bébé', icon: '👶', sub: '' },
      { key: 'cold', title: 'Cold & Flu', ar: 'البرد والإنفلونزا', fr: 'Rhume et grippe', icon: '🦠', sub: '' },
      { key: 'hair', title: 'Hair Care', ar: 'العناية بالشعر', fr: 'Soins cheveux', icon: '💇', sub: '' },
      { key: 'beauty', title: 'Beauty', ar: 'الجمال', fr: 'Beauté', icon: '💄', sub: '' }
    ]);
  }

  const brandCount = await Brand.countDocuments();
  if (brandCount === 0) {
    await Brand.insertMany([
      { key: 'loreal', title: "L'Oréal Paris", ar: 'لوريال باريس', fr: "L'Oréal Paris", image: 'images/loreal.png' },
      { key: 'laroche', title: 'La Roche Posay', ar: 'لا روش بوزيه', fr: 'La Roche Posay', image: 'images/laroche.png' },
      { key: 'vichy', title: 'Vichy', ar: 'فيشي', fr: 'Vichy', image: 'images/vichy.png' },
      { key: 'cerave', title: 'CeraVe', ar: 'سيرافي', fr: 'CeraVe', image: 'images/cerave.png' },
      { key: 'cetaphil', title: 'Cetaphil', ar: 'سيتافيل', fr: 'Cetaphil', image: 'images/cetaphil.png' }
    ]);
  }
}

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/categories'));
app.use('/api', require('./routes/brands'));
app.use('/api', require('./routes/orders'));
app.use('/api', require('./routes/prescriptions'));
app.use('/api', require('./routes/reminders'));
app.use('/api', require('./routes/support'));
app.use('/api', require('./routes/discount'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/misc'));
app.use('/api', require('./routes/ai'));

// Error handlers
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

// Ensure SSL certificates exist (auto-generate self-signed if missing)
function ensureSSLCerts() {
  const certDir = path.join(__dirname, 'certs');
  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
  }

  // Auto-generate self-signed certificate
  console.log('🔐 No SSL certificates found — generating self-signed certs...');
  const selfsigned = require('selfsigned');
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    keySize: 2048,
    days: 365,
    algorithm: 'sha256'
  });

  fs.mkdirSync(certDir, { recursive: true });
  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);
  console.log('✅ Self-signed certificates saved to certs/');

  return {
    key: pems.private,
    cert: pems.cert
  };
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    await seedData();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🟢 MediGo HTTP  server running on http://localhost:${PORT}`);
    });

    // Start HTTPS server
    try {
      const sslOptions = ensureSSLCerts();
      https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
        console.log(`🔒 MediGo HTTPS server running on https://localhost:${HTTPS_PORT}`);
      });
    } catch (err) {
      console.error('⚠️  HTTPS startup failed (HTTP still running):', err.message);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });