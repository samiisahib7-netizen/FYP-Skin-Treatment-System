const reviews = [
  {
    _id: 'r1',
    targetType: 'doctor',
    targetId: 'doc1',
    rating: 5,
    comment: 'Excellent dermatologist!',
    patientId: { userId: { name: 'Test Patient' } },
    createdAt: new Date().toISOString(),
  },
];

export function mockListReviews({ targetType, targetId }) {
  const list = reviews.filter((r) => r.targetType === targetType && r.targetId === targetId);
  return Promise.resolve(list);
}

export function mockMyReviews() {
  return Promise.resolve(reviews);
}

export function mockCreateReview(payload) {
  const review = {
    _id: `r${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(review);
  return Promise.resolve(review);
}
