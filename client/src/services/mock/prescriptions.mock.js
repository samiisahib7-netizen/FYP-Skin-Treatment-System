const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const prescriptions = [
  {
    _id: 'rx_seed_1',
    appointmentId: { _id: 'a_seed_1', timeSlot: '10:00-10:30', status: 'completed' },
    doctorId: { _id: 'd1', userId: { name: 'Dr. Ayesha Khan' } },
    patientId: { _id: 'p1', userId: { name: 'Test Patient' } },
    medicines: [
      { name: 'Benzoyl Peroxide 5%', dosage: 'Thin layer', duration: '4 weeks', instructions: 'Nightly' },
      { name: 'Sunscreen SPF 50', dosage: '2 finger lengths', duration: 'Ongoing', instructions: 'Morning' },
    ],
    advice: 'Avoid direct sun. Use gentle cleanser.',
    followUpDate: null,
    issuedAt: new Date().toISOString(),
  },
];

export async function mockListPrescriptions() {
  await delay();
  return [...prescriptions];
}

export async function mockCreatePrescription(payload) {
  await delay();
  const rx = {
    _id: `rx_${Date.now()}`,
    appointmentId: { _id: payload.appointmentId, status: 'completed' },
    doctorId: { _id: 'd1', userId: { name: 'Dr. Ayesha Khan' } },
    patientId: { _id: 'p1', userId: { name: 'Test Patient' } },
    medicines: payload.medicines,
    advice: payload.advice || '',
    followUpDate: payload.followUpDate || null,
    issuedAt: new Date().toISOString(),
  };
  prescriptions.unshift(rx);
  return rx;
}
