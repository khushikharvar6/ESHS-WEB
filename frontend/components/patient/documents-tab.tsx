'use client'

import { useMemo, useRef, useState } from 'react'
import {
  FileText,
  UploadCloud,
  Eye,
  Download,
  Trash2,
  BadgeCheck,
  FileStack,
} from 'lucide-react'
import { toast } from 'sonner'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Protect } from '@/components/protect'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { AuditLine } from '@/components/patient/audit-line'
import { DOCUMENT_TYPES } from '@/lib/constants'
import { useHealthcare, expectedDocsForService } from '@/lib/store'
import { uploadDocumentFile, deleteDocumentFile, formatFileSize, getSignedDownloadUrl } from '@/lib/document-upload'

export function DocumentsTab({
  uhid,
  service,
}: {
  uhid: string
  service: string
}) {
  const { patients, documentsFor, addDocument, verifyDocument, deleteDocument } =
    useHealthcare()
  const [docType, setDocType] = useState<string>('ID Proof')
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const patient = useMemo(() => patients.find((p) => p.uhid === uhid), [patients, uhid])
  const patientName = patient?.name || 'Unknown Patient'

  const docs = documentsFor(uhid)

  const clinicalDocTypes = useMemo(() => new Set([
    'Prescription',
    'Consultation Notes',
    'Pathology Report',
    'Radiology Report',
    'Billing Invoice',
    'Vaccination Certificate',
    'Dental Report',
    'Ophthalmology Report',
    'Home Healthcare Visit Notes',
    'Day Care Summary'
  ]), [])

  const clinicalDocs = useMemo(() => docs.filter((d) => clinicalDocTypes.has(d.type)), [docs, clinicalDocTypes])
  const generalDocs = useMemo(() => docs.filter((d) => !clinicalDocTypes.has(d.type)), [docs, clinicalDocTypes])

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setIsUploading(true)
    
    try {
      for (const f of Array.from(files)) {
        try {
          const { publicUrl, storagePath, fileSize } = await uploadDocumentFile(f, uhid)
          
          addDocument({ 
            uhid, 
            patientName,
            name: f.name, 
            type: docType, 
            fileUrl: publicUrl,
            storagePath,
            fileSize
          })
          toast.success(`Uploaded ${f.name} as ${docType}`)
        } catch (err: any) {
          toast.error(`Failed to upload ${f.name}: ${err.message}`)
        }
      }
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(d: any) {
    try {
      if (d.storagePath) {
        await deleteDocumentFile(d.storagePath)
      }
      deleteDocument(d.id)
      toast.success(`${d.name} deleted`)
    } catch (err: any) {
      toast.error(`Failed to delete ${d.name}: ${err.message}`)
    }
  }

  async function handleView(d: any) {
    if (d.storagePath) {
      try {
        const url = await getSignedDownloadUrl(d.storagePath, false)
        window.open(url, '_blank')
      } catch (err: any) {
        toast.error(`Failed to get secure link: ${err.message}`)
      }
    } else if (d.fileUrl) {
      window.open(d.fileUrl, '_blank')
    } else {
      toast.error('File preview not available')
    }
  }

  async function handleDownload(d: any) {
    if (d.storagePath) {
      try {
        const url = await getSignedDownloadUrl(d.storagePath, true)
        const a = document.createElement('a')
        a.href = url
        a.download = d.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success(`Downloaded ${d.name}`)
      } catch (err: any) {
        toast.error(`Failed to get secure link: ${err.message}`)
      }
    } else if (d.fileUrl) {
      const a = document.createElement('a'); a.href = d.fileUrl; a.download = d.name; document.body.appendChild(a); a.click(); document.body.removeChild(a); toast.success(`Downloaded ${d.name}`)
    } else {
      toast.error('File not available for download')
    }
  }

  const checklist = useMemo(() => {
    const expected = expectedDocsForService(service)
    return expected.map((type) => {
      const matches = docs.filter((d) => d.type === type)
      const uploaded = matches.length > 0
      const verified = matches.some((d) => d.verified)
      let status: string
      if (verified) status = 'Verified'
      else if (uploaded) status = 'Pending Verification'
      else status = 'Missing'
      return { type, required: true, uploaded, verified, status }
    })
  }, [docs, service])

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
          <div className="flex flex-col gap-1">
            <CardTitle>Patient Documents &amp; Reports</CardTitle>
            <CardDescription>
              ID proofs, lab reports, prescriptions and clinical documents.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {docs.length} {docs.length === 1 ? 'file' : 'files'}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {docs.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
              <FileStack className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No documents uploaded yet for this patient.
              </p>
              <p className="max-w-md text-sm text-muted-foreground text-pretty">
                Use the upload area below to add ID proofs, lab reports,
                prescriptions, or any clinical documents.
              </p>
            </div>
          )}

          {/* Upload controls */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  Document Type
                </span>
                <Select value={docType} onValueChange={(value) => setDocType(value ?? '')}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Protect module="PATIENT_PROFILE" action="UPDATE">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadCloud className="size-7 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {isUploading ? 'Uploading...' : 'Click to upload report, prescription, or document'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {`PDF, DOC, JPG, PNG • Max 10MB • Category: ${docType}`}
                </span>
              </button>
            </Protect>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>

          {/* Grouped Uploaded files list */}
          {docs.length > 0 && (
            <div className="space-y-6">
              {/* Section 1: Visit-Specific Clinical Records */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Visit-Specific Medical Records &amp; Reports</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {clinicalDocs.length} clinical document(s)
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prescriptions, lab reports, diagnostics, and visit summaries that change on every visit.
                </p>
                {clinicalDocs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-slate-50 border rounded-lg p-3">No clinical reports uploaded yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead>File</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clinicalDocs.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                                  <FileText className="size-4 text-muted-foreground" />
                                  {d.name}
                                </span>
                                <AuditLine
                                  updatedBy={d.updatedBy}
                                  updatedAt={d.updatedAt}
                                  className="pl-6"
                                />
                              </div>
                            </TableCell>
                            <TableCell>{d.type}</TableCell>
                            <TableCell>{d.uploadedBy}</TableCell>
                            <TableCell>{d.uploadedOn}</TableCell>
                            <TableCell>
                              <StatusBadge
                                status={d.verified ? 'Verified' : 'Pending Verification'}
                                tone={d.verified ? 'success' : 'warning'}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon-sm" aria-label="View" onClick={() => handleView(d)}>
                                  <Eye />
                                </Button>
                                <Button variant="ghost" size="icon-sm" aria-label="Download" onClick={() => handleDownload(d)}>
                                  <Download />
                                </Button>
                                {!d.verified && (
                                  <Protect module="PATIENT_PROFILE" action="UPDATE">
                                    <Button variant="ghost" size="icon-sm" aria-label="Mark verified" onClick={() => { verifyDocument(d.id); toast.success(`${d.name} verified`) }}>
                                      <BadgeCheck />
                                    </Button>
                                  </Protect>
                                )}
                                <Protect module="PATIENT_PROFILE" action="DELETE">
                                  <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(d)}>
                                    <Trash2 />
                                  </Button>
                                </Protect>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Section 2: Permanent / Identification Documents */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Identification &amp; General Documents</h3>
                  <Badge variant="outline" className="bg-slate-50 text-slate-750 border-slate-200">
                    {generalDocs.length} general document(s)
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permanent records such as ID proofs, consent forms, and other static documents.
                </p>
                {generalDocs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-slate-50 border rounded-lg p-3">No permanent documents uploaded yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead>File</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generalDocs.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                                  <FileText className="size-4 text-muted-foreground" />
                                  {d.name}
                                </span>
                                <AuditLine
                                  updatedBy={d.updatedBy}
                                  updatedAt={d.updatedAt}
                                  className="pl-6"
                                />
                              </div>
                            </TableCell>
                            <TableCell>{d.type}</TableCell>
                            <TableCell>{d.uploadedBy}</TableCell>
                            <TableCell>{d.uploadedOn}</TableCell>
                            <TableCell>
                              <StatusBadge
                                status={d.verified ? 'Verified' : 'Pending Verification'}
                                tone={d.verified ? 'success' : 'warning'}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon-sm" aria-label="View" onClick={() => handleView(d)}>
                                  <Eye />
                                </Button>
                                <Button variant="ghost" size="icon-sm" aria-label="Download" onClick={() => handleDownload(d)}>
                                  <Download />
                                </Button>
                                {!d.verified && (
                                  <Button variant="ghost" size="icon-sm" aria-label="Mark verified" onClick={() => { verifyDocument(d.id); toast.success(`${d.name} verified`) }}>
                                    <BadgeCheck />
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(d)}>
                                  <Trash2 />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Required checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents Checklist</CardTitle>
          <CardDescription>
            {`Expected documents for ${service}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Document</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklist.map((c) => (
                  <TableRow key={c.type}>
                    <TableCell className="font-medium text-foreground">{c.type}</TableCell>
                    <TableCell>{c.required ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{c.uploaded ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{c.verified ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={c.status}
                        tone={
                          c.status === 'Verified'
                            ? 'success'
                            : c.status === 'Missing'
                              ? 'error'
                              : 'warning'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
