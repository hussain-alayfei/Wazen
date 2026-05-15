const https = require('https');

https.get('https://font.thmanyah.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.match(/href="([^"]+)"/g));
  });
});
