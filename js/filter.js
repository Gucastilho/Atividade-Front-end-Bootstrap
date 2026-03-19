import { updateCartBadge, addProductToCart } from './update_cart.js';

let allProducts = {};

function parsePrice(preco) {
    return parseFloat(preco.replace('R$', '').replace('.', '').replace(',', '.').trim());
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');
    const entries = Object.entries(products);

    if (entries.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    grid.innerHTML = entries.map(([id, p]) => `
        <div class="card">
            <img src="${p.img}" class="card-img-top" alt="${p.nome}">
            <div class="card-body text-center">
                <h5>${p.nome}</h5>
                <p class="text-muted small mb-1">${p.marca}</p>
                <p class="text-success fw-bold">${p.preco}</p>
                <button class="btn btn-success w-100 mb-2" data-id="${id}">Adicionar ao Carrinho</button>
                <a href="produto.html?item=${id}" class="btn btn-outline-success w-100">Ver Detalhes</a>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await addProductToCart(id, allProducts[id]);
            btn.textContent = '✓ Adicionado!';
            setTimeout(() => btn.textContent = 'Adicionar ao Carrinho', 1500);
        });
    });
}

function applyFilters() {
    const maxPrice = parseFloat(document.getElementById('precoRange').value);
    const marca = document.getElementById('marcaSelect').value;

    document.getElementById('precoValor').textContent = 'R$ ' + maxPrice.toFixed(0);

    const filtered = Object.fromEntries(
        Object.entries(allProducts).filter(([, p]) => {
            const price = parsePrice(p.preco);
            const marcaOk = marca === 'todas' || p.marca === marca;
            return price <= maxPrice && marcaOk;
        })
    );

    renderProducts(filtered);
}

document.addEventListener('DOMContentLoaded', async () => {
    updateCartBadge();

    const res = await fetch('../lib/products_info.json');
    allProducts = await res.json();

    const maxPrice = Math.max(...Object.values(allProducts).map(p => parsePrice(p.preco)));
    const range = document.getElementById('precoRange');
    range.max = Math.ceil(maxPrice / 10) * 10;
    range.value = range.max;
    document.getElementById('precoValor').textContent = 'R$ ' + range.max;

    renderProducts(allProducts);

    range.addEventListener('input', applyFilters);
    document.getElementById('marcaSelect').addEventListener('change', applyFilters);
    document.getElementById('btnLimpar').addEventListener('click', () => {
        range.value = range.max;
        document.getElementById('marcaSelect').value = 'todas';
        applyFilters();
    });
});
