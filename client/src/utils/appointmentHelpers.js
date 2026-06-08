const STATUS_VARIANT = {
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'destructive',
};

export function statusVariant(status) {
  return STATUS_VARIANT[status] || 'default';
}

export function doctorName(appt) {
  return appt?.doctorId?.userId?.name || appt?.doctor?.userId?.name || 'Doctor';
}

export function patientName(appt) {
  return appt?.patientId?.userId?.name || appt?.patient?.userId?.name || 'Patient';
}

export function formatApptDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function dayLabelFromDate(dateStr) {
  const d = new Date(dateStr);
  return DAY_MAP[d.getDay()];
}

/** Build slot string "10:00-10:30" from availability slot object */
export function slotLabel(slot) {
  return `${slot.start}-${slot.end}`;
}
