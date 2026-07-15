export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    include: { ratings: true }
  })
  return NextResponse.json(feedbacks)
}

export async function POST(request: Request) {
  const payload = await request.json()
  
  const currentYear = new Date().getFullYear()
  const feedbackId = `FB${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`
  const uhid = payload.uhid || ''
  
  const ratingsToCreate = (payload.ratings || []).map((rating: any, index: number) => ({
    ...rating,
    id: `FBR${currentYear}-${Math.floor(10000 + Math.random() * 90000)}-${index + 1}`,
    uhid: uhid
  }))

  const feedback = await prisma.feedback.create({
    data: {
      id: feedbackId,
      uhid: uhid,
      patientName: payload.patientName || '',
      service: payload.service || '',
      heardAbout: payload.heardAbout || '',
      referenceBy: payload.referenceBy || '',
      serviceAvailed: payload.serviceAvailed || '',
      overallRating: payload.overallRating || 0,
      staffAppreciated: payload.staffAppreciated || '',
      positiveComments: payload.positiveComments || '',
      negativeComments: payload.negativeComments || '',
      agreeToUsage: payload.agreeToUsage !== false,
      ratings: {
        create: ratingsToCreate
      }
    }
  })

  return NextResponse.json(feedback, { status: 201 })
}

