import sortByAttribute from './filter.js';

export function addProductToCart(itemId, product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');

    if (cart[itemId]) {
        cart[itemId].quantity += 1;
    } else {
        cart[itemId] = { ...product, quantity: 1 };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(localStorage)
    sortByAttribute("Preco")

    return new Promise((resolve) => {
        setTimeout(() => { 
            resolve(`${product.nome} adicionado ao carrinho.`)}, 1000);
    });
}
