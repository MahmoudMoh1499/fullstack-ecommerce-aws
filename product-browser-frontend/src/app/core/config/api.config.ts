// src/app/core/config/api.config.ts
export const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:3000', // Replace with your actual API URL
  endpoints: {
    auth: {
      login: '/login',
      register: '/register'
    },
    products: '/products',
    cart: '/cart',
    user: '/user'
  }
};
