const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let products = [
  { _id: 'prod_1', name: 'Gentle Foaming Cleanser', description: 'pH-balanced cleanser.', category: 'cleanser', price: 1200, stock: 50, brand: 'DermaCare', images: [], isActive: true },
  { _id: 'prod_2', name: 'Hyaluronic Acid Serum', description: 'Deep hydration serum.', category: 'serum', price: 2400, stock: 35, brand: 'DermaCare', images: [], isActive: true },
  { _id: 'prod_3', name: 'SPF 50 Sunscreen', description: 'Non-greasy UV protection.', category: 'sunscreen', price: 1800, stock: 60, brand: 'SunShield', images: [], isActive: true },
  { _id: 'prod_4', name: 'Niacinamide 10% Serum', description: 'Pore refining serum.', category: 'serum', price: 2100, stock: 40, brand: 'ClearSkin', images: [], isActive: true },
];

export async function mockListProducts(params = {}) {
  await delay();
  let items = products.filter((p) => p.isActive);
  if (params.search) {
    const s = params.search.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(s));
  }
  if (params.category) items = items.filter((p) => p.category === params.category);
  return items;
}

export async function mockCreateProduct(payload) {
  await delay();
  const p = { _id: `prod_${Date.now()}`, ...payload, isActive: true, images: [] };
  products = [p, ...products];
  return p;
}

export async function mockUpdateProduct(id, payload) {
  await delay();
  const idx = products.findIndex((p) => p._id === id);
  if (idx === -1) throw new Error('Product not found');
  products[idx] = { ...products[idx], ...payload };
  return products[idx];
}

export async function mockDeleteProduct(id) {
  await delay();
  products = products.filter((p) => p._id !== id);
}
