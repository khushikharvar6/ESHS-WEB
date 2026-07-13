const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    // Remove all prisma imports
    .replace(/import \{.*?\} from '@prisma\/client';\r?\n?/g, '')
    // Remove @IsEnum(...)
    .replace(/@IsEnum\([^)]+\)/g, "@IsString()")
    // Simplify @ApiProperty({ enum: ... }) to @ApiProperty()
    .replace(/@ApiProperty\(\{\s*enum:[^}]+(?:\}\))/g, "@ApiProperty()")
    .replace(/@ApiPropertyOptional\(\{\s*enum:[^}]+(?:\}\))/g, "@ApiPropertyOptional()")
    // Replace Type[] with string[] if Type is not defined
    // We already handled Role, let's just do a generic sweep if needed, or specific ones.
    .replace(/roles: Role\[\]/g, "roles: string[]")
    .replace(/<Role\[\]>/g, "<string[]>")
    .replace(/Role\.SUPER_ADMIN/g, "'SUPER_ADMIN'")
    .replace(/Role\.ADMIN/g, "'ADMIN'")
    .replace(/Role\.QA_MANAGER/g, "'QA_MANAGER'")
    .replace(/Role\.FRONT_OFFICE/g, "'FRONT_OFFICE'")
    .replace(/Role\.BILLING_STAFF/g, "'BILLING_STAFF'")
    .replace(/Role\.DOCTOR/g, "'DOCTOR'")
    .replace(/Role\.MRD_STAFF/g, "'MRD_STAFF'")
    .replace(/Gender\.[A-Z_]+/g, "'MALE'")
    .replace(/BloodGroup\.[A-Z_]+/g, "'O_POSITIVE'")
    .replace(/MaritalStatus\.[A-Z_]+/g, "'SINGLE'")
    .replace(/EmergencyRelation\.[A-Z_]+/g, "'OTHER'")
    .replace(/PatientCategory\.[A-Z_]+/g, "'GENERAL'")
    .replace(/CareType\.[A-Z_]+/g, "'OPD'")
    .replace(/Department\.[A-Z_]+/g, "'GENERAL_MEDICINE'")
    .replace(/InquirySource\.[A-Z_]+/g, "'WEBSITE'")
    .replace(/InquiryStatus\.[A-Z_]+/g, "'NEW'")
    .replace(/NCType\.[A-Z_]+/g, "'PROCESS_DEVIATION'")
    .replace(/Severity\.[A-Z_]+/g, "'MINOR'")
    .replace(/NCStatus\.[A-Z_]+/g, "'OPEN'")
    .replace(/HeardFrom\.[A-Z_]+/g, "'WEBSITE'")
    .replace(/ReferenceBy\.[A-Z_]+/g, "'SELF'")
    .replace(/ServiceTypeAvailed\.[A-Z_]+/g, "'OPD'")

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
