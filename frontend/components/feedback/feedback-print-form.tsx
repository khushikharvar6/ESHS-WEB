'use client'

import Image from 'next/image'
import type { Patient } from '@/lib/store'

function BlankLine({ className = '' }: { className?: string }) {
  return <span className={`inline-block border-b border-black/60 ${className}`} />
}

function EmptyBox({ checked = false }: { checked?: boolean }) {
  return (
    <span className="inline-flex items-center justify-center size-3.5 border border-black/70 align-middle text-[9px] font-bold select-none mr-1.5 bg-white">
      {checked ? '✓' : ''}
    </span>
  )
}

function EmptyCircle({ checked = false }: { checked?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center size-3.5 border border-black/70 rounded-full align-middle text-[9px] font-bold select-none mr-1.5 bg-white`}>
      {checked ? '•' : ''}
    </span>
  )
}

function FieldRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">
        {label}
      </span>
      <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">
        {value || '__________________________'}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Printable Feedback Layout                                           */
/* ------------------------------------------------------------------ */
const TRANSLATIONS = {
  en: {
    title: 'Patient Experience & Feedback Form',
    patientName: 'Patient name:',
    date: 'Date:',
    time: 'Time:',
    uhid: 'UHID No.',
    location: 'Location:',
    ageGender: 'Age / Gender:',
    services: 'Services:',
    howDidYouHear: 'How did you hear about ES healthcare?',
    familyFriends: 'Family & Friends',
    socialMedia: 'Social Media',
    magazineNewspaper: 'Magazine & Newspaper',
    googleSearch: 'Google Search',
    website: 'Website',
    other: 'Other',
    referenceBy: 'Reference By:',
    doctor: 'Doctor',
    campsCommunity: 'Camps/community Activity',
    corporateTieup: 'Corporate Tie-up',
    insuranceTpa: 'Insurance/TPA',
    existingPatient: 'Existing Patient',
    typeOfService: 'TYPE OF SERVICE AVAILED:',
    homeCareServices: 'Home Care Services',
    opd: 'OPD',
    ipd: 'IPD',
    generalExp: 'GENERAL EXPERIENCE',
    particulars: 'Particulars',
    poor: 'Poor',
    average: 'Average',
    good: 'Good',
    veryGood: 'Very Good',
    excellent: 'Excellent',
    ratingLabels: ['Poor', 'Average', 'Good', 'Very Good', 'Excellent'],
    generalQuestions: [
      'Registration and enquiry services',
      'Handling of patient queries and guidance provided',
      'Waiting time management',
      'Behavior of the staff',
      'Billing and payment process',
      'Cleanliness and hygiene of the facility'
    ],
    homeHealthcare: 'HOME HEALTHCARE SERVICES',
    servicesAvailed: 'Services Availed:',
    homeServicesMap: {
      'Home Sample Collection': 'Home Sample Collection',
      'Home Doctor Visit': 'Home Doctor Visit',
      'Home Nursing Care': 'Home Nursing Care',
      'Home Physiotherapy': 'Home Physiotherapy',
      'Home Vaccination': 'Home Vaccination',
      'ECG at Home': 'ECG at Home',
      'Blood Glucose Monitoring': 'Blood Glucose Monitoring'
    },
    homeExp: 'Home Healthcare Experience',
    homeQuestions: [
      'Ease of booking the service',
      'Timeliness of home visit',
      'Behaviour, professionalism and explanation given',
      'Infection control and quality standards',
      'Overall quality of home healthcare services'
    ],
    opdFeedback: 'OPD FEEDBACK',
    doctorConsultation: 'Doctor Consultation',
    doctorQuestions: [
      'Explanation regarding illness and treatment',
      'Time spent during consultation',
      'Clarity of advice and follow-up instructions'
    ],
    pathology: 'Pathology',
    pathologyQuestions: [
      'Sample collection process',
      'Comfort during sample collection',
      'Timely availability of reports'
    ],
    radiology: 'Radiology',
    radiologyQuestions: [
      'Appointment scheduling process',
      'Explanation before the procedure',
      'Comfort during the procedure'
    ],
    cardiology: 'Cardiology',
    cardiologyQuestions: [
      'Explanation regarding cardiac evaluation',
      'Quality of diagnostic services provided',
      'Confidence in care received'
    ],
    pulmonology: 'Pulmonology',
    pulmonologyQuestions: [
      'Explanation regarding respiratory condition',
      'Quality of diagnostic services provided',
      'Satisfaction with care received'
    ],
    ophthalmology: 'Ophthalmology Services',
    ophthalmologyQuestions: [
      'Eye examination process',
      'Explanation regarding diagnosis and treatment',
      'Quality of eye care services'
    ],
    physiotherapy: 'Physiotherapy Services',
    physiotherapyQuestions: [
      'Explanation of exercises and treatment plan',
      'Effectiveness of therapy sessions',
      'Improvement experienced from treatment'
    ],
    pharmacy: 'Pharmacy Services',
    pharmacyQuestions: [
      'Availability of prescribed medicines',
      'Guidance regarding medication usage'
    ],
    package: 'Health Check-up Package',
    packageQuestions: [
      'Coordination between departments',
      'Smoothness of overall process',
      'Completion of package within expected time'
    ],
    dayCare: 'Day Care Services',
    dayCareQuestions: [
      'Admission process',
      'Comfort during stay',
      'Monitoring and care provided',
      'Discharge process'
    ],
    dental: 'Dental Services',
    dentalQuestions: [
      'Explanation regarding dental problem and treatment',
      'Comfort during the dental treatment',
      'Pain management during the procedure',
      'Cleanliness and hygiene during the dental treatment'
    ],
    ipdFeedback: 'IPD (INPATIENT) FEEDBACK',
    ipdQuestions: [
      'Admission process',
      "Doctor's care and communication",
      'Nursing care and responsiveness',
      'Investigation and diagnostic services',
      'Room comfort and cleanliness',
      'Food quality and service',
      'Discharge process and instructions'
    ],
    overallSat: 'OVERALL SATISFACTION:',
    overallSatDesc: 'Please rate the overall quality of healthcare services provided',
    appreciate: 'Staff member you would like to appreciate:',
    suggestions: 'Suggestions / Remarks for improvement:',
    consent: 'I AGREE TO THE USAGE OF ABOVE FEEDBACK BY THE CENTRE:',
    yes: 'YES',
    no: 'NO',
    contactNo: 'Contact No.',
    emailId: 'Email ID',
    signature: 'Signature',
    thankYou: '** THANK YOU **'
  },
  hi: {
    title: 'रोगी अनुभव और प्रतिक्रिया प्रपत्र',
    patientName: 'रोगी का नाम:',
    date: 'दिनांक:',
    time: 'समय:',
    uhid: 'UHID सं.',
    location: 'स्थान:',
    ageGender: 'आयु / लिंग:',
    services: 'सेवाएं:',
    howDidYouHear: 'आपने ES स्वास्थ्य सेवा के बारे में कैसे सुना?',
    familyFriends: 'परिवार और मित्र',
    socialMedia: 'सोशल मीडिया',
    magazineNewspaper: 'पत्रिका और समाचार पत्र',
    googleSearch: 'गूगल खोज',
    website: 'वेबसाइट',
    other: 'अन्य',
    referenceBy: 'संदर्भ द्वारा:',
    doctor: 'डॉक्टर',
    campsCommunity: 'शिविर/सामुदायिक गतिविधि',
    corporateTieup: 'कॉर्पोरेट अनुबंध',
    insuranceTpa: 'बीमा/TPA',
    existingPatient: 'मौजूदा रोगी',
    typeOfService: 'प्राप्त सेवा का प्रकार:',
    homeCareServices: 'होम केयर सेवाएं',
    opd: 'OPD',
    ipd: 'IPD',
    generalExp: 'सामान्य अनुभव',
    particulars: 'विवरण',
    poor: 'खराब',
    average: 'औसत',
    good: 'अच्छा',
    veryGood: 'बहुत अच्छा',
    excellent: 'उत्कृष्ट',
    ratingLabels: ['खराब', 'औसत', 'अच्छा', 'बहुत अच्छा', 'उत्कृष्ट'],
    generalQuestions: [
      'पंजीकरण और पूछताछ सेवाएं',
      'रोगी के प्रश्नों का उत्तर और मार्गदर्शन',
      'प्रतीक्षा समय प्रबंधन',
      'कर्मचारियों का व्यवहार',
      'बिलिंग और भुगतान प्रक्रिया',
      'सुविधा की स्वच्छता और सफाई'
    ],
    homeHealthcare: 'घरेलू स्वास्थ्य देखभाल सेवाएं',
    servicesAvailed: 'प्राप्त सेवाएं:',
    homeServicesMap: {
      'Home Sample Collection': 'घर पर सैंपल संग्रह',
      'Home Doctor Visit': 'घर पर डॉक्टर का दौरा',
      'Home Nursing Care': 'होम नर्सिंग देखभाल',
      'Home Physiotherapy': 'होम फिजियोथेरेपी',
      'Home Vaccination': 'घर पर टीकाकरण',
      'ECG at Home': 'घर पर ईसीजी',
      'Blood Glucose Monitoring': 'रक्त शर्करा निगरानी'
    },
    homeExp: 'घरेलू स्वास्थ्य देखभाल अनुभव',
    homeQuestions: [
      'सेवा बुक करने में आसानी',
      'गृह दौरे की समयबद्धता',
      'व्यवहार, व्यावसायिकता और दी गई व्याख्या',
      'संक्रमण नियंत्रण और गुणवत्ता मानक',
      'घरेलू स्वास्थ्य सेवाओं की समग्र गुणवत्ता'
    ],
    opdFeedback: 'OPD प्रतिक्रिया',
    doctorConsultation: 'डॉक्टर परामर्श',
    doctorQuestions: [
      'बीमारी और इलाज के बारे में विवरण',
      'परामर्श के दौरान बिताया गया समय',
      'सलाह और अनुवर्ती निर्देशों की स्पष्टता'
    ],
    pathology: 'पैथोलॉजी',
    pathologyQuestions: [
      'सैंपल संग्रह की प्रक्रिया',
      'सैंपल संग्रह के दौरान आराम',
      'रिपोर्ट समय पर उपलब्ध होना'
    ],
    radiology: 'रेडियोलॉजी',
    radiologyQuestions: [
      'अपॉइंटमेंट शेड्यूलिंग प्रक्रिया',
      'प्रक्रिया से पहले दिया गया विवरण',
      'प्रक्रिया के दौरान आराम'
    ],
    cardiology: 'कार्डियोलॉजी',
    cardiologyQuestions: [
      'हृदय संबंधी मूल्यांकन के बारे में विवरण',
      'प्रदान की गई नैदानिक सेवाओं की गुणवत्ता',
      'प्राप्त देखभाल में विश्वास'
    ],
    pulmonology: 'पल्मोनोलॉजी',
    pulmonologyQuestions: [
      'श्वसन स्थिति के बारे में स्पष्टीकरण',
      'प्रदान की गई नैदानिक सेवाओं की गुणवत्ता',
      'प्राप्त देखभाल से संतुष्टि'
    ],
    ophthalmology: 'नेत्र रोग सेवाएं (Ophthalmology)',
    ophthalmologyQuestions: [
      'आंखों की जांच प्रक्रिया',
      'निदान और उपचार के बारे में स्पष्टीकरण',
      'नेत्र देखभाल सेवाओं की गुणवत्ता'
    ],
    physiotherapy: 'फिजियोथेरेपी सेवाएं',
    physiotherapyQuestions: [
      'व्यायाम और उपचार योजना का विवरण',
      'थेरेपी सत्रों की प्रभावशीलता',
      'उपचार से अनुभव हुआ सुधार'
    ],
    pharmacy: 'फार्मेसी सेवाएं',
    pharmacyQuestions: [
      'निर्धारित दवाओं की उपलब्धता',
      'दवा के उपयोग के संबंध में मार्गदर्शन'
    ],
    package: 'स्वास्थ्य जांच पैकेज',
    packageQuestions: [
      'विभागों के बीच समन्वय',
      'समग्र प्रक्रिया की सुगमता',
      'अपेक्षित समय में पैकेज पूरा होना'
    ],
    dayCare: 'डे केयर सेवाएं',
    dayCareQuestions: [
      'प्रवेश प्रक्रिया',
      'रहने के दौरान आराम',
      'निगरानी और प्रदान की गई देखभाल',
      'डिस्चार्ज प्रक्रिया'
    ],
    dental: 'डेंटल सेवाएं (Dental)',
    dentalQuestions: [
      'दांतों की समस्या और उपचार के संबंध में विवरण',
      'डेंटल उपचार के दौरान आराम',
      'प्रक्रिया के दौरान दर्द प्रबंधन',
      'डेंटल उपचार के दौरान स्वच्छता और सफाई'
    ],
    ipdFeedback: 'IPD (इनपेशेंट) प्रतिक्रिया',
    ipdQuestions: [
      'प्रवेश प्रक्रिया',
      'डॉक्टर की देखभाल और संचार',
      'नर्सिंग देखभाल और जवाबदेही',
      'जांच और नैदानिक सेवाएं',
      'कमरे का आराम और स्वच्छता',
      'भोजन की गुणवत्ता और सेवा',
      'डिस्चार्ज प्रक्रिया और निर्देश'
    ],
    overallSat: 'कुल मिलाकर संतुष्टि:',
    overallSatDesc: 'कृपया प्रदान की गई स्वास्थ्य देखभाल सेवाओं की समग्र गुणवत्ता को दर दें',
    appreciate: 'कर्मचारी सदस्य जिसकी आप सराहना करना चाहेंगे:',
    suggestions: 'सुधार के लिए सुझाव / टिप्पणियाँ:',
    consent: 'मैं केंद्र द्वारा उपरोक्त प्रतिक्रिया के उपयोग से सहमत हूँ:',
    yes: 'हाँ',
    no: 'नहीं',
    contactNo: 'संपर्क नंबर',
    emailId: 'ईमेल आईडी',
    signature: 'हस्ताक्षर',
    thankYou: '** धन्यवाद **'
  },
  gu: {
    title: 'દર્દીનો અનુભવ અને પ્રતિસાદ ફોર્મ',
    patientName: 'દર્દીનું નામ:',
    date: 'તારીખ:',
    time: 'સમય:',
    uhid: 'UHID નં.',
    location: 'સ્થળ:',
    ageGender: 'ઉંમર / લિંગ:',
    services: 'સેવાઓ:',
    howDidYouHear: 'તમે ES હેલ્થકેર વિશે કેવી રીતે સાંભળ્યું?',
    familyFriends: 'કુટુંબ અને મિત્રો',
    socialMedia: 'સોશિયલ મીડિયા',
    magazineNewspaper: 'મેગેઝિન અને સમાચાર પત્ર',
    googleSearch: 'ગૂગલ સર્ચ',
    website: 'વેબસાઇટ',
    other: 'અન્ય',
    referenceBy: 'દ્વારા સંદર્ભ:',
    doctor: 'ડોક્ટર',
    campsCommunity: 'કેમ્પ/સમુદાય પ્રવૃત્તિ',
    corporateTieup: 'કોર્પોરેટ જોડાણ',
    insuranceTpa: 'વીમો/TPA',
    existingPatient: 'હાલના દર્દી',
    typeOfService: 'પ્રાપ્ત સેવાનો પ્રકાર:',
    homeCareServices: 'હોમ કેર સેવાઓ',
    opd: 'OPD',
    ipd: 'IPD',
    generalExp: 'સામાન્ય અનુભવ',
    particulars: 'વિગતો',
    poor: 'નબળું',
    average: 'સરેરાશ',
    good: 'સારું',
    veryGood: 'ખૂબ સારું',
    excellent: 'ઉત્કૃષ્ટ',
    ratingLabels: ['નબળું', 'સરેરાશ', 'સારું', 'ખૂબ સારું', 'ઉત્કૃષ્ટ'],
    generalQuestions: [
      'નોંધણી અને પૂછપરછ સેવાઓ',
      'દર્દીના પ્રશ્નોનું નિરાકરણ અને માર્ગદર્શન',
      'રાહ જોવાનો સમય વ્યવસ્થાપન',
      'સ્ટાફનું વર્તન',
      'બિલિંગ અને ચુકવણી પ્રક્રિયા',
      'સુવિધાની સ્વચ્છતા અને સફાઈ'
    ],
    homeHealthcare: 'ઘરની આરોગ્ય સંભાળ સેવાઓ',
    servicesAvailed: 'પ્રાપ્ત સેવાઓ:',
    homeServicesMap: {
      'Home Sample Collection': 'ઘરે સેમ્પલ કલેક્શન',
      'Home Doctor Visit': 'ઘરે ડોક્ટર વિઝિટ',
      'Home Nursing Care': 'હોમ નર્સિંગ કેર',
      'Home Physiotherapy': 'હોમ ફિઝિયોથેરાપી',
      'Home Vaccination': 'ઘરે રસીકરણ',
      'ECG at Home': 'ઘરે ECG',
      'Blood Glucose Monitoring': 'બ્લડ ગ્લુકોઝ મોનિટરિંગ'
    },
    homeExp: 'ઘરની આરોગ્ય સંભાળનો અનુભવ',
    homeQuestions: [
      'સેવા બુક કરવાની સરળતા',
      'ઘર મુલાકાતનો સમયપાલન',
      'વર્તન, વ્યવસાયિકતા અને આપેલ ખુલાસો',
      'ચેપ નિયંત્રણ અને ગુણવત્તાના ધોરણો',
      'ઘરની આરોગ્ય સેવાઓની એકંદર ગુણવત્તા'
    ],
    opdFeedback: 'OPD પ્રતિસાદ',
    doctorConsultation: 'ડોક્ટર કન્સલ્ટેશન',
    doctorQuestions: [
      'બીમારી અને સારવાર અંગેની સમજૂતી',
      'કન્સલ્ટેશન દરમિયાન વિતાવેલો સમય',
      'સલાહ અને ફોલો-અપ સૂચનાઓની સ્પષ્ટતા'
    ],
    pathology: 'પેથોલોજી',
    pathologyQuestions: [
      'સેમ્પલ કલેક્શન પ્રક્રિયા',
      'સેમ્પલ કલેક્શન દરમિયાન આરામ',
      'રિપોર્ટ સમયસર મળવો'
    ],
    radiology: 'રેડિયોલોજી',
    radiologyQuestions: [
      'એપોઇન્ટમેન્ટ શેડ્યુલિંગ પ્રક્રિયા',
      'પ્રક્રિયા પહેલાં આપેલી સમજૂતી',
      'પ્રક્રિયા દરમિયાન આરામ'
    ],
    cardiology: 'કાર્ડિયોલોજી',
    cardiologyQuestions: [
      'હૃદયના મૂલ્યાંકન અંગેની સમજૂતી',
      'પૂરી પાડવામાં આવેલ નિદાન સેવાઓની ગુણવત્તા',
      'મળેલી સંભાળમાં વિશ્વાસ'
    ],
    pulmonology: 'પલ્મોનોલોજી',
    pulmonologyQuestions: [
      'શ્વાસની સ્થિતિ અંગે સ્પષ્ટતા',
      'પૂરી પાડવામાં આવેલ નિદાન સેવાઓની ગુણવત્તા',
      'સંભાળથી સંતોષ'
    ],
    ophthalmology: 'આંખની સંભાળ સેવાઓ (Ophthalmology)',
    ophthalmologyQuestions: [
      'આંખની તપાસ પ્રક્રિયા',
      'નિદાન અને સારવાર અંગેની સમજૂતી',
      'આંખની સંભાળ સેવાઓની ગુણવત્તા'
    ],
    physiotherapy: 'ફિઝિયોથેરાપી સેવાઓ',
    physiotherapyQuestions: [
      'કસરત અને સારવાર યોજનાની સમજૂતી',
      'થેરાપી સત્રોની અસરકારકતા',
      'સારવારથી અનુભવાયેલ સુધારો'
    ],
    pharmacy: 'ફાર્મસી સેવાઓ',
    pharmacyQuestions: [
      'લખેલી દવાઓની ઉપલબ્ધતા',
      'દવાના ઉપયોગ અંગે માર્ગદર્શન'
    ],
    package: 'હેલ્થ ચેક-અપ પેકેજ',
    packageQuestions: [
      'વિભાગો વચ્ચે સંકલન',
      'એકંદર પ્રક્રિયાની સરળતા',
      'અપેક્ષિત સમયમાં પેકેજ પૂર્ણ થવું'
    ],
    dayCare: 'ડે કેર સેવાઓ',
    dayCareQuestions: [
      'દાખલ થવાની પ્રક્રિયા',
      'રોકાણ દરમિયાન આરામ',
      'મોનિટરિંગ અને આપેલી સંભાળ',
      'ડિસ્ચાર્જ પ્રક્રિયા'
    ],
    dental: 'ડેન્ટલ સેવાઓ (Dental)',
    dentalQuestions: [
      'દાંતની સમસ્યા અને સારવાર અંગેની સમજૂતી',
      'ડેન્ટલ સારવાર દરમિયાન આરામ',
      'પ્રક્રિયા દરમિયાન દુખાવાનું સંચાલન',
      'ડેન્ટલ સારવાર દરમિયાન સ્વચ્છતા અને સફાઈ'
    ],
    ipdFeedback: 'IPD (ઇનપેશન્ટ) પ્રતિસાદ',
    ipdQuestions: [
      'દાખલ થવાની પ્રક્રિયા',
      'ડોક્ટરની સંભાળ અને વાતચીત',
      'નર્સિંગ કેર અને પ્રતિભાવ',
      'તપાસ અને નિદાન સેવાઓ',
      'રૂમની સુખ-સુવિધા અને સ્વચ્છતા',
      'ખોરાકની ગુણવત્તા અને સેવા',
      'ડિસ્ચાર્જ પ્રક્રિયા અને સૂચનાઓ'
    ],
    overallSat: 'એકંદરે સંતોષ:',
    overallSatDesc: 'કૃપા કરીને પૂરી પાડવામાં આવેલ આરોગ્ય સંભાળ સેવાઓની ગુણવત્તાનું રેટિંગ આપો',
    appreciate: 'સ્ટાફ સભ્ય કે જેની તમે પ્રશંસા કરવા માંગો છો:',
    suggestions: 'સુધારણા માટેનાં સૂચનો / ટિપ્પણીઓ:',
    consent: 'હું કેન્દ્ર દ્વારા ઉપરોક્ત પ્રતિસાદના ઉપયોગ સાથે સંમત છું:',
    yes: 'હા',
    no: 'ના',
    contactNo: 'સંપર્ક નંબર',
    emailId: 'ઈમેલ આઈડી',
    signature: 'સહી',
    thankYou: '** આભાર **'
  }
}

export function FeedbackPrintForm({
  patient,
  services,
  lang = 'en',
}: {
  patient?: Patient
  services: string[]
  lang?: 'en' | 'hi' | 'gu'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  // Determine date, time, location
  const dateStr = patient ? new Date().toLocaleDateString('en-GB') : ''
  const timeStr = patient ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''
  const locationStr = patient ? (patient.city || 'Ahmedabad') : ''

  // Determine service availed type
  const isHomecare = services.some(s => s.toLowerCase().includes('home'))
  const isIPD = patient?.careType === 'IPD' || services.some(s => s.toUpperCase().includes('IPD'))
  const hasOPDService = services.some(s => 
    ['Doctor Consultation', 'Pathology', 'Radiology', 'Cardiology', 'Pulmonology', 'Dental', 'Ophthalmology', 'Physiotherapy', 'Pharmacy', 'Package', 'Day Care'].some(opd => s.includes(opd))
  )
  const isOPD = (!isHomecare && !isIPD) || hasOPDService

  return (
    <div className="mx-auto w-full max-w-[210mm] bg-white p-6 text-black shadow-sm print:max-w-none print:p-0 print:shadow-none font-sans text-xs">

      {/* Letterhead Logo Header */}
      <header className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Image
              src="/es-logo.jpg"
              alt="ES Healthcare Centre logo"
              width={40}
              height={40}
              className="size-9 object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">ES Healthcare Centre</h1>
            <p className="text-[10px] font-semibold text-teal-700 tracking-wide mt-0.5">
              {t.title}
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-600 font-mono">
          <p className="font-semibold">📞 +917961616161.</p>
          <p className="hover:underline">https://eshealthcarecentre.in/</p>
        </div>
      </header>

      {/* Patient info boxes */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-2 mb-4 border border-slate-200 rounded p-3 bg-slate-50/50">
        <FieldRow label={t.patientName} value={patient?.name} />
        <FieldRow label={t.date} value={dateStr} />
        <FieldRow label={t.time} value={timeStr} />
        <FieldRow label={t.uhid} value={patient?.uhid} />
        <FieldRow label={t.location} value={locationStr} />
        <div className="flex items-baseline gap-2">
          <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">{t.ageGender}</span>
          <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">
            {patient ? `${patient.age} / ${patient.gender}` : '____________________'}
          </span>
        </div>
        <div className="col-span-3">
          <FieldRow label={t.services} value={services.length ? services.join(', ') : undefined} />
        </div>
      </div>

      {/* How did you hear & Reference By section */}
      <div className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-4 mb-4">
        {/* How did you hear */}
        <div>
          <h3 className="font-bold text-slate-800 mb-2">{t.howDidYouHear}</h3>
          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
            <div className="flex items-center"><EmptyBox /> {t.familyFriends}</div>
            <div className="flex items-center"><EmptyBox /> {t.socialMedia}</div>
            <div className="flex items-center"><EmptyBox /> {t.magazineNewspaper}</div>
            <div className="flex items-center"><EmptyBox /> {t.googleSearch}</div>
            <div className="flex items-center"><EmptyBox /> {t.website}</div>
            <div className="flex items-center"><EmptyBox /> {t.other}_____________</div>
          </div>
        </div>
        {/* Reference By */}
        <div>
          <h3 className="font-bold text-slate-800 mb-2">{t.referenceBy}</h3>
          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
            <div className="flex items-center"><EmptyBox /> {t.doctor}</div>
            <div className="flex items-center"><EmptyBox /> {t.campsCommunity}</div>
            <div className="flex items-center"><EmptyBox /> {t.corporateTieup}</div>
            <div className="flex items-center"><EmptyBox /> {t.insuranceTpa}</div>
            <div className="flex items-center"><EmptyBox /> {t.existingPatient}</div>
            <div className="flex items-center"><EmptyBox /> {t.other}____________</div>
          </div>
        </div>
      </div>

      {/* Type of Service Availed */}
      <div className="border-b border-slate-200 pb-3 mb-4 flex items-center gap-6">
        <span className="font-bold text-slate-800">{t.typeOfService}</span>
        <div className="flex items-center gap-6 text-[11px]">
          <span className="flex items-center"><EmptyCircle checked={isHomecare} /> {t.homeCareServices}</span>
          <span className="flex items-center"><EmptyCircle checked={isOPD} /> {t.opd}</span>
          <span className="flex items-center"><EmptyCircle checked={isIPD} /> {t.ipd}</span>
        </div>
      </div>

      {/* General Experience Table (Seen by all) */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 mb-2">{t.generalExp}</h3>
        <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 p-2 w-1/2">{t.particulars}</th>
              {t.ratingLabels.map(r => (
                <th key={r} className="border border-slate-300 p-2 text-center font-semibold w-16">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.generalQuestions.map(q => (
              <tr key={q}>
                <td className="border border-slate-300 p-2 font-medium text-slate-700">{q}</td>
                {t.ratingLabels.map(r => (
                  <td key={r} className="border border-slate-300 p-2 text-center">
                    <EmptyBox />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service-Specific Conditional Questionnaires */}
      {isHomecare && (
        <div className="mb-4 border-t border-slate-300 pt-3 break-inside-avoid">
          <h3 className="font-bold text-slate-800 mb-1">{t.homeHealthcare}</h3>

          {/* Services availed sub list */}
          <div className="mb-2 bg-slate-50 p-2 rounded">
            <span className="font-semibold text-slate-700 block mb-1">{t.servicesAvailed}</span>
            <div className="grid grid-cols-4 gap-y-1 text-[10px]">
              {Object.entries(t.homeServicesMap).map(([rawKey, translatedLabel]) => (
                <div key={rawKey} className="flex items-center">
                  <EmptyBox checked={services.includes(rawKey)} /> {translatedLabel}
                </div>
              ))}
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 w-1/2">{t.homeExp}</th>
                {t.ratingLabels.map(r => (
                  <th key={r} className="border border-slate-300 p-2 text-center font-semibold w-16">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.homeQuestions.map(q => (
                <tr key={q}>
                  <td className="border border-slate-300 p-2 font-medium text-slate-700">{q}</td>
                  {t.ratingLabels.map(r => (
                    <td key={r} className="border border-slate-300 p-2 text-center"><EmptyBox /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOPD && (
        <div className="mb-4 border-t border-slate-300 pt-3 space-y-4">
          <h3 className="font-bold text-slate-800">{t.opdFeedback}</h3>

          {/* Doctor Consultation */}
          {services.some(s => s.includes('Doctor Consultation') || s.includes('Consultation')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.doctorConsultation}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.doctorQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pathology */}
          {services.some(s => s.includes('Pathology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.pathology}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.pathologyQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Radiology */}
          {services.some(s => s.includes('Radiology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.radiology}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.radiologyQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cardiology */}
          {services.some(s => s.includes('Cardiology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.cardiology}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.cardiologyQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pulmonology */}
          {services.some(s => s.includes('Pulmonology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.pulmonology}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.pulmonologyQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ophthalmology */}
          {services.some(s => s.includes('Ophthalmology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.ophthalmology}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.ophthalmologyQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Physiotherapy */}
          {services.some(s => s.includes('Physiotherapy')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.physiotherapy}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.physiotherapyQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pharmacy Services */}
          {services.some(s => s.includes('Pharmacy')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.pharmacy}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.pharmacyQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Health Check-up Package */}
          {services.some(s => s.includes('Package') || s.includes('Check-up')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.package}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.packageQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Day Care Services */}
          {services.some(s => s.includes('Day Care')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.dayCare}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.dayCareQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Dental Services */}
          {services.some(s => s.toLowerCase().includes('dental')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">{t.dental}</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {t.dentalQuestions.map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {t.ratingLabels.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
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
        <div className="mb-4 border-t border-slate-300 pt-3 break-inside-avoid">
          <h3 className="font-bold text-slate-800 mb-2">{t.ipdFeedback}</h3>
          <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
            <tbody>
              {t.ipdQuestions.map(q => (
                <tr key={q}>
                  <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                  {t.ratingLabels.map(r => (
                    <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer seen by all */}
      <div className="mt-4 border-t border-slate-300 pt-3 break-inside-avoid space-y-3">
        {/* Overall satisfaction */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800">{t.overallSat}</span>
          <span className="text-[10px] text-slate-600">{t.overallSatDesc}</span>
          <div className="flex items-center gap-3 ml-2">
            {[1, 2, 3, 4, 5].map(num => (
              <span key={num} className="flex items-center font-semibold"><EmptyBox /> {num}</span>
            ))}
          </div>
        </div>

        {/* Appreciation line */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-slate-800 whitespace-nowrap">{t.appreciate}</span>
          <BlankLine className="flex-1" />
        </div>

        {/* Suggestions */}
        <div className="flex items-start gap-2">
          <span className="font-bold text-slate-800 whitespace-nowrap pt-1">{t.suggestions}</span>
          <div className="flex-1 flex flex-col gap-3">
            <BlankLine className="w-full h-4" />
            <BlankLine className="w-full h-4" />
          </div>
        </div>

        {/* Consent usage */}
        <div className="flex items-center gap-4 py-1">
          <span className="font-bold text-slate-800 uppercase">{t.consent}</span>
          <span className="flex items-center"><EmptyBox /> {t.yes}</span>
          <span className="flex items-center"><EmptyBox /> {t.no}</span>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-4 text-[10px]">
          <div>
            <BlankLine className="w-full h-4" />
            <div className="mt-1 font-semibold text-slate-700">{t.contactNo}</div>
          </div>
          <div>
            <BlankLine className="w-full h-4" />
            <div className="mt-1 font-semibold text-slate-700">{t.emailId}</div>
          </div>
          <div>
            <BlankLine className="w-full h-4" />
            <div className="mt-1 font-semibold text-slate-700">{t.signature}</div>
          </div>
        </div>
      </div>

      <footer className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] font-bold text-teal-800 uppercase tracking-widest break-inside-avoid">
        {t.thankYou}
      </footer>
    </div>
  )
}
