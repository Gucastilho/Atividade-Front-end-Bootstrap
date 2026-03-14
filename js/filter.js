import produtos from '../lib/products_info.json' with { type: "json" };

export default function sortByAttribute(sortOption) {
    const entries = Object.entries(produtos);

    switch (sortOption) {
        case "nome":
            return entries.sort(([, a], [, b]) => a.nome.localeCompare(b.nome));

        case "preco":
            return entries
                .map(([itemId, product]) => [itemId, { ...product, _preco: parseFloat(
                    product.preco.replace('R$', '').replace(',', '.').trim())
                }])
                .sort(([, a], [, b]) => a._preco - b._preco);

        case "marca":
            return entries.sort(([, a], [, b]) => a.marca?.localeCompare(b.marca));
    }
}
