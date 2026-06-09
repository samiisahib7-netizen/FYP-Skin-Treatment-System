import api from './api';
import {
  mockListProducts,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct,
} from './mock/products.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const BASE = API_URL.replace(/\/api\/v1$/, '');

export const productService = {
  list: (params) =>
    USE_MOCK
      ? mockListProducts(params)
      : api.get('/products', { params }).then((r) => r.data.data),

  get: (id) => api.get(`/products/${id}`).then((r) => r.data.data),

  create: (payload, imageFile) => {
    if (USE_MOCK) return mockCreateProduct(payload);
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    return api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },

  update: (id, payload, imageFile) => {
    if (USE_MOCK) return mockUpdateProduct(id, payload);
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    if (imageFile) fd.append('image', imageFile);
    return api.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },

  delete: (id) => (USE_MOCK ? mockDeleteProduct(id) : api.delete(`/products/${id}`).then((r) => r.data)),

  imageUrl: (path) => (path?.startsWith('http') ? path : path ? `${BASE}${path}` : null),
};

export default productService;
