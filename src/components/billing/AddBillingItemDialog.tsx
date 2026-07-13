"use client"

import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SERVICE_MASTER } from '@/src/config/serviceMaster'
import { ESHEALTH_TEST_MASTER } from '@/src/config/testMaster'
import { PACKAGE_MASTER } from '@/src/config/packageMaster'
import type { BillingInvoiceItem } from '@/src/types/billing.types'

export function AddBillingItemDialog({
  open,
  onOpenChange,
  onAddItem,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: BillingInvoiceItem) => void
}) {
  const [tab, setTab] = useState<'services' | 'tests' | 'packages'>('services')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [subcategory, setSubcategory] = useState('ALL')

  const services = useMemo(() => SERVICE_MASTER.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (category === 'ALL' || item.category === category)), [query, category])
  const tests = useMemo(() => {
    const filtered = ESHEALTH_TEST_MASTER.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (category === 'ALL' || item.category === category) && (subcategory === 'ALL' || item.serviceType === subcategory))
    return filtered
  }, [query, category, subcategory])
  const packages = useMemo(() => PACKAGE_MASTER.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (category === 'ALL' || item.category === category)), [query, category])

  const serviceCategories = ['ALL', ...Array.from(new Set(SERVICE_MASTER.map((item) => item.category)))]
  const testCategories = ['ALL', ...Array.from(new Set(ESHEALTH_TEST_MASTER.map((item) => item.category)))]
  const testSubcategories = ['ALL', ...Array.from(new Set(ESHEALTH_TEST_MASTER.map((item) => item.serviceType).filter(Boolean)))]
  const packageCategories = ['ALL', ...Array.from(new Set(PACKAGE_MASTER.map((item) => item.category)))]

  const addService = (item: typeof SERVICE_MASTER[number]) => {
    const invoiceItem: BillingInvoiceItem = {
      id: `${item.id}-${Date.now()}`,
      itemType: 'SERVICE',
      itemName: item.name,
      category: item.category,
      department: item.department,
      quantity: 1,
      unitPrice: item.price,
      taxRate: item.taxRate,
      amount: item.price,
    }
    onAddItem(invoiceItem)
    onOpenChange(false)
  }

  const addTest = (item: typeof ESHEALTH_TEST_MASTER[number]) => {
    const invoiceItem: BillingInvoiceItem = {
      id: `${item.id}-${Date.now()}`,
      itemType: 'TEST',
      itemName: item.name,
      category: item.category,
      department: item.department,
      quantity: 1,
      unitPrice: item.price,
      taxRate: item.taxRate,
      amount: item.price,
    }
    onAddItem(invoiceItem)
    onOpenChange(false)
  }

  const addPackage = (item: typeof PACKAGE_MASTER[number]) => {
    const invoiceItem: BillingInvoiceItem = {
      id: `${item.id}-${Date.now()}`,
      itemType: 'PACKAGE',
      itemName: item.name,
      category: item.category,
      department: 'Package',
      quantity: 1,
      unitPrice: item.price,
      taxRate: item.taxRate,
      amount: item.price,
    }
    onAddItem(invoiceItem)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Billing Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Search items..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Tabs value={tab} onValueChange={(value) => setTab(value as 'services' | 'tests' | 'packages')}>
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="tests">Tests / Investigations</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-4">
              <div className="mb-3">
                <Select value={category} onValueChange={(val) => setCategory(val || 'ALL')}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {services.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.category} • {item.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₹{item.price}</span>
                      <Button size="sm" onClick={() => addService(item)}>Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tests" className="mt-4">
              <div className="mb-3 flex flex-wrap gap-3">
                <Select value={category} onValueChange={(val) => setCategory(val || 'ALL')}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {testCategories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={subcategory} onValueChange={(val) => setSubcategory(val || 'ALL')}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {testSubcategories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="max-h-[320px] space-y-2 overflow-auto">
                {tests.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.category} • {item.department} • {item.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₹{item.price}</span>
                      <Button size="sm" onClick={() => addTest(item)}>Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="packages" className="mt-4">
              <div className="mb-3">
                <Select value={category} onValueChange={(val) => setCategory(val || 'ALL')}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageCategories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {packages.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.includedItems.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₹{item.price}</span>
                      <Button size="sm" onClick={() => addPackage(item)}>Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
