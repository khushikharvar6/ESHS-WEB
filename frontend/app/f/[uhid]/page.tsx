'use client'

import React, { useState, useEffect } from 'react'
// @ts-ignore: Could not find a declaration file for module 'next/navigation'
import { useParams, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarIcon, CheckSquare, Square } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

const TRANSLATIONS = {
  en: {
    title: 'Patient Experience & Feedback Form',
    patientName: 'Patient Name',
    uhid: 'UHID',
    ageGender: 'Age / Gender',
    date: 'Date',
    howDidYouHear: 'How did you hear about ES healthcare?',
    hearOptions: {
      'Family & Friends': 'Family & Friends',
      'Social Media': 'Social Media',
      'Magazine & Newspaper': 'Magazine & Newspaper',
      'Google Search': 'Google Search',
      'Website': 'Website',
      'Other': 'Other'
    },
    referenceBy: 'Reference By:',
    refOptions: {
      'Doctor': 'Doctor',
      'Camps/community Activity': 'Camps/community Activity',
      'Corporate Tie-up': 'Corporate Tie-up',
      'Insurance/TPA': 'Insurance/TPA',
      'Existing Patient': 'Existing Patient',
      'Other': 'Other'
    },
    typeOfService: 'TYPE OF SERVICE AVAILED',
    serviceTypes: {
      'Home Care Services': 'Home Care Services',
      'OPD': 'OPD',
      'IPD': 'IPD'
    },
    selectOpdDept: 'Please select the OPD department you visited:',
    generalExperience: 'General Experience',
    particulars: 'Particulars',
    ratingLabels: ['Poor', 'Average', 'Good', 'Very Good', 'Excellent'],
    generalQuestions: [
      'Registration and enquiry services',
      'Handling of patient queries and guidance provided',
      'Waiting time management',
      'Behavior of the staff',
      'Billing and payment process',
      'Cleanliness and hygiene of the facility'
    ],
    homeHealthcare: 'Home Healthcare Experience',
    servicesAvailed: 'Services Availed',
    homeServicesMap: {
      'Home Sample Collection': 'Home Sample Collection',
      'Home Doctor Visit': 'Home Doctor Visit',
      'Home Nursing Care': 'Home Nursing Care',
      'Home Physiotherapy': 'Home Physiotherapy',
      'Home Vaccination': 'Home Vaccination',
      'ECG at Home': 'ECG at Home',
      'Blood Glucose Monitoring': 'Blood Glucose Monitoring'
    },
    homeQuestions: [
      'Ease of booking the service',
      'Timeliness of home visit',
      'Behaviour, professionalism and explanation given',
      'Infection control and quality standards',
      'Overall quality of home healthcare services'
    ],
    opdFeedback: 'OPD Feedback',
    depts: {
      doctor: 'Doctor Consultation',
      pathology: 'Pathology',
      dental: 'Dental',
      radiology: 'Radiology',
      cardiology: 'Cardiology',
      pulmonology: 'Pulmonology',
      ophthalmology: 'Ophthalmology Services',
      physiotherapy: 'Physiotherapy Services',
      pharmacy: 'Pharmacy Services',
      package: 'Health Check-up Package',
      dayCare: 'Day Care Services'
    },
    doctorQuestions: [
      'Explanation regarding illness and treatment',
      'Time spent during consultation',
      'Clarity of advice and follow-up instructions'
    ],
    pathologyQuestions: [
      'Sample collection process',
      'Comfort during sample collection',
      'Timely availability of reports'
    ],
    dentalQuestions: [
      'Explanation regarding dental problem and treatment',
      'Comfort during the dental treatment',
      'Pain management during the procedure',
      'Cleanliness and hygiene during the dental treatment'
    ],
    radiologyQuestions: [
      'Appointment scheduling process',
      'Explanation before the procedure',
      'Comfort during the procedure'
    ],
    cardiologyQuestions: [
      'Explanation regarding cardiac evaluation',
      'Quality of diagnostic services provided',
      'Confidence in care received'
    ],
    pulmonologyQuestions: [
      'Explanation regarding respiratory condition',
      'Quality of diagnostic services provided',
      'Satisfaction with care received'
    ],
    ophthalmologyQuestions: [
      'Eye examination process',
      'Explanation regarding diagnosis and treatment',
      'Quality of eye care services'
    ],
    physiotherapyQuestions: [
      'Explanation of exercises and treatment plan',
      'Effectiveness of therapy sessions',
      'Improvement experienced from treatment'
    ],
    pharmacyQuestions: [
      'Availability of prescribed medicines',
      'Guidance regarding medication usage'
    ],
    packageQuestions: [
      'Coordination between departments',
      'Smoothness of overall process',
      'Completion of package within expected time'
    ],
    dayCareQuestions: [
      'Admission process',
      'Comfort during stay',
      'Monitoring and care provided',
      'Discharge process'
    ],
    ipdFeedback: 'IPD Feedback',
    ipdQuestions: [
      'Admission process',
      "Doctor's care and communication",
      'Nursing care and responsiveness',
      'Investigation and diagnostic services',
      'Room comfort and cleanliness',
      'Food quality and service',
      'Discharge process and instructions'
    ],
    overallSatisfaction: 'OVERALL SATISFACTION',
    staffAppreciated: 'Staff member you would like to appreciate (Optional):',
    positiveComments: 'What did we do well? (Optional)',
    negativeComments: 'Suggestions / Remarks for improvement (Optional):',
    agreeToUsage: 'I AGREE TO THE USAGE OF ABOVE FEEDBACK BY THE CENTRE',
    submit: 'Submit Feedback'
  },
  hi: {
    title: 'रोगी अनुभव और प्रतिक्रिया प्रपत्र',
    patientName: 'रोगी का नाम',
    uhid: 'UHID',
    ageGender: 'आयु / लिंग',
    date: 'दिनांक',
    howDidYouHear: 'आपने ES स्वास्थ्य सेवा के बारे में कैसे सुना?',
    hearOptions: {
      'Family & Friends': 'परिवार और मित्र',
      'Social Media': 'सोशल मीडिया',
      'Magazine & Newspaper': 'पत्रिका और समाचार पत्र',
      'Google Search': 'गूगल खोज',
      'Website': 'वेबसाइट',
      'Other': 'अन्य'
    },
    referenceBy: 'संदर्भ द्वारा:',
    refOptions: {
      'Doctor': 'डॉक्टर',
      'Camps/community Activity': 'शिविर/सामुदायिक गतिविधि',
      'Corporate Tie-up': 'कॉर्पोरेट अनुबंध',
      'Insurance/TPA': 'बीमा/TPA',
      'Existing Patient': 'मौजूदा रोगी',
      'Other': 'अन्य'
    },
    typeOfService: 'प्राप्त सेवा का प्रकार',
    serviceTypes: {
      'Home Care Services': 'होम केयर सेवाएं',
      'OPD': 'OPD',
      'IPD': 'IPD'
    },
    selectOpdDept: 'कृपया वह OPD विभाग चुनें जहाँ आपने दौरा किया:',
    generalExperience: 'सामान्य अनुभव',
    particulars: 'विवरण',
    ratingLabels: ['खराब', 'औसत', 'अच्छा', 'बहुत अच्छा', 'उत्कृष्ट'],
    generalQuestions: [
      'पंजीकरण और पूछताछ सेवाएं',
      'रोगी के प्रश्नों का उत्तर और मार्गदर्शन',
      'प्रतीक्षा समय प्रबंधन',
      'कर्मचारियों का व्यवहार',
      'बिलिंग और भुगतान प्रक्रिया',
      'सुविधा की स्वच्छता और सफाई'
    ],
    homeHealthcare: 'घरेलू स्वास्थ्य देखभाल अनुभव',
    servicesAvailed: 'प्राप्त सेवाएं',
    homeServicesMap: {
      'Home Sample Collection': 'घर पर सैंपल संग्रह',
      'Home Doctor Visit': 'घर पर डॉक्टर का दौरा',
      'Home Nursing Care': 'होम नर्सिंग देखभाल',
      'Home Physiotherapy': 'होम फिजियोथेरेपी',
      'Home Vaccination': 'घर पर टीकाकरण',
      'ECG at Home': 'घर पर ईसीजी',
      'Blood Glucose Monitoring': 'रक्त शर्करा निगरानी'
    },
    homeQuestions: [
      'सेवा बुक करने में आसानी',
      'गृह दौरे की समयबद्धता',
      'व्यवहार, व्यावसायिकता और दी गई व्याख्या',
      'संक्रमण नियंत्रण और गुणवत्ता मानक',
      'घरेलू स्वास्थ्य सेवाओं की समग्र गुणवत्ता'
    ],
    opdFeedback: 'OPD प्रतिक्रिया',
    depts: {
      doctor: 'डॉक्टर परामर्श',
      pathology: 'पैथोलॉजी',
      dental: 'डेंटल (Dental)',
      radiology: 'रेडियोलॉजी',
      cardiology: 'कार्डियोलॉजी',
      pulmonology: 'पल्मोनोलॉजी',
      ophthalmology: 'नेत्र रोग सेवाएं (Ophthalmology)',
      physiotherapy: 'फिजियोथेरेपी सेवाएं',
      pharmacy: 'फार्मेसी सेवाएं',
      package: 'स्वास्थ्य जांच पैकेज',
      dayCare: 'डे केयर सेवाएं'
    },
    doctorQuestions: [
      'बीमारी और इलाज के बारे में विवरण',
      'परामर्श के दौरान बिताया गया समय',
      'सलाह और अनुवर्ती निर्देशों की स्पष्टता'
    ],
    pathologyQuestions: [
      'सैंपल संग्रह की प्रक्रिया',
      'सैंपल संग्रह के दौरान आराम',
      'रिपोर्ट समय पर उपलब्ध होना'
    ],
    dentalQuestions: [
      'दांतों की समस्या और उपचार के संबंध में विवरण',
      'डेंटल उपचार के दौरान आराम',
      'प्रक्रिया के दौरान दर्द प्रबंधन',
      'डेंटल उपचार के दौरान स्वच्छता और सफाई'
    ],
    radiologyQuestions: [
      'अपॉइंटमेंट शेड्यूलिंग प्रक्रिया',
      'प्रक्रिया से पहले दिया गया विवरण',
      'प्रक्रिया के दौरान आराम'
    ],
    cardiologyQuestions: [
      'हृदय संबंधी मूल्यांकन के बारे में विवरण',
      'प्रदान की गई नैदानिक सेवाओं की गुणवत्ता',
      'प्राप्त देखभाल में विश्वास'
    ],
    pulmonologyQuestions: [
      'श्वसन स्थिति के बारे में स्पष्टीकरण',
      'प्रदान की गई नैदानिक सेवाओं की गुणवत्ता',
      'प्राप्त देखभाल से संतुष्टि'
    ],
    ophthalmologyQuestions: [
      'आंखों की जांच प्रक्रिया',
      'निदान और उपचार के बारे में स्पष्टीकरण',
      'नेत्र देखभाल सेवाओं की गुणवत्ता'
    ],
    physiotherapyQuestions: [
      'व्यायाम और उपचार योजना का विवरण',
      'थेरेपी सत्रों की प्रभावशीलता',
      'उपचार से अनुभव हुआ सुधार'
    ],
    pharmacyQuestions: [
      'निर्धारित दवाओं की उपलब्धता',
      'दवा के उपयोग के संबंध में मार्गदर्शन'
    ],
    packageQuestions: [
      'विभागों के बीच समन्वय',
      'समग्र प्रक्रिया की सुगमता',
      'अपेक्षित समय में पैकेज पूरा होना'
    ],
    dayCareQuestions: [
      'प्रवेश प्रक्रिया',
      'रहने के दौरान आराम',
      'निगरानी और प्रदान की गई देखभाल',
      'डिस्चार्ज प्रक्रिया'
    ],
    ipdFeedback: 'IPD प्रतिक्रिया',
    ipdQuestions: [
      'प्रवेश प्रक्रिया',
      'डॉक्टर की देखभाल और संचार',
      'नर्सिंग देखभाल और जवाबदेही',
      'जांच और नैदानिक सेवाएं',
      'कमरे का आराम और स्वच्छता',
      'भोजन की गुणवत्ता और सेवा',
      'डिस्चार्ज प्रक्रिया और निर्देश'
    ],
    overallSatisfaction: 'कुल मिलाकर संतुष्टि',
    staffAppreciated: 'कर्मचारी सदस्य जिसकी आप सराहना करना चाहेंगे (वैकल्पिक):',
    positiveComments: 'हमने क्या अच्छा किया? (वैकल्पिक)',
    negativeComments: 'सुधार के लिए सुझाव / टिप्पणियाँ (वैकल्पिक):',
    agreeToUsage: 'मैं केंद्र द्वारा उपरोक्त प्रतिक्रिया के उपयोग से सहमत हूँ',
    submit: 'प्रतिक्रिया जमा करें'
  },
  gu: {
    title: 'દર્દીનો અનુભવ અને પ્રતિસાદ ફોર્મ',
    patientName: 'દર્દીનું નામ',
    uhid: 'UHID',
    ageGender: 'ઉંમર / લિંગ',
    date: 'તારીખ',
    howDidYouHear: 'તમે ES હેલ્થકેર વિશે કેવી રીતે સાંભળ્યું?',
    hearOptions: {
      'Family & Friends': 'કુટુંબ અને મિત્રો',
      'Social Media': 'સોશિયલ મીડિયા',
      'Magazine & Newspaper': 'મેગેઝિન અને સમાચાર પત્ર',
      'Google Search': 'ગૂગલ સર્ચ',
      'Website': 'વેબસાઇટ',
      'Other': 'અન્ય'
    },
    referenceBy: 'દ્વારા સંદર્ભ:',
    refOptions: {
      'Doctor': 'ડોક્ટર',
      'Camps/community Activity': 'કેમ્પ/સમુદાય પ્રવૃત્તિ',
      'Corporate Tie-up': 'કોર્પોરેટ જોડાણ',
      'Insurance/TPA': 'વીમો/TPA',
      'Existing Patient': 'હાલના દર્દી',
      'Other': 'અન્ય'
    },
    typeOfService: 'પ્રાપ્ત સેવાનો પ્રકાર',
    serviceTypes: {
      'Home Care Services': 'હોમ કેર સેવાઓ',
      'OPD': 'OPD',
      'IPD': 'IPD'
    },
    selectOpdDept: 'કૃપા કરીને તમે મુલાકાત લીધેલ OPD વિભાગ પસંદ કરો:',
    generalExperience: 'સામાન્ય અનુભવ',
    particulars: 'વિગતો',
    ratingLabels: ['નબળું', 'સરેરાશ', 'સારું', 'ખૂબ સારું', 'ઉત્કૃષ્ટ'],
    generalQuestions: [
      'નોંધણી અને પૂછપરછ સેવાઓ',
      'દર્દીના પ્રશ્નોનું નિરાકરણ અને માર્ગદર્શન',
      'રાહ જોવાનો સમય વ્યવસ્થાપન',
      'સ્ટાફનું વર્તન',
      'બિલિંગ અને ચુકવણી પ્રક્રિયા',
      'સુવિધાની સ્વચ્છતા અને સફાઈ'
    ],
    homeHealthcare: 'ઘરની આરોગ્ય સંભાળનો અનુભવ',
    servicesAvailed: 'પ્રાપ્ત સેવાઓ',
    homeServicesMap: {
      'Home Sample Collection': 'ઘરે સેમ્પલ કલેક્શન',
      'Home Doctor Visit': 'ઘરે ડોક્ટર વિઝિટ',
      'Home Nursing Care': 'હોમ નર્સિંગ કેર',
      'Home Physiotherapy': 'હોમ ફિઝિયોથેરાપી',
      'Home Vaccination': 'ઘરે રસીકરણ',
      'ECG at Home': 'ઘરે ECG',
      'Blood Glucose Monitoring': 'બ્લડ ગ્લુકોઝ મોનિટરિંગ'
    },
    homeQuestions: [
      'સેવા બુક કરવાની સરળતા',
      'ઘર મુલાકાતનો સમયપાલન',
      'વર્તન, વ્યવસાયિકતા અને આપેલ ખુલાસો',
      'ચેપ નિયંત્રણ અને ગુણવત્તાના ધોરણો',
      'ઘરની આરોગ્ય સેવાઓની એકંદર ગુણવત્તા'
    ],
    opdFeedback: 'OPD પ્રતિસાદ',
    depts: {
      doctor: 'ડોક્ટર કન્સલ્ટેશન',
      pathology: 'પેથોલોજી',
      dental: 'ડેન્ટલ (Dental)',
      radiology: 'રેડિયોલોજી',
      cardiology: 'કાર્ડિયોલોજી',
      pulmonology: 'પલ્મોનોલોજી',
      ophthalmology: 'આંખની સંભાળ સેવાઓ (Ophthalmology)',
      physiotherapy: 'ફિઝિયોથેરાપી સેવાઓ',
      pharmacy: 'ફાર્મસી સેવાઓ',
      package: 'હેલ્થ ચેક-અપ પેકેજ',
      dayCare: 'ડે કેર સેવાઓ'
    },
    doctorQuestions: [
      'બીમારી અને સારવાર અંગેની સમજૂતી',
      'કન્સલ્ટેશન દરમિયાન વિતાવેલો સમય',
      'સલાહ અને ફોલો-અપ સૂચનાઓની સ્પષ્ટતા'
    ],
    pathologyQuestions: [
      'સેમ્પલ કલેક્શન પ્રક્રિયા',
      'સેમ્પલ કલેક્શન દરમિયાન આરામ',
      'રિપોર્ટ સમયસર મળવો'
    ],
    dentalQuestions: [
      'દાંતની સમસ્યા અને સારવાર અંગેની સમજૂતી',
      'ડેન્ટલ સારવાર દરમિયાન આરામ',
      'પ્રક્રિયા દરમિયાન દુખાવાનું સંચાલન',
      'ડેન્ટલ સારવાર દરમિયાન સ્વચ્છતા અને સફાઈ'
    ],
    radiologyQuestions: [
      'એપોઇન્ટમેન્ટ શેડ્યુલિંગ પ્રક્રિયા',
      'પ્રક્રિયા પહેલાં આપેલી સમજૂતી',
      'પ્રક્રિયા દરમિયાન આરામ'
    ],
    cardiologyQuestions: [
      'હૃદયના મૂલ્યાંકન અંગેની સમજૂતી',
      'પૂરી પાડવામાં આવેલ નિદાન સેવાઓની ગુણવત્તા',
      'મળેલી સંભાળમાં વિશ્વાસ'
    ],
    pulmonologyQuestions: [
      'શ્વાસની સ્થિતિ અંગે સ્પષ્ટતા',
      'પૂરી પાડવામાં આવેલ નિદાન સેવાઓની ગુણવત્તા',
      'સંભાળથી સંતોષ'
    ],
    ophthalmologyQuestions: [
      'આંખની તપાસ પ્રક્રિયા',
      'નિદાન અને સારવાર અંગેની સમજૂતી',
      'આંખની સંભાળ સેવાઓની ગુણવત્તા'
    ],
    physiotherapyQuestions: [
      'કસરત અને સારવાર યોજનાની સમજૂતી',
      'થેરાપી સત્રોની અસરકારકતા',
      'સારવારથી અનુભવાયેલ સુધારો'
    ],
    pharmacyQuestions: [
      'લખેલી દવાઓની ઉપલબ્ધતા',
      'દવાના ઉપયોગ અંગે માર્ગદર્શન'
    ],
    packageQuestions: [
      'વિભાગો વચ્ચે સંકલન',
      'એકંદર પ્રક્રિયાની સરળતા',
      'અપેક્ષિત સમયમાં પેકેજ પૂર્ણ થવું'
    ],
    dayCareQuestions: [
      'દાખલ થવાની પ્રક્રિયા',
      'રોકાણ દરમિયાન આરામ',
      'મોનિટરિંગ અને આપેલી સંભાળ',
      'ડિસ્ચાર્જ પ્રક્રિયા'
    ],
    ipdFeedback: 'IPD પ્રતિસાદ',
    ipdQuestions: [
      'દાખલ થવાની પ્રક્રિયા',
      'ડોક્ટરની સંભાળ અને વાતચીત',
      'નર્સિંગ કેર અને પ્રતિભાવ',
      'તપાસ અને નિદાન સેવાઓ',
      'રૂમની સુખ-સુવિધા અને સ્વચ્છતા',
      'ખોરાકની ગુણવત્તા અને સેવા',
      'ડિસ્ચાર્જ પ્રક્રિયા અને સૂચનાઓ'
    ],
    overallSatisfaction: 'એકંદરે સંતોષ',
    staffAppreciated: 'સ્ટાફ સભ્ય કે જેની તમે પ્રશંસા કરવા માંગો છો (વૈકલ્પિક):',
    positiveComments: 'અમે શું સારું કર્યું? (વૈકલ્પિક)',
    negativeComments: 'સુધારણા માટેનાં સૂચનો / ટિપ્પણીઓ (વૈકલ્પિક):',
    agreeToUsage: 'હું કેન્દ્ર દ્વારા ઉપરોક્ત પ્રતિસાદના ઉપયોગ સાથે સંમત છું',
    submit: 'પ્રતિસાદ સબમિટ કરો'
  }
}

const fetchPatientService = async (uhid: string) => {
  const res = await fetch('/api/patients')
  const patients = await res.json()
  const p = patients.find((p: any) => p.uhid === uhid)
  return p || null
}

export default function PublicFeedbackPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const uhid = params.uhid as string
  const servicesParam = searchParams.get('services')

  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi' | 'gu'>('en')
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  // Form State
  const [heardAbout, setHeardAbout] = useState<string[]>([])
  const [heardAboutOther, setHeardAboutOther] = useState('')
  
  const [referenceBy, setReferenceBy] = useState<string[]>([])
  const [referenceByOther, setReferenceByOther] = useState('')
  
  const [serviceAvailed, setServiceAvailed] = useState<string[]>([])
  const [homeServicesAvailed, setHomeServicesAvailed] = useState<string[]>([])

  const [ratings, setRatings] = useState<Record<string, number>>({})
  
  const [overallRating, setOverallRating] = useState(0)
  const [staffAppreciated, setStaffAppreciated] = useState('')
  const [positiveComments, setPositiveComments] = useState('')
  const [negativeComments, setNegativeComments] = useState('')
  const [agreeToUsage, setAgreeToUsage] = useState(true)

  const [servicesParamState, setServicesParamState] = useState<string[]>([])

  useEffect(() => {
    fetchPatientService(uhid).then(p => {
      setPatient(p)
      
      if (p) {
        const pServices = Array.isArray(p.services) && p.services.length > 0 
          ? p.services 
          : (p.service ? [p.service] : [])
        
        setServicesParamState(pServices)

        const checkboxes: string[] = []
        if (pServices.some((s: string) => s.toLowerCase().includes('home'))) checkboxes.push('Home Care Services')
        if (pServices.some((s: string) => s.toLowerCase().includes('ipd'))) checkboxes.push('IPD')
        
        if (pServices.length > 0 && checkboxes.length === 0) {
          checkboxes.push('OPD')
        }
        
        setServiceAvailed(checkboxes)
      }
      setLoading(false)
    })
  }, [uhid, servicesParam])

  // Select department manually if generic link
  const [manualDepartments, setManualDepartments] = useState<string[]>([])

  // Helpers
  const handleCheckbox = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) setList(list.filter(i => i !== item))
    else setList([...list, item])
  }

  const setRating = (category: string, question: string, score: number) => {
    setRatings({ ...ratings, [`${category}|||${question}`]: score })
  }

  const getRating = (category: string, question: string) => {
    return ratings[`${category}|||${question}`] || 0
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    
    const finalHeardAbout = [...heardAbout.filter(x => x !== 'Other')]
    if (heardAbout.includes('Other') && heardAboutOther) finalHeardAbout.push(`Other: ${heardAboutOther}`)
    
    const finalReferenceBy = [...referenceBy.filter(x => x !== 'Other')]
    if (referenceBy.includes('Other') && referenceByOther) finalReferenceBy.push(`Other: ${referenceByOther}`)

    const ratingsPayload = Object.keys(ratings).map(key => {
      const [category, question] = key.split('|||')
      return { category, question, rating: ratings[key] }
    })
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uhid,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Verified Patient',
          service: patient ? patient.service : 'General',
          heardAbout: finalHeardAbout.join(', '),
          referenceBy: finalReferenceBy.join(', '),
          serviceAvailed: serviceAvailed.join(', '),
          homeHealthcareServices: homeServicesAvailed.join(', '),
          overallRating,
          staffAppreciated,
          positiveComments,
          negativeComments,
          agreeToUsage,
          ratings: ratingsPayload
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Submission failed (status ${response.status})`)
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error('Feedback submission error:', err)
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <CardTitle className="mb-2">Thank You!</CardTitle>
            <p className="text-slate-500">Your feedback has been submitted successfully and will help us improve our services.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const svcString = servicesParamState.length > 0 
    ? servicesParamState.join(' ') 
    : (patient?.service || '')

  const isHomecare = serviceAvailed.some(s => s.toLowerCase().includes('home'))
  const isIPD = serviceAvailed.some(s => s.toLowerCase().includes('ipd'))
  const isOPD = serviceAvailed.some(s => s.toLowerCase().includes('opd')) || (!isHomecare && !isIPD)

  const activeSvcString = manualDepartments.length > 0 
    ? manualDepartments.join(' ')
    : svcString

  const hasActiveSvc = (name: string) => activeSvcString.toLowerCase().includes(name.toLowerCase())

  const showPathology = hasActiveSvc('pathology') || hasActiveSvc('lab') || hasActiveSvc('sample collection')
  const showDoctorConsult = hasActiveSvc('doctor consult') || (!showPathology && !hasActiveSvc('radiology') && !hasActiveSvc('cardiology') && !hasActiveSvc('pulmonology') && !hasActiveSvc('ophthalmology') && !hasActiveSvc('physiotherapy') && !hasActiveSvc('pharmacy') && !hasActiveSvc('package') && !hasActiveSvc('day care') && !hasActiveSvc('dental'))
  const showRadiology = hasActiveSvc('radiology')
  const showCardiology = hasActiveSvc('cardiology')
  const showPulmonology = hasActiveSvc('pulmonology')
  const showOphthalmology = hasActiveSvc('ophthalmology')
  const showPhysiotherapy = hasActiveSvc('physiotherapy')
  const showPharmacy = hasActiveSvc('pharmacy')
  const showPackage = hasActiveSvc('package') || hasActiveSvc('check-up')
  const showDayCare = hasActiveSvc('day care')
  const showDental = hasActiveSvc('dental')

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center font-sans">
      <div className="w-full max-w-4xl relative">
        {/* Language selector button */}
        <div className="absolute right-0 top-0 flex gap-1 bg-white p-1 rounded shadow-sm border border-slate-200 z-10">
          <button type="button" onClick={() => setLang('en')} className={`px-3 py-1.5 text-xs font-semibold rounded ${lang === 'en' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>EN</button>
          <button type="button" onClick={() => setLang('hi')} className={`px-3 py-1.5 text-xs font-semibold rounded ${lang === 'hi' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>HI</button>
          <button type="button" onClick={() => setLang('gu')} className={`px-3 py-1.5 text-xs font-semibold rounded ${lang === 'gu' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>GU</button>
        </div>
        
        <div className="text-center mb-8 pt-10 md:pt-0">
          <h1 className="text-2xl font-bold text-slate-800">ES Healthcare Centre</h1>
          <p className="text-slate-600 font-medium">{t.title}</p>
        </div>

        {patient && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">{t.patientName}</span>
              <span className="font-semibold text-slate-800">{patient.firstName} {patient.lastName}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">{t.uhid}</span>
              <span className="font-semibold text-slate-800">{patient.uhid}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">{t.ageGender}</span>
              <span className="font-semibold text-slate-800">{patient.age || 0} / {patient.gender || 'U'}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">{t.date}</span>
              <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        )}

        <Card className="shadow-lg border-t-4 border-t-teal-600">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                
                {/* How did you hear */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">{t.howDidYouHear}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(t.hearOptions).map(([rawKey, translatedLabel]) => (
                      <div key={rawKey} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`hear-${rawKey}`} 
                          checked={heardAbout.includes(rawKey)}
                          onCheckedChange={() => handleCheckbox(heardAbout, setHeardAbout, rawKey)}
                        />
                        <Label htmlFor={`hear-${rawKey}`} className="font-normal">{translatedLabel}</Label>
                      </div>
                    ))}
                  </div>
                  {heardAbout.includes('Other') && (
                    <Input className="mt-3" placeholder="Please specify..." value={heardAboutOther} onChange={e => setHeardAboutOther(e.target.value)} />
                  )}
                </div>

                {/* Reference By */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">{t.referenceBy}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(t.refOptions).map(([rawKey, translatedLabel]) => (
                      <div key={rawKey} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`ref-${rawKey}`} 
                          checked={referenceBy.includes(rawKey)}
                          onCheckedChange={() => handleCheckbox(referenceBy, setReferenceBy, rawKey)}
                        />
                        <Label htmlFor={`ref-${rawKey}`} className="font-normal">{translatedLabel}</Label>
                      </div>
                    ))}
                  </div>
                  {referenceBy.includes('Other') && (
                    <Input className="mt-3" placeholder="Please specify..." value={referenceByOther} onChange={e => setReferenceByOther(e.target.value)} />
                  )}
                </div>

                {/* Service Availed */}
              <div className="md:col-span-2 pt-4 border-t border-slate-200">
                <Label className="text-base font-semibold mb-4 block text-slate-800 uppercase tracking-wide border-b pb-2">{t.typeOfService}</Label>
                  <div className="flex flex-wrap gap-6 mb-4">
                    {Object.entries(t.serviceTypes).map(([rawKey, translatedLabel]) => (
                      <div key={rawKey} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`svc-${rawKey}`} 
                          checked={serviceAvailed.includes(rawKey)}
                          onCheckedChange={() => {
                            if (!servicesParam && !patient) handleCheckbox(serviceAvailed, setServiceAvailed, rawKey)
                          }}
                          disabled={!!servicesParam || !!patient}
                        />
                        <Label htmlFor={`svc-${rawKey}`} className={`font-medium ${(servicesParam || patient) ? 'text-slate-400' : 'text-slate-700'}`}>{translatedLabel}</Label>
                      </div>
                    ))}
                  </div>

                  {(!patient && !servicesParam && isOPD) && (
                    <div className="mt-4 p-4 bg-white border rounded-lg border-slate-200">
                      <Label className="text-sm font-semibold mb-3 block text-slate-700">{t.selectOpdDept}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { raw: 'Doctor Consultation', label: t.depts.doctor },
                          { raw: 'Cardiology', label: t.depts.cardiology },
                          { raw: 'Pulmonology', label: t.depts.pulmonology },
                          { raw: 'Radiology', label: t.depts.radiology },
                          { raw: 'Pathology', label: t.depts.pathology },
                          { raw: 'Dental', label: t.depts.dental },
                          { raw: 'Ophthalmology', label: t.depts.ophthalmology },
                          { raw: 'Day Care', label: t.depts.dayCare },
                          { raw: 'Physiotherapy', label: t.depts.physiotherapy }
                        ].map(opt => (
                          <div key={opt.raw} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`dept-${opt.raw}`} 
                              checked={manualDepartments.includes(opt.raw)}
                              onCheckedChange={() => handleCheckbox(manualDepartments, setManualDepartments, opt.raw)}
                            />
                            <Label htmlFor={`dept-${opt.raw}`} className="text-sm font-medium">{opt.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* General Experience Table */}
              <div>
                <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">{t.generalExperience}</Label>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-4 border-b">{t.particulars}</th>
                        {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {t.generalQuestions.map((q, idx) => (
                        <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                          {t.ratingLabels.map((_, rIdx) => (
                            <td key={rIdx} className="p-4 border-b text-center">
                              <button
                                type="button"
                                onClick={() => setRating('General Experience', q, rIdx + 1)}
                                className={`w-6 h-6 rounded-full border-2 transition-colors ${getRating('General Experience', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conditional Sections */}
              {isHomecare && (
                <div>
                  <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">{t.homeHealthcare}</Label>
                  
                  <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <Label className="text-base font-semibold mb-3 block text-slate-800">{t.servicesAvailed}</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(t.homeServicesMap).map(([rawKey, translatedLabel]) => (
                        <div key={rawKey} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`home-svc-${rawKey}`} 
                            checked={homeServicesAvailed.includes(rawKey)}
                            onCheckedChange={() => handleCheckbox(homeServicesAvailed, setHomeServicesAvailed, rawKey)}
                          />
                          <Label htmlFor={`home-svc-${rawKey}`} className="font-normal">{translatedLabel}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-4 border-b">{t.particulars}</th>
                          {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {t.homeQuestions.map((q, idx) => (
                          <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                            {t.ratingLabels.map((_, rIdx) => (
                              <td key={rIdx} className="p-4 border-b text-center">
                                <button
                                  type="button"
                                  onClick={() => setRating('Home Healthcare', q, rIdx + 1)}
                                  className={`w-6 h-6 rounded-full border-2 transition-colors ${getRating('Home Healthcare', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {isOPD && (
                <div>
                  <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">{t.opdFeedback}</Label>
                  
                  {showDoctorConsult && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.doctor}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.doctorQuestions.map((q, idx) => (
                            <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Doctor Consultation', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Doctor Consultation', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPathology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.pathology}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.pathologyQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Pathology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Pathology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showDental && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.dental}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.dentalQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Dental', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Dental', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showRadiology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.radiology}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.radiologyQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Radiology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Radiology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showCardiology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.cardiology}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.cardiologyQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Cardiology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Cardiology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPulmonology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.pulmonology}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.pulmonologyQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Pulmonology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Pulmonology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showOphthalmology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.ophthalmology}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.ophthalmologyQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Ophthalmology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Ophthalmology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPhysiotherapy && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.physiotherapy}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.physiotherapyQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Physiotherapy', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Physiotherapy', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPharmacy && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.pharmacy}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.pharmacyQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Pharmacy', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Pharmacy', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPackage && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.package}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.packageQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Health Check-up Package', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Health Check-up Package', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showDayCare && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">{t.depts.dayCare}</th>
                            {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.dayCareQuestions.map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {t.ratingLabels.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Day Care', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Day Care', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {isIPD && (
                <div>
                  <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">{t.ipdFeedback}</Label>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-4 border-b">{t.particulars}</th>
                          {t.ratingLabels.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {t.ipdQuestions.map((q, idx) => (
                          <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                            {t.ratingLabels.map((_, rIdx) => (
                              <td key={rIdx} className="p-4 border-b text-center">
                                <button
                                  type="button"
                                  onClick={() => setRating('IPD', q, rIdx + 1)}
                                  className={`w-6 h-6 rounded-full border-2 transition-colors ${getRating('IPD', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bottom Section */}
              <div className="space-y-6 pt-6 border-t border-slate-200">
                {/* Overall Rating */}
                <div>
                  <Label className="text-base font-semibold mb-2 block text-slate-800">{t.overallSatisfaction}</Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setOverallRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <StarIcon
                          className={`w-8 h-8 ${
                            star <= overallRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm font-semibold text-slate-600">
                      {overallRating > 0 ? `${overallRating} / 5` : ''}
                    </span>
                  </div>
                </div>

                {/* Staff Appreciated */}
                <div>
                  <Label htmlFor="staff" className="text-sm font-medium mb-2 block text-slate-700">
                    {t.staffAppreciated}
                  </Label>
                  <Input
                    id="staff"
                    placeholder="e.g. Dr. Mehta, Nurse Priya"
                    value={staffAppreciated}
                    onChange={(e) => setStaffAppreciated(e.target.value)}
                  />
                </div>

                {/* Positive Comments */}
                <div>
                  <Label htmlFor="positive" className="text-sm font-medium mb-2 block text-slate-700">
                    {t.positiveComments}
                  </Label>
                  <Textarea
                    id="positive"
                    rows={3}
                    placeholder="Tell us what you liked..."
                    value={positiveComments}
                    onChange={(e) => setPositiveComments(e.target.value)}
                  />
                </div>

                {/* Negative Comments */}
                <div>
                  <Label htmlFor="negative" className="text-sm font-medium mb-2 block text-slate-700">
                    {t.negativeComments}
                  </Label>
                  <Textarea
                    id="negative"
                    rows={3}
                    placeholder="How can we serve you better?"
                    value={negativeComments}
                    onChange={(e) => setNegativeComments(e.target.value)}
                  />
                </div>

                {/* Consent */}
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="consent"
                    checked={agreeToUsage}
                    onCheckedChange={(checked) => setAgreeToUsage(!!checked)}
                  />
                  <Label htmlFor="consent" className="text-sm font-medium text-slate-700 cursor-pointer">
                    {t.agreeToUsage}
                  </Label>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-6 text-lg rounded-xl shadow-md transition-colors"
              >
                {submitting ? 'Submitting...' : t.submit}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
