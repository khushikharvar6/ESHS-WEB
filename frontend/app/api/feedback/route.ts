export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        homeHealthcareRatings: true,
        doctorConsultationRatings: true,
        pathologyRatings: true,
        radiologyRatings: true,
        cardiologyRatings: true,
        pulmonologyRatings: true,
        ophthalmologyRatings: true,
        physiotherapyRatings: true,
        pharmacyRatings: true,
        packageRatings: true,
        dayCareRatings: true,
        ipdRatings: true,
        generalRatings: true
      }
    })
    
    // Ensure objects are plain JS objects without Prisma symbols before spreading
    const plainFeedbacks = JSON.parse(JSON.stringify(feedbacks))
    
    // Combine all the separate tables back into a single "ratings" array for the frontend
    const formattedFeedbacks = plainFeedbacks.map((f: any) => {
      const combinedRatings = [
        ...(f.homeHealthcareRatings || []).map((r: any) => ({ ...r, category: 'Home Healthcare Services' })),
        ...(f.doctorConsultationRatings || []).map((r: any) => ({ ...r, category: 'Doctor Consultation' })),
        ...(f.pathologyRatings || []).map((r: any) => ({ ...r, category: 'Pathology' })),
        ...(f.radiologyRatings || []).map((r: any) => ({ ...r, category: 'Radiology' })),
        ...(f.cardiologyRatings || []).map((r: any) => ({ ...r, category: 'Cardiology' })),
        ...(f.pulmonologyRatings || []).map((r: any) => ({ ...r, category: 'Pulmonology' })),
        ...(f.ophthalmologyRatings || []).map((r: any) => ({ ...r, category: 'Ophthalmology Services' })),
        ...(f.physiotherapyRatings || []).map((r: any) => ({ ...r, category: 'Physiotherapy Services' })),
        ...(f.pharmacyRatings || []).map((r: any) => ({ ...r, category: 'Pharmacy Services' })),
        ...(f.packageRatings || []).map((r: any) => ({ ...r, category: 'Health Check-up Package' })),
        ...(f.dayCareRatings || []).map((r: any) => ({ ...r, category: 'Day Care Services' })),
        ...(f.ipdRatings || []).map((r: any) => ({ ...r, category: 'IPD (Inpatient)' })),
        ...(f.generalRatings || []).map((r: any) => ({ ...r, category: 'General Experience' }))
      ];

      // Remove the separate arrays so the payload isn't huge
      const { 
        homeHealthcareRatings, doctorConsultationRatings, pathologyRatings, radiologyRatings, 
        cardiologyRatings, pulmonologyRatings, ophthalmologyRatings, physiotherapyRatings, 
        pharmacyRatings, packageRatings, dayCareRatings, ipdRatings, generalRatings, 
        ...rest 
      } = f;

      return {
        ...rest,
        ratings: combinedRatings
      }
    })

    return NextResponse.json(formattedFeedbacks, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Time': Date.now().toString()
      }
    })
  } catch (error) {
    console.error('Error fetching feedbacks:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  const payload = await request.json()
  
  const currentYear = new Date().getFullYear()
  const feedbackId = `FB${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`
  const uhid = payload.uhid || ''
  
  const generateRating = (rating: any, index: number) => ({
    id: `FBR${currentYear}-${Math.floor(10000 + Math.random() * 90000)}-${index + 1}`,
    uhid: uhid,
    question: rating.question,
    rating: rating.rating
  });

  const getRatings = (category: string) => {
    return (payload.ratings || [])
      .filter((r: any) => r.category === category)
      .map(generateRating)
  }

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
      homeHealthcareRatings: { create: getRatings('Home Healthcare') },
      doctorConsultationRatings: { create: getRatings('Doctor Consultation') },
      pathologyRatings: { create: getRatings('Pathology') },
      radiologyRatings: { create: getRatings('Radiology') },
      cardiologyRatings: { create: getRatings('Cardiology') },
      pulmonologyRatings: { create: getRatings('Pulmonology') },
      ophthalmologyRatings: { create: getRatings('Ophthalmology Services') },
      physiotherapyRatings: { create: getRatings('Physiotherapy Services') },
      pharmacyRatings: { create: getRatings('Pharmacy Services') },
      packageRatings: { create: getRatings('Health Check-up Package') },
      dayCareRatings: { create: getRatings('Day Care Services') },
      ipdRatings: { create: getRatings('IPD') },
      generalRatings: { create: getRatings('General Experience') }
    }
  })

  return NextResponse.json(feedback, { status: 201 })
}
