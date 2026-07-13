const fs = require('fs');
let content = fs.readFileSync('src/config/testMaster.ts', 'utf-8');

// The array starts at export const ESHEALTH_TEST_MASTER
const dataStart = content.indexOf('[');
const dataEnd = content.lastIndexOf(']');
const arrayStr = content.substring(dataStart, dataEnd + 1);

// We need to parse this properly. It is JSON-like but might have some differences.
// Wait, in my previous view_file, it looks like valid JSON actually! Let's check.
let tests;
try {
  tests = eval(arrayStr);
} catch (e) {
  console.log("EVAL ERROR", e);
}

// mapping rules
tests.forEach(t => {
    let name = t.name.toLowerCase();
    
    // Default categories based on user instructions and common medical sense
    if (name.includes('cbc') || name.includes('esr') || name.includes('hemoglobin') || name.includes('platelet') || name.includes('wbc') || name.includes('bleeding time') || name.includes('clotting time') || name.includes('prothrombin')) {
        t.serviceType = 'Hematology';
    } else if (name.includes('hba1c') || name.includes('glucose') || name.includes('fbg') || name.includes('pp2bg') || name.includes('sugar')) {
        t.serviceType = 'Diabetes';
    } else if (name.includes('lipid') || name.includes('cholesterol') || name.includes('triglyceride') || name.includes('hdl') || name.includes('ldl')) {
        t.serviceType = 'Cardiology';
    } else if (name.includes('thyroid') || name.includes('tsh') || name.includes('t3') || name.includes('t4') || name.includes('tft')) {
        t.serviceType = 'Thyroid';
    } else if (name.includes('renal') || name.includes('creatinine') || name.includes('createnine') || name.includes('urea') || name.includes('uric acid') || name.includes('sodium') || name.includes('potassium') || name.includes('chloride') || name.includes('bun')) {
        t.serviceType = 'Nephrology';
    } else if (name.includes('liver') || name.includes('sgpt') || name.includes('sgot') || name.includes('bilirubin') || name.includes('alkaline phosphatase') || name.includes('albumin') || name.includes('protein') || name.includes('lft')) {
        t.serviceType = 'Hepatology';
    } else if (name.includes('vitamin') || name.includes('b12')) {
        t.serviceType = 'Nutrition';
    } else if (name.includes('urine') || name.includes('stool')) {
        t.serviceType = 'Pathology';
    } else if (name.includes('calcium') || name.includes('electrolytes')) {
        t.serviceType = 'Biochemistry';
    } else if (name.includes('hiv') || name.includes('hbsag') || name.includes('widal') || name.includes('crp') || name.includes('c- reactive') || name.includes('rpr') || name.includes('viral marker') || name.includes('mp by') || name.includes('smear')) {
        t.serviceType = 'Serology & Immunology';
    } else if (name.includes('usg') || name.includes('ultrasound') || name.includes('x-ray') || name.includes('scan')) {
        t.serviceType = 'Radiology';
    } else if (name.includes('echo') || name.includes('tmt') || name.includes('ecg')) {
        t.serviceType = 'Cardiology Diagnostics';
    } else if (!t.serviceType || t.serviceType === '0') {
        t.serviceType = 'General';
    }
});

const output = content.substring(0, dataStart) + JSON.stringify(tests, null, 2) + content.substring(dataEnd + 1);
fs.writeFileSync('src/config/testMaster.ts', output);
console.log('updated testMaster.ts');
