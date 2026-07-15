const https = require('https');

function test(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`[${url}] Status: ${res.statusCode}`);
      try {
        const json = JSON.parse(data);
        console.log(`[${url}] Records: ${json.length}`);
      } catch (e) {
        console.log(`[${url}] Data: ${data.substring(0, 100)}`);
      }
    });
  }).on('error', (e) => {
    console.error(`[${url}] Error: ${e.message}`);
  });
}

test('https://eshs-web.vercel.app/api/appointments');
test('https://eshs-web.onrender.com/api/appointments');
