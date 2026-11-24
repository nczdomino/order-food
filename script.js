// Danh sách món ăn mẫu
const foods = [
  {
    id: 1,
    name: "Phở Bò Tái Nạm",
    category: "main",
    price: 65000,
    desc: "Nước dùng xương hầm 12 tiếng thơm lừng, thịt bò mềm ngọt tự nhiên.",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Cơm Tấm Sườn Bì Chả",
    category: "main",
    price: 55000,
    desc: "Sườn nướng mật ong đậm đà kết hợp bì thính và chả trứng béo ngậy.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Bánh Mì Thịt Nướng Giòn",
    category: "fastfood",
    price: 35000,
    desc: "Vỏ giòn rụm kẹp pate béo, thịt nướng than hoa và dưa chua giòn ngọt.",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Burger Bò Phô Mai Tan Chảy",
    category: "fastfood",
    price: 69000,
    desc: "Thịt bò Úc nướng mềm mọng, sốt đặc biệt cùng phô mai Cheddar thơm lừng.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    name: "Trà Sữa Trân Châu Đường Đen",
    category: "drink",
    price: 42000,
    desc: "Vị trà đậm đà, sữa tươi thanh mát kết hợp trân châu nấu đường đen dẻo dai.",
    image: "https://images.unsplash.com/photo-1558857563-b37cf5a9d453?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    name: "Trà Đào Cam Sả Tươi",
    category: "drink",
    price: 38000,
    desc: "Thanh mát giải nhiệt ngày hè với miếng đào giòn và hương sả sảng khoái.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60"
  }
];

let cart = [];

// DOM Elements
const foodGrid = document.getElementById('foodGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountBadge = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const categoryBtns = document.querySelectorAll('.cat-btn');
const orderModal = document.getElementById('orderModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const orderSummary = document.getElementById('orderSummary');

// Format tiền tệ VND
function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN') + ' đ';
}

// Render danh sách món ăn
function renderFoods(category = 'all') {
  foodGrid.innerHTML = '';
  const filtered = category === 'all' 
    ? foods 
    : foods.filter(item => item.category === category);

  filtered.forEach(food => {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
      <img src="${food.image}" alt="${food.name}" class="food-img" loading="lazy">
      <div class="food-info">
        <h3 class="food-title">${food.name}</h3>
        <p class="food-desc">${food.desc}</p>
        <div class="food-bottom">
          <span class="food-price">${formatCurrency(food.price)}</span>
          <button class="add-btn" onclick="addToCart(${food.id})">+ Thêm</button>
        </div>
      </div>
    `;
    foodGrid.appendChild(card);
  });
}

// Thêm vào giỏ hàng
window.addToCart = function(id) {
  const item = foods.find(f => f.id === id);
  if (!item) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  toggleCart(true);
};

// Cập nhật số lượng
window.changeQty = function(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  updateCartUI();
};

// Cập nhật giao diện giỏ hàng
function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  cartCountBadge.textContent = totalCount;
  cartTotalEl.textContent = formatCurrency(totalPrice);
  checkoutBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Giỏ hàng đang trống</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span>${formatCurrency(item.price)} x ${item.qty}</span>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

// Mở / Đóng giỏ hàng
function toggleCart(show) {
  if (show) {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
  } else {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
  }
}

// Xử lý sự kiện
openCartBtn.addEventListener('click', () => toggleCart(true));
closeCartBtn.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFoods(btn.dataset.category);
  });
});

checkoutBtn.addEventListener('click', () => {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  orderSummary.textContent = `Bạn đã đặt ${totalCount} món với tổng giá trị ${formatCurrency(totalPrice)}. Đơn hàng đang được chuẩn bị!`;
  toggleCart(false);
  orderModal.classList.add('show');

  cart = [];
  updateCartUI();
});

closeModalBtn.addEventListener('click', () => {
  orderModal.classList.remove('show');
});

// Khởi chạy ban đầu
renderFoods();
