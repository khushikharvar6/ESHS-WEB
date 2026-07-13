export interface ServiceMaster {
  id: string
  itemType: 'SERVICE'
  name: string
  category: string
  department: string
  price: number
  taxRate: number
  sourceUrl: string
  isActive: boolean
}

export const SERVICE_MASTER: ServiceMaster[] = [
  { id: 'doctor-consultation', itemType: 'SERVICE', name: 'Doctor Consultation', category: 'Consultation', department: 'OPD', price: 500, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'cardiology', itemType: 'SERVICE', name: 'Cardiology', category: 'Consultation', department: 'Cardiology', price: 1000, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'pulmonology', itemType: 'SERVICE', name: 'Pulmonology', category: 'Consultation', department: 'Pulmonology', price: 900, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'radiology', itemType: 'SERVICE', name: 'Radiology', category: 'Investigation', department: 'Radiology', price: 1500, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'pathology', itemType: 'SERVICE', name: 'Pathology', category: 'Investigation', department: 'Pathology', price: 700, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'sample-collection', itemType: 'SERVICE', name: 'Sample Collection', category: 'Service', department: 'Pathology', price: 300, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'dental', itemType: 'SERVICE', name: 'Dental', category: 'Consultation', department: 'Dental', price: 800, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'ophthalmology', itemType: 'SERVICE', name: 'Ophthalmology', category: 'Consultation', department: 'Ophthalmology', price: 800, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'home-healthcare', itemType: 'SERVICE', name: 'Home Healthcare', category: 'Service', department: 'Home Healthcare', price: 1200, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'day-care', itemType: 'SERVICE', name: 'Day Care', category: 'Service', department: 'Day Care', price: 2500, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'vaccination', itemType: 'SERVICE', name: 'Vaccination', category: 'Service', department: 'Vaccination', price: 600, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
  { id: 'physiotherapy', itemType: 'SERVICE', name: 'Physiotherapy', category: 'Service', department: 'Physiotherapy', price: 700, taxRate: 5, sourceUrl: 'https://eshealth.in/', isActive: true },
]
