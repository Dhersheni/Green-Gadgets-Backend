// cart.js - Frontend logic for adding, removing, and fetching cart items

const API_BASE_URL = 'http://localhost:51296/cart';

// --- API Functions ---

// Fetch all cart items from the backend
async function fetchCartItems() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch cart items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}

// Add a product to the cart (send POST request)
async function addToCart(productName, price, quantity, imageUrl) {
    const cartItem = {
        productName: productName,
        price: price,
        quantity: quantity,
        imageUrl: imageUrl
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        });

        if (response.ok) {
            alert('Item added to cart!');
            // Update cart count after adding item
            updateCartCount();
        } else {
            alert('Failed to add item to cart.');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Remove an item from the cart (send DELETE request)
async function removeFromCart(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Re-render the cart items and update cart count
            displayCart();
            updateCartCount();
        } else {
            alert('Failed to remove item from cart.');
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

// --- UI Functions ---

// Fetch items and calculate total count to show in navbar and save to localStorage
async function updateCartCount() {
    const cartItems = await fetchCartItems();
    
    // Calculate total quantity
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Save to localStorage so it persists across pages
    localStorage.setItem('cartCount', totalCount);

    // Update UI if a #cart-count element exists
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = totalCount;
    }
}

// Read localStorage to instantly show cart count on page load
function loadCartCount() {
    const count = localStorage.getItem('cartCount') || 0;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = count;
    }
    // Sync with backend to ensure it's accurate
    updateCartCount();
}

// Render dynamic cart items inside a container with id="cart-container"
async function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    // Abort if we aren't on the cart page
    if (!cartContainer) return;

    const cartItems = await fetchCartItems();
    cartContainer.innerHTML = ''; // Clear container
    
    let totalPrice = 0;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is completely empty. Start shopping!</p>';
        updateTotalPriceUI(0);
        return;
    }

    // Loop through each product and render HTML
    cartItems.forEach(item => {
        totalPrice += (item.price * item.quantity);

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        // Basic inline styles to keep it neat
        itemElement.style = 'display: flex; gap: 20px; align-items: center; border-bottom: 1px solid #ddd; padding: 10px 0; margin-bottom: 10px;';

        itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.productName}" style="width: 100px; height: 100px; object-fit: cover;" />
            <div style="flex-grow: 1;">
                <h4 style="margin: 0; font-size: 1.1em;">${item.productName}</h4>
                <p style="margin: 5px 0; color: #555;">Price: $${item.price.toFixed(2)}</p>
                <p style="margin: 5px 0; color: #555;">Qty: ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">
                Remove
            </button>
        `;
        cartContainer.appendChild(itemElement);
    });

    updateTotalPriceUI(totalPrice);
}

// Update the total price text
function updateTotalPriceUI(total) {
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.innerText = '$' + total.toFixed(2);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCartCount();
    displayCart();
});
