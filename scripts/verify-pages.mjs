import fs from 'fs';

async function check() {
  const webRes = await fetch('http://127.0.0.1:3000/products');
  const webHtml = await webRes.text();
  console.log('Web status:', webRes.status);
  
  // Find product occurrences
  const rockwellCount = (webHtml.match(/Rockwell/gi) || []).length;
  const bluestarCount = (webHtml.match(/Blue Star/gi) || []).length;
  console.log('Rockwell mentions in web products page:', rockwellCount);
  console.log('Blue Star mentions in web products page:', bluestarCount);

  // Check admin
  const adminRes = await fetch('http://127.0.0.1:3001/products');
  const adminHtml = await adminRes.text();
  console.log('Admin status:', adminRes.status);
  const adminRockwell = (adminHtml.match(/Rockwell/gi) || []).length;
  const adminBlueStar = (adminHtml.match(/Blue Star/gi) || []).length;
  console.log('Rockwell mentions in admin products page:', adminRockwell);
  console.log('Blue Star mentions in admin products page:', adminBlueStar);
}

check().catch(console.error);
