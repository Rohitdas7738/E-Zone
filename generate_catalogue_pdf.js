const fs = require('fs');                                                                                                               
const path = require('path');
const { execSync } = require('child_process');

const content = fs.readFileSync(path.join(__dirname, 'js/data/products.js'), 'utf8');
const arrayMatch = content.match(/const\s+originalProducts\s*=\s*(\[[\s\S]*?\n\s*\];)/);
if (!arrayMatch) {
  console.error('Could not extract products');
  process.exit(1);
}

const products = eval(arrayMatch[1]);
console.log('Successfully loaded ' + products.length + ' products.');

const categoryDisplayNames = {
  'lights and decoratives light': 'Lights & Decorative Lights',
  'Fans': 'Fans & Ventilation',
  'Appliances': 'Home & Electrical Appliances',
  'Modular Plates': 'Modular Plates',
  'switch and sockets': 'Switches & Sockets',
  'wires and cabiles': 'Wires & Cables',
  'Pvc plastic items': 'PVC Plastic & Gang Boxes',
  'accesories': 'Electrical Accessories & Essentials',
  'Electrical Accessories': 'Batteries & Tools',
  'GI Boxes': 'Galvanized Iron (GI) Boxes',
  'Zip Tie': 'Zip Ties & Cable Management',
  'wiring items': 'Wiring Accessories & Tapes',
  'Screw and Nuts': 'Screw and Nuts'
};

const grouped = {};
products.forEach(p => {
  const catKey = p.category || 'General';
  if (!grouped[catKey]) grouped[catKey] = [];
  grouped[catKey].push(p);
});

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>E-Zone Electricals - Official Product & Price List</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
  
  @page {
    size: A4 portrait;
    margin: 12mm 12mm 15mm 12mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 10.5px;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 18px 22px;
    border-radius: 10px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-title h1 {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #38bdf8;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-title p {
    font-size: 11px;
    color: #94a3b8;
  }

  .header-meta {
    text-align: right;
    font-size: 10px;
    color: #cbd5e1;
    line-height: 1.5;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    border-radius: 6px;
  }

  .stat-card .label {
    font-size: 8.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
  }

  .stat-card .value {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 2px;
  }

  .category-section {
    margin-bottom: 18px;
    page-break-inside: auto;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f1f5f9;
    border-left: 4px solid #0284c7;
    padding: 6px 10px;
    border-radius: 0 5px 5px 0;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  .category-title {
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
  }

  .category-badge {
    font-size: 9.5px;
    font-weight: 600;
    background: #e0f2fe;
    color: #0369a1;
    padding: 2px 7px;
    border-radius: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    font-size: 10px;
  }

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  th {
    background: #f8fafc;
    color: #475569;
    font-weight: 700;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 6px;
    border-bottom: 1.5px solid #cbd5e1;
    text-align: left;
  }

  td {
    padding: 5px 6px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background-color: #fafbfc;
  }

  .col-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
    width: 65px;
  }

  .col-product {
    font-weight: 600;
    color: #0f172a;
    width: 210px;
  }

  .col-spec {
    font-size: 9px;
    color: #64748b;
    margin-top: 1px;
    font-weight: 400;
  }

  .col-brand {
    width: 85px;
  }

  .brand-badge {
    display: inline-block;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 8.5px;
    font-weight: 600;
    background: #e2e8f0;
    color: #334155;
    white-space: nowrap;
  }

  .col-variants {
    font-size: 8.5px;
    color: #475569;
    width: 190px;
  }

  .variant-tag {
    display: inline-block;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 3px;
    padding: 1px 4px;
    margin: 1px 2px 1px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
  }

  .col-price {
    text-align: right;
    font-weight: 700;
    font-size: 11px;
    color: #0f766e;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    width: 75px;
  }

  .no-print {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #0f172a;
    color: #ffffff;
    padding: 12px 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    margin-bottom: 20px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  }

  .banner-text {
    font-size: 13px;
    font-weight: 600;
    color: #f8fafc;
  }

  .banner-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .btn-download {
    background: #0284c7;
    color: #ffffff;
  }
  .btn-download:hover {
    background: #0369a1;
  }

  .btn-print {
    background: #334155;
    color: #ffffff;
  }
  .btn-print:hover {
    background: #475569;
  }

  .btn-home {
    background: #1e293b;
    color: #94a3b8;
    border: 1px solid #334155;
  }
  .btn-home:hover {
    color: #ffffff;
    background: #334155;
  }

  @media print {
    .no-print {
      display: none !important;
    }
  }

  .footer-note {
    margin-top: 18px;
    padding: 10px 14px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 6px;
    font-size: 8.5px;
    color: #64748b;
    text-align: center;
    page-break-inside: avoid;
  }
</style>
</head>
<body>

<div class="no-print">
  <div class="banner-text">
    ⚡ <strong>E-Zone Products & Price Catalogue</strong> (240 Products Active)
  </div>
  <div class="banner-actions">
    <a href="/download-pdf" class="btn btn-download" download="E-Zone_Products_Price_List.pdf">
      ⬇️ Download PDF
    </a>
    <button onclick="window.print()" class="btn btn-print">
      🖨️ Print / Save As
    </button>
    <a href="/" class="btn btn-home">
      🏠 Return to Store
    </a>
  </div>
</div>

<div class="header">
  <div class="header-title">
    <h1>⚡ E-Zone Electricals</h1>
    <p>Complete Product Inventory & Price Catalogue</p>
  </div>
  <div class="header-meta">
    <div><strong>Website:</strong> localhost:3000</div>
    <div><strong>Total Inventory:</strong> ${products.length} Products</div>
    <div><strong>Status:</strong> Active Live Catalogue</div>
  </div>
</div>

<div class="stats-grid">
  <div class="stat-card">
    <div class="label">Total Products</div>
    <div class="value">${products.length} Items</div>
  </div>
  <div class="stat-card">
    <div class="label">Categories</div>
    <div class="value">${Object.keys(grouped).length} Categories</div>
  </div>
  <div class="stat-card">
    <div class="label">Brands</div>
    <div class="value">${[...new Set(products.map(p => p.brand))].length} Brands</div>
  </div>
  <div class="stat-card">
    <div class="label">Price Range</div>
    <div class="value">₹${Math.min(...products.map(p => p.price))} - ₹${Math.max(...products.map(p => p.price)).toLocaleString('en-IN')}</div>
  </div>
</div>
`;

let slNo = 1;
for (const [catKey, catProducts] of Object.entries(grouped)) {
  const catName = categoryDisplayNames[catKey] || catKey;
  html += `
  <div class="category-section">
    <div class="category-header">
      <div class="category-title">${catName}</div>
      <div class="category-badge">${catProducts.length} Items</div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 25px;">#</th>
          <th style="width: 60px;">ID</th>
          <th>Product Name & Description</th>
          <th>Brand</th>
          <th>Variants / Options & Prices</th>
          <th style="text-align: right;">Base Price</th>
        </tr>
      </thead>
      <tbody>
  `;

  catProducts.forEach(p => {
    let variantsStr = '-';
    if (p.subVariantPrices && typeof p.subVariantPrices === 'object') {
      const vKeys = Object.keys(p.subVariantPrices);
      variantsStr = vKeys.map(k => `<span class="variant-tag"><b>${k}:</b> ₹${p.subVariantPrices[k]}</span>`).join(' ');
    }

    html += `
      <tr>
        <td style="color: #94a3b8; font-size: 8.5px;">${slNo++}</td>
        <td class="col-id">${p.id}</td>
        <td class="col-product">
          <div>${p.name}</div>
          <div class="col-spec">${p.spec || ''}</div>
        </td>
        <td class="col-brand">
          <span class="brand-badge">${p.brand || 'Generic'}</span>
        </td>
        <td class="col-variants">${variantsStr}</td>
        <td class="col-price">₹${p.price.toLocaleString('en-IN')}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  </div>
  `;
}

html += `
<div class="footer-note">
  <strong>E-Zone Electricals & Electronics</strong> • Product catalogue, specifications, variant pricing, and live inventory records. All prices in INR (₹).
</div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'E-Zone_Products_Catalogue.html');
const pdfPath = path.join(__dirname, 'E-Zone_Products_Price_List.pdf');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved HTML to:', htmlPath);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Generating PDF with:', browserBin);
const cmd = `"${browserBin}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log('PDF Generated Successfully! File size:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.error('PDF file was not created.');
}
