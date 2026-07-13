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

export const SERVICE_MASTER: ServiceMaster[] = []
