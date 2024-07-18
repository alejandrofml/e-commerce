document.addEventListener('DOMContentLoaded', function() {
    const products = [
      { id: 1, name: 'Nintendo NES', price: 250.00, description: 'Consola Nintendo NES Original', image: 'https://funtec.com.uy/wp-content/uploads/2022/11/D_NQ_NP_2X_950144-MLU44938630217_022021-F.webp' },
      { id: 2, name: 'Armario', price: 100.00, description: 'Armario de 6 puertas ', image: 'https://promart.vteximg.com.br/arquivos/ids/8059112-1000-1000/152976.jpg?v=638562656639600000' },
      { id: 3, name: 'Bananas', price: 3.00, description: '3 bananas de Brasil', image: 'https://cirogentilesa.com.uy/wp-content/uploads/2022/09/banana-3.png' }
    ];
  
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const productsSection = document.getElementById('products');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');
    const orderList = document.getElementById('order-list');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalAddToCart = document.getElementById('modal-add-to-cart');
    let currentProduct = null;
  
    // Mostrar la sección correspondiente
    window.showSection = function(sectionId) {
      document.getElementById('products').classList.add('d-none');
      document.getElementById('cart').classList.add('d-none');
      document.getElementById('orders').classList.add('d-none');
      document.getElementById(sectionId).classList.remove('d-none');
    };
  
    showSection('products');
  
    // Cargar productos en la página
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('col-md-4', 'mb-4');
      productDiv.innerHTML = `
        <div class="card">
          <img src="${product.image}" class="card-img-top" alt="${product.name}" onclick="showProductDetails(${product.id})">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">$${product.price.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar al Carrito</button>
          </div>
        </div>
      `;
      productsSection.querySelector('.row').appendChild(productDiv);
    });
  
    // Función para mostrar detalles del producto en el modal
    window.showProductDetails = function(productId) {
      currentProduct = products.find(p => p.id === productId);
      modalTitle.textContent = currentProduct.name;
      modalImage.src = currentProduct.image;
      modalDescription.textContent = currentProduct.description;
      modalPrice.textContent = currentProduct.price.toFixed(2);
      $('#product-modal').modal('show');
    };
  
    // Función para agregar un producto al carrito
    window.addToCart = function(productId) {
      const product = products.find(p => p.id === productId);
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        cartItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCart();
      localStorage.setItem('cart', JSON.stringify(cart));
    };
  
    modalAddToCart.onclick = function() {
      addToCart(currentProduct.id);
      $('#product-modal').modal('hide');
    };
  
    // Función para actualizar el carrito
    function updateCart() {
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
          ${product.name} - $${product.price.toFixed(2)} x ${product.quantity}
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${product.id})">Eliminar</button>
        `;
        cartItems.appendChild(li);
        total += product.price * product.quantity;
      });
      totalPrice.textContent = total.toFixed(2);
      cartCount.textContent = cart.length;
    }
  
    // Función para eliminar un producto del carrito
    window.removeFromCart = function(productId) {
      const index = cart.findIndex(item => item.id === productId);
      if (index !== -1) {
        cart.splice(index, 1);
      }
      updateCart();
      localStorage.setItem('cart', JSON.stringify(cart));
    };
  
    // Evento para finalizar la compra
    document.getElementById('checkout').addEventListener('click', function() {
      if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
      }
      const order = {
        id: Date.now(),
        items: cart.map(item => ({ ...item })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      cart.length = 0;
      updateCart();
      alert('Compra finalizada!');
      localStorage.removeItem('cart');
      loadOrders();
      showSection('orders');
    });
  
    // Función para cargar las compras realizadas
    function loadOrders() {
      orderList.innerHTML = '';
      orders.forEach(order => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
          <h5>Compra #${order.id}</h5>
          <ul>
            ${order.items.map(item => `
              <li>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</li>
            `).join('')}
          </ul>
          <p>Total: $${order.total.toFixed(2)}</p>
        `;
        orderList.appendChild(li);
      });
    }
  
    updateCart();
    loadOrders();
  });
  