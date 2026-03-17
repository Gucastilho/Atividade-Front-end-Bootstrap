import { getCart, removeFromCart, updateQty, updateCartBadge } from './cart.js';

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

    updateCartItemCount();
    updateHeroCount(items);

    if (items.length === 0) {
        mainContent.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    mainContent.style.display = '';
    emptyState.style.display = 'none';
    container.innerHTML = '';

    const skeleton = document.getElementById('item-skeleton');

    items.forEach(([id, item]) => {
        const row = skeleton.cloneNode(true);
        row.id = `item-${id}`;
        row.hidden = false;

        const img = row.querySelector('#item-img');
        img.src = item.img;
        img.alt = item.nome;
        img.onerror = () => img.parentElement.textContent = '🛍️';

        row.querySelector('#item-title').textContent = item.nome;
        row.querySelector('#item-sub').textContent = item.marca || '';
        row.querySelector('#item-price').textContent = formatBRL(item.priceNum * item.quantity);
        row.querySelector('#item-unit').textContent = `(${formatBRL(item.priceNum)} un.)`;

        const qty = row.querySelector('#item-qty');
        qty.value = item.quantity;
        qty.dataset.id = id;

        row.querySelectorAll('.qty-btn').forEach(btn => btn.dataset.id = id);
        row.querySelector('#item-remove').dataset.id = id;

        container.appendChild(row);
    });

    bindEvents();
    updateTotals();
}

function bindEvents() {
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const delta = parseInt(btn.dataset.delta);
            const cart = getCart();
            const newQty = (cart[id]?.quantity || 1) + delta;
            if (newQty < 1) return;
            updateQty(id, newQty);
            renderCart();
        });
    });

    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', () => {
            const id = input.dataset.id;
            const val = parseInt(input.value);
            if (val >= 1) { updateQty(id, val); renderCart(); }
        });
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.id);
            renderCart();
        });
    });
}

function updateTotals() {
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

function updateHeroCount(items) {
    const total = items.reduce((sum, [, item]) => sum + item.quantity, 0);
    const heroP = document.querySelector('.page-hero p');
    if (heroP) {
        heroP.innerHTML = `${total} ${total === 1 ? 'item adicionado' : 'itens adicionados'} &nbsp;·&nbsp; <span class="frete-tag"><i class="bi bi-truck"></i> Frete grátis acima de R$150</span>`;
    }
}

window.applyCoupon = function () {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    if (code === 'SAVE10') {
        discountPct = 0.10;
        updateTotals();
    } else {
        alert('Cupom inválido.');
    }
};

window.showToast = function (name) {
    document.getElementById('toastMsg').textContent = name + ' adicionado ao carrinho!';
    new bootstrap.Toast(document.getElementById('liveToast')).show();
};

window.checkout = function () {
    alert('Redirecionando para o pagamento...');
    localStorage.clear();
    window.location.href = '../index.html'
};

document.addEventListener('DOMContentLoaded', renderCart);
