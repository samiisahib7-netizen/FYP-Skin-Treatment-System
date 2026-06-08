const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let appointments = [
  {
    _id: 'a_seed_1',
    patientId: { _id: 'p1', userId: { name: 'Test Patient', email: 'patient@skintreatment.local' } },
    doctorId: {
      _id: 'd1',
      userId: { name: 'Dr. Ayesha Khan', email: 'doctor@skintreatment.local' },
      specialization: 'Dermatologist',
      consultationFee: 2000,
    },
    date: new Date(Date.now() + 86400000).toISOString(),
    timeSlot: '10:00-10:30',
    status: 'confirmed',
    reason: 'Acne follow-up',
    notes: '',
  },
];

export async function mockListAppointments(params = {}) {
  await delay();
  let items = [...appointments];
  if (params.status) items = items.filter((a) => a.status === params.status);
  return items;
}

export async function mockCreateAppointment(payload) {
  await delay();
  const appt = {
    _id: `a_${Date.now()}`,
    patientId: { _id: 'p1', userId: { name: 'Test Patient' } },
    doctorId: {
      _id: payload.doctorId,
      userId: { name: 'Dr. Ayesha Khan' },
      specialization: 'Dermatologist',
    },
    date: payload.date,
    timeSlot: payload.timeSlot,
    status: 'pending',
    reason: payload.reason || '',
    notes: '',
  };
  appointments = [appt, ...appointments];
  return appt;
}

export async function mockUpdateAppointmentStatus(id, status) {
  await delay();
  const idx = appointments.findIndex((a) => a._id === id);
  if (idx === -1) throw new Error('Appointment not found');
  appointments[idx] = { ...appointments[idx], status };
  return appointments[idx];
}
