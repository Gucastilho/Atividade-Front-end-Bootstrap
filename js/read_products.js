import produtos from '../lib/products_info.json' with { type: "json" };
import { addProductToCart, updateCartBadge } from './update_cart.js';

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('item');

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    if (itemId && produtos[itemId]) {
        const prod = produtos[itemId];

        document.getElementById('img-produto').src = prod.img;
        document.getElementById('nome-produto').innerText = prod.nome;
        document.getElementById('preco-produto').innerText = prod.preco;
        document.getElementById('desc-produto').innerText = prod.desc;

        const lista = document.getElementById('lista-detalhes');
        lista.innerHTML = '';
        prod.detalhes.forEach(detalhe => {
            const li = document.createElement('li');
            li.innerText = detalhe;
            lista.appendChild(li);
        });

        const btn = document.querySelector('.btn-success');
        btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i> Adicionando...';
            addProductToCart(itemId, prod).then(msg => {
                btn.innerHTML = '<i class="fa fa-check me-2"></i> Adicionado!';
                btn.classList.replace('btn-success', 'btn-secondary');
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa fa-cart-plus me-2"></i> Adicionar ao Carrinho';
                    btn.classList.replace('btn-secondary', 'btn-success');
                }, 2000);
            });
        });
    } else {
        document.getElementById('nome-produto').innerText = 'Produto não encontrado';
        document.getElementById('desc-produto').innerText = 'Por favor, volte à página inicial e escolha um produto válido.';
    }
});
