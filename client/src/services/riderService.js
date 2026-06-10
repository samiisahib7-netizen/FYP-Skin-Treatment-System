import api from './api';

export const riderService = {
  list: () => api.get('/riders').then((r) => r.data.data),
};

export default riderService;
