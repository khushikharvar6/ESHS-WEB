"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PricingInitializationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingInitializationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PricingInitializationService = PricingInitializationService_1 = class PricingInitializationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PricingInitializationService_1.name);
    }
    async onModuleInit() {
        this.initializeAllPrices().catch(err => this.logger.error('Failed to initialize pricing data:', err));
    }
    async initializeAllPrices() {
        this.logger.log('🔄 Initializing ES Healthcare Centre pricing data...');
        await this.initializeTestMaster();
        await this.initializeServiceMaster();
        await this.initializePackages();
        await this.initializeDoctors();
        this.logger.log('✅ All pricing data initialized successfully!');
    }
    async initializeTestMaster() {
        this.logger.log('  📋 Upserting TestMaster records...');
        const count = await this.prisma.testMaster.count();
        if (count >= 280) {
            this.logger.log('  ✅ TestMaster records already initialized. Skipping.');
            return;
        }
        const tests = [
            { category: 'Pathology', subcategory: null, serviceType: 'Hematology', department: 'PATHOLOGY', name: 'CBC - Complete Blood Count', price: 315 },
            { category: 'Pathology', subcategory: null, serviceType: 'Hematology', department: 'PATHOLOGY', name: 'Platelet Count', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Hematology', department: 'PATHOLOGY', name: 'Total Count Wbc', price: 160 },
            { category: 'Pathology', subcategory: null, serviceType: 'Hematology', department: 'PATHOLOGY', name: 'Hemoglobin', price: 130 },
            { category: 'Pathology', subcategory: null, serviceType: 'Hematology', department: 'PATHOLOGY', name: 'ESR', price: 110 },
            { category: 'Pathology', subcategory: null, serviceType: 'Hematology', department: 'PATHOLOGY', name: 'Blood Group & RH Factor', price: 200 },
            { category: 'Pathology', subcategory: null, serviceType: 'Diabetic', department: 'PATHOLOGY', name: 'Random Blood Glucose (RBG)', price: 80 },
            { category: 'Pathology', subcategory: null, serviceType: 'Diabetic', department: 'PATHOLOGY', name: 'FBG Fasting Blood Glucose(FBG)', price: 80 },
            { category: 'Pathology', subcategory: null, serviceType: 'Diabetic', department: 'PATHOLOGY', name: 'Post Prandial Blood Glucose(PP2BG)', price: 80 },
            { category: 'Pathology', subcategory: null, serviceType: 'Diabetic', department: 'PATHOLOGY', name: 'Glycosylated Hemoglobin (Hba1C)', price: 600 },
            { category: 'Pathology', subcategory: null, serviceType: 'Thyroid', department: 'PATHOLOGY', name: 'T3 Triodothyronine', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Thyroid', department: 'PATHOLOGY', name: 'T4 Thyroxine', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Thyroid', department: 'PATHOLOGY', name: 'TSH Thyroid Stimulating Hormone', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Thyroid', department: 'PATHOLOGY', name: 'Thyroid Function Test (TFT)', price: 600 },
            { category: 'Pathology', subcategory: null, serviceType: 'Heart', department: 'PATHOLOGY', name: 'Lipid Profile', price: 700 },
            { category: 'Pathology', subcategory: null, serviceType: 'Heart', department: 'PATHOLOGY', name: 'Triglyceride', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Heart', department: 'PATHOLOGY', name: 'Cholesterol', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Heart', department: 'PATHOLOGY', name: 'Cholesterol/HDL Ratio', price: 260 },
            { category: 'Pathology', subcategory: null, serviceType: 'Heart', department: 'PATHOLOGY', name: 'LDL Direct', price: 420 },
            { category: 'Pathology', subcategory: null, serviceType: 'Heart', department: 'PATHOLOGY', name: 'HDL Cholesterol Hdlc', price: 330 },
            { category: 'Pathology', subcategory: null, serviceType: 'Liver', department: 'PATHOLOGY', name: 'Liver Function Test', price: 1000 },
            { category: 'Pathology', subcategory: null, serviceType: 'Liver', department: 'PATHOLOGY', name: 'S.Albumin', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Liver', department: 'PATHOLOGY', name: 'S.Bilirubin', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Liver', department: 'PATHOLOGY', name: 'Alkaline Phosphatase', price: 320 },
            { category: 'Pathology', subcategory: null, serviceType: 'Liver', department: 'PATHOLOGY', name: 'SGOT (Ast)', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Liver', department: 'PATHOLOGY', name: 'SGPT (Alt)', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Liver', department: 'PATHOLOGY', name: 'Total Protein (Albumin/Globulin)', price: 910 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'Renal Profile', price: 900 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'S. Createnine', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'S.Uric Acid', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'Blood Urea', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'S. Calcium', price: 250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'Chloride', price: 260 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'Sodium', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'Potassium', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'Blood Urea Nitrogen', price: 260 },
            { category: 'Pathology', subcategory: null, serviceType: 'Kidney', department: 'PATHOLOGY', name: 'BUN Creatinine Ratio Serum', price: 470 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Urine Routine Examination', price: 200 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Stool Routine Examination', price: 200 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Stool Occult Blood', price: 160 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Prothrombin Time - PT', price: 210 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Clotting Time', price: 110 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Bleeding Time', price: 110 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Hbsag Rapid', price: 260 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'HIV 1 and 2', price: 600 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Rpr Rapid Plasma Reagin Test(Syphilis)', price: 260 },
            { category: 'Pathology', subcategory: null, serviceType: 'Viral Marker', department: 'PATHOLOGY', name: 'C- Reactive Protein - CRP', price: 520 },
            { category: 'Pathology', subcategory: null, serviceType: 'Viral Marker', department: 'PATHOLOGY', name: 'Widal Slide', price: 110 },
            { category: 'Pathology', subcategory: null, serviceType: 'Viral Marker', department: 'PATHOLOGY', name: 'Widal Titre', price: 300 },
            { category: 'Pathology', subcategory: null, serviceType: 'Viral Marker', department: 'PATHOLOGY', name: 'Mp By QBC', price: 400 },
            { category: 'Pathology', subcategory: null, serviceType: 'Viral Marker', department: 'PATHOLOGY', name: 'Mp By Card', price: 200 },
            { category: 'Pathology', subcategory: null, serviceType: 'Viral Marker', department: 'PATHOLOGY', name: 'PS For Mp', price: 160 },
            { category: 'Pathology', subcategory: null, serviceType: 'Viral Marker', department: 'PATHOLOGY', name: 'Peripheral Smear Examination', price: 260 },
            { category: 'Pathology', subcategory: null, serviceType: 'Vitamins', department: 'PATHOLOGY', name: 'Vitamin D3', price: 1250 },
            { category: 'Pathology', subcategory: null, serviceType: 'Vitamins', department: 'PATHOLOGY', name: 'B12 Level', price: 850 },
            { category: 'Pathology', subcategory: null, serviceType: null, department: 'PATHOLOGY', name: 'Electrolytes (Na K Cl)', price: 750 },
            ...this.getXrayRecords(),
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Whole Abdomen', price: 1800 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Upper Abdomen', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Pelvis Lower Abdomen', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Kub', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Neck', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Local Part', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Breast B/L', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Trans Rectal', price: 2000 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Scrotum', price: 2000 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Both Inguino Scrotal Region', price: 2000 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Singal Joints', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Chest', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Thorax', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Soft Part', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Unilateral Shoulder', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Both Axillary Regions', price: 2000 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Orbit', price: 1500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG TVS', price: 900 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Ovulation Follicular Study', price: 2000 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Antenatal Routine', price: 2000 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Antenatal Early -12 Weeks', price: 2500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Antenatal Anomaly Scan', price: 3500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Antenatal Anomaly Twins', price: 4500 },
            { category: 'Radiology', subcategory: 'usg', serviceType: null, department: 'RADIOLOGY', name: 'USG Antenatal 3D - 4D', price: 2500 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Both Lower Limb Arterial and Venous Doppler', price: 5400 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Right Lower Limb Arterial and Venous Doppler', price: 3000 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Right Lower Limb Venous Doppler', price: 1500 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Right Lower Limb Arterial Doppler', price: 1500 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Left Lower Limb Arterial and Venous Doppler', price: 3000 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Left Lower Limb Venous Doppler', price: 1500 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Left Lower Limb Arterial Doppler', price: 1500 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Both Lower Limb Venous Doppler', price: 2700 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Both Lower Limb Arterial Doppler', price: 2700 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Renal Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Renal Veins Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Pelvic Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Neck Veins Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Portal Venous Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Hepatic Veins Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Pregnancy With Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Iliac Vessels Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Aorta Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'doppler', serviceType: null, department: 'RADIOLOGY', name: 'Carotid Doppler', price: 1800 },
            { category: 'Radiology', subcategory: 'mammo', serviceType: null, department: 'RADIOLOGY', name: 'Bilateral Mammography with USG', price: 2000 },
            { category: 'Radiology', subcategory: 'mammo', serviceType: null, department: 'RADIOLOGY', name: 'Unilateral Mammography with USG', price: 1200 },
            { category: 'Cardiology', subcategory: null, serviceType: null, department: 'CARDIOLOGY', name: 'ECG', price: 250 },
            { category: 'Cardiology', subcategory: null, serviceType: null, department: 'CARDIOLOGY', name: '2D Echo-Physician', price: 1800 },
            { category: 'Cardiology', subcategory: null, serviceType: null, department: 'CARDIOLOGY', name: '2D Echo-Cardiologist', price: 3000 },
            { category: 'Cardiology', subcategory: null, serviceType: null, department: 'CARDIOLOGY', name: 'TMT- Physician', price: 1000 },
            { category: 'Cardiology', subcategory: null, serviceType: null, department: 'CARDIOLOGY', name: 'TMT- Cardiologist', price: 1500 },
            { category: 'Physiotherapy', subcategory: null, serviceType: null, department: 'PHYSIOTHERAPY', name: '1st consultation', price: 700 },
            { category: 'Physiotherapy', subcategory: null, serviceType: null, department: 'PHYSIOTHERAPY', name: 'Any physio treatment / sitting', price: 500 },
            { category: 'Physiotherapy', subcategory: null, serviceType: null, department: 'PHYSIOTHERAPY', name: 'Home consultation', price: 1200 },
            { category: 'Physiotherapy', subcategory: null, serviceType: null, department: 'PHYSIOTHERAPY', name: 'Online Consulting', price: 650 },
            { category: 'Misc', subcategory: null, serviceType: 'ENT Procedure', department: 'DOCTOR_CONSULTATION', name: 'Audiometry', price: 500 },
            { category: 'Misc', subcategory: null, serviceType: 'Pulmonology', department: 'PULMONOLOGY', name: 'PFT (Pre and Post)', price: 1200 },
            { category: 'Misc', subcategory: null, serviceType: 'Pulmonology', department: 'PULMONOLOGY', name: 'PFT', price: 600 },
        ];
        let upserted = 0;
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const testId = `TEST${(i + 1).toString().padStart(3, '0')}`;
            await this.prisma.testMaster.upsert({
                where: {
                    name_category: { name: test.name, category: test.category },
                },
                update: {
                    price: test.price,
                    department: test.department,
                    subcategory: test.subcategory,
                    serviceType: test.serviceType,
                    sourceUrl: 'https://eshealth.in/',
                },
                create: {
                    id: testId,
                    itemType: 'TEST',
                    category: test.category,
                    subcategory: test.subcategory,
                    serviceType: test.serviceType,
                    department: test.department,
                    name: test.name,
                    price: test.price,
                    taxRate: 0,
                    sourceUrl: 'https://eshealth.in/',
                },
            });
            upserted++;
        }
        this.logger.log(`  ✅ TestMaster: ${upserted} records upserted`);
    }
    getXrayRecords() {
        const xrays = [
            { name: 'X Ray Chest PA', price: 400 },
            { name: 'X Ray Chest Ap', price: 400 },
            { name: 'X Ray Kub', price: 400 },
            { name: 'X Ray Abdomen', price: 400 },
            { name: 'X Ray L S Spine Ap', price: 400 },
            { name: 'X Ray L S Spine Ap Lat', price: 400 },
            { name: 'X Ray Cervical Spine Ap Lat', price: 400 },
            { name: 'X Ray L S Spine Lat Flex Ext', price: 400 },
            { name: 'X Ray Whole Limb', price: 400 },
            { name: 'X Ray Both Wrist Ap Lat', price: 800 },
            { name: 'X Ray Both Wrist Lat', price: 400 },
            { name: 'X Ray Both Wrist Ap', price: 400 },
            { name: 'X Ray Wrist Ap Scaphoid View', price: 400 },
            { name: 'X Ray Lt Wrist Joint Lat', price: 400 },
            { name: 'X Ray Lt Wrist Joint Ap Lat', price: 400 },
            { name: 'X Ray Lt Wrist Joint Ap', price: 400 },
            { name: 'X Ray Rt Wrist Joint Lat', price: 400 },
            { name: 'X Ray Rt Wrist Joint Ap Lat', price: 400 },
            { name: 'X Ray Rt Wrist Joint Ap', price: 400 },
            { name: 'X Ray Lt Finger Ap Oblique Lat', price: 400 },
            { name: 'X Ray Lt Hand Ap Lat Oblique', price: 400 },
            { name: 'X Ray Lt Hand Oblique', price: 400 },
            { name: 'X Ray Lt Hand Lat', price: 400 },
            { name: 'X Ray Lt Hand Ap Oblique', price: 400 },
            { name: 'X Ray Lt Forearm R U With Wrist Ap Lat', price: 400 },
            { name: 'X Ray Lt Forearm R U Oblique', price: 400 },
            { name: 'X Ray Lt Forearm R U Ap Lat', price: 400 },
            { name: 'X Ray Lt Elbow With Forearm R U With Wrist Ap Lat', price: 400 },
            { name: 'X Ray Lt Elbow Lat', price: 400 },
            { name: 'X Ray Lt Elbow Ap Lat', price: 400 },
            { name: 'X Ray Lt Elbow Ap', price: 400 },
            { name: 'X Ray Lt Scapula Ap', price: 400 },
            { name: 'X Ray Lt Clavicle With Shoulder Ap', price: 400 },
            { name: 'X Ray Lt Shoulder With Arm Ap', price: 400 },
            { name: 'X Ray Lt Shoulder Lat', price: 400 },
            { name: 'X Ray Lt Shoulder Axial', price: 400 },
            { name: 'X Ray Lt Shoulder Ap', price: 400 },
            { name: 'X Ray Rt Finger Ap Oblique Lat', price: 400 },
            { name: 'X Ray Rt Hand Ap Lat Oblique', price: 400 },
            { name: 'X Ray Rt Hand Oblique', price: 400 },
            { name: 'X Ray Rt Hand Lat', price: 400 },
            { name: 'X Ray Rt Hand Ap Oblique', price: 400 },
            { name: 'X Ray Rt Forearm R U With Wrist Ap Lat', price: 400 },
            { name: 'X Ray Rt Forearm R U Oblique', price: 400 },
            { name: 'X Ray Rt Forearm R U Ap Lat', price: 400 },
            { name: 'X Ray Rt Elbow With Forearm R U With Wrist Ap Lat', price: 400 },
            { name: 'X Ray Rt Elbow Lat', price: 400 },
            { name: 'X Ray Rt Elbow Ap Lat', price: 400 },
            { name: 'X Ray Rt Elbow Ap', price: 400 },
            { name: 'X Ray Rt Scapula Ap', price: 400 },
            { name: 'X Ray Rt Clavicle With Shoulder Ap', price: 400 },
            { name: 'X Ray Lt Clavicle Ap', price: 400 },
            { name: 'X Ray Rt Shoulder With Arm Ap', price: 400 },
            { name: 'X Ray Rt Shoulder Lat', price: 400 },
            { name: 'X Ray Rt Shoulder Axial', price: 400 },
            { name: 'X Ray Rt Shoulder Ap', price: 400 },
            { name: 'X Ray Both Knee Lat Standing', price: 400 },
            { name: 'X Ray Both Knee Ap Standing', price: 400 },
            { name: 'X Ray Both Calcaceum Ap Lateral View', price: 800 },
            { name: 'X Ray X Ray Both Ankle Ap Lat', price: 800 },
            { name: 'X Ray Lt Foot Oblique', price: 400 },
            { name: 'X Ray Lt Foot Lat', price: 400 },
            { name: 'X Ray Lt Foot Ap Oblique', price: 400 },
            { name: 'X Ray Lt Foot Ap Lat', price: 400 },
            { name: 'X Ray Lt Foot Ap', price: 400 },
            { name: 'X Ray LT Calcaneum Lat and Axial', price: 400 },
            { name: 'X Ray Lt Calcaneum Lat', price: 400 },
            { name: 'X Ray Lt Calcaneum Axial', price: 400 },
            { name: 'X Ray Lt Ankle Oblique', price: 400 },
            { name: 'X Ray Lt Ankle Lat', price: 400 },
            { name: 'X Ray Lt Ankle Ap Lat', price: 400 },
            { name: 'X Ray Lt Ankle Ap', price: 400 },
            { name: 'X Ray Lt Leg T F Lat', price: 400 },
            { name: 'X Ray Lt Leg T F Ap Lat', price: 400 },
            { name: 'X Ray Lt Leg T F Ap', price: 400 },
            { name: 'X Ray Lt Knee With T F Ap Lat', price: 400 },
            { name: 'X Ray Lt Patella Lat', price: 400 },
            { name: 'X Ray Lt Patella Ap Lat', price: 400 },
            { name: 'X Ray Lt Patella Ap', price: 400 },
            { name: 'X Ray Lt Knee Lat', price: 400 },
            { name: 'X Ray Lt Knee Ap', price: 400 },
            { name: 'X Ray Lt Knee With Femur Lat', price: 400 },
            { name: 'X Ray Lt Knee With Femur Ap Lat', price: 400 },
            { name: 'X Ray Lt Thigh Femur Lat', price: 400 },
            { name: 'X Ray Lt Thigh Femur Ap Lat', price: 400 },
            { name: 'X Ray Lt Thigh Femur Ap', price: 400 },
            { name: 'X Ray Lt Hip Lat', price: 400 },
            { name: 'X Ray Lt Hip Ap Lat', price: 400 },
            { name: 'X Ray Lt Hip Ap', price: 400 },
            { name: 'X Ray Rt Foot Oblique', price: 400 },
            { name: 'X Ray Rt Foot Lat', price: 400 },
            { name: 'X Ray Rt Foot Ap Oblique', price: 400 },
            { name: 'X Ray Rt Foot Ap Lat', price: 400 },
            { name: 'X Ray Rt Foot Ap', price: 400 },
            { name: 'X Ray RT Calcaneum Lat and Axial', price: 400 },
            { name: 'X Ray Rt Calcaneum Lat', price: 400 },
            { name: 'X Ray Rt Calcaneum Axial', price: 400 },
            { name: 'X Ray Rt Ankle Oblique', price: 400 },
            { name: 'X Ray Rt Ankle Lat', price: 400 },
            { name: 'X Ray Rt Ankle Ap Lat', price: 400 },
            { name: 'X Ray Rt Ankle Ap', price: 400 },
            { name: 'X Ray Rt Leg TF Lat', price: 400 },
            { name: 'X Ray Rt Leg T F Ap', price: 400 },
            { name: 'X Ray Rt Leg T F Ap Lat', price: 400 },
            { name: 'X Ray Rt Patella Lat', price: 400 },
            { name: 'X Ray Rt Patella Ap Lat', price: 400 },
            { name: 'X Ray Rt Patella Ap', price: 400 },
            { name: 'X Ray Rt Knee Lat', price: 400 },
            { name: 'X Ray Rt Knee Ap', price: 400 },
            { name: 'X Ray Rt Knee With Femur Ap', price: 400 },
            { name: 'X Ray Rt Knee With Femur Lat', price: 400 },
            { name: 'X Ray Lt Knee With Femur Ap', price: 400 },
            { name: 'X Ray Rt Thigh Femur Lat', price: 400 },
            { name: 'X Ray Rt Thigh Femur Ap Lat', price: 400 },
            { name: 'X Ray Rt Thigh Femur Ap', price: 400 },
            { name: 'X Ray Rt Hip Lat', price: 400 },
            { name: 'X Ray Rt Hip Ap Lat', price: 400 },
            { name: 'X Ray Rt Hip Ap', price: 400 },
            { name: 'X Ray Si Joint', price: 400 },
            { name: 'X Ray Frog Leg View', price: 400 },
            { name: 'X Ray Pbh Ap', price: 400 },
            { name: 'X Ray Pbh Outlet', price: 400 },
            { name: 'X Ray Pbh Inlet', price: 400 },
            { name: 'X Ray Both Nasal Bone Lateral View', price: 400 },
            { name: 'X Ray Pns', price: 400 },
            { name: 'X Ray Orbit Ap', price: 400 },
            { name: 'X Ray Mandible Lat', price: 400 },
            { name: 'X Ray Mandible Ap Lat', price: 800 },
            { name: 'X Ray Mandible Ap', price: 400 },
            { name: 'X Ray Rt Mastoids Lat', price: 400 },
            { name: 'X Ray Soft Tissue Neck Lat', price: 400 },
            { name: 'X Ray Soft Tissue Neck Ap Lat', price: 800 },
            { name: 'X Ray Soft Tissue Neck Ap', price: 400 },
            { name: 'X Ray Skull Zygomatic Arch', price: 400 },
            { name: 'X Ray Skull Towns View', price: 400 },
            { name: 'X Ray Skull Lat', price: 400 },
            { name: 'X Ray Skull CaldwellS View For Orbit', price: 400 },
            { name: 'X Ray Skull Ap Lat', price: 800 },
            { name: 'X Ray Skull Ap', price: 400 },
            { name: 'X Ray Sacrum Lat', price: 400 },
            { name: 'X Ray Sacrum Ap', price: 400 },
            { name: 'X Ray Coccyx Lat', price: 400 },
            { name: 'X Ray Coccyx Ap Lat', price: 800 },
            { name: 'X Ray Coccyx Ap', price: 400 },
            { name: 'X Ray L S Spine Lat', price: 400 },
            { name: 'X Ray D L Spine Lat', price: 400 },
            { name: 'X Ray D L Spine Ap', price: 400 },
            { name: 'X Ray Cl C2 Open Mouth', price: 400 },
            { name: 'X Ray Cervical Spine Lat', price: 400 },
            { name: 'X Ray Cervical Spine Ap', price: 400 },
            { name: 'X Ray Chest Lordotic View', price: 400 },
            { name: 'X Ray Chest Pa Lat', price: 800 },
            { name: 'X Ray Rt Knee With T F Ap Lat', price: 500 },
            { name: 'X Ray Rt Knee With Femur Ap Lat', price: 500 },
            { name: 'X Ray Rt Hip With Femur Ap Lat', price: 500 },
            { name: 'X Ray Rt Clavicle Ap', price: 500 },
            { name: 'X Ray Rt Shoulder Ap Lat', price: 400 },
            { name: 'X Ray Lt Shoulder Ap Lat', price: 400 },
            { name: 'X Ray Lt Hip With Femur Ap Lat', price: 400 },
            { name: 'X Ray D L Spine Ap Lat', price: 800 },
            { name: 'X Ray C S Spine Lat Flex Ext Neutral', price: 1200 },
            { name: 'X Ray D S Spine Lat Flex Ext Neutral', price: 1200 },
            { name: 'X Ray L S Spine Lat Flex Ext Neutral', price: 1200 },
            { name: 'X Ray C S Spine Lat Flex Ext', price: 800 },
            { name: 'X Ray D S Spine Lat Flex Ext', price: 800 },
            { name: 'X Ray Lower Limb X Ray', price: 400 },
            { name: 'X Ray Upper Limb X Ray', price: 400 },
            { name: 'X Ray Sternum Ap Lat', price: 800 },
            { name: 'X Ray Sternum Ap', price: 400 },
            { name: 'X Ray Both Patella Axial', price: 400 },
        ];
        return xrays.map((x) => ({
            category: 'Radiology',
            subcategory: 'xray',
            serviceType: null,
            department: 'RADIOLOGY',
            name: x.name,
            price: x.price,
        }));
    }
    async initializeServiceMaster() {
        this.logger.log('  📋 Upserting ServiceMaster records...');
        const services = [];
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            const serviceId = `SVC${(i + 1).toString().padStart(3, '0')}`;
            await this.prisma.serviceMaster.upsert({
                where: { department: service.department },
                update: { name: service.name, price: service.price },
                create: {
                    id: serviceId,
                    department: service.department,
                    name: service.name,
                    price: service.price,
                    taxRate: 0,
                },
            });
        }
        this.logger.log(`  ✅ ServiceMaster: ${services.length} records upserted`);
    }
    async initializePackages() {
        this.logger.log('  📋 Upserting PackageMaster records...');
        const packages = [
            {
                name: 'Diabetic Profile',
                price: 499,
                description: 'FBS, PPBS, HbA1c, Urine Routine & Micro',
                items: ['FBG Fasting Blood Glucose(FBG)', 'Post Prandial Blood Glucose(PP2BG)', 'Glycosylated Hemoglobin (Hba1C)', 'Urine Routine Examination'],
            },
            {
                name: 'Basic Profile',
                price: 899,
                description: 'CBC, FBS, PPBS, Lipid Profile, S.Creatinine, Urine Routine & Micro',
                items: ['CBC - Complete Blood Count', 'FBG Fasting Blood Glucose(FBG)', 'Post Prandial Blood Glucose(PP2BG)', 'Lipid Profile', 'S. Createnine', 'Urine Routine Examination'],
            },
            {
                name: 'Executive Profile',
                price: 1499,
                description: 'CBC, FBS, PPBS, Lipid Profile, SGPT, S.Creatinine, TSH, HbA1c, Urine Routine & Micro',
                items: ['CBC - Complete Blood Count', 'FBG Fasting Blood Glucose(FBG)', 'Post Prandial Blood Glucose(PP2BG)', 'Lipid Profile', 'SGPT (Alt)', 'S. Createnine', 'TSH Thyroid Stimulating Hormone', 'Glycosylated Hemoglobin (Hba1C)', 'Urine Routine Examination'],
            },
            {
                name: 'Comprehensive Profile',
                price: 3999,
                description: 'CBC, ESR, RFT, LFT, FBS, PPBS, HbA1c, Lipid Profile, Thyroid Profile, Vitamin B12, Vitamin-D3, Urine Routine & Micro',
                items: ['CBC - Complete Blood Count', 'ESR', 'Renal Profile', 'Liver Function Test', 'FBG Fasting Blood Glucose(FBG)', 'Post Prandial Blood Glucose(PP2BG)', 'Glycosylated Hemoglobin (Hba1C)', 'Lipid Profile', 'Thyroid Function Test (TFT)', 'B12 Level', 'Vitamin D3', 'Urine Routine Examination'],
            },
            {
                name: 'Basic Package',
                price: 1999,
                description: 'Basic health check package',
                items: ['CBC - Complete Blood Count', 'Lipid Profile', 'Liver Function Test', 'Urine Routine Examination'],
            },
            {
                name: 'Cardiac Package',
                price: 5999,
                description: 'Comprehensive cardiac evaluation',
                items: ['ECG', 'Lipid Profile', '2D Echo-Physician', 'CBC - Complete Blood Count'],
            },
            {
                name: "Well Women's Package",
                price: 6999,
                description: 'Complete women health screening',
                items: ['CBC - Complete Blood Count', 'Thyroid Function Test (TFT)', 'Lipid Profile', 'Liver Function Test', 'Urine Routine Examination', 'Vitamin D3'],
            },
            {
                name: 'Gold Package',
                price: 11999,
                description: 'Premium health check',
                items: ['CBC - Complete Blood Count', 'Lipid Profile', 'Liver Function Test', 'Renal Profile', 'Thyroid Function Test (TFT)', 'Glycosylated Hemoglobin (Hba1C)', 'Vitamin D3', 'B12 Level', 'ECG'],
            },
            {
                name: 'Diamond Package',
                price: 14999,
                description: 'Most comprehensive health evaluation',
                items: ['CBC - Complete Blood Count', 'Lipid Profile', 'Liver Function Test', 'Renal Profile', 'Thyroid Function Test (TFT)', 'Glycosylated Hemoglobin (Hba1C)', 'Vitamin D3', 'B12 Level', 'ECG', '2D Echo-Physician', 'USG Whole Abdomen'],
            },
        ];
        for (let i = 0; i < packages.length; i++) {
            const pkg = packages[i];
            const pkgId = `PKG${(i + 1).toString().padStart(3, '0')}`;
            const packageRecord = await this.prisma.packageMaster.upsert({
                where: { name: pkg.name },
                update: { price: pkg.price, description: pkg.description },
                create: {
                    id: pkgId,
                    name: pkg.name,
                    price: pkg.price,
                    description: pkg.description,
                    taxRate: 0,
                    sourceUrl: 'https://eshealthcarecentre.in/packages',
                },
            });
            await this.prisma.packageItem.deleteMany({
                where: { packageId: packageRecord.id },
            });
            let itemIndex = 1;
            for (const itemName of pkg.items) {
                const test = await this.prisma.testMaster.findFirst({
                    where: { name: itemName },
                });
                await this.prisma.packageItem.create({
                    data: {
                        id: `${packageRecord.id}-I${String(itemIndex++).padStart(3, '0')}`,
                        packageId: packageRecord.id,
                        testId: test?.id || null,
                        itemName: itemName,
                        quantity: 1,
                    },
                });
            }
        }
        this.logger.log(`  ✅ PackageMaster: ${packages.length} packages upserted with items`);
    }
    async initializeDoctors() {
        this.logger.log('  📋 Upserting Doctor records...');
        const doctors = [
            {
                firstName: 'Christian',
                lastName: 'Troy',
                fullName: 'Dr. Christian Troy',
                specialization: ['DOCTOR_CONSULTATION'],
                qualification: 'MBBS, MD (General Medicine)',
                experienceYears: 15,
                consultationFee: 500,
                followUpFee: 300,
            },
            {
                firstName: 'Lisa',
                lastName: 'Cuddy',
                fullName: 'Dr. Lisa Cuddy',
                specialization: ['DOCTOR_CONSULTATION'],
                qualification: 'MBBS, MD (Endocrinology)',
                experienceYears: 20,
                consultationFee: 800,
                followUpFee: 500,
            },
            {
                firstName: 'John',
                lastName: 'Watson',
                fullName: 'Dr. John Watson',
                specialization: ['CARDIOLOGY'],
                qualification: 'MBBS, DM (Cardiology)',
                experienceYears: 18,
                consultationFee: 1000,
                followUpFee: 600,
            },
            {
                firstName: 'Narendra',
                lastName: 'Shah',
                fullName: 'Dr. Narendra Shah',
                specialization: ['DOCTOR_CONSULTATION'],
                qualification: 'MBBS, MD',
                experienceYears: 25,
                consultationFee: 800,
                followUpFee: 600,
            },
            {
                firstName: 'Dushyant',
                lastName: 'Balat',
                fullName: 'Dr. Dushyant Balat',
                specialization: ['DOCTOR_CONSULTATION'],
                qualification: 'MBBS, MD',
                experienceYears: 22,
                consultationFee: 1600,
                followUpFee: 1200,
            },
        ];
        for (let i = 0; i < doctors.length; i++) {
            const doc = doctors[i];
            const docId = `DOC${(i + 1).toString().padStart(3, '0')}`;
            const existing = await this.prisma.doctor.findFirst({
                where: { fullName: doc.fullName },
            });
            if (existing) {
                await this.prisma.doctor.update({
                    where: { id: existing.id },
                    data: {
                        consultationFee: doc.consultationFee,
                        followUpFee: doc.followUpFee,
                        qualification: doc.qualification,
                        experienceYears: doc.experienceYears,
                        specialization: doc.specialization,
                    },
                });
            }
            else {
                await this.prisma.doctor.create({ data: { ...doc, id: docId } });
            }
        }
        this.logger.log(`  ✅ Doctors: ${doctors.length} records upserted`);
    }
};
exports.PricingInitializationService = PricingInitializationService;
exports.PricingInitializationService = PricingInitializationService = PricingInitializationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingInitializationService);
//# sourceMappingURL=pricing-initialization.service.js.map