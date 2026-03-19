import { getCart, removeFromCart, updateCartItems, updateCartBadge, addProductToCart } from './update_cart.js';

let discountPct = 0;

function formatBRL(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    const emptyState = document.getElementById('emptyState');
    const mainContent = document.getElementById('mainContent');
    const items = Object.entries(cart);

    updateCartBadge();
    updateProductText(items);

    if (items.length === 0) {
        mainContent.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    mainContent.style.display = '';
    emptyState.style.display = 'none';
    container.innerHTML = '';

    items.forEach(([id, item]) => {
        const row = document.createElement('div');
        row.className = 'item-row d-flex align-items-center gap-3';
        row.id = `item-${id}`;
        row.innerHTML = `
            <div class="item-img">
                <img src="${item.img}" alt="${item.nome}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.parentElement.textContent='🛍️'">
            </div>
            <div class="flex-grow-1">
                <div class="item-title">${item.nome}</div>
                <div class="item-sub">${item.marca || ''}</div>
                <div class="mt-2 d-flex align-items-center gap-3 flex-wrap">
                    <div class="qty-control">
                        <button class="qty-btn" data-id="${id}" data-delta="-1">−</button>
                        <input class="qty-input" data-id="${id}" value="${item.quantity}" min="1" type="number"/>
                        <button class="qty-btn" data-id="${id}" data-delta="1">+</button>
                    </div>
                    <span class="item-price">${formatBRL(item.priceNum * item.quantity)}</span>
                    <span class="item-unit-price" style="font-size:.78rem;color:var(--muted)">(${formatBRL(item.priceNum)} un.)</span>
                </div>
            </div>
            <button class="btn-remove" data-id="${id}" title="Remover"><i class="bi bi-trash3"></i></button>
        `;
        container.appendChild(row);
    });

    updateCartContainer();
    updatePurchaseTotalValue();
}

function updateCartContainer() {
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const delta = parseInt(btn.dataset.delta);
            const cart = getCart();
            const newQty = (cart[id]?.quantity || 1) + delta;
            if (newQty < 1) return;
            updateCartItems(id, newQty);
            renderCart();
        });
    });

    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', () => {
            const id = input.dataset.id;
            const val = parseInt(input.value);
            if (val >= 1) { updateCartItems(id, val); renderCart(); }
        });
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.id);
            renderCart();
        });
    });
}

function updatePurchaseTotalValue() {
    const cart = getCart();
    const subtotal = Object.values(cart).reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
    const discount = subtotal * discountPct;
    const total = subtotal - discount;

    document.getElementById('subtotal').textContent = formatBRL(subtotal);
    document.getElementById('total').textContent = formatBRL(total);

    const discRow = document.getElementById('discountRow');
    if (discountPct > 0) {
        document.getElementById('discountVal').textContent = '− ' + formatBRL(discount);
        discRow.style.display = 'flex';
    } else {
        discRow.style.display = 'none';
    }
}

function updateProductText(items) {
    const total = items.reduce((sum, [, item]) => sum + item.quantity, 0);
    const heroP = document.querySelector('.page-hero p');
    if (heroP) {
        heroP.innerHTML = `${total} ${total === 1 ? 'item adicionado' : 'itens adicionados'} &nbsp;·&nbsp; <span class="frete-tag"><i class="bi bi-truck"></i> Frete grátis acima de R$150</span>`;
    }
}

window.showRecommended = function (name) {
    document.getElementById('toastMsg').textContent = name + ' adicionado ao carrinho!';
    new bootstrap.Toast(document.getElementById('liveToast')).show();
};

window.checkout = function () {
    alert('Redirecionando para o pagamento...');
};

async function renderRecommended() {
    const res = await fetch('../lib/products_info.json');
    const products = await res.json();
    const container = document.getElementById('recProducts');
    container.innerHTML = Object.entries(products).map(([id, p]) => `
        <div class="col-6 col-md-3">
            <div class="rec-card">
                <div class="rec-img"><img src="${p.img}" alt="${p.nome}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.parentElement.textContent='🛍️'"></div>
                <div class="rec-body">
                    <div class="rec-name">${p.nome}</div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="rec-price">${p.preco}</span>
                        <button class="btn-add-rec" data-id="${id}"><i class="bi bi-plus"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.btn-add-rec').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const msg = await addProductToCart(id, products[id]);
            showRecommended(msg);
            renderCart();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => { renderCart(); renderRecommended(); });
