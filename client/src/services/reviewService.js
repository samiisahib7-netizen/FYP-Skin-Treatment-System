import api from './api';
import { mockListReviews, mockMyReviews, mockCreateReview } from './mock/reviews.mock';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export const reviewService = {
  list: (params) =>
    USE_MOCK
      ? mockListReviews(params)
      : api.get('/reviews', { params }).then((r) => r.data.data),

  mine: () =>
    USE_MOCK ? mockMyReviews() : api.get('/reviews/mine').then((r) => r.data.data),

  create: (payload) =>
    USE_MOCK
      ? mockCreateReview(payload)
      : api.post('/reviews', payload).then((r) => r.data.data),
};

export default reviewService;
