const https = require('https');

https.get('https://font.thmanyah.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find link rel=stylesheet
    const cssLinks = [...data.matchAll(/href="([^"]+\.css)"/g)].map(m => m[1]);
    cssLinks.forEach(link => {
      const url = link.startsWith('http') ? link : 'https://font.thmanyah.com' + (link.startsWith('/') ? '' : '/') + link;
      https.get(url, (cRes) => {
        let cData = '';
        cRes.on('data', chunk => cData += chunk);
        cRes.on('end', () => {
          if (cData.includes('@font-face')) {
             console.log(cData.substring(0, 1000));
          }
        });
      });
    });
  });
});
