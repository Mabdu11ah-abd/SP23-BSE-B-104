// Function to update cart UI
function updateCart() {
    const cartItems = JSON.parse(Cookies.get('cart') || '[]');
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = ''; // Clear current cart list
  
    cartItems.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = `${item.name} - $${item.price}`;
      cartList.appendChild(li);
    });
  }
  
  // Function to add item to cart
  function addToCart(event) {
    const productId = event.target.getAttribute('data-id');
    const productName = event.target.getAttribute('data-name');
    const productPrice = parseFloat(event.target.getAttribute('data-price'));
  
    // Get current cart from cookies, or initialize it as an empty array
    const cart = JSON.parse(Cookies.get('cart') || '[]');
  
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if item is already in the cart
    } else {
      // Add new item to cart
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1
      });
    }
  
    // Save updated cart to cookies
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 }); // Expires in 7 days
    updateCart();
  }
  
  // Function to clear the cart
  function clearCart() {
    Cookies.remove('cart'); // Remove cart cookie
    updateCart();
  }
  
  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
  
  // Add event listener to "Clear Cart" button
  document.getElementById('clear-cart').addEventListener('click', clearCart);
  
  // Initialize cart UI on page load
  updateCart();
  