import { IMAGE_COMPONENTS } from "./image.index";

export type AdminAppointmentStatus = 'Upcoming' | 'Completed' | 'Canceled' | 'Pending';

export type AdminAppointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string | number;
  patientName: string;
  patientGender: 'Male' | 'Female';
  patientIC: string;
  patientDOB: string;
  patientAge: number;
  patientPhone: string;
  patientImage: string | number;
  patientType: 'Own Self' | 'Family Member';
  bookedByName?: string;
  bookedByIC?: string;
  bookedByDOB?: string;
  bookedByAge?: number;
  bookedByPhone?: string;
  bookedByImage?: string | number;
  date: string;
  time: string;
  displayDate: string;
  visitReason: string;
  details: string;
  status: AdminAppointmentStatus;
  canceledReason?: string;
  medicalInfo: {
    bloodGroup: string;
    allergies: string;
    medicalCondition: string;
    medication: string;
  };
  insuranceInfo: {
    provider: string;
    planType: string;
    memberId: string;
  };
};

export const ADMIN_APPOINTMENTS: AdminAppointment[] = [
  {
    id: 'ad1',
    doctorId: 'd1',
    doctorName: 'Dr. Anis Effendi',
    doctorSpecialty: 'GENERAL PRACTITIONER Primary Care for Adults & ChildrenSpecializing in Wellness & Chronic Disease Management',
    doctorImage: IMAGE_COMPONENTS.drAnis,
    patientName: 'Ahmad Bin Abdullah',
    patientGender: 'Male',
    patientIC: '****5678',
    patientDOB: '10-Aug-1986',
    patientAge: 40,
    patientPhone: '+60 12 2345678',
    patientImage: IMAGE_COMPONENTS.patient,
    patientType: 'Own Self',
    date: 'May 03, 2026 (Sunday)',
    time: '09:00 AM',
    displayDate: 'Today',
    visitReason: 'Checkup',
    details: "Detail Info The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words Which Don't Look Even Slightly Believable.",
    status: 'Upcoming',
    medicalInfo: { bloodGroup: 'A+', allergies: 'Food Allergies, Seasonal Allergies, Pet Allergies', medicalCondition: 'Asthma, Hypertension', medication: 'Cetirizine (Zyrtec)' },
    insuranceInfo: { provider: 'AIA Malaysia', planType: 'A-Plus Med', memberId: 'AIA-MY-123456789' },
  },
  {
    id: 'ad2',
    doctorId: 'd2',
    doctorName: 'Dr. Muhammad Faiz',
    doctorSpecialty: 'GENERAL PRACTITIONER Primary Care for Adults & Children',
    doctorImage: IMAGE_COMPONENTS.drMuhammadFaiz,
    patientName: 'Musaaid bin Taa...',
    patientGender: 'Male',
    patientIC: '****1234',
    patientDOB: '05-Jan-1990',
    patientAge: 34,
    patientPhone: '+60 11 1234567',
    patientImage:  IMAGE_COMPONENTS.patient,
    patientType: 'Own Self',
    date: 'May 04, 2026 (Monday)',
    time: '09:00 AM',
    displayDate: 'Today',
    visitReason: 'Demam/Sakit',
    details: "Detail Info The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words Which Don't Look Even Slightly Believable.",
    status: 'Pending',
    medicalInfo: { bloodGroup: 'B+', allergies: 'Dust Allergies', medicalCondition: 'None', medication: 'None' },
    insuranceInfo: { provider: 'Prudential', planType: 'PRUMed', memberId: 'PRU-MY-987654321' },
  },
  {
    id: 'ad3',
    doctorId: 'd3',
    doctorName: 'Dr. Noormimi Khatijah',
    doctorSpecialty: 'PEDIATRICIAN Specializing in Child Health',
    doctorImage: IMAGE_COMPONENTS.drNoormimiKhatijah,
    patientName: 'Haatim bin Jareer',
    patientGender: 'Male',
    patientIC: '****9876',
    patientDOB: '20-Mar-2005',
    patientAge: 19,
    patientPhone: '+60 13 9876543',
    patientImage:  IMAGE_COMPONENTS.patient,
    patientType: 'Family Member',
    bookedByName: 'Ahmad Bin Abdullah',
    bookedByIC: '****5678',
    bookedByDOB: '10-Aug-1986',
    bookedByAge: 40,
    bookedByPhone: '+60 12 2345678',
    bookedByImage:  IMAGE_COMPONENTS.patient,
    date: 'May 05, 2026 (Tuesday)',
    time: '09:00 AM',
    displayDate: 'Today',
    visitReason: 'Vaksin',
    details: "Detail Info The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words Which Don't Look Even Slightly Believable.",
    status: 'Upcoming',
    medicalInfo: { bloodGroup: 'O+', allergies: 'None', medicalCondition: 'None', medication: 'None' },
    insuranceInfo: { provider: 'Great Eastern', planType: 'SmartMedic', memberId: 'GE-MY-112233445' },
  },
  {
    id: 'ad4',
    doctorId: 'd4',
    doctorName: 'Dr. Liyana Binti Ramli',
    doctorSpecialty: 'ANTENATAL Specializing in Maternal Health',
    doctorImage: IMAGE_COMPONENTS.drLiyanaBintiRamli,
    patientName: 'Atan bin Johan',
    patientGender: 'Male',
    patientIC: '****4321',
    patientDOB: '15-Jun-1985',
    patientAge: 39,
    patientPhone: '+60 12 4321098',
    patientImage:  IMAGE_COMPONENTS.patient,
    patientType: 'Own Self',
    date: 'May 06, 2026 (Wednesday)',
    time: '09:00 AM',
    displayDate: 'Today',
    visitReason: 'Follow-up',
    details: "Detail Info The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words Which Don't Look Even Slightly Believable.",
    status: 'Pending',
    medicalInfo: { bloodGroup: 'AB+', allergies: 'Pollen', medicalCondition: 'Diabetes', medication: 'Metformin' },
    insuranceInfo: { provider: 'AIA Malaysia', planType: 'A-Plus Med', memberId: 'AIA-MY-556677889' },
  },
  {
    id: 'ad5',
    doctorId: 'd5',
    doctorName: 'Dr. Noor Liyana Binti...',
    doctorSpecialty: 'GENERAL PRACTITIONER Primary Care for Adults',
    doctorImage: IMAGE_COMPONENTS.drNoorLiyana,
    patientName: 'Mahdi bin Shakeel',
    patientGender: 'Male',
    patientIC: '****7654',
    patientDOB: '01-Feb-1992',
    patientAge: 32,
    patientPhone: '+60 19 7654321',
    patientImage: IMAGE_COMPONENTS.patient,
    patientType: 'Family Member',
    bookedByName: 'Ahmad Bin Abdullah',
    bookedByIC: '****5678',
    bookedByDOB: '10-Aug-1986',
    bookedByAge: 40,
    bookedByPhone: '+60 12 2345678',
    bookedByImage:  IMAGE_COMPONENTS.patient,
    date: 'May 07, 2026 (Thursday)',
    time: '09:00 AM',
    displayDate: 'Tomorrow',
    visitReason: 'Checkup',
    details: "Detail Info The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words Which Don't Look Even Slightly Believable.",
    status: 'Upcoming',
    medicalInfo: { bloodGroup: 'A-', allergies: 'Seafood', medicalCondition: 'None', medication: 'None' },
    insuranceInfo: { provider: 'Takaful Malaysia', planType: 'i-Med Plus', memberId: 'TM-MY-998877665' },
  }, 
];
export const BOOKING_STATS = {
  bookingRequest: 23,
  accepted: 20,
};