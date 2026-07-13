const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/import \{ Role \} from '@prisma\/client';\r?\n?/g, '')
    .replace(/Role\.SUPER_ADMIN/g, "'SUPER_ADMIN'")
    .replace(/Role\.ADMIN/g, "'ADMIN'")
    .replace(/Role\.QA_MANAGER/g, "'QA_MANAGER'")
    .replace(/Role\.FRONT_OFFICE/g, "'FRONT_OFFICE'")
    .replace(/Role\.BILLING_STAFF/g, "'BILLING_STAFF'")
    .replace(/Role\.DOCTOR/g, "'DOCTOR'")
    .replace(/Role\.MRD_STAFF/g, "'MRD_STAFF'")
    .replace(/roles: Role\[\]/g, "roles: string[]")
    .replace(/<Role\[\]>/g, "<string[]>")
    .replace(/\{ enum: Role, example: 'FRONT_OFFICE' \}/g, "{ example: 'FRONT_OFFICE' }")
    .replace(/@IsEnum\(Role\)/g, "@IsString()")
    .replace(/role\?: Role;/g, "role?: string;");

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
