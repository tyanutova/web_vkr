const products = [
  { id: "PRD-1001", name: "Sac de Jour Nano", brand: "Saint Laurent", price: 2850, condition: "Excellent", size: "OS", badge: "Редкий лот", image: "./assets/Sac%20de%20Jour%20Nano1.webp", gallery: ["./assets/Sac%20de%20Jour%20Nano1.webp", "./assets/Sac%20de%20Jour%20Nano2.webp", "./assets/Sac%20de%20Jour%20Nano3.webp", "./assets/Sac%20de%20Jour%20Nano4.webp"] },
  { id: "PRD-1002", name: "Spazzolato Leather Pump", brand: "Prada", price: 850, condition: "Pristine", size: "38", badge: "Новинка", image: "./assets/Prada%20%20Spazzolato%20Leather%20Pump1.webp", gallery: ["./assets/Prada%20%20Spazzolato%20Leather%20Pump1.webp", "./assets/Prada%20%20Spazzolato%20Leather%20Pump2.webp", "./assets/Prada%20%20Spazzolato%20Leather%20Pump3.webp"] },
  { id: "PRD-1003", name: "Small Puzzle Bag", brand: "Loewe", price: 1900, condition: "Excellent", size: "OS", badge: "Кураторский выбор", image: "./assets/Loewe%20%20Small%20Puzzle%20Bag1.webp", gallery: ["./assets/Loewe%20%20Small%20Puzzle%20Bag1.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag2.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag3.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag4.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag5.webp"] },
  { id: "PRD-1004", name: "Oversized Square Acetate", brand: "Gucci", price: 340, condition: "Very Good", size: "OS", badge: "Архив", image: "./assets/Gucci%20%20Oversized%20Square%20Acetate%201.webp", gallery: ["./assets/Gucci%20%20Oversized%20Square%20Acetate%201.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%202.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%203.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%204.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%205.webp"] },
  { id: "PRD-1005", name: "Galleria Saffiano", brand: "Prada", price: 2400, condition: "Excellent", size: "OS", badge: "Редкий лот", image: "./assets/Prada%20%20Galleria%20Saffiano1.webp", gallery: ["./assets/Prada%20%20Galleria%20Saffiano1.webp", "./assets/Prada%20%20Galleria%20Saffiano2.webp", "./assets/Prada%20%20Galleria%20Saffiano3.webp", "./assets/Prada%20%20Galleria%20Saffiano4.webp"] },
  { id: "PRD-1006", name: "Triomphe Wallet", brand: "Celine", price: 790, condition: "Pristine", size: "OS", badge: "Хит", image: "./assets/Celine%20%20Triomphe%20Wallet1.webp", gallery: ["./assets/Celine%20%20Triomphe%20Wallet1.webp", "./assets/Celine%20%20Triomphe%20Wallet2.webp", "./assets/Celine%20%20Triomphe%20Wallet3.webp", "./assets/Celine%20%20Triomphe%20Wallet4.webp", "./assets/Celine%20%20Triomphe%20Wallet5.webp"] }
];

const orders = [
  { id: "EC-89231", client: "Elena Holland", date: "Nov 14, 2024", amount: 2450, status: "Shipped", delivery: "DHL Express / Nov 18, 2024" },
  { id: "EC-87114", client: "Marcus Chen", date: "Oct 22, 2024", amount: 5100, status: "Delivered", delivery: "Delivered / Verified" },
  { id: "EC-86002", client: "Sofia Al-Fayed", date: "Sept 12, 2024", amount: 650, status: "Delivered", delivery: "Delivered / Invoice sent" },
  { id: "EC-99388", client: "Julian Rossi", date: "Oct 23, 2024", amount: 12800, status: "Processing", delivery: "Packing in atelier" }
];

const state = {
  currentView: "home",
  activeProduct: products[0].id,
  activeGalleryIndex: 0,
  cart: [{ productId: "PRD-1001", qty: 1 }, { productId: "PRD-1003", qty: 1 }],
  adminTab: "dashboard",
  lastClientView: "home"
};

const viewIds = ["home", "catalog", "product", "cart", "orders", "profile", "admin"];

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function setView(view) {
  state.currentView = view;
  if (view !== "admin") state.lastClientView = view;
  viewIds.forEach((id) => document.getElementById(`${id}View`).classList.toggle("active", id === view));
  document.querySelectorAll(".nav-link").forEach((el) => el.classList.toggle("active", el.dataset.view === view));
  setModeSwitch(view === "admin" ? "admin" : "client");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "catalog") renderCatalog();
  if (view === "product") renderProductDetail();
  if (view === "cart") renderCart();
  if (view === "orders") renderOrders();
  if (view === "admin") renderAdmin();
}

function renderProductCard(product, compact = false) {
  return `
    <article class="product-card">
      <button class="image-button js-open-product" data-product="${product.id}" aria-label="Открыть товар ${product.name}">
        <img class="product-thumb" src="${product.image}" alt="${product.name}">
      </button>
      <span class="pill">${product.badge}</span>
      <h3>
        <button class="title-button js-open-product" data-product="${product.id}">${product.name}</button>
      </h3>
      <div class="product-meta"><span>${product.brand}</span><span>${product.condition}</span></div>
      <p class="price">${money(product.price)}</p>
      <div class="hero-actions">
        ${compact ? "" : `<button class="btn btn-primary js-add-to-cart" data-product="${product.id}">В корзину</button>`}
      </div>
    </article>
  `;
}

function bindProductActions(root = document) {
  root.querySelectorAll(".js-open-product").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeProduct = btn.dataset.product;
      state.activeGalleryIndex = 0;
      setView("product");
    });
  });
  root.querySelectorAll(".js-add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.product));
  });
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) existing.qty += 1;
  else state.cart.push({ productId, qty: 1 });
  updateCartCount();
  animateCartFeedback();
}

function updateCartCount() {
  const total = state.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = String(total);
}

function animateCartFeedback() {
  const badge = document.getElementById("cartCount");
  const cartButton = document.getElementById("cartButton");
  const cartToast = document.getElementById("cartToast");
  badge.classList.remove("bump");
  cartButton.classList.remove("cart-pulse");
  cartToast.classList.remove("show");
  // Force reflow so repeated add-to-cart still animates.
  // eslint-disable-next-line no-unused-expressions
  badge.offsetWidth;
  badge.classList.add("bump");
  cartButton.classList.add("cart-pulse");
  cartToast.classList.add("show");
}

function setModeSwitch(mode) {
  const isAdmin = mode === "admin";
  const clientBtn = document.getElementById("clientModeBtn");
  const adminBtn = document.getElementById("adminModeBtn");
  clientBtn.classList.toggle("active", !isAdmin);
  adminBtn.classList.toggle("active", isAdmin);
  clientBtn.setAttribute("aria-selected", String(!isAdmin));
  adminBtn.setAttribute("aria-selected", String(isAdmin));
}

function renderHome() {
  const grid = document.getElementById("featuredGrid");
  grid.innerHTML = products.slice(0, 3).map((p) => renderProductCard(p, true)).join("");
  bindProductActions(grid);
}

function renderCatalog() {
  const brand = document.getElementById("brandFilter").value;
  const condition = document.getElementById("conditionFilter").value;
  const sort = document.getElementById("sortFilter").value;
  let filtered = products.filter((p) => (brand === "all" || p.brand === brand) && (condition === "all" || p.condition === condition));
  if (sort === "priceAsc") filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") filtered = filtered.sort((a, b) => b.price - a.price);
  const grid = document.getElementById("catalogGrid");
  grid.innerHTML = filtered.map((p) => renderProductCard(p)).join("");
  bindProductActions(grid);
}

function renderProductDetail() {
  const p = products.find((item) => item.id === state.activeProduct) ?? products[0];
  const relatedProducts = products.filter((item) => item.id !== p.id).slice(0, 3);
  const mainImage = p.gallery[state.activeGalleryIndex] ?? p.gallery[0];
  const root = document.getElementById("productDetail");
  root.innerHTML = `
    <div>
      <div class="gallery">
        <div class="zoom-frame">
          <img class="gallery-main" id="galleryMainImage" src="${mainImage}" alt="${p.name}">
        </div>
        <div class="mini-grid">${p.gallery.map((src, index) => `
          <button class="thumb-button ${index === state.activeGalleryIndex ? "active" : ""}" data-image-index="${index}" aria-label="Показать фото ${index + 1}">
            <img src="${src}" alt="${p.name} фото ${index + 1}">
          </button>
        `).join("")}</div>
      </div>
      <section class="section">
        <div class="section-head">
          <h2>Похожие товары</h2>
        </div>
        <div class="product-grid">
          ${relatedProducts.map((item) => renderProductCard(item)).join("")}
        </div>
      </section>
    </div>
    <article class="details">
      <p class="eyebrow">${p.brand}</p>
      <h1 id="productTitle">${p.name}</h1>
      <p class="price">${money(p.price)}</p>
      <p><strong>Состояние:</strong> ${p.condition}</p>
      <p><strong>Размер:</strong> ${p.size}</p>
      <p><strong>Бренд:</strong> ${p.brand}</p>
      <p class="muted">Каждый экземпляр проходит аутентификацию и профессиональную проверку состояния перед публикацией.</p>
      <div class="hero-actions">
        <button class="btn btn-primary js-add-to-cart" data-product="${p.id}">Добавить в корзину</button>
        <button class="btn btn-secondary" data-view="catalog">Назад в каталог</button>
      </div>
    </article>
  `;
  bindProductActions(root);
  root.querySelectorAll(".thumb-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imageIndex = Number(btn.dataset.imageIndex);
      state.activeGalleryIndex = imageIndex;
      const nextSrc = p.gallery[imageIndex];
      const main = root.querySelector("#galleryMainImage");
      if (main && nextSrc) main.src = nextSrc;
      root.querySelectorAll(".thumb-button").forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  root.querySelectorAll("[data-view]").forEach((el) => el.addEventListener("click", () => setView(el.dataset.view)));
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const items = state.cart.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId) })).filter((item) => item.product);
  if (!items.length) {
    cartItems.innerHTML = `<p class="muted">Корзина пуста.</p>`;
  } else {
    cartItems.innerHTML = items.map((item) => `
      <article class="cart-item">
        <div>
          <h3>${item.product.name}</h3>
          <p class="muted">${item.product.brand} • ${item.product.condition} • кол-во ${item.qty}</p>
          <p class="price">${money(item.product.price * item.qty)}</p>
        </div>
        <img class="cart-thumb" src="${item.product.image}" alt="${item.product.name}">
        <div class="cart-item-actions">
          <div class="qty-control" aria-label="Управление количеством">
            <button class="qty-button js-qty" data-id="${item.product.id}" data-step="-1" aria-label="Уменьшить количество">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-button js-qty" data-id="${item.product.id}" data-step="1" aria-label="Увеличить количество">+</button>
          </div>
          <button class="remove-btn js-remove" data-id="${item.product.id}" aria-label="Удалить товар">Удалить</button>
        </div>
      </article>
    `).join("");
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;
  document.getElementById("checkoutSummary").innerHTML = `
    <div><dt>Подытог</dt><dd>${money(subtotal)}</dd></div>
    <div><dt>Доставка</dt><dd>Бесплатно</dd></div>
    <div><dt>Оценочный налог</dt><dd>${money(tax)}</dd></div>
    <div><dt><strong>Итого</strong></dt><dd><strong>${money(total)}</strong></dd></div>
  `;

  cartItems.querySelectorAll(".js-qty").forEach((btn) => btn.addEventListener("click", () => {
    const line = state.cart.find((item) => item.productId === btn.dataset.id);
    if (!line) return;
    line.qty += Number(btn.dataset.step);
    if (line.qty <= 0) state.cart = state.cart.filter((item) => item.productId !== line.productId);
    updateCartCount();
    renderCart();
  }));
  cartItems.querySelectorAll(".js-remove").forEach((btn) => btn.addEventListener("click", () => {
    state.cart = state.cart.filter((item) => item.productId !== btn.dataset.id);
    updateCartCount();
    renderCart();
  }));
}

function renderOrders() {
  const root = document.getElementById("ordersList");
  root.innerHTML = orders.map((o) => `
    <article class="order-card">
      <h3>${o.id} — ${o.client}</h3>
      <p>${o.date} • ${money(o.amount)}</p>
      <p>Статус: <span class="status ${o.status}">${statusLabel(o.status)}</span></p>
      <p class="muted">${o.delivery}</p>
    </article>
  `).join("");
}

function renderAdmin() {
  document.querySelectorAll(".admin-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.admin === state.adminTab));
  document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.remove("active"));
  document.getElementById(`admin${state.adminTab[0].toUpperCase()}${state.adminTab.slice(1)}`).classList.add("active");

  document.getElementById("kpiGrid").innerHTML = `
    <article class="card kpi"><p class="muted">Общий доход</p><h3>$428,900</h3><p>+12.4%</p></article>
    <article class="card kpi"><p class="muted">Объем продаж</p><h3>1,842</h3><p>+5.2%</p></article>
    <article class="card kpi"><p class="muted">Конверсия</p><h3>3.82%</h3><p>-0.4%</p></article>
    <article class="card kpi"><p class="muted">Живые аукционы</p><h3>156</h3><p>+12</p></article>
  `;
  document.getElementById("brandLeaders").innerHTML = `
    <li>Louis Vuitton — продано 242</li><li>Chanel — продано 184</li><li>Hermes — продано 92</li><li>Prada — продано 128</li>
  `;
  document.getElementById("productsTableBody").innerHTML = products.map((p) => `
    <tr><td>${p.id}</td><td>${p.name}</td><td>${p.brand}</td><td>${p.size}</td><td>${money(p.price)}</td><td>${p.condition}</td></tr>
  `).join("");

  const statusFilter = document.getElementById("adminStatusFilter").value;
  const rows = orders.filter((o) => statusFilter === "all" || o.status === statusFilter);
  document.getElementById("adminOrdersBody").innerHTML = rows.map((o) => `
    <tr><td>${o.id}</td><td>${o.client}</td><td>${o.date}</td><td>${money(o.amount)}</td><td>${statusLabel(o.status)}</td><td>${o.delivery}</td></tr>
  `).join("");
}

function statusLabel(status) {
  if (status === "Processing") return "В обработке";
  if (status === "Shipped") return "Отправлен";
  if (status === "Delivered") return "Доставлен";
  return status;
}

function init() {
  const brandSelect = document.getElementById("brandFilter");
  [...new Set(products.map((p) => p.brand))].forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.append(option);
  });

  document.querySelectorAll("[data-view]").forEach((el) => {
    el.addEventListener("click", () => setView(el.dataset.view));
  });
  document.querySelectorAll(".mode-switch-btn").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.dataset.mode === "admin") setView("admin");
      else setView(state.lastClientView === "admin" ? "home" : state.lastClientView);
    });
  });
  document.getElementById("catalogFilters").addEventListener("input", renderCatalog);
  document.getElementById("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const button = document.getElementById("authorizeButton");
    button.disabled = true;
    button.textContent = "Подтверждение...";
    setTimeout(() => {
      button.textContent = "Оплачено";
      state.cart = [];
      updateCartCount();
      renderCart();
    }, 900);
  });
  document.querySelectorAll(".admin-tab").forEach((tab) => tab.addEventListener("click", () => {
    state.adminTab = tab.dataset.admin;
    renderAdmin();
  }));
  document.getElementById("adminStatusFilter").addEventListener("change", renderAdmin);

  const mobileButton = document.getElementById("mobileMenuButton");
  mobileButton.addEventListener("click", () => {
    const nav = document.getElementById("primaryNav");
    const next = !nav.classList.contains("open");
    nav.classList.toggle("open", next);
    mobileButton.setAttribute("aria-expanded", String(next));
  });

  renderHome();
  renderCatalog();
  renderOrders();
  updateCartCount();
}

init();
