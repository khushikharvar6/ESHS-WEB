const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === 'route.ts') {
      let c = fs.readFileSync(p, 'utf8');
      if (!c.includes('force-dynamic')) {
        fs.writeFileSync(p, "export const dynamic = 'force-dynamic'\n" + c);
        console.log('Fixed ' + p);
      }
    }
  });
}

walk('frontend/app/api');
