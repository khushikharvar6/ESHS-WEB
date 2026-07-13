export interface PackageMaster {
  id: string
  itemType: 'PACKAGE'
  name: string
  category: string
  includedItems: string[]
  price: number
  taxRate: number
  sourceUrl: string
  isActive: boolean
}

export const PACKAGE_MASTER: PackageMaster[] = [
  {
    id: 'diabetic-profile',
    itemType: 'PACKAGE',
    name: 'Diabetic Profile',
    category: 'Wellness',
    includedItems: ['Blood Glucose', 'HbA1c', 'Lipid Profile'],
    price: 499,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'basic-profile',
    itemType: 'PACKAGE',
    name: 'Basic Profile',
    category: 'Wellness',
    includedItems: ['CBC', 'ESR', 'Blood Group'],
    price: 899,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'executive-profile',
    itemType: 'PACKAGE',
    name: 'Executive Profile',
    category: 'Wellness',
    includedItems: ['CBC', 'Lipid Profile', 'Thyroid Profile'],
    price: 1499,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'comprehensive-profile',
    itemType: 'PACKAGE',
    name: 'Comprehensive Profile',
    category: 'Wellness',
    includedItems: ['CBC', 'Lipid Profile', 'HbA1c', 'Liver Function Test'],
    price: 3999,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'basic-package',
    itemType: 'PACKAGE',
    name: 'Basic Package',
    category: 'Packages',
    includedItems: ['Doctor Consultation', 'CBC'],
    price: 1999,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'cardiac-package',
    itemType: 'PACKAGE',
    name: 'Cardiac Package',
    category: 'Packages',
    includedItems: ['ECG', 'Lipid Profile', 'Cardiology Consultant'],
    price: 5999,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'well-womens-package',
    itemType: 'PACKAGE',
    name: 'Well Women’s Package',
    category: 'Packages',
    includedItems: ['Doctor Consultation', 'CBC', 'Thyroid Profile'],
    price: 6999,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'gold-package',
    itemType: 'PACKAGE',
    name: 'Gold Package',
    category: 'Packages',
    includedItems: ['Comprehensive Profile', 'Doctor Consultation'],
    price: 11999,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
  {
    id: 'diamond-package',
    itemType: 'PACKAGE',
    name: 'Diamond Package',
    category: 'Packages',
    includedItems: ['Executive Profile', 'Radiology', 'Cardiology'],
    price: 14999,
    taxRate: 0,
    sourceUrl: 'https://eshealth.in/',
    isActive: true,
  },
]
