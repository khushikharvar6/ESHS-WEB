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
  
  const feedback = await prisma.feedback.create({
    data: {
      uhid: payload.uhid || '',
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
        create: payload.ratings || []
      }
    }
  })

  return NextResponse.json(feedback, { status: 201 })
}
