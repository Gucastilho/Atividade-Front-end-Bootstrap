export function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '{}');
}

export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addProductToCart(itemId, product) {
    const cart = getCart();
    const priceNum = parseFloat(product.preco.replace('R$', '').replace('.', '').replace(',', '.').trim());

    if (cart[itemId]) {
        cart[itemId].quantity += 1;
    } else {
        cart[itemId] = { ...product, priceNum, quantity: 1 };
    }

    saveCart(cart);
    updateCartItemCount();

    return new Promise(resolve =>
        setTimeout(() => resolve(`${product.nome} adicionado ao carrinho!`), 300)
    );
}

export function removeFromCart(itemId) {
    const cart = getCart();
    delete cart[itemId];
    saveCart(cart);
    updateCartBadge();
}

export function updateQty(itemId, qty) {
    const cart = getCart();
    if (!cart[itemId]) return;
    cart[itemId].quantity = Math.max(1, qty);
    saveCart(cart);
    updateCartItemCount();
}

export function getCartCount() {
    return Object.values(getCart()).reduce((sum, item) => sum + item.quantity, 0);
}

export function updateCartItemCount() {
    const badge = document.querySelector('.navbar .badge');
    if (badge) badge.textContent = getCartCount();
}
