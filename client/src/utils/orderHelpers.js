const STATUS_VARIANT = {
  pending: 'warning',
  paid: 'info',
  shipped: 'info',
  'out-for-delivery': 'info',
  delivered: 'success',
  cancelled: 'destructive',
};

export function orderStatusVariant(status) {
  return STATUS_VARIANT[status] || 'default';
}

export function patientNameFromOrder(order) {
  return order?.patientId?.userId?.name || 'Patient';
}
