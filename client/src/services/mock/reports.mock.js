const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const reports = [
  {
    _id: 'rpt_seed_1',
    patientId: { _id: 'p1', userId: { name: 'Test Patient' } },
    uploadedBy: { name: 'Dr. Ayesha Khan' },
    title: 'Skin allergy panel',
    description: 'Baseline allergy test results',
    fileUrl: '/uploads/reports/sample-report.pdf',
    fileType: 'pdf',
    createdAt: new Date().toISOString(),
  },
];

export async function mockListReports() {
  await delay();
  return [...reports];
}

export async function mockUploadReport(_formData) {
  await delay();
  const report = {
    _id: `rpt_${Date.now()}`,
    title: 'Uploaded report',
    fileUrl: '/uploads/reports/sample-report.pdf',
    fileType: 'pdf',
    createdAt: new Date().toISOString(),
  };
  reports.unshift(report);
  return report;
}
