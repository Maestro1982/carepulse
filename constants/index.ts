export const GenderOptions = ['Male', 'Female', 'Other'];

export const PatientFormDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: new Date(Date.now()),
  gender: 'Male' as Gender,
  address: '',
  occupation: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  primaryPhysician: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  allergies: '',
  currentMedication: '',
  familyMedicalHistory: '',
  pastMedicalHistory: '',
  identificationType: 'Birth Certificate',
  identificationNumber: '',
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  'Birth Certificate',
  "Driver's License",
  'Medical Insurance Card/Policy',
  'Military ID Card',
  'National Identity Card',
  'Passport',
  'Resident Alien Card (Green Card)',
  'Social Security Card',
  'State ID Card',
  'Student ID Card',
  'Voter ID Card',
];

export const Doctors = [
  {
    image: '/assets/images/dr-green.png',
    name: 'John Green',
    specialization: 'Lungs',
  },
  {
    image: '/assets/images/dr-cameron.png',
    name: 'Leila Cameron',
    specialization: 'Neurology',
  },
  {
    image: '/assets/images/dr-livingston.png',
    name: 'David Livingston',
    specialization: 'Cardiology',
  },
  {
    image: '/assets/images/dr-peter.png',
    name: 'Evan Peter',
    specialization: 'Endocrinology',
  },
  {
    image: '/assets/images/dr-powell.png',
    name: 'Jane Powell',
    specialization: 'Gastroenterology',
  },
  {
    image: '/assets/images/dr-remirez.png',
    name: 'Alex Ramirez',
    specialization: 'Gynaecologist',
  },
  {
    image: '/assets/images/dr-lee.png',
    name: 'Jasmine Lee',
    specialization: 'Rheumatologist',
  },
  {
    image: '/assets/images/dr-cruz.png',
    name: 'Alyana Cruz',
    specialization: 'Physical and rehabilitation',
  },
  {
    image: '/assets/images/dr-sharma.png',
    name: 'Hardik Sharma',
    specialization: 'Otorhinolaryngology',
  },
];

export const StatusIcon = {
  scheduled: '/assets/icons/check.svg',
  pending: '/assets/icons/pending.svg',
  cancelled: '/assets/icons/cancelled.svg',
};
