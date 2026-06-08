const API = '';

let currentUser = null;

let pageNow = 1;

let cart = [];


function userKey(type) {
  return currentUser
    ? `medigo_${type}_${currentUser.id}`
    : `medigo_${type}_guest`;
}

function loadUserStorage() {
  cart = JSON.parse(localStorage.getItem(userKey('cart')) || '[]');
 

  renderCart();

}

function saveCart() {
  localStorage.setItem(userKey('cart'), JSON.stringify(cart));
}


let lang = localStorage.getItem('medigo_lang') || 'en';

let theme = localStorage.getItem('medigo_theme') || 'light';

let authMode = 'signin';

const words = {
  en: {
    shop: 'Shop',
    admin: 'Admin',
    upload: 'Upload Prescription',
    orders: 'Orders',
    title: 'Online Pharmacy',
    subtitle: 'Products, users, orders, sessions, uploads, validation and AJAX.',
    products: 'Products',
    search: 'Search product',
    searchBtn: 'Search',
    cart: 'Cart',
    placeOrder: 'Place Order',
    adminPanel: 'Admin Panel',
    saveProduct: 'Save Product',
    uploadBtn: 'Upload',
    external: 'External API'
  },

  ar: {
    shop: 'المتجر',
    admin: 'الأدمن',
    upload: 'رفع الروشتة',
    orders: 'الطلبات',
    title: 'صيدلية أونلاين',
    subtitle: 'منتجات ومستخدمين وطلبات وسيشن ورفع ملفات وفاليديشن و AJAX.',
    products: 'المنتجات',
    search: 'ابحث عن منتج',
    searchBtn: 'بحث',
    cart: 'السلة',
    placeOrder: 'اعمل طلب',
    adminPanel: 'لوحة التحكم',
    saveProduct: 'حفظ المنتج',
    uploadBtn: 'رفع',
    external: 'API خارجي'
  },

  fr: {
    shop: 'Boutique',
    admin: 'Admin',
    upload: 'Ordonnance',
    orders: 'Commandes',
    title: 'Pharmacie en ligne',
    subtitle: 'Produits, utilisateurs, commandes, sessions, uploads, validation et AJAX.',
    products: 'Produits',
    search: 'Chercher un produit',
    searchBtn: 'Chercher',
    cart: 'Panier',
    placeOrder: 'Commander',
    adminPanel: 'Tableau admin',
    saveProduct: 'Enregistrer',
    uploadBtn: 'Téléverser',
    external: 'API externe'
  }
};
const productTranslations = {
  ar: {
    'مزيج': 'مزيج',
    'panadol': 'بانادول',
    'Paracetamol 500mg': 'باراسيتامول 500 مجم',
    'Vitamin C 1000mg': 'فيتامين سي 1000 مجم',
    'Cough Syrup': 'شراب كحة',
    'Baby Lotion': 'لوشن أطفال',
    'Cetaphil Cleanser': 'غسول سيتافيل',
    'Johnson’s Baby Shower': 'شاور أطفال جونسون',
    'tiny cold tablets': 'أقراص برد للأطفال',
    'cough cold & flu': 'كحة وبرد وإنفلونزا',

    'pain': 'مسكنات',
    'vitamins': 'فيتامينات',
    'skin': 'العناية بالبشرة',
    'baby': 'الأطفال',
    'cold': 'البرد والكحة',
    'hair': 'الشعر',
    'beauty': 'الجمال',

    'Add': 'أضف',
    'Remove': 'حذف',
    'Out of stock': 'غير متوفر',
    'No products found': 'لا توجد منتجات',
    'EGP': 'جنيه',
    'Stock': 'المخزون',
    'Cart is empty': 'السلة فارغة',
    'Login to see orders': 'سجل الدخول لعرض الطلبات',
    'No orders': 'لا توجد طلبات',
    'Total': 'الإجمالي'
  },

  fr: {
    'مزيج': 'مزيج',
    'panadol': 'Panadol',
    'Paracetamol 500mg': 'Paracétamol 500mg',
    'Vitamin C 1000mg': 'Vitamine C 1000mg',
    'Cough Syrup': 'Sirop contre la toux',
    'Baby Lotion': 'Lotion bébé',
    'Cetaphil Cleanser': 'Nettoyant Cetaphil',
    'Johnson’s Baby Shower': 'Gel douche bébé Johnson',
    'tiny cold tablets': 'Comprimés rhume enfant',
    'cough cold & flu': 'Toux, rhume et grippe',

    'pain': 'Douleur',
    'vitamins': 'Vitamines',
    'skin': 'Soin de peau',
    'baby': 'Bébé',
    'cold': 'Rhume',
    'hair': 'Cheveux',
    'beauty': 'Beauté',

    'Add': 'Ajouter',
    'Remove': 'Supprimer',
    'Out of stock': 'Rupture de stock',
    'No products found': 'Aucun produit trouvé',
    'EGP': 'EGP',
    'Stock': 'Stock',
    'Cart is empty': 'Le panier est vide',
    'Login to see orders': 'Connectez-vous pour voir les commandes',
    'No orders': 'Aucune commande',
    'Total': 'Total'
  }
};

function tr(text) {
  if (lang === 'en') {
    return text;
  }

  // If text contains Arabic characters → keep as-is in all languages (e.g. مزيج)
  if (/[\u0600-\u06FF]/.test(String(text || ''))) {
    return text;
  }
  
  if (productTranslations[lang]?.[text]) {
    return productTranslations[lang][text];
  }
  
  const dictionary = {
    ar: {
      'paracetamol': 'باراسيتامول',
      'vitamin': 'فيتامين',
      'cough': 'كحة',
      'syrup': 'شراب',
      'baby': 'أطفال',
      'lotion': 'لوشن',
      'cleanser': 'غسول',
      'aspirin': 'أسبرين',
      'cold': 'برد',
      'flu': 'إنفلونزا',
      'extra': 'إكسترا',
      'tablets': 'أقراص',
      'tablet': 'قرص',
      'capsules': 'كبسولات',
      'capsule': 'كبسولة',
      'cream': 'كريم',
      'gel': 'جيل',
      'pain': 'ألم',
      'relief': 'مسكن',
      'panadol': 'بانادول',
      'johnson': 'جونسون',
      'cetaphil': 'سيتافيل',
      'active': 'نشط',
      'daily': 'يومي',
      'care': 'عناية',
      'skin': 'بشرة',
      'mg': 'مجم',
      'ml': 'مل',
      'spray': 'بخاخ',
      'drops': 'نقاط',
      'cleansing': 'تنظيف',
      'wash': 'غسول'
    },
    fr: {
      'paracetamol': 'Paracétamol',
      'vitamin': 'Vitamine',
      'cough': 'Toux',
      'syrup': 'Sirop',
      'baby': 'Bébé',
      'lotion': 'Lotion',
      'cleanser': 'Nettoyant',
      'aspirin': 'Aspirine',
      'cold': 'Rhume',
      'flu': 'Grippe',
      'extra': 'Extra',
      'tablets': 'Comprimés',
      'tablet': 'Comprimé',
      'capsules': 'Capsules',
      'capsule': 'Capsule',
      'cream': 'Crème',
      'gel': 'Gel',
      'pain': 'Douleur',
      'relief': 'Soulagement',
      'panadol': 'Panadol',
      'johnson': 'Johnson',
      'cetaphil': 'Cetaphil',
      'active': 'Actif',
      'daily': 'Quotidien',
      'care': 'Soin',
      'skin': 'Peau',
      'mg': 'mg',
      'ml': 'ml',
      'spray': 'Spray',
      'drops': 'Gouttes',
      'cleansing': 'Nettoyant',
      'wash': 'Lavage'
    }
  };

  const wordsList = String(text || '').toLowerCase().split(/\s+/);
  const translatedWords = wordsList.map(word => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    const numberPart = word.replace(/[^0-9]/g, '');
    const unitPart = word.replace(/[^a-zA-Z]/g, '');
    
    const dict = dictionary[lang];
    if (!dict) return word;

    if (dict[cleanWord]) {
      return numberPart ? numberPart + ' ' + dict[cleanWord] : dict[cleanWord];
    }
    if (dict[unitPart]) {
      return numberPart ? numberPart + ' ' + dict[unitPart] : dict[unitPart];
    }
    return word;
  });

  if (lang === 'fr') {
    return translatedWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return translatedWords.join(' ');
}

function t(key) {
  return (words[lang] || words.en)[key] || key;
}

function toast(message) {
  const el = document.getElementById('toast');

  el.textContent = message;

  el.style.display = 'block';

  setTimeout(() => {
    el.style.display = 'none';
  }, 2500);
}

function changeLang(selectedLang) {

  lang = selectedLang;

  localStorage.setItem('medigo_lang', selectedLang);

  document.documentElement.lang = selectedLang;

  document.documentElement.dir = selectedLang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(element => {

    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {

    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  loadProducts(pageNow);

  renderCart();

  loadOrders();

  loadReminders();
  updateSupportLanguage();

  // Trigger Google Translate for any content not in the dictionary (e.g. admin-added products)
  triggerGoogleTranslate(selectedLang);
}

// Google Translate trigger - translates ALL page content including dynamically added products
function triggerGoogleTranslate(selectedLang) {
  const langMap = { ar: 'ar', fr: 'fr', en: '' };
  const targetLang = langMap[selectedLang];

  setTimeout(() => {
    if (targetLang === '') {
      // Only reload if Google Translate was actually active (cookie has ar or fr value)
      const googtransCookie = document.cookie
        .split(';')
        .map(c => c.trim())
        .find(c => c.startsWith('googtrans='));
      const isTranslated = googtransCookie && /\/(ar|fr)$/.test(googtransCookie);

      if (isTranslated) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
        location.reload();
      }
      // If already English → do nothing, no reload needed
      return;
    }

    // Switch to AR or FR
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change'));
    }
  }, 800);
}

function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';

  localStorage.setItem('medigo_theme', theme);

  applyTheme();
}

function applyTheme() {
  document.body.classList.toggle('dark', theme === 'dark');

  document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
}

async function request(url, options = {}) {
  const res = await fetch(API + url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Error');
  }

  return data;
}
/* AUTH */

function openAuth(mode) {
  authMode = mode;

  document.getElementById('authModal').classList.remove('hidden');

  clearAllFieldErrors();
  
  // Clear input fields to prevent prefilled data
  document.getElementById('authName').value = '';
  document.getElementById('authEmail').value = '';
  document.getElementById('authPassword').value = '';

  if (mode === 'signup') {
    document.getElementById('authTitle').textContent = 'Sign Up';

    document.getElementById('authSubmit').textContent = 'Create Account';

    document.getElementById('nameGroup').classList.remove('hidden');
    
    // Suggest the browser not to autofill password for new accounts
    document.getElementById('authPassword').setAttribute('autocomplete', 'new-password');
  } else {
    document.getElementById('authTitle').textContent = 'Sign In';

    document.getElementById('authSubmit').textContent = 'Sign In';

    document.getElementById('nameGroup').classList.add('hidden');
    
    document.getElementById('authPassword').removeAttribute('autocomplete');
  }
}

function closeAuth() {
  document.getElementById('authModal').classList.add('hidden');
}

async function submitAuth() {
  if (!validateAuthInputs()) {
    return;
  }

  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();

  const url = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/signin';

  const body = authMode === 'signup'
    ? { name, email, password }
    : { email, password };

  try {
    const data = await request(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    currentUser = data.user;

    toast('Welcome ' + currentUser.name);

    closeAuth();

    await checkMe();

    await loadProducts(pageNow);

    await loadOrders();
  } catch (error) {
    handleServerAuthError(error.message);
  }
}



async function logout() {
  try {
    await request('/api/auth/logout', {
      method: 'POST'
    });

    currentUser = null;
    location.hash = '';
showPage('shop');
selectedCategory = 'all';
document.getElementById('supportReply').innerHTML = '';
    toast('Logged out');

    await checkMe();

    await loadProducts(pageNow);
  } catch (error) {
    toast(error.message);
  }
}

async function checkMe() {
  const data = await request('/api/auth/me');

  currentUser = data.user;

  const currentUserEl = document.getElementById('currentUser');

  const signinBtn = document.getElementById('openSigninBtn');

  const signupBtn = document.getElementById('openSignupBtn');

  const logoutBtn = document.getElementById('logoutBtn');

if (currentUser) {

  currentUserEl.textContent =
    `Welcome ${currentUser.name} to MediGo`;

  signinBtn.classList.add('hidden');

  signupBtn.classList.add('hidden');

  logoutBtn.classList.remove('hidden');

} else {

  currentUserEl.textContent = '';

  signinBtn.classList.remove('hidden');

  signupBtn.classList.remove('hidden');

  logoutBtn.classList.add('hidden');
}

const welcomeMsg = document.getElementById('welcomeMsg');

if (welcomeMsg) {

  if (currentUser) {

    welcomeMsg.textContent =
      `Welcome ${currentUser.name} to MediGo`;

  } else {

    welcomeMsg.textContent =
      'Welcome to MediGo';

  }
}

  document.querySelectorAll('.adminOnly').forEach(element => {
    element.classList.toggle('hidden', !currentUser || currentUser.role !== 'admin');
  });
  document.querySelectorAll('.userOnly').forEach(element => {
  element.classList.toggle('hidden', !currentUser || currentUser.role === 'admin');
});
document.querySelectorAll('.userOnly').forEach(el => {
    if (currentUser && currentUser.role === 'admin') {
        el.classList.add('hidden');
    } else {
        el.classList.remove('hidden');
    }
});
  if (currentUser && currentUser.role === 'admin') {
  loadUsers();
  loadAdminSupportMessages();
}
loadUserStorage();
loadSupportMessages();

  loadOrders();
}

/* PRODUCTS */


let selectedCategory = 'all';

function selectCategory(category) {
  selectedCategory = category;
  selectedBrand = 'all';
  selectedBrandTitle = 'all';
  pageNow = 1;
  loadProducts(1);
}
async function loadProducts(page = 1) {
  try {
    pageNow = page;

    const q = document.getElementById('search')?.value.trim() || '';
    const sort = document.getElementById('sort')?.value || '';
    const category = selectedCategory || 'all';
    const brandParam = selectedBrandTitle !== 'all' ? `&brand=${encodeURIComponent(selectedBrandTitle)}` : '';
const data = await request(
  `/api/products?page=1&limit=200&q=${encodeURIComponent(q)}&category=${category}${brandParam}&_=${Date.now()}`
);
    if (sort === 'az') data.products.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') data.products.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'priceLow') data.products.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'priceHigh') data.products.sort((a, b) => Number(b.price) - Number(a.price));
const perPage = 15;
const totalPages = Math.ceil(data.products.length / perPage);
const start = (page - 1) * perPage;
const productsToShow = data.products.slice(start, start + perPage);
    const grid = document.getElementById('productsGrid');

    if (!data.products.length) {
      grid.innerHTML = '<p>No products found</p>';
      document.getElementById('pages').innerHTML = '';
      return;
    }

grid.innerHTML = productsToShow.map(product => {
        const isOut = product.stock <= 0;
      const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

      return `
        <div class="product">
          ${discount > 0 ? `<span class="discountBadge">-${discount}%</span>` : ''}

          <img
            src="${getProxiedImageUrl(product.image)}"
            onerror="this.src='https://via.placeholder.com/400x300?text=MediGo'"
          >

          <h3 ${/[\u0600-\u06FF]/.test(product.name) ? 'translate="no"' : ''}>${tr(product.name)}</h3>

          <div class="muted">
            ${product.brand} - ${tr(product.category)}
          </div>

          <div class="price">
            ${
              product.oldPrice
                ? `
                  <div class="oldPrice">EGP ${product.oldPrice}</div>
                  <div class="newPrice">EGP ${product.price}</div>
                  <span class="saleBadge">SALE</span>
                `
                : `<div class="newPrice">EGP ${product.price}</div>`
            }
          </div>

          ${
            currentUser && currentUser.role === 'admin'
              ? `
                <div class="row">
                  <button onclick='editProduct(${JSON.stringify(product)})'>Edit</button>
                </div>
              `
              : isOut
                ? `<p class="outStock">${tr('Out of stock')}</p>`
                : `
                  <div class="qtyBox">
                    <button onclick="changeTempQty('${product._id}', -1, ${product.stock})">-</button>
                    <span id="qty-${product._id}">1</span>
                    <button onclick="changeTempQty('${product._id}', 1, ${product.stock})">+</button>
                  </div>

                  <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, ${product.stock})">
                    ${tr('Add')}
                  </button>
                `
          }
        </div>
      `;
    }).join('');

    const pagesBox = document.getElementById('pages');
    pagesBox.innerHTML = '';

    for (let pageNumber = 1;pageNumber <= totalPages; pageNumber++) {
      pagesBox.innerHTML += `
        <button
          class="${pageNumber === data.page ? 'activePage' : ''}"
          onclick="loadProducts(${pageNumber}); document.getElementById('shop').scrollIntoView({behavior:'smooth'});"
        >
          ${pageNumber}
        </button>
      `;
    }

  } catch (error) {
    toast(error.message);
  }
}

function changeTempQty(id, change, stock) {
  const qtyEl = document.getElementById('qty-' + id);

  let qty = Number(qtyEl.textContent);

  qty = qty + change;


  if (qty < 1) {
    qty = 1;
  }

  if (qty > stock) {
    qty = stock;

    toast('No more stock available');
  }

  qtyEl.textContent = qty;
}

document.getElementById('productForm').addEventListener('submit', async event => {
  event.preventDefault();

  try {
    const id = document.getElementById('pId').value;

    const body = {
  name: document.getElementById('pName').value,
  brand: document.getElementById('pBrand').value,
  category: document.getElementById('pCategory').value,

  price: Number(document.getElementById('pPrice').value),

  oldPrice:
    Number(document.getElementById('pOldPrice').value) || null,

  stock: Number(document.getElementById('pStock').value),

  image: document.getElementById('pImage').value
};

    await request(id ? `/api/products/${id}` : '/api/products', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body)
    });

    event.target.reset();

    document.getElementById('pId').value = '';

    loadProducts(pageNow);

    toast('Product saved');
  } catch (error) {
    toast(error.message);
  }
});

function editProduct(product) {
  document.getElementById('pId').value = product._id;

  document.getElementById('pName').value = product.name;

  document.getElementById('pBrand').value = product.brand;

  document.getElementById('pCategory').value = product.category;

  document.getElementById('pPrice').value = product.price;

  document.getElementById('pStock').value = product.stock;

  document.getElementById('pImage').value = product.image || '';
document.getElementById('pOldPrice').value = product.oldPrice || '';
  location.hash = 'admin';
}

async function deleteProduct(id) {
  if (!confirm('Delete product?')) {
    return;
  }

  try {
    await request('/api/products/' + id, {
      method: 'DELETE'
    });

    loadProducts(pageNow);

    toast('Deleted');
  } catch (error) {
    toast(error.message);
  }
}

/* CART */

function addToCart(id, name, price, stock) {
  const qtyEl = document.getElementById('qty-' + id);

  const qty = Number(qtyEl.textContent);

  const found = cart.find(item => item.productId === id);

  const oldQty = found ? found.qty : 0;

  if (oldQty + qty > stock) {
    toast('No more stock available');

    return;
  }

  if (found) {
    found.qty = found.qty + qty;
  } else {
    cart.push({
      productId: id,
      name: name,
      price: price,
      stock: stock,
      qty: qty
    });
  }

saveCart();
  renderCart();
updateCartBadge();
  toast('Added to cart');
}
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');

    if (!badge) return;

    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}
function renderCart() {
  updateCartBadge();
  const cartList = document.getElementById('cartList');

  if (!cart.length) {
    cartList.innerHTML = '<p>Cart is empty</p>';

    return;
  }

  cartList.innerHTML = cart.map((item, index) => {
    return `
      <div class="order">
        <b>${item.name}</b>

        <br>

        ${item.qty} x ${item.price} EGP

        <br>

        Total: ${item.qty * item.price} EGP

        <br>

        <button onclick="changeCartQty(${index}, -1)">
          -
        </button>

        <button onclick="changeCartQty(${index}, 1)">
          +
        </button>

        <button class="danger" onclick="removeFromCart(${index})">
          Remove
        </button>
      </div>
    `;
  }).join('');
}

function changeCartQty(index, change) {
  const item = cart[index];

  const newQty = item.qty + change;

  if (newQty < 1) {
    return;
  }

  if (newQty > item.stock) {
    toast('No more stock available');

    return;
  }

  item.qty = newQty;

saveCart();
  renderCart();
  updateCartBadge();
}

function removeFromCart(index) {
  cart.splice(index, 1);

saveCart();
  renderCart();
  updateCartBadge();
}

/* CHECKOUT */

function placeOrder() {
  if (!currentUser) {
    toast('Please login first');

    return;
  }

  if (!cart.length) {
    toast('Cart is empty');

    return;
  }

  document.getElementById('checkoutModal').classList.remove('hidden');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.add('hidden');
}
function toggleVisaFields() {
  const payment = document.querySelector('input[name="paymentMethod"]:checked').value;
  const visaFields = document.getElementById('visaFields');

  if (payment === 'Visa') {
    visaFields.classList.remove('hidden');
  } else {
    visaFields.classList.add('hidden');
  }
}
async function confirmOrder() {
  clearAllCheckoutErrors();
  let hasError = false;

  try {
    const address = document.getElementById('checkoutAddress').value.trim();
    const mobile = document.getElementById('checkoutMobile').value.trim();
    const payment = document.querySelector('input[name="paymentMethod"]:checked').value;
    let cardInfo = null;

    if (!address || address.length < 5) {
      showFieldError('checkoutAddress', lang === 'ar' ? 'يجب أن يكون العنوان 5 أحرف على الأقل' : (lang === 'fr' ? 'L\'adresse doit comporter au moins 5 caractères' : 'Address must be at least 5 characters'));
      hasError = true;
    }

    if (!/^01[0-2,5][0-9]{8}$/.test(mobile)) {
      showFieldError('checkoutMobile', lang === 'ar' ? 'أدخل رقم موبايل مصري صحيح' : (lang === 'fr' ? 'Entrez un numéro de mobile égyptien valide' : 'Enter valid Egyptian mobile number'));
      hasError = true;
    }

    if (payment === 'Visa') {
      const cardHolder = document.getElementById('cardHolder').value.trim();
      const cardNumber = document.getElementById('cardNumber').value.trim();
      const cardExpiry = document.getElementById('cardExpiry').value.trim();
      const cardCvv = document.getElementById('cardCvv').value.trim();

      if (!cardHolder || cardHolder.length < 3) {
        showFieldError('cardHolder', lang === 'ar' ? 'أدخل اسم صاحب الكارت (3 أحرف على الأقل)' : (lang === 'fr' ? 'Entrez le nom du titulaire de la carte' : 'Enter card holder name (at least 3 characters)'));
        hasError = true;
      }

      if (!/^[0-9]{16}$/.test(cardNumber)) {
        showFieldError('cardNumber', lang === 'ar' ? 'أدخل رقم كارت صحيح مكون من 16 رقم' : (lang === 'fr' ? 'Entrez un numéro de carte valide à 16 chiffres' : 'Enter valid 16 digit card number'));
        hasError = true;
      }

      if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardExpiry)) {
        showFieldError('cardExpiry', lang === 'ar' ? 'أدخل تاريخ الانتهاء بصيغة MM/YY' : (lang === 'fr' ? 'Entrez l\'expiration sous la forme MM/YY' : 'Enter expiry as MM/YY'));
        hasError = true;
      }

      if (!/^[0-9]{3}$/.test(cardCvv)) {
        showFieldError('cardCvv', lang === 'ar' ? 'أدخل الرقم السري CVV (3 أرقام)' : (lang === 'fr' ? 'Entrez un CVV valide' : 'Enter valid CVV (3 digits)'));
        hasError = true;
      }

      cardInfo = {
        cardHolder,
        last4: cardNumber.slice(-4),
        cardExpiry
      };
    }

    if (hasError) return;

    const pointsCheckbox = document.getElementById('usePointsCheckbox');
    const usePoints = pointsCheckbox ? pointsCheckbox.checked : false;

    await request('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cart,
        address,
        mobile,
        paymentMethod: payment,
        cardInfo,
        discountCode: appliedDiscount ? appliedDiscount.code : undefined,
        usePoints
      })
    });

    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();

    if (pointsCheckbox) pointsCheckbox.checked = false;
    closeCheckout();

    loadProducts(pageNow);
    loadOrders();

    // Refresh user points
    try {
      const uData = await request('/api/auth/me');
      if (uData && uData.user) {
        currentUser = uData.user;
        const profilePoints = document.getElementById('profilePoints');
        if (profilePoints) profilePoints.textContent = currentUser.points || 0;
      }
    } catch (e) {
      console.error(e);
    }

    let successMsg = 'Order placed successfully! Estimated delivery: 30 - 60 minutes.';
    if (lang === 'ar') {
      successMsg = 'تم عمل الطلب بنجاح! وقت التوصيل المتوقع: من ٣٠ إلى ٦٠ دقيقة.';
    } else if (lang === 'fr') {
      successMsg = 'Commande passée avec succès ! Livraison estimée : 30 - 60 minutes.';
    }
    toast(successMsg);
  } catch (error) {
    const errMsg = error.message;
    const lower = errMsg.toLowerCase();
    if (lower.includes('address')) {
      showFieldError('checkoutAddress', errMsg);
    } else if (lower.includes('mobile') || lower.includes('phone')) {
      showFieldError('checkoutMobile', errMsg);
    } else if (lower.includes('card holder')) {
      showFieldError('cardHolder', errMsg);
    } else if (lower.includes('card number')) {
      showFieldError('cardNumber', errMsg);
    } else if (lower.includes('expiry')) {
      showFieldError('cardExpiry', errMsg);
    } else if (lower.includes('cvv')) {
      showFieldError('cardCvv', errMsg);
    } else {
      toast(errMsg);
    }
  }
}

/* ORDERS */

function getEstimatedDeliveryText(createdAtStr, lang) {
  const createdDate = new Date(createdAtStr);
  const minDate = new Date(createdDate.getTime() + 30 * 60 * 1000);
  const maxDate = new Date(createdDate.getTime() + 60 * 60 * 1000);
  
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  let minTimeStr = minDate.toLocaleTimeString('en-US', options);
  let maxTimeStr = maxDate.toLocaleTimeString('en-US', options);

  if (lang === 'ar') {
    minTimeStr = minTimeStr.replace('AM', 'صباحاً').replace('PM', 'مساءً');
    maxTimeStr = maxTimeStr.replace('AM', 'صباحاً').replace('PM', 'مساءً');
    return `وقت التوصيل المتوقع: اليوم بين ${minTimeStr} و ${maxTimeStr}`;
  } else if (lang === 'fr') {
    const optionsFr = { hour: '2-digit', minute: '2-digit', hour12: false };
    const minFr = minDate.toLocaleTimeString('fr-FR', optionsFr);
    const maxFr = maxDate.toLocaleTimeString('fr-FR', optionsFr);
    return `Livraison estimée : Aujourd'hui entre ${minFr} et ${maxFr}`;
  } else {
    return `Estimated Delivery: Today between ${minTimeStr} and ${maxTimeStr}`;
  }
}

async function loadOrders() {
  const ordersList = document.getElementById('ordersList');

  try {
    if (!currentUser) {
      ordersList.innerHTML = '<p>Login to see orders</p>';

      return;
    }

const orders = await request(`/api/orders?_=${Date.now()}`);
    ordersList.innerHTML = orders.map(order => {
      return `
        <div class="order">
          <b>${order.status}</b> - ${order.total} EGP

          <br>

          ${order.items.map(item => `${item.name} x ${item.qty}`).join(', ')}

          <br>

<small>
  Address: ${order.address}
  <br>
  Mobile: ${order.mobile || 'No mobile'}
  <br>
  Payment: ${order.paymentMethod || 'N/A'}
 <br>
Order Date:
${new Date(order.createdAt).toLocaleDateString()}
<br>
Order Time:
${new Date(order.createdAt).toLocaleTimeString()}
<br>
<span style="display:inline-block; margin-top: 5px; padding: 4px 8px; background: rgba(0, 128, 0, 0.1); color: var(--green); border-radius: 6px; font-weight: bold;">
  ${getEstimatedDeliveryText(order.createdAt, lang)}
</span>
</small>
     ${currentUser.role === 'admin' &&
order.status !== 'Delivered' &&
order.status !== 'Cancelled'
? `
<div class="orderActions">

<button onclick="updateOrder('${order._id}','Confirmed')">
Confirm
</button>

<button onclick="updateOrder('${order._id}','Delivered')">
Delivered
</button>

<button class="danger"
onclick="updateOrder('${order._id}','Cancelled')">
Cancel
</button>

</div>
`
: ''}
        </div>
      `;
    }).join('') || '<p>No orders</p>';
  } catch (error) {
    ordersList.innerHTML = '<p>' + error.message + '</p>';
  }
}

async function updateOrder(id, status) {
  try {
    await request(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });

    toast('Order updated');

    await loadOrders();

    if (typeof refreshAdminDashboard === 'function') {
      await refreshAdminDashboard();
    }

    if (typeof adminTab === 'function') {
      adminTab('orders');
    }

  } catch (error) {
    toast(error.message);
  }
}
/* USERS */

async function loadUsers() {
  const box = document.getElementById('usersListMirror') || document.getElementById('usersList');
  if (!box) return;

  try {
    const users = await request('/api/users');

    box.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td><b>${safeText(user.name)}</b></td>
              <td>${safeText(user.email)}</td>
              <td>${safeText(user.phone || 'No phone')}</td>
              <td>
                <span class="stock-pill ${user.role === 'admin' ? 'low' : ''}">${user.role.toUpperCase()}</span>
              </td>
              <td>
                <div style="display: flex; gap: 8px;">
                  <button class="danger small-btn" onclick="deleteUserById('${user._id}')">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    box.innerHTML = '<p>' + error.message + '</p>';
  }
}

async function toggleUserRole(id, currentRole) {
  try {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await request(`/api/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole })
    });
    toast('User role updated');
    loadUsers();
  } catch (error) {
    toast(error.message);
  }
}

async function deleteUserById(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const res = await request(`/api/users/${id}`, {
      method: 'DELETE'
    });
    toast(res.message || 'User deleted successfully');
    loadUsers();
  } catch (error) {
    toast(error.message);
  }
}

async function loadAdminSupportMessages() {
  const boxes = document.querySelectorAll('[id="supportAdminList"]');
  if (!boxes.length) return;

  // Skip update if admin is currently typing a reply in any reply box
  const activeEl = document.activeElement;
  if (activeEl && activeEl.id && activeEl.id.startsWith('reply-')) {
    return;
  }

  try {
    const messages = await request('/api/admin/support');

    const htmlContent = messages.map(msg => {
      // Sort messages by creation time (oldest first for natural chat flow)
      const threadMsgs = [...(msg.messages || [])].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const chatHistoryHtml = threadMsgs.map(m => `
        <div class="chat-msg ${m.sender === 'user' ? 'user-msg' : 'admin-msg'}">
          <b>${m.sender === 'user' ? 'User' : 'You'}:</b>
          ${safeText(m.text)}
          <div style="font-size: 9px; opacity: 0.7; text-align: right; margin-top: 4px;">
            ${new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      `).join('');

      return `
        <div class="order" style="margin-bottom: 20px; padding: 18px; border: 1px solid var(--border); border-radius: 18px; background: var(--card); box-shadow: var(--shadow);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px;">
            <div>
              <b>User:</b> ${safeText(msg.user?.name || 'Unknown')}
              <br>
              <b>Email:</b> ${safeText(msg.user?.email || 'No email')}
            </div>
            <div>
              <span class="stock-pill ${msg.status === 'Open' ? 'low' : ''}">${msg.status || 'Open'}</span>
            </div>
          </div>

          <div class="chat-box" style="max-height: 250px; overflow-y: auto; margin: 12px 0; border: 1px solid var(--border); padding: 14px; border-radius: 12px; background: var(--bg); display: flex; flex-direction: column; gap: 8px;">
            ${chatHistoryHtml || '<p style="color: var(--muted); font-style: italic; text-align: center; margin: 10px 0;">No messages yet.</p>'}
          </div>

          <div style="display: flex; gap: 10px; align-items: end; margin-top: 12px;">
            <textarea id="reply-${msg._id}" placeholder="Write admin reply..." style="flex: 1; min-height: 60px; padding: 10px; border-radius: 12px; border: 1px solid var(--border); margin: 0;"></textarea>
            <button onclick="sendAdminReply('${msg._id}')" style="height: fit-content; padding: 12px 20px;">
              Send Reply
            </button>
          </div>
        </div>
      `;
    }).join('') || '<div class="empty-state">No support messages found.</div>';

    boxes.forEach(box => {
      box.innerHTML = htmlContent;
    });

  } catch (error) {
    boxes.forEach(box => {
      box.innerHTML = '<p>' + error.message + '</p>';
    });
  }
}

async function sendAdminReply(id) {
  try {
    const textarea = document.getElementById('reply-' + id);
    const reply = textarea.value.trim();

    if (!reply) {
      toast('Write a reply first');
      return;
    }

    await request(`/api/admin/support/${id}/reply`, {
      method: 'PUT',
      body: JSON.stringify({ reply })
    });

    toast('Reply sent');
    textarea.value = '';
    loadAdminSupportMessages();

  } catch (error) {
    toast(error.message);
  }
}

/* PRESCRIPTION */

document.getElementById('rxForm').addEventListener('submit', async event => {
  event.preventDefault();

  try {
    const formData = new FormData();

    formData.append('patientName', document.getElementById('patientName').value);

    formData.append('phone', document.getElementById('phone').value);

    formData.append('notes', document.getElementById('notes').value);

    formData.append('file', document.getElementById('rxFile').files[0]);

    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast('Prescription uploaded');
  } catch (error) {
    toast(error.message);
  }
});

/* EXTERNAL API */

async function getDrugInfo() {
  try {
    const name = document.getElementById('drugName').value || 'aspirin';

    const data = await request('/api/drug-info?name=' + encodeURIComponent(name));

    document.getElementById('drugInfo').textContent = data.source + ': ' + data.result;
  } catch (error) {
    document.getElementById('drugInfo').textContent = error.message;
  }
}
/* REMINDERS */

let reminderAlarm = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');

let remindedToday = {};
document
  .getElementById('reminderFrequency')
  .addEventListener('change', function () {

    const box =
      document.getElementById('extraReminderTimes');

    box.innerHTML = '';

    if (this.value === 'Twice per day') {

      box.innerHTML = `
        <input id="reminderTime2" type="time">
      `;

    } else if (
      this.value === 'Three times per day'
    ) {

      box.innerHTML = `
        <input id="reminderTime2" type="time">

        <input id="reminderTime3" type="time">
      `;
    }
});
async function addReminder() {
  try {
    if (!currentUser) {
      toast('Please login first');

      return;
    }

    const medicineName = document.getElementById('reminderMedicine').value.trim();

const times = [
  document.getElementById('reminderTime')?.value,
  document.getElementById('reminderTime2')?.value,
  document.getElementById('reminderTime3')?.value
].filter(Boolean);
    const frequency = document.getElementById('reminderFrequency').value;

if (!medicineName || !times.length) {
        toast('Enter medicine name and time');

      return;
    }

    await request('/api/reminders', {
      method: 'POST',
      body: JSON.stringify({
        medicineName,
        times,
        frequency
      })
    });

    document.getElementById('reminderMedicine').value = '';

    document.getElementById('reminderTime').value = '';

    loadReminders();

    toast('Reminder added');
  } catch (error) {
    toast(error.message);
  }
}

async function loadReminders() {
  const list = document.getElementById('remindersList');

  if (!list) {
    return;
  }

  if (!currentUser) {
    list.innerHTML = '<p>Login to see reminders</p>';

    return;
  }

  try {
    const reminders = await request('/api/reminders');

    list.innerHTML = reminders.map(reminder => {
      return `
        <div class="order">
          <b>${reminder.medicineName}</b>

          <br>

          Time: ${reminder.time}

          <br>

          Frequency: ${reminder.frequency}

          <br>

          <button class="danger" onclick="deleteReminder('${reminder._id}')">
            Delete
          </button>
        </div>
      `;
    }).join('') || '<p>No reminders yet</p>';
  } catch (error) {
    list.innerHTML = '<p>' + error.message + '</p>';
  }
}

async function deleteReminder(id) {
  try {
    await request('/api/reminders/' + id, {
      method: 'DELETE'
    });

    loadReminders();

    toast('Reminder deleted');
  } catch (error) {
    toast(error.message);
  }
}

function showReminderPopup(medicineName) {

  let popup = document.getElementById('alarmPopup');

  if (!popup) {

    popup = document.createElement('div');

    popup.id = 'alarmPopup';

    popup.className = 'modal';

    popup.innerHTML = `
      <div class="authCard">
        <h2>⏰🚨 Medicine Time</h2>

        <p id="alarmText"></p>

        <button onclick="stopAlarm()">
          Taken / OK
        </button>
      </div>
    `;

    document.body.appendChild(popup);
  }

  document.getElementById('alarmText').textContent =
    'Time to take: ' + medicineName;

  popup.classList.remove('hidden');
}

function stopAlarm() {

  reminderAlarm.pause();

  reminderAlarm.currentTime = 0;

  const popup = document.getElementById('alarmPopup');

  if (popup) {
    popup.classList.add('hidden');
  }
}

async function checkReminderAlarm() {

  if (!currentUser) {
    return;
  }

  try {

    const reminders = await request('/api/reminders');

    const now = new Date();

    const currentTime =
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0');

    const today = now.toDateString();

    reminders.forEach(reminder => {

      const key = reminder._id + '-' + today + '-' + currentTime;

      if (reminder.time === currentTime && !remindedToday[key]) {

        remindedToday[key] = true;

        reminderAlarm.loop = true;

        reminderAlarm.play();

        showReminderPopup(reminder.medicineName);
      }
    });

  } catch (error) {

    console.log(error.message);
  }
}

setInterval(checkReminderAlarm, 15000);
/* BUTTONS */

document.getElementById('openSigninBtn').addEventListener('click', () => {
  openAuth('signin');
});

document.getElementById('openSignupBtn').addEventListener('click', () => {
  openAuth('signup');
});

document.getElementById('closeAuth').addEventListener('click', closeAuth);

document.getElementById('authSubmit').addEventListener('click', submitAuth);

document.getElementById('logoutBtn').addEventListener('click', logout);

/* START */

applyTheme();

changeLang(lang);

checkMe();
loadProducts();
loadReminders();
updateSupportLanguage();
fetchActiveDiscountCode();

let activeDiscountCode = null;
let appliedDiscount = null;

async function fetchActiveDiscountCode() {
  try {
    const data = await request('/api/discount-code');
    activeDiscountCode = data.discountCode;

    const banner = document.getElementById('promoBanner');
    const bannerText = document.getElementById('promoText');
    const discountSection = document.getElementById('discountSection');

    if (activeDiscountCode) {
      if (banner && bannerText) {
        bannerText.innerHTML = `Use coupon code <code style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">${activeDiscountCode.code}</code> to get <b>${activeDiscountCode.discountPercent}%</b> discount at checkout!`;
        banner.classList.remove('hidden');
      }
      if (discountSection) {
        discountSection.classList.remove('hidden');
      }
      const dCode = document.getElementById('dCode');
      const dPercent = document.getElementById('dPercent');
      if (dCode) dCode.value = activeDiscountCode.code;
      if (dPercent) dPercent.value = activeDiscountCode.discountPercent;
    } else {
      if (banner) banner.classList.add('hidden');
      if (discountSection) discountSection.classList.add('hidden');
      const dCode = document.getElementById('dCode');
      const dPercent = document.getElementById('dPercent');
      if (dCode) dCode.value = '';
      if (dPercent) dPercent.value = '';
    }
  } catch (error) {
    console.error('Failed to fetch discount code:', error);
  }
}

async function applyDiscountCode() {
  const input = document.getElementById('checkoutDiscountInput');
  const msg = document.getElementById('discountMsg');
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    msg.style.color = 'red';
    msg.textContent = 'Please enter a code';
    return;
  }

  if (activeDiscountCode && activeDiscountCode.code.toUpperCase() === code) {
    appliedDiscount = {
      code: activeDiscountCode.code,
      discountPercent: activeDiscountCode.discountPercent
    };
    msg.style.color = 'var(--green)';
    msg.textContent = `Coupon applied! ${activeDiscountCode.discountPercent}% discount.`;
    updateDeliverySummary();
  } else {
    appliedDiscount = null;
    msg.style.color = 'red';
    msg.textContent = 'Invalid discount code';
    updateDeliverySummary();
  }
}

async function saveDiscountCode(event) {
  event.preventDefault();
  const code = document.getElementById('dCode').value.trim();
  const percent = Number(document.getElementById('dPercent').value) || 10;

  try {
    const res = await request('/api/admin/discount-code', {
      method: 'POST',
      body: JSON.stringify({ code, discountPercent: percent })
    });
    toast(res.message || 'Discount code saved');
    await fetchActiveDiscountCode();
  } catch (error) {
    toast(error.message);
  }
}
function togglePassword(inputId, el) {

  const input = document.getElementById(inputId);

  if (input.type === 'password') {
    input.type = 'text';
    el.textContent = '👁️';
  } else {
    input.type = 'password';
    el.textContent = '👁';
  }

}
const slides = [
  'Your smart online pharmacy',
  'Upload prescription easily',
  'Medicine reminder for your health'
];

let slideIndex = 0;

setInterval(() => {
  slideIndex = (slideIndex + 1) % slides.length;

  const slideText = document.getElementById('slideText');

  if (slideText) {
    slideText.innerHTML = `
      <h1>Welcome to MediGo</h1>
      <p>${slides[slideIndex]}</p>
    `;
  }
}, 30000);



function showPage(pageId) {
  const selectors = ['#shop', '#cartPage', '#admin', '#reminders', '#upload', '#orders', '#support', '#adminSupport', '#aboutPage', '#contactPage', '#profilePage', '#healthScorePage'];
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden');
  }

  if (pageId === 'cartPage') renderCart();
  if (pageId === 'profilePage') renderProfilePage();

  window.scrollTo(0, 0);
}
const heroSlides = [
  {
    image: 'images/slide1.png',
    title: 'Welcome to MediGo',
    subtitle: 'Pharmacy you can trust'
  },
  {
    image: 'images/slide2.png',
    title: 'Solutions for every concern',
    subtitle: 'Pharmacist supervised • 100% original'
  }
];

let heroIndex = 0;

function changeHeroSlide() {
  heroIndex = (heroIndex + 1) % heroSlides.length;

  const slide = heroSlides[heroIndex];

  document.getElementById('mainSlider').style.backgroundImage =
    `url("${slide.image}")`;

  document.getElementById('slideTitle').textContent = slide.title;

  document.getElementById('slideSub').textContent = slide.subtitle;
}

setInterval(changeHeroSlide, 5000);
function updateSupportLanguage() {
  const title = document.getElementById('supportTitle');
  const welcome = document.getElementById('supportWelcome');
  const message = document.getElementById('supportMessage');

  if (!title || !welcome || !message) return;

  if (lang === 'ar') {
    title.textContent = 'اسأل دعم MediGo';
    welcome.textContent =
      'مرحبًا بك في MediGo. اكتب رسالتك وسيقوم أحد الأدمن بالرد عليك في أقرب وقت.';
    message.placeholder =
      'اسأل عن طلبك، التأخير، الإلغاء، أو كمية منتج معين...';
  } else if (lang === 'fr') {
    title.textContent = 'Contacter le support MediGo';
    welcome.textContent =
      'Bienvenue chez MediGo. Envoyez votre question et un admin vous répondra bientôt.';
    message.placeholder =
      'Demandez votre commande, retard, annulation ou quantité produit...';
  } else {
    title.textContent = 'Ask MediGo Support';
    welcome.textContent =
      'Welcome to MediGo. Send your question and an admin will contact you as soon as possible.';
    message.placeholder =
      'Ask about your order, cancellation, delay, or product quantity...';
  }
}
async function sendSupportMessage() {
  try {
    if (!currentUser) {
      toast('Please login first');
      return;
    }

    const message = document.getElementById('supportMessage').value.trim();

    if (!message) {
      toast('Please write your message');
      return;
    }

    await request('/api/support', {
      method: 'POST',
      body: JSON.stringify({ message })
    });

    document.getElementById('supportMessage').value = '';

    await loadSupportMessages();

    toast('Message sent');
  } catch (error) {
    toast(error.message);
  }
}

let activeSupportId = null;

async function loadSupportMessages() {
  const box = document.getElementById('supportReply');

  if (!box) return;

  if (!currentUser) {
    box.innerHTML = '';
    return;
  }

  // Skip update if user is currently typing a reply
  const activeEl = document.activeElement;
  if (activeEl && activeEl.id === 'chatReply') {
    return;
  }

  const chats = await request('/api/support');

  if (!chats.length) {
    box.innerHTML = `
      <div class="chat-box">
        <p>No support messages yet.</p>
      </div>
    `;
    activeSupportId = null;
    return;
  }

  activeSupportId = chats[0]._id;

  const allMessages = [];

  chats.forEach(chat => {
    (chat.messages || []).forEach(msg => {
      allMessages.push(msg);
    });
  });

  allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  box.innerHTML = `
    <div class="chat-box">
      ${allMessages.map(msg => `
        <div class="chat-msg ${msg.sender === 'user' ? 'user-msg' : 'admin-msg'}">
          <b>${msg.sender === 'user' ? 'You' : 'Admin'}:</b>
          ${safeText(msg.text)}
        </div>
      `).join('')}

      <textarea id="chatReply" placeholder="Write your reply..."></textarea>

      <button onclick="sendSupportReply()">
        Reply
      </button>
    </div>
  `;
}

async function sendSupportReply() {
  try {
    if (!activeSupportId) {
      toast('No active chat found');
      return;
    }

    const input = document.getElementById('chatReply');
    if (!input) {
      toast('Reply box not found');
      return;
    }

    const message = input.value.trim();

    if (!message) {
      toast('Write your reply first');
      return;
    }

    await request('/api/support', {
      method: 'POST',
      body: JSON.stringify({
        supportId: activeSupportId,
        message
      })
    });

    input.value = '';
    await loadSupportMessages();

    toast('Reply sent');
  } catch (error) {
    toast(error.message);
  }
}

function toggleOrders() {
  const list = document.getElementById('ordersList');
  const btn = document.querySelector('#orders .toggleBtn');

  if (list.classList.contains('hidden')) {
    list.classList.remove('hidden');
    btn.textContent = '▼';
  } else {
    list.classList.add('hidden');
    btn.textContent = '▲';
  }
}
/* =====================================================
   MEDIGO UI UPGRADE - professional frontend layer
   Added without changing existing backend logic
===================================================== */

let selectedBrand = 'all';
let selectedBrandTitle = 'all';
let allProductsCache = [];
let showAllCategories = false;
let showAllBrands = false;

let categoryMeta = [
  { key: 'all',     title: 'All Products', ar: 'كل المنتجات',      fr: 'Tous les produits',  icon: '💊', sub: '' },
  { key: 'pain',    title: 'Pain Relief',  ar: 'مسكنات الألم',    fr: 'Antidouleurs',       icon: '✚',   sub: '' },
  { key: 'vitamins',title: 'Vitamins',     ar: 'فيتامينات',           fr: 'Vitamines',          icon: '🍋', sub: '' },
  { key: 'skin',    title: 'Skin Care',    ar: 'العناية بالبشرة',  fr: 'Soin de peau',       icon: '🌿', sub: '' },
  { key: 'baby',    title: 'Baby Care',    ar: 'العناية بالأطفال', fr: 'Bébé',             icon: '👶', sub: '' },
  { key: 'cold',    title: 'Cold & Flu',   ar: 'البرد والإنفلونزا',  fr: 'Rhume et grippe',    icon: '🦠', sub: '' },
  { key: 'hair',    title: 'Hair Care',    ar: 'العناية بالشعر',  fr: 'Soins cheveux',      icon: '💇', sub: '' },
  { key: 'beauty',  title: 'Beauty',       ar: 'الجمال',               fr: 'Beauté',           icon: '💄', sub: '' }
];

let brandMeta = [
  {
    key: 'loreal',
    title: "L'Oréal Paris",
    image: 'images/loreal.png'
  },
  {
    key: 'laroche',
    title: 'La Roche Posay',
    image: 'images/laroche.png'
  },
  {
    key: 'vichy',
    title: 'Vichy',
    image: 'images/vichy.png'
  },
  {
    key: 'cerave',
    title: 'CeraVe',
    image: 'images/cerave.png'
  },
  {
    key: 'cetaphil',
    title: 'Cetaphil',
    image: 'images/cetaphil.png'
  }
];
function selectBrand(brandKey) {
  const brandObj = brandMeta.find(b => b.key === brandKey);
  selectedBrand = brandKey;
  selectedBrandTitle = brandObj ? brandObj.title : brandKey;
  selectedCategory = 'all';
  pageNow = 1;
  loadProducts(1);
}
function getProxiedImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('images/') || url.includes(window.location.host)) {
    return url;
  }
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

function cleanImageURL(url) {
  try {
    if (url && (url.includes('google.com') || url.includes('google.com.eg')) && url.includes('imgurl=')) {
      const parsed = new URL(url);
      const imgUrl = parsed.searchParams.get('imgurl');
      if (imgUrl) return imgUrl;
    }
  } catch (e) {
    console.error(e);
  }
  return url;
}

function safeText(value) {
  return String(value || '').replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
}

function labelByLang(item) {
  if (lang === 'ar' && item.ar) return item.ar;
  if (lang === 'fr' && item.fr) return item.fr;
  return item.title;
}

function enhanceShell() {
  if (document.querySelector('.top-strip')) return;

  const strip = document.createElement('div');
  strip.className = 'top-strip';
  strip.innerHTML = 'Free delivery on orders above <b>1500 EGP</b> &nbsp;|&nbsp; Hotline: <b>19600</b>';
  document.body.prepend(strip);

  const header = document.querySelector('header.top');
  if (header) {
    header.classList.add('modern-header');
    const h1 = header.querySelector('h1');
    if (h1) h1.innerHTML = '<span class="logo-icon">💊</span> Medi <span>Go</span>';
  }
}

function enhanceShopSection() {
  const shop = document.getElementById('shop');
  if (!shop || shop.dataset.modern === '1') return;
  shop.dataset.modern = '1';
  shop.className = 'modern-shop';
  shop.innerHTML = `
    <div class="shop-toolbar">
      <div>
        <h2>Shop by <span>Category</span></h2>
        <p>Browse medicines, vitamins and skincare products</p>
      </div>
      <button id="viewAllCategoriesBtn" onclick="toggleShowAllCategories()">View all →</button>
    </div>

    <div id="modernCategories" class="modern-categories"></div>

    <div class="shop-toolbar brand-toolbar" style="margin-top: 30px;">
      <div>
        <h2>Shop by <span>Brand</span></h2>
        <p>Top trusted pharmaceutical brands</p>
      </div>
      <button id="viewAllBrandsBtn" onclick="toggleShowAllBrands()">View all →</button>
    </div>

    <div class="brand-section" style="margin-top: 0; padding-top: 0;">
      <div id="modernBrands" class="brand-cards"></div>
    </div>

    <div class="shop-toolbar featured-title" style="margin-top: 30px;">
      <div>
        <h2 id="productPageTitle">Featured <span>Products</span></h2>
        <p id="productPageSub">Handpicked by our pharmacists</p>
      </div>
    </div>

    <div class="modern-filters">
      <label>Sort by:</label>
      <button onclick="setSortAndReload('')">Default</button>
      <button onclick="setSortAndReload('az')">A → Z</button>
      <button onclick="setSortAndReload('za')">Z → A</button>
      <button onclick="setSortAndReload('priceLow')">Price ↓</button>
      <button onclick="setSortAndReload('priceHigh')">Price ↑</button>
      <div class="smart-search-box">
        <input id="search" placeholder="Search medicines, vitamins..." autocomplete="off">
        <div id="searchSuggestions" class="search-suggestions hidden"></div>
      </div>
      <select id="sort" class="hidden">
        <option value=""></option>
        <option value="az"></option>
        <option value="za"></option>
        <option value="priceLow"></option>
        <option value="priceHigh"></option>
      </select>
    </div>

    <div id="productsGrid" class="modern-grid"></div>
    <div id="pages" class="pages"></div>
  `;

  renderCategoryCards();
  renderBrandCards();
  attachSmartSearch();
}

function renderCategoryCards() {
  const box = document.getElementById('modernCategories');
  if (!box) return;

  let categoriesToShow = categoryMeta;
  if (!showAllCategories && categoryMeta.length > 5) {
    categoriesToShow = categoryMeta.slice(0, 5);
  }

  box.innerHTML = categoriesToShow.map(cat => `
    <button class="category-card ${selectedCategory === cat.key && selectedBrand === 'all' ? 'active' : ''}" onclick="openCategoryPage('${cat.key}')">
      <div class="cat-icon">${cat.icon}</div>
      <b>${labelByLang(cat)}</b>
      <small>${cat.sub}</small>
    </button>
  `).join('');

  const btn = document.getElementById('viewAllCategoriesBtn');
  if (btn) {
    if (categoryMeta.length <= 5) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'inline-block';
      btn.textContent = showAllCategories ? 'Show less' : 'View all →';
    }
  }
}

function toggleShowAllCategories() {
  showAllCategories = !showAllCategories;
  renderCategoryCards();
}

function renderBrandCards() {
  const box = document.getElementById('modernBrands');
  if (!box) return;

  let brandsToShow = brandMeta;
  if (!showAllBrands && brandMeta.length > 5) {
    brandsToShow = brandMeta.slice(0, 5);
  }

  box.innerHTML = brandsToShow.map(brand => {
    const imgSrc = getProxiedImageUrl(brand.image || '');
    const fallbackText = encodeURIComponent(brand.title ? brand.title.charAt(0).toUpperCase() : 'B');
    return `
    <button class="brand-card ${selectedBrand === brand.key ? 'active' : ''}" onclick="openBrandPage('${brand.key}')">
      <img src="${imgSrc}" alt="${safeText(brand.title)}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://via.placeholder.com/120x60?text=${fallbackText}';">
      <b>${safeText(brand.title)}</b>
    </button>
  `;
  }).join('');

  const btn = document.getElementById('viewAllBrandsBtn');
  if (btn) {
    if (brandMeta.length <= 5) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'inline-block';
      btn.textContent = showAllBrands ? 'Show less' : 'View all →';
    }
  }
}

function toggleShowAllBrands() {
  showAllBrands = !showAllBrands;
  renderBrandCards();
}

function setSortAndReload(value) {
  const sort = document.getElementById('sort');
  if (sort) sort.value = value;
  loadProducts(1);
}

function openCategoryPage(category) {
  selectedBrand = 'all';
  selectedBrandTitle = 'all';
  selectedCategory = category;
  showPage('shop');
  renderCategoryCards();
  renderBrandCards();
  const meta = categoryMeta.find(c => c.key === category);
  document.getElementById('productPageTitle').innerHTML = `${meta ? labelByLang(meta) : 'Products'} <span>Products</span>`;
  document.getElementById('productPageSub').textContent = 'Products filtered by category';
  loadProducts(1);
}

function openBrandPage(brandKey) {
  const brandObj = brandMeta.find(b => b.key === brandKey);
  selectedBrand = brandKey;
  selectedBrandTitle = brandObj ? brandObj.title : brandKey;
  selectedCategory = 'all';
  showPage('shop');
  renderCategoryCards();
  renderBrandCards();
  document.getElementById('productPageTitle').innerHTML = `${selectedBrandTitle} <span>Products</span>`;
  document.getElementById('productPageSub').textContent = 'Brand collection';
  loadProducts(1);
}

function attachSmartSearch() {
  const input = document.getElementById('search');
  const box = document.getElementById('searchSuggestions');
  if (!input || !box) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) {
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }
    const flexibleQ = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      .replace(/[eéèêë]/gi, '[eéèêë]')
      .replace(/['’‘]/g, "['’‘]?")
      .replace(/([a-z])(?=[a-z])/gi, "$1['’‘]?");
    const regex = new RegExp(flexibleQ, 'i');
    const matches = allProductsCache
      .filter(p => regex.test(p.name || '') || regex.test(p.brand || ''))
      .slice(0, 6);

    box.innerHTML = matches.map(p => `
      <button onclick="chooseSuggestion('${safeText(p.name)}')">
        <b>${safeText(p.name)}</b><small>${safeText(p.brand)} • ${safeText(p.category)}</small>
      </button>
    `).join('') || '<p>No suggestions</p>';
    box.classList.remove('hidden');
  });
}

function chooseSuggestion(name) {
  document.getElementById('search').value = name;
  document.getElementById('searchSuggestions').classList.add('hidden');
  loadProducts(1);
}

const originalShowPage = showPage;
showPage = function(pageId) {
  document.querySelectorAll('main > section').forEach(section => {
    section.classList.add('hidden');
  });

  const target = document.getElementById(pageId);

  if (target) {
    target.classList.remove('hidden');
  }

  if (pageId === 'cartPage') renderCart();
  if (pageId === 'admin') refreshAdminDashboard();
  if (pageId === 'orders') loadOrders();
  if (pageId === 'reminders') loadReminders();
  if (pageId === 'support') loadSupportMessages();
  if (pageId === 'adminSupport') loadAdminSupportMessages();
  if (pageId === 'profilePage') renderProfilePage();

const targetSection = document.getElementById(pageId);

if (targetSection) {
  targetSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}};

const oldChangeLang = changeLang;
changeLang = function(selectedLang) {
  oldChangeLang(selectedLang);
  renderCategoryCards();
  renderBrandCards();
};

loadProducts = async function(page = 1) {
  try {
    pageNow = page;
    const q = document.getElementById('search')?.value?.trim() || '';
    const sort = document.getElementById('sort')?.value || '';
    const brandParam = selectedBrandTitle !== 'all' ? `&brand=${encodeURIComponent(selectedBrandTitle)}` : '';
    const url = `/api/products?page=1&limit=200&q=${encodeURIComponent(q)}&category=${selectedCategory}${brandParam}&_=${Date.now()}`;
    const data = await request(url);
    allProductsCache = data.products || [];
    // Keep lookup map updated so editProductById works from shop cards too
    window._adminProducts = window._adminProducts || {};
    allProductsCache.forEach(p => { window._adminProducts[p._id] = p; });
    let products = [...allProductsCache];

    if (sort === 'az') products.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') products.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'priceLow') products.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'priceHigh') products.sort((a, b) => Number(b.price) - Number(a.price));
const perPage = 15;
const totalPages = Math.ceil(products.length / perPage);
const start = (page - 1) * perPage;
const productsToShow = products.slice(start, start + perPage);
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (!products.length) {
      grid.innerHTML = '<div class="empty-state">No products found</div>';
      document.getElementById('pages').innerHTML = '';
      return;
    }

grid.innerHTML = productsToShow.map(product => {
        const isOut = Number(product.stock) <= 0;
      const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
      return `
        <div class="modern-product">
          ${discount > 0 ? `<span class="discountBadge">SALE</span>` : ''}
          ${product.badge ? `<span class="rx-badge">${safeText(product.badge)}</span>` : ''}
          <img src="${getProxiedImageUrl(product.image || '')}" onerror="this.src='https://via.placeholder.com/400x300?text=MediGo'">
          <h3 ${/[\u0600-\u06FF]/.test(product.name) ? 'translate="no"' : ''}>${tr(product.name)}</h3>
          <p>${safeText(product.brand)} • ${tr(product.category)}</p>
          <div class="modern-price">
            ${product.oldPrice ? `<small>${product.oldPrice} EGP</small>` : ''}
            <b>${product.price} EGP</b>
          </div>
${currentUser && currentUser.role === 'admin' ? `
  <button class="soft-btn" onclick="editProductById('${product._id}')">✎ Edit</button>
` : isOut ? `
  <span class="stock-danger">Out of stock</span>

  <button class="soft-btn" onclick="notifyMe('${product._id}', '${product.name.replace(/'/g, "\\'")}')">
    Notify Me
  </button>
` : `
  <div class="qtyBox">
    <button onclick="changeTempQty('${product._id}', -1, ${product.stock})">-</button>
    <span id="qty-${product._id}">1</span>
    <button onclick="changeTempQty('${product._id}', 1, ${product.stock})">+</button>
  </div>

  <button onclick="addToCart('${product._id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, ${product.stock})">
    Add to Cart
  </button>
`}

        </div>
      `;
    }).join('');

    document.getElementById('pages').innerHTML = '';
    refreshAdminDashboard();
    const pagesBox = document.getElementById('pages');

pagesBox.innerHTML = '';

for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {

  pagesBox.innerHTML += `
    <button
      class="${pageNumber === page ? 'activePage' : ''}"
      onclick="loadProducts(${pageNumber})"
    >
      ${pageNumber}
    </button>
  `;
}
  } catch (error) {
    toast(error.message);
  }
};

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getDeliveryFee() {
  const subtotal = getCartSubtotal();
  if (subtotal >= 1500) return 0;
  const area = document.getElementById('deliveryArea')?.value || 'cairo';
  return area === 'cairo' ? 50 : 60;
}

function updateDeliverySummary() {
  const box = document.getElementById('deliverySummary');
  if (!box) return;
  const subtotal = getCartSubtotal();
  const fee = getDeliveryFee();
  let discountRow = '';
  let finalTotal = subtotal + fee;

  let priceBeforePoints = subtotal;
  if (appliedDiscount) {
    const discountAmt = Math.round(subtotal * (appliedDiscount.discountPercent / 100));
    priceBeforePoints -= discountAmt;
    discountRow = `<br>Discount (${appliedDiscount.discountPercent}%): <b style="color: var(--green);">- ${discountAmt} EGP</b>`;
  }

  let pointsRow = '';
  const pointsCheckbox = document.getElementById('usePointsCheckbox');
  if (pointsCheckbox && pointsCheckbox.checked && currentUser) {
    const userPoints = currentUser.points || 0;
    if (userPoints >= 100) {
      const pointsToRedeem = Math.min(userPoints, Math.floor(priceBeforePoints));
      if (pointsToRedeem > 0) {
        priceBeforePoints -= pointsToRedeem;
        pointsRow = `<br>Points Redeemed: <b style="color: var(--green);">- ${pointsToRedeem} EGP</b>`;
        const pointsMsg = document.getElementById('pointsMsg');
        if (pointsMsg) {
          pointsMsg.style.color = 'var(--green)';
          pointsMsg.textContent = `Using ${pointsToRedeem} points as a discount!`;
        }
      }
    }
  } else {
    const pointsMsg = document.getElementById('pointsMsg');
    if (pointsMsg) pointsMsg.textContent = '';
  }

  finalTotal = priceBeforePoints + fee;

  box.innerHTML = `Subtotal: <b>${subtotal} EGP</b><br>Delivery: <b>${fee === 0 ? 'Free' : fee + ' EGP'}</b>${discountRow}${pointsRow}<br>Total with delivery: <b>${finalTotal} EGP</b>`;
}

renderCart = function() {
  const cartList = document.getElementById('cartList');
  if (!cartList) return;
  if (!cart.length) {
    cartList.innerHTML = '<div class="empty-state">Cart is empty</div>';
    updateDeliverySummary();
    return;
  }
  cartList.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div><b>${safeText(item.name)}</b><small>${item.price} EGP each</small></div>
      <div class="qtyBox">
        <button onclick="changeCartQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeCartQty(${index}, 1)">+</button>
      </div>
      <b>${item.qty * item.price} EGP</b>
      <button class="danger small-btn" onclick="removeFromCart(${index})">Remove</button>
    </div>
  `).join('') + `<div class="cart-total">Subtotal: ${getCartSubtotal()} EGP</div>`;
  updateDeliverySummary();
};

function enhanceCheckout() {
  const address = document.getElementById('checkoutAddress');
  if (!address || document.getElementById('deliveryArea')) return;
  address.insertAdjacentHTML('beforebegin', `
    <select id="deliveryArea" onchange="updateDeliverySummary()">
      <option value="cairo">Cairo delivery - 50 EGP</option>
      <option value="outside">Outside Cairo - 60 EGP</option>
    </select>
    <div id="deliverySummary" class="delivery-summary"></div>
  `);
}

const oldPlaceOrder = placeOrder;
placeOrder = async function() {
  appliedDiscount = null;
  const input = document.getElementById('checkoutDiscountInput');
  if (input) input.value = '';
  const msg = document.getElementById('discountMsg');
  if (msg) msg.textContent = '';
  
  clearAllCheckoutErrors();
  
  const pointsCheckbox = document.getElementById('usePointsCheckbox');
  if (pointsCheckbox) pointsCheckbox.checked = false;
  const pointsMsg = document.getElementById('pointsMsg');
  if (pointsMsg) pointsMsg.textContent = '';
  
  const pointsSection = document.getElementById('pointsSection');
  if (pointsSection) pointsSection.classList.add('hidden');

  if (currentUser) {
    try {
      const data = await request('/api/auth/me');
      if (data && data.user) {
        currentUser = data.user;
        const pts = currentUser.points || 0;
        const checkoutPointsBalance = document.getElementById('checkoutPointsBalance');
        if (checkoutPointsBalance) {
          checkoutPointsBalance.textContent = pts;
        }
        if (pts >= 100 && pointsSection) {
          pointsSection.classList.remove('hidden');
        }
      }
    } catch (err) {
      console.error('Error fetching user points:', err);
    }
  }

  oldPlaceOrder();
  updateDeliverySummary();
};

const oldConfirmOrder = confirmOrder;
confirmOrder = async function() {
  const fee = getDeliveryFee();
  const area = document.getElementById('deliveryArea')?.value || 'cairo';
  await oldConfirmOrder();
  // Ensure cart badge is fully reset after order placement
  if (cart.length === 0) {
    updateCartBadge();
  }
  console.log('Delivery info:', { area, fee });
};

function getDeliveryEstimate(order) {
  return getEstimatedDeliveryText(order.createdAt, lang);
}

function orderStatusTimeline(status) {
  if (status === 'Cancelled') return '<div class="timeline cancelled">✕ Cancelled</div>';
  const steps = [
    { key: 'Pending', label: 'Order Placed' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' }
  ];
  const index = Math.max(0, steps.findIndex(s => s.key === status));
  return `<div class="timeline">${steps.map((s, i) => `
    <div class="timeline-step ${i <= index ? 'active' : ''}">
      <span>${i <= index ? '✓' : '○'}</span><small>${s.label}</small>
    </div>
  `).join('')}</div>`;
}

loadOrders = async function() {
  const ordersList = document.getElementById('ordersList');
  if (!ordersList) return;
  try {
    if (!currentUser) {
      ordersList.innerHTML = '<div class="empty-state">Login to see orders</div>';
      return;
    }
    const orders = await request('/api/orders');
    window.latestOrders = orders;
    refreshAdminDashboard(orders);

    ordersList.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-top">
          <div>
            <b>${order.status}</b>
            <p>${order.items.map(item => `${safeText(item.name)} x ${item.qty}`).join(', ')}</p>
          </div>
          <strong>${order.total} EGP</strong>
        </div>
        ${orderStatusTimeline(order.status)}
        <div class="order-meta">
          ${currentUser.role === 'admin' && order.user ? `
            <span>👤 ${lang === 'ar' ? 'العميل' : (lang === 'fr' ? 'Client' : 'Customer')}: <b>${safeText(order.user.name)}</b> (${safeText(order.user.email)})</span>
          ` : ''}
          <span>📍 ${safeText(order.address)}</span>
          <span>📱 ${safeText(order.mobile || 'No mobile')}</span>
          <span>💳 ${safeText(order.paymentMethod || 'N/A')}</span>
          <span>📅 ${new Date(order.createdAt).toLocaleDateString()}</span>
          <span>⏰ ${new Date(order.createdAt).toLocaleTimeString()}</span>
          <span>🚚 ${getDeliveryEstimate(order)}</span>
          ${order.redeemedPoints ? `
            <span style="color: var(--green); font-weight: bold;">⭐ Redeemed Points: -${order.redeemedPoints} EGP</span>
          ` : ''}
        </div>
        ${renderOrderRatingSection(order)}
        ${currentUser && currentUser.role !== 'admin' ? `
          <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
            <button onclick="reorderItems(${JSON.stringify(order.items).replace(/"/g, '&quot;')})" style="background: var(--navy2); font-size: 13px; padding: 6px 14px; margin: 0; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">🔁 Order Again</button>
          </div>
        ` : ''}
        ${currentUser && currentUser.role === 'admin' && order.status !== 'Delivered' && order.status !== 'Cancelled' ? `
          <div class="orderActions compact-actions">
            <button onclick="updateOrder('${order._id}','Confirmed')">Confirm</button>
            <button onclick="updateOrder('${order._id}','Out for Delivery')">Out for Delivery</button>
            <button onclick="updateOrder('${order._id}','Delivered')">Delivered</button>
            <button class="danger" onclick="updateOrder('${order._id}','Cancelled')">Cancel</button>
          </div>
        ` : ''}
      </div>
    `).join('') || '<div class="empty-state">No orders yet. Orders placed by users will appear here.</div>';
  } catch (error) {
    ordersList.innerHTML = '<p>' + error.message + '</p>';
  }
};

function enhanceAdminSection() {
  const admin = document.getElementById('admin');
  if (!admin || admin.dataset.modern === '1') return;
  admin.dataset.modern = '1';
  admin.className = 'adminOnly hidden modern-admin';
  admin.innerHTML = `
    <div class="admin-hero">
      <div><h2>🛡️ Admin Dashboard</h2><p>Manage inventory, orders, prescriptions and products</p></div>
      <div class="admin-stats" id="adminStats"></div>
    </div>
    <div class="admin-tabs">
      <button onclick="adminTab('inventory')" class="active">Inventory</button>
      <button onclick="adminTab('add')">＋ Add Product</button>
      <button onclick="adminTab('brand')">🏷 Brands</button>
      <button onclick="adminTab('category')">📂 Categories</button>
      <button onclick="adminTab('orders')">▤ Orders</button>
      <button onclick="adminTab('prescriptions')">Rx Status</button>
      <button onclick="adminTab('discount')">🎟 Discount Code</button>
      <button onclick="adminTab('users')">👥 Users</button>
    </div>
    <div id="admin-inventory" class="admin-panel">
      <div class="admin-filter-row"><input id="adminProductSearch" placeholder="Search products..." oninput="loadAdminInventory()"><select id="adminCategoryFilter" onchange="loadAdminInventory()"></select></div>
      <div id="adminInventoryTable"></div>
    </div>
    <div id="admin-add" class="admin-panel hidden">
      <form id="productForm" class="modern-form">
        <input id="pId" type="hidden">
        <h3>＋ Add New Product</h3>
        <label>Product Name *</label><input id="pName" placeholder="e.g., Paracetamol 500mg" required minlength="3">
        <label>Brand *</label><input id="pBrand" placeholder="e.g., La Roche Posay" required>
        <label>Category *</label><select id="pCategory" required></select>
        <label>Price (EGP) *</label><input id="pPrice" type="number" min="1" placeholder="e.g., 50" required>
        <label>Old Price (EGP)</label><input id="pOldPrice" type="number" min="0" placeholder="Leave empty if no discount">
        <label>Stock *</label><input id="pStock" type="number" min="0" placeholder="Stock" required>
        <label>Badge</label><input id="pBadge" placeholder="SALE / NEW / RX">
        <label>Image URL</label><input id="pImage" placeholder="Image URL">
        <button type="submit">Save Product</button>
      </form>
    </div>
    <div id="admin-brand" class="admin-panel hidden">
      <form id="brandForm" class="modern-form" onsubmit="saveBrand(event)" style="max-width: 480px;">
        <h3>🏷 Add New Brand</h3>
        <label>Brand English Name *</label><input id="brandTitle" placeholder="e.g., Vichy" required>
        <label>Brand Key * (lowercase, no spaces, e.g. vichy)</label><input id="brandKey" placeholder="e.g., vichy" required>
        <label>Brand Logo Image URL *</label><input id="brandImage" placeholder="e.g., images/vichy.png" required>
        <label>Brand Arabic Name</label><input id="brandAr" placeholder="e.g., فيشي">
        <label>Brand French Name</label><input id="brandFr" placeholder="e.g., Vichy">
        <button type="submit" style="margin-top: 10px;">Add Brand</button>
      </form>
      <div style="margin-top: 30px;">
        <h3>Existing Brands</h3>
        <div id="adminBrandsList" class="admin-table-wrap"></div>
      </div>
    </div>
    <div id="admin-category" class="admin-panel hidden">
      <form id="categoryForm" class="modern-form" onsubmit="saveCategory(event)" style="max-width: 480px;">
        <h3>📂 Add New Category</h3>
        <label>Category English Title *</label><input id="catTitle" placeholder="e.g., Skin Care" required>
        <label>Category Key * (lowercase, no spaces, e.g. skin)</label><input id="catKey" placeholder="e.g., skin" required>
        <label>Category Icon * (emoji or short text)</label><input id="catIcon" placeholder="e.g., 🌿" required>
        <label>Category Arabic Title</label><input id="catAr" placeholder="e.g., العناية بالبشرة">
        <label>Category French Title</label><input id="catFr" placeholder="e.g., Soin de peau">
        <button type="submit" style="margin-top: 10px;">Add Category</button>
      </form>
      <div style="margin-top: 30px;">
        <h3>Existing Categories</h3>
        <div id="adminCategoriesList" class="admin-table-wrap"></div>
      </div>
    </div>
    <div id="admin-orders" class="admin-panel hidden"><div id="salesDashboard" class="dashboardCards"></div><div id="adminOrdersMirror"></div></div>
    <div id="admin-prescriptions" class="admin-panel hidden"><div id="adminPrescriptionsList" class="admin-table-wrap"></div></div>
    <div id="admin-discount" class="admin-panel hidden">
      <form id="discountForm" class="modern-form" onsubmit="saveDiscountCode(event)" style="max-width: 480px;">
        <h3>🎟 Manage Discount Code</h3>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label>Discount Code</label>
          <input id="dCode" placeholder="e.g., SAVE20" style="margin: 0;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label>Discount Percentage (%)</label>
          <input id="dPercent" type="number" min="1" max="100" placeholder="e.g., 20" style="margin: 0;">
        </div>
        <p style="grid-column: 1/-1; color: var(--muted); font-size: 13px; margin: 10px 0 0;">
          Leave the code blank to delete/deactivate any active discount code.
        </p>
        <button type="submit" style="grid-column: 1/-1; margin-top: 10px;">Save Discount Code</button>
      </form>
    </div>
    <div id="admin-users" class="admin-panel hidden">
      <div id="usersListMirror" class="admin-table-wrap"></div>
    </div>
  `;

  document.getElementById('productForm').addEventListener('submit', saveAdminProduct);

  document.getElementById('brandImage')?.addEventListener('change', function() {
    this.value = cleanImageURL(this.value);
  });
  document.getElementById('brandImage')?.addEventListener('input', function() {
    this.value = cleanImageURL(this.value);
  });
  document.getElementById('pImage')?.addEventListener('change', function() {
    this.value = cleanImageURL(this.value);
  });
  document.getElementById('pImage')?.addEventListener('input', function() {
    this.value = cleanImageURL(this.value);
  });

  // Instantly populate selectors
  populateCategoryDropdowns();
}

function adminTab(tab) {
  document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active'));
  [...document.querySelectorAll('.admin-tabs button')].find(b => {
    const term = tab === 'add' ? 'add' : (tab === 'discount' ? 'discount' : (tab === 'brand' ? 'brand' : (tab === 'category' ? 'categor' : tab)));
    return b.textContent.toLowerCase().includes(term);
  })?.classList.add('active');
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById('admin-' + tab)?.classList.remove('hidden');
  if (tab === 'inventory') loadAdminInventory();
  if (tab === 'brand') loadAdminBrands();
  if (tab === 'category') loadAdminCategories();
  if (tab === 'orders') { loadOrders(); setTimeout(() => document.getElementById('adminOrdersMirror').innerHTML = document.getElementById('ordersList')?.innerHTML || '', 400); }
  if (tab === 'prescriptions') loadAdminPrescriptions();
  if (tab === 'discount') {
    if (activeDiscountCode) {
      document.getElementById('dCode').value = activeDiscountCode.code;
      document.getElementById('dPercent').value = activeDiscountCode.discountPercent;
    } else {
      document.getElementById('dCode').value = '';
      document.getElementById('dPercent').value = '';
    }
  }
  if (tab === 'users') loadUsers();
}

async function refreshAdminDashboard(orders = window.latestOrders || []) {
  if (!currentUser || currentUser.role !== 'admin') return;
  try {
    const data = await request('/api/products?page=1&limit=200&category=all');
    const products = data.products || [];
    const low = products.filter(p => Number(p.stock) <= 10).length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const revenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + Number(o.total || 0), 0);
    const stats = document.getElementById('adminStats');
    if (stats) stats.innerHTML = `
      <div><b>${products.length}</b><small>PRODUCTS</small></div>
      <div><b>${orders.length}</b><small>ORDERS</small></div>
      <div><b>${low}</b><small>LOW STOCK</small></div>
    `;
    const dash = document.getElementById('salesDashboard');
    if (dash) dash.innerHTML = `
      <div class="dashCard"><h3>${orders.length}</h3><p>Total Orders</p></div>
      <div class="dashCard"><h3>${delivered}</h3><p>Delivered</p></div>
      <div class="dashCard"><h3>${cancelled}</h3><p>Cancelled</p></div>
      <div class="dashCard"><h3>${revenue} EGP</h3><p>Revenue</p></div>
    `;
  } catch (e) {}
}

async function loadAdminInventory() {
  if (!currentUser || currentUser.role !== 'admin') return;
  const q = document.getElementById('adminProductSearch')?.value || '';
  const cat = document.getElementById('adminCategoryFilter')?.value || 'all';
  const data = await request(`/api/products?page=1&limit=200&q=${encodeURIComponent(q)}&category=${cat}`);
  const box = document.getElementById('adminInventoryTable');
  if (!box) return;

  // Store products in a safe lookup map (avoids JSON/apostrophe issues in onclick)
  window._adminProducts = {};
  (data.products || []).forEach(p => { window._adminProducts[p._id] = p; });

  box.innerHTML = `
    <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>PRODUCT</th><th>BRAND</th><th>CATEGORY</th><th>PRICE</th><th>OLD PRICE</th><th>STOCK</th><th>BADGE</th><th>ACTIONS</th></tr></thead><tbody>
    ${(data.products || []).map((p, i) => `<tr>
      <td>#${i + 1}</td>
      <td><img src="${p.image || ''}" onerror="this.src='https://via.placeholder.com/60?text=M'"> <b>${safeText(p.name)}</b></td>
      <td>${safeText(p.brand)}</td>
      <td>${safeText(p.category)}</td>
      <td><b>${p.price} EGP</b></td>
      <td>${p.oldPrice || '—'}</td>
      <td><span class="stock-pill ${p.stock <= 10 ? 'low' : ''}">${p.stock}</span></td>
      <td>${p.badge || '—'}</td>
      <td>
        <button class="soft-btn" onclick="editProductById('${p._id}')">✎ Edit</button>
        <button class="danger small-btn" onclick="deleteProduct('${p._id}')">Del</button>
      </td>
    </tr>`).join('')}
    </tbody></table></div>`;
}

function editProductById(id) {
  const product = window._adminProducts && window._adminProducts[id];
  if (!product) return;
  editProduct(product);
}


async function saveAdminProduct(event) {
  event.preventDefault();
  const id = document.getElementById('pId').value;
  const body = {
    name: document.getElementById('pName').value,
    brand: document.getElementById('pBrand').value,
    category: document.getElementById('pCategory').value,
    price: Number(document.getElementById('pPrice').value),
    oldPrice: Number(document.getElementById('pOldPrice').value) || null,
    stock: Number(document.getElementById('pStock').value),
    badge: document.getElementById('pBadge')?.value || '',
    image: document.getElementById('pImage').value
  };
  await request(id ? `/api/products/${id}` : '/api/products', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
  event.target.reset();
  document.getElementById('pId').value = '';
  toast('Product saved');
  loadProducts(1);
  loadAdminInventory();
  adminTab('inventory');
}

editProduct = function(product) {
  showPage('admin');
  adminTab('add');
  document.getElementById('pId').value = product._id;
  document.getElementById('pName').value = product.name || '';
  document.getElementById('pBrand').value = product.brand || '';
  document.getElementById('pCategory').value = product.category || 'pain';
  document.getElementById('pPrice').value = product.price || '';
  document.getElementById('pOldPrice').value = product.oldPrice || '';
  document.getElementById('pStock').value = product.stock || '';
  if (document.getElementById('pBadge')) document.getElementById('pBadge').value = product.badge || '';
  document.getElementById('pImage').value = product.image || '';
};

function enhanceReminders() {
  const section = document.getElementById('reminders');
  if (!section || section.dataset.modern === '1') return;
  section.dataset.modern = '1';
  section.className = 'modern-reminders userOnly';
  section.innerHTML = `
    <div class="reminder-info"><h2>Medicine <span>Reminders</span></h2><p>Set up daily reminders for your medications and never miss an important dose again.</p><ul><li>✓ Daily & weekly reminder schedules</li><li>✓ Multiple medicines at different times</li><li>✓ Refill alerts when running low</li><li>✓ Share with family members</li></ul></div>
    <div class="reminder-card"><h3>⏰ Add Medicine Reminder</h3><label>Medicine Name</label><input id="reminderMedicine" placeholder="e.g., Paracetamol 500mg"><div class="two-cols"><div><label>Time</label><input id="reminderTime" type="time" value="08:00"></div><div><label>Frequency</label><select id="reminderFrequency"><option value="Once per day">Once per day</option><option value="Twice per day">Twice per day</option><option value="Three times per day">Three times per day</option></select></div></div><div id="extraReminderTimes" class="two-cols"></div><button onclick="addReminder()">＋ Set Reminder</button><div id="remindersList"></div></div>
  `;
  document.getElementById('reminderFrequency').addEventListener('change', showExtraReminderTimes);
  showExtraReminderTimes();
}

function showExtraReminderTimes() {
  const value = document.getElementById('reminderFrequency')?.value;
  const box = document.getElementById('extraReminderTimes');
  if (!box) return;
  if (value === 'Twice per day') box.innerHTML = '<div><label>Second Time</label><input id="reminderTime2" type="time" value="20:00"></div>';
  else if (value === 'Three times per day') box.innerHTML = '<div><label>Second Time</label><input id="reminderTime2" type="time" value="14:00"></div><div><label>Third Time</label><input id="reminderTime3" type="time" value="22:00"></div>';
  else box.innerHTML = '';
}

loadReminders = async function() {
  const list = document.getElementById('remindersList');
  if (!list) return;
  if (!currentUser) { list.innerHTML = '<p>Login to see reminders</p>'; return; }
  try {
    const reminders = await request('/api/reminders');
    list.innerHTML = reminders.map(r => `<div class="reminder-item"><b>${safeText(r.medicineName)}</b><span>${r.time || ''}</span><small>${safeText(r.frequency || '')}</small><button class="danger small-btn" onclick="deleteReminder('${r._id}')">Delete</button></div>`).join('') || '<p>No reminders yet</p>';
  } catch (e) { list.innerHTML = '<p>' + e.message + '</p>'; }
};

async function loadAdminPrescriptions() {
  const box = document.getElementById('adminPrescriptionsList');
  if (!box) return;
  try {
    const list = await request('/api/prescriptions');
    box.innerHTML = `<table class="admin-table"><thead><tr><th>Patient</th><th>Phone</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(rx => `<tr><td>${safeText(rx.patientName)}</td><td>${safeText(rx.phone)}</td><td>${safeText(rx.notes || '')}</td><td><span class="stock-pill">${safeText(rx.status || 'Pending Review')}</span></td><td><a href="${rx.filePath}" target="_blank" class="soft-btn small-btn" style="text-decoration:none;">Open</a> ${rx.status === 'Pending Review' ? `<button class="small-btn" onclick="openPrescriptionOrderModal('${rx._id}', '${safeText(rx.phone)}', '${safeText(rx.notes)}')">＋ Create Order</button>` : ''}</td></tr>`).join('')}</tbody></table>`;
  } catch (e) { box.innerHTML = '<p>' + e.message + '</p>'; }
}

async function bootUpgrade() {
  enhanceShell();
  enhanceShopSection();
  enhanceAdminSection();
  enhanceReminders();
  enhanceCheckout();
  await loadCategories();
  await loadBrands();
  showPage('shop');
  loadProducts(1);
  loadOrders();
  loadReminders();
}

setTimeout(bootUpgrade, 100);













const homeSlides = [
  'images/slide1.png',
  'images/slide2.png'
];

let homeSlideIndex = 0;

setInterval(() => {
  const img = document.getElementById('homeSliderImg');

  if (!img) return;

  homeSlideIndex = (homeSlideIndex + 1) % homeSlides.length;

  img.src = homeSlides[homeSlideIndex];
}, 5000);
setInterval(() => {
  if (!currentUser) return;

  const ordersSection = document.getElementById('orders');
  const adminSection = document.getElementById('admin');

  const ordersOpen =
    ordersSection && !ordersSection.classList.contains('hidden');

  const adminOpen =
    adminSection && !adminSection.classList.contains('hidden');

  if (ordersOpen || adminOpen) {
    // Skip auto-refresh if the user is typing a rating comment or has selected stars
    const activeEl = document.activeElement;
    if (activeEl && activeEl.id && activeEl.id.startsWith('ratingComment-')) {
      return;
    }
    const ratingInputs = document.querySelectorAll('input[id^="ratingValue-"]');
    let isRating = false;
    for (let input of ratingInputs) {
      if (Number(input.value) > 0) {
        isRating = true;
        break;
      }
    }
    if (isRating) return;

    loadOrders();

    if (typeof refreshAdminDashboard === 'function') {
      refreshAdminDashboard();
    }
  }
}, 3000);

async function notifyMe(productId, productName) {
    try {
        const email = prompt(`Enter your email for ${productName} to send you mail when restocked`);

        if (!email) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            toast('Please enter a valid email address');
            return;
        }

        const result = await request('/api/notify', {
            method: 'POST',
            body: JSON.stringify({
                productId,
                productName,
                email: email.trim().toLowerCase()
            })
        });

        toast(result.message);

    } catch (err) {
        toast(err.message);
    }
}

function renderOrderRatingSection(order) {
  if (order.status !== 'Delivered' || currentUser.role !== 'user') return '';
  
  if (order.rating && order.rating > 0) {
    const stars = '⭐'.repeat(order.rating);
    return `
      <div style="border-top: 1px dashed var(--line); margin-top: 12px; padding-top: 12px; font-size: 14px;">
        <b style="color: var(--green);">Your Review:</b> ${stars}
        ${order.ratingComment ? `<p style="margin: 4px 0 0; font-style: italic; font-size: 13px;">"${safeText(order.ratingComment)}"</p>` : ''}
      </div>
    `;
  }
  
  return `
    <div id="ratingBox-${order._id}" style="border-top: 1px dashed var(--line); margin-top: 12px; padding-top: 12px;">
      <span style="font-weight: bold; font-size: 14px; display: block; margin-bottom: 6px;">Rate this order:</span>
      <div class="stars-select" style="display: flex; gap: 8px; margin-bottom: 8px; font-size: 24px; cursor: pointer; color: #cbd5e1;">
        <span onclick="setTempRating('${order._id}', 1)" id="star-${order._id}-1">☆</span>
        <span onclick="setTempRating('${order._id}', 2)" id="star-${order._id}-2">☆</span>
        <span onclick="setTempRating('${order._id}', 3)" id="star-${order._id}-3">☆</span>
        <span onclick="setTempRating('${order._id}', 4)" id="star-${order._id}-4">☆</span>
        <span onclick="setTempRating('${order._id}', 5)" id="star-${order._id}-5">☆</span>
      </div>
      <input type="hidden" id="ratingValue-${order._id}" value="0">
      <textarea id="ratingComment-${order._id}" placeholder="Write comment or issues (optional)..." style="margin: 0 0 8px; min-height: 48px; font-size: 13px; padding: 8px;"></textarea>
      <button class="small-btn" onclick="submitOrderRating('${order._id}')" style="background: var(--navy2);">Submit Review</button>
    </div>
  `;
}

function setTempRating(orderId, val) {
  document.getElementById('ratingValue-' + orderId).value = val;
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`star-${orderId}-${i}`);
    if (i <= val) {
      star.textContent = '★';
      star.style.color = '#ff9f43';
    } else {
      star.textContent = '☆';
      star.style.color = '#cbd5e1';
    }
  }
}

async function submitOrderRating(orderId) {
  const rating = Number(document.getElementById('ratingValue-' + orderId).value);
  const ratingComment = document.getElementById('ratingComment-' + orderId).value.trim();
  
  if (rating < 1 || rating > 5) {
    toast('Select a rating first');
    return;
  }
  
  try {
    const res = await request(`/api/orders/${orderId}/rate`, {
      method: 'PUT',
      body: JSON.stringify({ rating, ratingComment })
    });
    toast(res.message);
    loadOrders();
  } catch (error) {
    toast(error.message);
  }
}

let activeRxId = null;
let activeRxItems = [];

async function openPrescriptionOrderModal(rxId, phone, notes) {
  activeRxId = rxId;
  activeRxItems = [];
  document.getElementById('rxOrderAddress').value = 'Prescription Order (Note: ' + (notes || 'None') + ')';
  document.getElementById('rxOrderMobile').value = phone || '';
  
  const dropdown = document.getElementById('rxOrderProductSelect');
  dropdown.innerHTML = '<option value="">Loading products...</option>';
  
  try {
    const data = await request('/api/products?page=1&limit=200');
    const products = data.products || [];
    dropdown.innerHTML = products.map(p => `<option value="${p._id}">${safeText(p.name)} (${p.price} EGP, Stock: ${p.stock})</option>`).join('');
  } catch (error) {
    dropdown.innerHTML = '<option value="">Error loading products</option>';
  }
  
  renderRxOrderItems();
  document.getElementById('prescriptionOrderModal').classList.remove('hidden');
}

function closePrescriptionOrderModal() {
  document.getElementById('prescriptionOrderModal').classList.add('hidden');
}

function addRxOrderProduct() {
  const select = document.getElementById('rxOrderProductSelect');
  const qtyInput = document.getElementById('rxOrderProductQty');
  const productId = select.value;
  const qty = Number(qtyInput.value) || 1;
  
  if (!productId) {
    toast('Select a product first');
    return;
  }
  
  const option = select.options[select.selectedIndex];
  const name = option.text;
  
  const exists = activeRxItems.find(item => item.productId === productId);
  if (exists) {
    exists.qty += qty;
  } else {
    activeRxItems.push({ productId, name, qty });
  }
  
  renderRxOrderItems();
  qtyInput.value = 1;
}

function removeRxOrderProduct(index) {
  activeRxItems.splice(index, 1);
  renderRxOrderItems();
}

function renderRxOrderItems() {
  const list = document.getElementById('rxOrderProductList');
  if (!list) return;
  if (!activeRxItems.length) {
    list.innerHTML = '<p style="color: var(--muted); font-size: 13px; text-align: center; margin: 10px 0;">No products added yet.</p>';
    return;
  }
  list.innerHTML = activeRxItems.map((item, index) => `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding: 6px 0; font-size: 13px;">
      <span><b>${safeText(item.name)}</b> x ${item.qty}</span>
      <button class="danger small-btn" onclick="removeRxOrderProduct(${index})" style="padding: 2px 6px !important; margin: 0;">Remove</button>
    </div>
  `).join('');
}

async function submitRxOrder() {
  if (!activeRxItems.length) {
    toast('Please add at least one product');
    return;
  }
  const address = document.getElementById('rxOrderAddress').value.trim();
  const mobile = document.getElementById('rxOrderMobile').value.trim();
  
  if (!address || address.length < 5) {
    toast('Enter delivery address');
    return;
  }
  if (!/^01[0-2,5][0-9]{8}$/.test(mobile)) {
    toast('Enter valid mobile number');
    return;
  }
  
  try {
    const res = await request(`/api/admin/prescriptions/${activeRxId}/create-order`, {
      method: 'POST',
      body: JSON.stringify({ items: activeRxItems, address, mobile })
    });
    toast(res.message);
    closePrescriptionOrderModal();
    loadAdminPrescriptions();
    loadOrders();
  } catch (error) {
    toast(error.message);
  }
}

window.setTempRating = setTempRating;
window.submitOrderRating = submitOrderRating;
window.openPrescriptionOrderModal = openPrescriptionOrderModal;
window.closePrescriptionOrderModal = closePrescriptionOrderModal;
window.addRxOrderProduct = addRxOrderProduct;
window.removeRxOrderProduct = removeRxOrderProduct;
window.submitRxOrder = submitRxOrder;

/* =====================================================
   AI CHAT WIDGET
===================================================== */
function toggleAIChat() {
  const widget = document.getElementById('aiChatWidget');
  widget.classList.toggle('hidden');
  if (!widget.classList.contains('hidden')) {
    document.getElementById('aiInput').focus();
  }
}

function appendAIMessage(text, role) {
  const container = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

async function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const message = input.value.trim();
  if (!message) return;

  // Show user message
  appendAIMessage(message, 'user');
  input.value = '';

  // Show typing indicator
  const typingDiv = appendAIMessage('💊 Typing...', 'typing');

  try {
    const data = await request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });

    typingDiv.remove();
    appendAIMessage(data.reply, 'bot');
  } catch (err) {
    typingDiv.remove();
    appendAIMessage('Sorry, I couldn\'t respond right now. Please try again!', 'bot');
  }
}

// Auto-refresh support messages if the support/adminSupport panels are currently visible
setInterval(() => {
  const supportSec = document.getElementById('support');
  const adminSupportSec = document.getElementById('adminSupport');
  
  if (supportSec && !supportSec.classList.contains('hidden') && currentUser) {
    loadSupportMessages().catch(() => {});
  }
  
  if (adminSupportSec && !adminSupportSec.classList.contains('hidden') && currentUser && currentUser.role === 'admin') {
    loadAdminSupportMessages().catch(() => {});
  }
}, 5000); // Poll every 5 seconds

/* Auth Validation Helpers */
function showFieldError(fieldId, errorText) {
  const errorEl = document.getElementById(fieldId + 'Error');
  if (errorEl) {
    if (errorText) {
      errorEl.textContent = errorText;
      errorEl.classList.remove('hidden');
    } else {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }
}

function clearAllFieldErrors() {
  showFieldError('authName', '');
  showFieldError('authEmail', '');
  showFieldError('authPassword', '');
  const msgEl = document.getElementById('authMsg');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.classList.add('hidden');
  }
}

function validateAuthInputs() {
  let hasError = false;
  clearAllFieldErrors();

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  
  if (authMode === 'signup') {
    const name = document.getElementById('authName').value.trim();
    if (!name) {
      showFieldError('authName', lang === 'ar' ? 'اسم المستخدم مطلوب' : (lang === 'fr' ? 'Nom d\'utilisateur requis' : 'Username is required'));
      hasError = true;
    } else if (name.length < 3) {
      showFieldError('authName', lang === 'ar' ? 'يجب أن يكون الاسم 3 أحرف على الأقل' : (lang === 'fr' ? 'Le nom doit comporter au moins 3 caractères' : 'Name must be at least 3 characters'));
      hasError = true;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showFieldError('authEmail', lang === 'ar' ? 'البريد الإلكتروني مطلوب' : (lang === 'fr' ? 'E-mail requis' : 'Email is required'));
    hasError = true;
  } else if (!emailRegex.test(email)) {
    showFieldError('authEmail', lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : (lang === 'fr' ? 'Format d\'e-mail invalide' : 'Invalid email format (e.g. user@gmail.com)'));
    hasError = true;
  }

  if (!password) {
    showFieldError('authPassword', lang === 'ar' ? 'كلمة المرور مطلوبة' : (lang === 'fr' ? 'Mot de passe requis' : 'Password is required'));
    hasError = true;
  } else if (password.length < 8) {
    showFieldError('authPassword', lang === 'ar' ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : (lang === 'fr' ? 'Le mot de passe doit comporter au moins 8 caractères' : 'Password must be at least 8 characters'));
    hasError = true;
  }

  return !hasError;
}

function handleServerAuthError(errorMessage) {
  clearAllFieldErrors();
  const lowerMessage = errorMessage.toLowerCase();
  
  if (lowerMessage.includes('email already exists') || lowerMessage.includes('email exists')) {
    showFieldError('authEmail', lang === 'ar' ? 'البريد الإلكتروني مسجل بالفعل' : (lang === 'fr' ? 'Cet e-mail existe déjà' : 'Email already exists'));
  } else if (lowerMessage.includes('invalid email') || lowerMessage.includes('email format')) {
    showFieldError('authEmail', lang === 'ar' ? 'البريد الإلكتروني غير صحيح' : (lang === 'fr' ? 'E-mail invalide' : 'Invalid email'));
  } else if (lowerMessage.includes('wrong email or password') || lowerMessage.includes('wrong password') || lowerMessage.includes('incorrect password') || lowerMessage.includes('unauthorized')) {
    const errorText = lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : (lang === 'fr' ? 'E-mail ou mot de passe incorrect' : 'Wrong email or password');
    showFieldError('authEmail', errorText);
    showFieldError('authPassword', errorText);
  } else if (lowerMessage.includes('password must be at least 8')) {
    showFieldError('authPassword', lang === 'ar' ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : (lang === 'fr' ? 'Le mot de passe doit comporter au moins 8 caractères' : 'Password must be at least 8 characters'));
  } else if (lowerMessage.includes('name must be at least 3') || lowerMessage.includes('name is required')) {
    showFieldError('authName', lang === 'ar' ? 'يجب أن يكون الاسم 3 أحرف على الأقل' : (lang === 'fr' ? 'Le nom doit comporter au moins 3 caractères' : 'Name must be at least 3 characters'));
  } else {
    const msgEl = document.getElementById('authMsg');
    if (msgEl) {
      msgEl.textContent = errorMessage;
      msgEl.classList.remove('hidden');
    }
  }
}

// Clear validation messages as user corrects inputs
document.getElementById('authName').addEventListener('input', () => showFieldError('authName', ''));
document.getElementById('authEmail').addEventListener('input', () => showFieldError('authEmail', ''));
document.getElementById('authPassword').addEventListener('input', () => showFieldError('authPassword', ''));

document.getElementById('checkoutAddress').addEventListener('input', () => showFieldError('checkoutAddress', ''));
document.getElementById('checkoutMobile').addEventListener('input', () => showFieldError('checkoutMobile', ''));
document.getElementById('cardHolder').addEventListener('input', () => showFieldError('cardHolder', ''));
document.getElementById('cardNumber').addEventListener('input', () => showFieldError('cardNumber', ''));
document.getElementById('cardExpiry').addEventListener('input', () => showFieldError('cardExpiry', ''));
document.getElementById('cardCvv').addEventListener('input', () => showFieldError('cardCvv', ''));

function clearAllCheckoutErrors() {
  showFieldError('checkoutAddress', '');
  showFieldError('checkoutMobile', '');
  showFieldError('cardHolder', '');
  showFieldError('cardNumber', '');
  showFieldError('cardExpiry', '');
  showFieldError('cardCvv', '');
}

/* Dynamic Category Management Helpers */
async function loadCategories() {
  try {
    const list = await request('/api/categories');
    if (list && Array.isArray(list) && list.length > 0) {
      categoryMeta = [
        { key: 'all', title: 'All Products', ar: 'كل المنتجات', fr: 'Tous les produits', icon: '💊', sub: '' },
        ...list
      ];
    }
    renderCategoryCards();
    populateCategoryDropdowns();
  } catch (error) {
    console.error('Error loading categories:', error.message);
  }
}

function populateCategoryDropdowns() {
  const legacySelect = document.getElementById('pCategory');
  if (legacySelect) {
    legacySelect.innerHTML = categoryMeta
      .filter(cat => cat.key !== 'all')
      .map(cat => `<option value="${cat.key}">${labelByLang(cat)}</option>`)
      .join('');
  }

  const adminSelect = document.querySelector('#admin-add #pCategory');
  if (adminSelect) {
    adminSelect.innerHTML = categoryMeta
      .filter(cat => cat.key !== 'all')
      .map(cat => `<option value="${cat.key}">${labelByLang(cat)}</option>`)
      .join('');
  }

  const filterSelect = document.getElementById('adminCategoryFilter');
  if (filterSelect) {
    filterSelect.innerHTML = [
      { key: 'all', title: 'All Categories', ar: 'كل التصنيفات', fr: 'Toutes les catégories' },
      ...categoryMeta.filter(cat => cat.key !== 'all')
    ].map(cat => `<option value="${cat.key}">${labelByLang(cat)}</option>`)
     .join('');
  }
}

async function loadAdminCategories() {
  const listDiv = document.getElementById('adminCategoriesList');
  if (!listDiv) return;
  try {
    const list = await request('/api/categories');
    const defaults = ['pain', 'vitamins', 'skin', 'baby', 'cold', 'hair', 'beauty'];
    
    listDiv.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name (English)</th>
            <th>Name (Arabic)</th>
            <th>Name (French)</th>
            <th>Key</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(cat => `
            <tr>
              <td>${safeText(cat.icon)}</td>
              <td><b>${safeText(cat.title)}</b></td>
              <td>${safeText(cat.ar || '-')}</td>
              <td>${safeText(cat.fr || '-')}</td>
              <td><code>${safeText(cat.key)}</code></td>
              <td>
                ${defaults.includes(cat.key) 
                  ? `<span style="color:var(--muted); font-size:12px;">System Default</span>` 
                  : `<button type="button" class="danger small-btn" onclick="deleteAdminCategory('${cat._id}')">Delete</button>`
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    listDiv.innerHTML = '<p>' + error.message + '</p>';
  }
}

async function saveCategory(event) {
  event.preventDefault();
  const title = document.getElementById('catTitle').value.trim();
  const key = document.getElementById('catKey').value.trim().toLowerCase();
  const ar = document.getElementById('catAr').value.trim();
  const fr = document.getElementById('catFr').value.trim();
  const icon = document.getElementById('catIcon').value.trim() || '🏷️';

  try {
    await request('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ key, title, ar, fr, icon })
    });
    
    toast('Category added successfully');
    document.getElementById('categoryForm').reset();
    
    await loadCategories();
    await loadAdminCategories();
  } catch (error) {
    toast(error.message);
  }
}

async function deleteAdminCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    await request('/api/categories/' + id, {
      method: 'DELETE'
    });
    toast('Category deleted');
    await loadCategories();
    await loadAdminCategories();
  } catch (error) {
    toast(error.message);
  }
}

/* Dynamic Brand Management Helpers */
async function loadBrands() {
  try {
    const list = await request('/api/brands');
    if (list && Array.isArray(list) && list.length > 0) {
      brandMeta = list;
    }
    renderBrandCards();
  } catch (error) {
    console.error('Error loading brands:', error.message);
  }
}

async function loadAdminBrands() {
  const listDiv = document.getElementById('adminBrandsList');
  if (!listDiv) return;
  try {
    const list = await request('/api/brands');
    const defaults = ['loreal', 'laroche', 'vichy', 'cerave', 'cetaphil'];
    
    listDiv.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name (English)</th>
            <th>Name (Arabic)</th>
            <th>Name (French)</th>
            <th>Key</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(brand => `
            <tr>
              <td><img src="${getProxiedImageUrl(brand.image)}" style="width: 40px; height: auto; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/40x40?text=Brand'"></td>
              <td><b>${safeText(brand.title)}</b></td>
              <td>${safeText(brand.ar || '-')}</td>
              <td>${safeText(brand.fr || '-')}</td>
              <td><code>${safeText(brand.key)}</code></td>
              <td>
                ${defaults.includes(brand.key) 
                  ? `<span style="color:var(--muted); font-size:12px;">System Default</span>` 
                  : `<button type="button" class="danger small-btn" onclick="deleteAdminBrand('${brand._id}')">Delete</button>`
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    listDiv.innerHTML = '<p>' + error.message + '</p>';
  }
}

async function saveBrand(event) {
  event.preventDefault();
  const title = document.getElementById('brandTitle').value.trim();
  const key = document.getElementById('brandKey').value.trim().toLowerCase();
  const image = document.getElementById('brandImage').value.trim();
  const ar = document.getElementById('brandAr').value.trim();
  const fr = document.getElementById('brandFr').value.trim();

  try {
    await request('/api/brands', {
      method: 'POST',
      body: JSON.stringify({ key, title, image, ar, fr })
    });
    
    toast('Brand added successfully');
    document.getElementById('brandForm').reset();
    
    await loadBrands();
    await loadAdminBrands();
  } catch (error) {
    toast(error.message);
  }
}

async function deleteAdminBrand(id) {
  if (!confirm('Are you sure you want to delete this brand?')) return;
  try {
    await request('/api/brands/' + id, {
      method: 'DELETE'
    });
    toast('Brand deleted');
    await loadBrands();
    await loadAdminBrands();
  } catch (error) {
    toast(error.message);
  }
}

/* User Profile & Loyalty Points Rendering */
async function renderProfilePage() {
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profilePoints = document.getElementById('profilePoints');
  
  if (!profileName || !profilePoints) return;
  
  try {
    const data = await request('/api/auth/me');
    if (data && data.user) {
      profileName.textContent = data.user.name;
      profileEmail.textContent = data.user.email;
      profilePoints.textContent = data.user.points || 0;
    } else {
      profileName.textContent = 'Guest User';
      profileEmail.textContent = '-';
      profilePoints.textContent = '0';
    }
  } catch (error) {
    console.error('Error loading profile details:', error.message);
  }
}

/* One Click Reorder Function */
async function reorderItems(orderItems) {
  if (!orderItems || !orderItems.length) return;
  
  toast(lang === 'ar' ? 'جاري إعادة إضافة المنتجات للسلة...' : 'Adding items to cart...');
  
  for (const item of orderItems) {
    const pId = item.product || item.productId;
    const qty = Number(item.qty || 1);
    
    try {
      const product = await request('/api/products/' + pId).catch(() => null);
      const stock = product ? product.stock : 999;
      
      const found = cart.find(c => c.productId === pId);
      const oldQty = found ? found.qty : 0;
      
      if (oldQty + qty > stock) {
        toast(`Not enough stock available for ${item.name}`);
        continue;
      }
      
      if (found) {
        found.qty += qty;
      } else {
        cart.push({
          productId: pId,
          name: item.name,
          price: item.price,
          stock: stock,
          qty: qty
        });
      }
    } catch (e) {
      const found = cart.find(c => c.productId === pId);
      if (found) {
        found.qty += qty;
      } else {
        cart.push({
          productId: pId,
          name: item.name,
          price: item.price,
          stock: 999,
          qty: qty
        });
      }
    }
  }
  
  saveCart();
  renderCart();
  updateCartBadge();
  toast(lang === 'ar' ? 'تم إضافة المنتجات للسلة!' : (lang === 'fr' ? 'Produits ajoutés au panier !' : 'All items added to cart!'));
  showPage('cartPage');
}

/* AI Health Score Calculator */
async function calculateHealthScore(event) {
  event.preventDefault();
  
  const age = document.getElementById('healthAge').value;
  const weight = document.getElementById('healthWeight').value;
  const water = document.getElementById('healthWater').value;
  const exercise = document.getElementById('healthExercise').value;
  
  const btn = event.target.querySelector('button[type="submit"]');
  const oldText = btn.textContent;
  btn.textContent = lang === 'ar' ? 'جاري حساب النتيجة...' : 'Calculating health score...';
  btn.disabled = true;

  try {
    const res = await request('/api/ai/health-score', {
      method: 'POST',
      body: JSON.stringify({ age, weight, water, exercise, lang })
    });
    
    document.getElementById('healthScoreCircle').textContent = res.score;
    
    // Set circle border color based on score
    const circle = document.getElementById('healthScoreCircle');
    if (res.score >= 80) {
      circle.style.borderColor = 'var(--green)';
      circle.style.color = 'var(--green)';
    } else if (res.score >= 50) {
      circle.style.borderColor = '#e2b13c';
      circle.style.color = '#e2b13c';
    } else {
      circle.style.borderColor = 'var(--danger)';
      circle.style.color = 'var(--danger)';
    }
    
    const tipsList = document.getElementById('healthTipsList');
    tipsList.innerHTML = res.tips.map(tip => `<li>${safeText(tip)}</li>`).join('');
    
    document.getElementById('healthScoreResult').classList.remove('hidden');
    document.getElementById('healthScoreResult').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    toast(error.message);
  } finally {
    btn.textContent = oldText;
    btn.disabled = false;
  }
}