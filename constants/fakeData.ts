import { IMAGE_COMPONENTS } from "./image.index";

export type TierType = 'Tier 1' | 'Tier 2';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fullSpecialty: string;
  tier: TierType;
  time: string;
  image: string | number;
  consultationDays: string;
  consultationTime: string;
  about: string;
  services: string[];
  route: string;
}

export interface QuickAction {
  id: string;
  title: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface Vaccine {
  id: string;
  name: string;
  price: string;
  stock: number;
  expireDate: string;
}

export interface MedicalRecord {
  id: string;
  doctorName: string;
  specialty: string;
  patient: string;
  dateTime: string;
}

export interface QueueItem {
  id: string;
  doctorName: string;
  waiting: number;
  served: number;
  estimatedWait: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  tier: string;
  patientName: string;
  patientType: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  details: string;
  image: string | number;
  doctorId?: string;
  cancelReason?: string;
  cancelDate?: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Anis Effendi',
    specialty: 'General Practice',
    fullSpecialty: 'General Practice, Adults & Children, Wellness & Chronic Disease',
    tier: 'Tier 1',
    time: '8:00AM - 1:00PM',
    image: IMAGE_COMPONENTS.drAnis,
    consultationDays: 'Sunday - Friday',
    consultationTime: '8:00 AM - 1:00 PM',
    about: 'As a former Head of House Officer in General Internal Medicine, he has demonstrated exceptional leadership and decision-making skills. Dr. Anis has also played a key role in COVID-19 management and completed a nephrology attachment at Hospital Serdang. His approach to healthcare emphasizes critical thinking, patient care, and community health improvement.',
    services: ['Bridge', 'Dental Cleaning', 'Pediatric Dentist Consultation', 'Dental Consultation', 'Root Canal'],
    route: '/patient/doctors_info/doctor_details',
  },
  {
    id: '2',
    name: 'Dr. Liyana Binti Ramli',
    specialty: 'General Practice',
    fullSpecialty: "General Practice, Adults & Children, Women's Health",
    tier: 'Tier 1',
    time: '8:00AM - 1:00PM',
    image: IMAGE_COMPONENTS.drLiyanaBintiRamli,
    consultationDays: 'Sunday - Friday',
    consultationTime: '8:00 AM - 1:00 PM',
    about: "Dr. Liyana is a dedicated general practitioner with a special interest in women's health and pediatric care. She has over 8 years of experience in primary healthcare and is known for her compassionate approach to patient management.",
    services: ["General Consultation", "Women's Health Screening", 'Antenatal Care', 'Pediatric Consultation'],
    route: '/patient/doctors_info/doctor_details',
  },
  {
    id: '3',
    name: 'Dr. Muhammad Faiz',
    specialty: 'General Practice',
    fullSpecialty: 'General Practice, Emergency & Minor Surgery, Pediatric Interest',
    tier: 'Tier 2',
    time: '8:00AM - 1:00PM',
    image: IMAGE_COMPONENTS.drMuhammadFaiz,
    consultationDays: 'Monday - Saturday',
    consultationTime: '8:00 AM - 1:00 PM',
    about: 'Dr. Muhammad Faiz specializes in emergency medicine and minor surgical procedures. With a strong background in pediatric care, he handles both adult and pediatric emergencies with skill and efficiency.',
    services: ['Emergency Consultation', 'Minor Surgery', 'Wound Dressing', 'Pediatric Care', 'General Consultation'],
    route: '/patient/doctors_info/doctor_details',
  },
  {
    id: '4',
    name: 'Dr.Noormimi Khatijah',
    specialty: 'Pediatrics',
    fullSpecialty: 'Pediatrics, Baby & Immunization (KNC Junior)',
    tier: 'Tier 2',
    time: '8:00AM - 1:00PM',
    image: IMAGE_COMPONENTS.drNoormimiKhatijah,
    consultationDays: 'Sunday - Thursday',
    consultationTime: '8:00 AM - 1:00 PM',
    about: 'Dr. Noormimi is a specialist in pediatric medicine with a focus on baby care and immunization programs under KNC Junior. She is passionate about child health and development.',
    services: ['Pediatric Consultation', 'Baby Immunization', 'Child Development Assessment', 'Nutritional Guidance'],
    route: '/patient/doctors_info/doctor_details',
  },
  {
    id: '5',
    name: 'Dr. Noor Liyana Binti',
    specialty: 'Antenatal Care',
    fullSpecialty: 'General Practice, O&G, Antenatal & Ultrasound',
    tier: 'Tier 2',
    time: '8:00AM - 1:00PM',
    image: IMAGE_COMPONENTS.drNoorLiyana,
    consultationDays: 'Sunday - Friday',
    consultationTime: '8:00 AM - 5:00 PM',
    about: 'Dr. Noor Liyana is an experienced OB-GYN specialist providing comprehensive antenatal care and ultrasound services. She is committed to ensuring the health and well-being of both mother and child throughout pregnancy.',
    services: ['Antenatal Checkup', 'Ultrasound Scan', 'O&G Consultation', 'Family Planning', 'Postnatal Care'],
    route: '/patient/doctors_info/doctor_details',
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', title: 'Book Appointment' },
  { id: '2', title: 'Queue Status' },
  { id: '3', title: 'Vaccine Stock' },
  { id: '4', title: 'Medical Record' },
];

export interface Service {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  price: string;
  doctorIds: string[];
}

export const SERVICE_NAMES: Service[] = [
  {
    id: '1',
    name: '23-Jam GP',
    emoji: '🌙',
    subtitle: 'Walk-in 23 jam',
    description: 'Perkhidmatan doktor umum yang beroperasi selama 23 jam sehari. Sesuai untuk rawatan segera, demam, sakit, dan keadaan yang memerlukan perhatian segera tanpa perlu buat temujanji terlebih dahulu.',
    price: 'RM 30 – RM 80',
    doctorIds: ['1', '2', '3'],
  },
  {
    id: '2',
    name: 'Kanak-Kanak & Vaksin',
    emoji: '👶',
    subtitle: 'KNC Junior',
    description: 'Perkhidmatan kesihatan kanak-kanak merangkumi pemeriksaan tumbuh kembang, imunisasi mandatori dan pilihan, serta konsultasi pediatrik oleh doktor berpengalaman.',
    price: 'RM 50 – RM 200',
    doctorIds: ['4'],
  },
  {
    id: '3',
    name: 'Health Screening',
    emoji: '🩺',
    subtitle: 'Pakej pemeriksaan',
    description: 'Pakej saringan kesihatan menyeluruh termasuk ujian darah, tekanan darah, kolesterol, gula darah, fungsi buah pinggang dan hati. Sesuai untuk pemeriksaan tahunan.',
    price: 'RM 150 – RM 500',
    doctorIds: ['1', '2'],
  },
  {
    id: '4',
    name: 'Antenatal & O&G',
    emoji: '🤰',
    subtitle: 'Penjagaan ibu mengandung',
    description: 'Penjagaan menyeluruh untuk ibu mengandung termasuk pemeriksaan antenatal rutin, ultrasound 4D, konsultasi O&G, dan penjagaan selepas bersalin.',
    price: 'RM 80 – RM 350',
    doctorIds: ['5'],
  },
  {
    id: '5',
    name: 'Minor Surgery',
    emoji: '🔬',
    subtitle: 'Rawatan luka, tumor kecil, dll',
    description: 'Prosedur pembedahan kecil termasuk rawatan luka, penjahitan, pemotongan tumor kecil, dan prosedur dermatologi ringkas di bawah anestesia tempatan.',
    price: 'RM 100 – RM 600',
    doctorIds: ['3'],
  },
  {
    id: '6',
    name: 'Tips Kesihatan',
    emoji: '📰',
    subtitle: 'Artikel & info terkini',
    description: 'Akses kepada artikel kesihatan terkini, panduan gaya hidup sihat, tips pemakanan, dan maklumat perubatan yang dikurasi oleh pasukan doktor KNC.',
    price: 'Percuma',
    doctorIds: ['1', '2', '3', '4', '5'],
  },
];


export const VACCINES: Vaccine[] = [
  { id: '1', name: 'BCG (Bacillus Calmette–Guérin)', price: 'RM 1200', stock: 56, expireDate: 'October 30, 2027' },
  { id: '2', name: 'Japanese Encephalitis (JE) Vaccine', price: 'RM 1200', stock: 56, expireDate: 'October 30, 2027' },
  { id: '3', name: '6-in-1 Vaccine (Hexaxim)', price: 'RM 1200', stock: 0, expireDate: 'October 30, 2027' },
];

export const PERSONAL_RECORDS = [
  {
    id: '1',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'My Self',
    dateTime: '09:30 | May 05, 2026 (Tuesday)',
  },
  {
    id: '2',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'My Self',
    dateTime: '11:00 | May 12, 2026 (Tuesday)',
  },
  {
    id: '3',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'My Self',
    dateTime: '18:00 | May 24, 2026 (Sunday)',
  },
];
export const FAMILY_RECORDS = [
  {
    id: '1',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'Hakim',
    dateTime: '08:00 | May 03, 2026 (Sunday)',
  },
  {
    id: '2',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'Hakim',
    dateTime: '10:15 | May 15, 2026 (Friday)',
  },
  {
    id: '3',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'Hakim',
    dateTime: '16:45 | May 28, 2026 (Thursday)',
  },
];

export const QUEUE_DATA: QueueItem[] = [
  { id: '1', doctorName: 'Dr. Anis Effendi', waiting: 1, served: 4, estimatedWait: '30 minutes' },
];

export const APPOINTMENTS_DATA: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & Children',
    tier: 'Tier 1',
    patientName: 'Hakim',
    patientType: '(Own Self)',
    date: 'March 13, 2026 (Sunday)',
    time: '08:00 AM',
    status: 'Accepted',
    reason: 'Checkup',
    doctorId: '1',
    details: "Regular health checkup for blood pressure and general wellness monitoring. The patient has requested a full body screening and consultation regarding chronic fatigue.",
    image: IMAGE_COMPONENTS.drAnis,
  },
  {
    id: '2',
    doctorName: 'Dr.Noormimi Khatijah',
    specialty: 'PEDIATRICS Baby & Immunization (KNC Junior)',
    tier: 'Tier 2',
    patientName: 'Zayan',
    patientType: '(Family Member)',
    date: 'April 05, 2026 (Monday)',
    time: '10:30 AM',
    status: 'Pending',
    reason: 'Vaccination',
    doctorId: '4',
    details: "Scheduled 6-in-1 vaccine (Hexaxim) for the baby. This is the second dose of the mandatory immunization program to ensure full protection.",
    image: IMAGE_COMPONENTS.drNoormimiKhatijah,
  },
  {
    id: '3',
    doctorName: 'Dr. Liyana Binti Ramli',
    specialty: "GENERAL PRACTICE Adults & Children, Women's Health",
    tier: 'Tier 1',
    patientName: 'Sara Khan',
    patientType: '(Family Member)',
    date: 'February 20, 2026 (Friday)',
    time: '02:00 PM',
    status: 'Completed',
    reason: 'Consultation',
    doctorId: '2',
    details: "Post-consultation summary: Discussion regarding persistent migraine and nutritional guidance. Patient was advised to maintain a strict sleep schedule.",
    image: IMAGE_COMPONENTS.drLiyanaBintiRamli,
  },
  {
    id: '4',
    doctorName: 'Dr. Muhammad Faiz',
    specialty: 'GENERAL PRACTICE Emergency & Minor Surgery',
    tier: 'Tier 2',
    patientName: 'Hakim',
    patientType: '(Own Self)',
    date: 'January 15, 2026 (Thursday)',
    time: '11:00 AM',
    status: 'Canceled',
    reason: 'Minor Surgery',
    details: "Request for wound dressing and follow-up after a minor surgical procedure. The session was canceled due to patient unavailability.",
    image: IMAGE_COMPONENTS.drMuhammadFaiz,
    doctorId: '3',
    cancelReason: 'False Information',
    cancelDate: '10 March, 2026 09:00 AM',
  },
  {
    id: '5',
    doctorName: 'Dr. Noor Liyana Binti',
    specialty: 'ANTENATAL CARE O&G, Antenatal & Ultrasound',
    tier: 'Tier 2',
    patientName: 'Mrs. Hakim',
    patientType: '(Family Member)',
    date: 'May 10, 2026 (Sunday)',
    time: '09:15 AM',
    status: 'Accepted',
    reason: 'Ultrasound Scan',
    doctorId: '5',
    details: "Routine antenatal checkup including a 4D ultrasound scan for pregnancy monitoring. Both mother and baby are reported to be in stable condition.",
    image: IMAGE_COMPONENTS.drNoorLiyana,
  },
];