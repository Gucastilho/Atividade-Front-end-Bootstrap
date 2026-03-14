import produtos from '../lib/products_info.json' with { type: "json" };
import { addProductToCart } from './cart.js';

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('item');

if (itemId && produtos[itemId]) {
    const prod = produtos[itemId];
    
    document.getElementById('img-produto').src = prod.img;
    document.getElementById('nome-produto').innerText = prod.nome;
    document.getElementById('preco-produto').innerText = prod.preco;
    document.getElementById('desc-produto').innerText = prod.desc;

    const lista = document.getElementById('lista-detalhes');
    lista.innerHTML = '';
    prod.detalhes.forEach(detalhe => {
        let li = document.createElement('li');
        li.innerText = detalhe;
        lista.appendChild(li);
    });

    document.querySelector('.btn-success').addEventListener('click', () => {
        const id = new URLSearchParams(window.location.search).get('item');
        const product = produtos[id];
        addProductToCart(id, product)
            .then(message => alert(message))
            .catch(error => alert(error));
    });
}
else {
    document.getElementById('nome-produto').innerText = 'Produto não encontrado';
    document.getElementById('desc-produto').innerText = 'Por favor, volte à página inicial e escolha um produto válido.';
}
