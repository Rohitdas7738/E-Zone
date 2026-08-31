// ================================================================
// E-ZONE CATEGORY, BRAND FILTERS & LIVE PROPERTY UPDATES
// ================================================================
        function renderCategoryCards() {
            const container = document.getElementById('category-cards-grid');
            container.innerHTML = "";

            categoriesList.forEach(cat => {
                const card = document.createElement('div');
                const isActive = (selectedCategory === cat.name);
                card.className = `bg-white border-2 rounded-xl p-3 flex flex-col items-center justify-between shadow-sm cursor-pointer transition transform hover:-translate-y-1 ${isActive ? 'border-teal-700 bg-teal-50/50 ring-2 ring-teal-600' : 'border-gray-200 hover:border-teal-500'}`;
                
                card.onclick = (e) => {
                    if(e.target.closest('button')) return;
                    selectCategory(cat.name);
                };

                let imgContent = "";
                const customImg = savedCategoryImages[cat.name];
                if(customImg) {
                    imgContent = `<div class="w-full h-20 bg-gray-100 rounded-lg overflow-hidden relative group">
                        <img src="${customImg}" class="w-full h-full object-cover">
                        ${!isPermanentlySaved ? `<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <button onclick="triggerUpload('category', '${cat.name}')" class="bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow">Change Image</button>
                        </div>` : ''}
                    </div>`;
                } else {
                    imgContent = `<div class="w-full h-20 bg-teal-50 border border-teal-100 rounded-lg flex flex-col items-center justify-center relative group">
                        <i class="${cat.icon} text-teal-800 text-xl mb-1"></i>
                        <span class="text-[9px] text-teal-900 font-bold">No Image</span>
                        ${!isPermanentlySaved ? `<div class="absolute inset-0 bg-teal-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <button onclick="triggerUpload('category', '${cat.name}')" class="bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow">Upload Image</button>
                        </div>` : ''}
                    </div>`;
                }

                card.innerHTML = `
                    ${imgContent}
                    <div class="mt-2 text-center w-full">
                        <h4 class="font-bold text-xs text-cyan-950 capitalize truncate">${(typeof categoryLabels !== "undefined" && categoryLabels[cat.name] && categoryLabels[cat.name][currentLang]) ? categoryLabels[cat.name][currentLang] : cat.label}</h4>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function triggerUpload(type, id) {
            if(isPermanentlySaved) {
                alert("Website is permanently locked. Unlock system to change images.");
                return;
            }
            activeTargetType = type;
            activeTargetId = id;
            document.getElementById('global-file-input').click();
        }

        function handleFileSelected(event) {
            const file = event.target.files[0];
            if(!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Data = e.target.result;
                if(activeTargetType === 'product') {
                    const p = products.find(item => item.id === activeTargetId);
                    if(p) {
                        p.customImage = base64Data;
                        saveDataToStorage();
                        renderProducts();
                    }
                } else if(activeTargetType === 'category') {
                    savedCategoryImages[activeTargetId] = base64Data;
                    localStorage.setItem('ezone_category_images', JSON.stringify(savedCategoryImages));
                    renderCategoryCards();
                }
                event.target.value = ""; 
            };
            reader.readAsDataURL(file);
        }

        function selectCategory(catName) {
            selectedCategory = catName;
            updateFilterButtonsHighlight();
            renderCategoryCards();
            renderProducts();
        }

        function getBrandTheme(brandName) {
            const key = String(brandName || '').trim().toLowerCase();
            const themes = {
                "all":        { main:"#f59e0b", dark:"#b45309", soft:"#fffbeb", text:"#92400e" },
                "philips":    { main:"#0b5ed7", dark:"#084298", soft:"#eff6ff", text:"#0b5ed7" },
                "ecolink":    { main:"#16a34a", dark:"#15803d", soft:"#f0fdf4", text:"#15803d" },
                "pritam":     { main:"#dc2626", dark:"#991b1b", soft:"#fef2f2", text:"#b91c1c" },
                "jj ultra":   { main:"#111827", dark:"#000000", soft:"#f3f4f6", text:"#111827" },
                "kinato":     { main:"#00b050", dark:"#15803d", soft:"#f0fdf4", text:"#15803d" },
                "kineto":     { main:"#00b050", dark:"#15803d", soft:"#f0fdf4", text:"#15803d" },
                "pahadi":     { main:"#1d4ed8", dark:"#1e3a8a", soft:"#eff6ff", text:"#1d4ed8" },
                "finolex":    { main:"#2563eb", dark:"#1d4ed8", soft:"#eff6ff", text:"#1d4ed8" },
                "polycab":    { main:"#e11d48", dark:"#9f1239", soft:"#fff1f2", text:"#be123c" },
                "havells":    { main:"#e31b23", dark:"#a30d13", soft:"#fff1f2", text:"#c5161d" },
                "crompton":   { main:"#0057b8", dark:"#003d80", soft:"#eff6ff", text:"#0057b8" },
                "atomberg":   { main:"#1e3a8a", dark:"#172554", soft:"#eff6ff", text:"#1e3a8a" },
                "orient":     { main:"#ff4f00", dark:"#c2410c", soft:"#fff7ed", text:"#ff4f00" },
                "taparia":    { main:"#f97316", dark:"#c2410c", soft:"#fff7ed", text:"#c2410c" },
                "kabyo":      { main:"#f59e0b", dark:"#b45309", soft:"#fffbeb", text:"#d97706" },
                "kavyo":      { main:"#f59e0b", dark:"#b45309", soft:"#fffbeb", text:"#d97706" },
                "starlightx": { main:"#7c3aed", dark:"#4c1d95", soft:"#f5f3ff", text:"#6d28d9" },
                "priti plast":{ main:"#0f766e", dark:"#115e59", soft:"#f0fdfa", text:"#0f766e" },
                "star flowrus":{ main:"#dc2626", dark:"#991b1b", soft:"#fef2f2", text:"#dc2626" },
                "zubbix":     { main:"#ea580c", dark:"#c2410c", soft:"#fff7ed", text:"#ea580c" },
                "techpride":  { main:"#ea580c", dark:"#c2410c", soft:"#fff7ed", text:"#ea580c" },
                "lexton":     { main:"#c8102e", dark:"#991b1b", soft:"#fef2f2", text:"#c8102e" },
                "duracell":   { main:"#b45309", dark:"#78350f", soft:"#fef3c7", text:"#b45309" },
                "aroma plus": { main:"#dc2626", dark:"#991b1b", soft:"#fef2f2", text:"#dc2626" },
                "arish":      { main:"#059669", dark:"#047857", soft:"#ecfdf5", text:"#059669" },
                "fire flex":  { main:"#ea580c", dark:"#9a3412", soft:"#fff7ed", text:"#c2410c" },
                "nitcap":     { main:"#0284c7", dark:"#0369a1", soft:"#f0f9ff", text:"#0284c7" },
                "paramarsh":  { main:"#b45309", dark:"#78350f", soft:"#fef3c7", text:"#b45309" },
                "generic":    { main:"#0f172a", dark:"#000000", soft:"#f8fafc", text:"#000000" },
                "ecolink led":{ main:"#16a34a", dark:"#166534", soft:"#f0fdf4", text:"#15803d" }
            };
            if (themes[key]) return themes[key];

            // Deterministic professional fallback for any new manufacturer added later.
            const palette = [
                ["#0f766e","#115e59","#f0fdfa","#0f766e"],
                ["#2563eb","#1d4ed8","#eff6ff","#1d4ed8"],
                ["#7c3aed","#5b21b6","#f5f3ff","#6d28d9"],
                ["#db2777","#9d174d","#fdf2f8","#be185d"],
                ["#ea580c","#9a3412","#fff7ed","#c2410c"],
                ["#0891b2","#155e75","#ecfeff","#0e7490"]
            ];
            let hash = 0;
            for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
            const x = palette[hash % palette.length];
            return { main:x[0], dark:x[1], soft:x[2], text:x[3] };
        }

        function getBrandTypographyHtml(brand) {
            const key = String(brand || '').trim().toLowerCase();
            const brandDesigns = {
                "all": `<span style="color:#b45309; font-weight:900; font-size:13px; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-th-large text-amber-500"></i> All</span>`,
                "philips": `<span style="color:#005eb8; font-weight:900; font-size:14px; letter-spacing:0.8px; font-family:'Segoe UI',Roboto,sans-serif;">PHILIPS</span>`,
                "ecolink": `<img src="images/brands/ecolink.svg" alt="Ecolink" class="h-5.5 max-h-[22px] max-w-[95px] object-contain select-none pointer-events-none">`,
                "ecolink led": `<img src="images/brands/ecolink.svg" alt="Ecolink" class="h-5.5 max-h-[22px] max-w-[95px] object-contain select-none pointer-events-none">`,
                "pritam": `<img src="images/brands/pritam.svg" alt="Pritam" class="h-6.5 max-h-[26px] max-w-[125px] object-contain select-none pointer-events-none mx-auto">`,
                "jj ultra": `<span style="font-weight:900; font-size:14px; letter-spacing:0.4px; font-family:'Segoe UI',Roboto,sans-serif;"><span style="color:#dc2626;">JJ</span><span style="color:#0f172a; margin-left:1px;">ULTRA</span></span>`,
                "kinato": `<img src="images/brands/kinato.svg" alt="Kinato" class="h-6.5 max-h-[26px] max-w-[110px] object-contain select-none pointer-events-none mx-auto">`,
                "kineto": `<img src="images/brands/kinato.svg" alt="Kineto" class="h-6.5 max-h-[26px] max-w-[110px] object-contain select-none pointer-events-none mx-auto">`,
                "pahadi": `<img src="images/brands/pahadi.svg" alt="Pahadi" class="h-6.5 max-h-[26px] max-w-[115px] object-contain select-none pointer-events-none mx-auto">`,
                "finolex": `<span style="color:#0072ce; font-weight:900; font-size:14px; letter-spacing:0.3px; font-family:'Segoe UI',Roboto,sans-serif;">Finolex</span>`,
                "polycab": `<span style="color:#c8102e; font-weight:900; font-size:14px; letter-spacing:1px; font-family:'Segoe UI',Roboto,sans-serif;">POLYCAB</span>`,
                "havells": `<img src="images/brands/havells.svg" alt="Havells" class="h-6.5 max-h-[26px] max-w-[110px] object-contain select-none pointer-events-none mx-auto">`,
                "crompton": `<span style="color:#0057b8; font-weight:900; font-size:14px; font-family:'Segoe UI',Roboto,sans-serif;">Crompton</span>`,
                "atomberg": `<img src="images/brands/atomberg.svg" alt="Atomberg" class="h-6.5 max-h-[26px] max-w-[120px] object-contain select-none pointer-events-none mx-auto">`,
                "orient": `<img src="images/brands/orient.svg" alt="Orient" class="h-6.5 max-h-[26px] max-w-[110px] object-contain select-none pointer-events-none mx-auto">`,
                "taparia": `<img src="images/brands/taparia.svg" alt="Taparia" class="h-6.5 max-h-[26px] max-w-[105px] object-contain select-none pointer-events-none mx-auto">`,
                "duracell": `<img src="images/brands/duracell.svg" alt="Duracell" class="h-6 max-h-[25px] max-w-[120px] object-contain select-none pointer-events-none mx-auto">`,
                "starlightx": `<img src="images/brands/starlightx.svg" alt="Sturlite X" class="h-6 max-h-[24px] max-w-[125px] object-contain select-none pointer-events-none mx-auto">`,
                "sturlitex": `<img src="images/brands/starlightx.svg" alt="Sturlite X" class="h-6 max-h-[24px] max-w-[125px] object-contain select-none pointer-events-none mx-auto">`,
                "sturlite": `<img src="images/brands/starlightx.svg" alt="Sturlite X" class="h-6 max-h-[24px] max-w-[125px] object-contain select-none pointer-events-none mx-auto">`,
                "priti plast": `<img src="images/brands/priti_plast.svg" alt="Preeti Plast" class="h-7 max-h-[28px] max-w-[130px] object-contain select-none pointer-events-none mx-auto">`,
                "preeti plast": `<img src="images/brands/priti_plast.svg" alt="Preeti Plast" class="h-7 max-h-[28px] max-w-[130px] object-contain select-none pointer-events-none mx-auto">`,
                "star flowrus": `<img src="images/brands/star_flowrus.svg" alt="Star flowrus" class="h-6.5 max-h-[26px] max-w-[115px] object-contain select-none pointer-events-none mx-auto">`,
                "zubbix": `<img src="images/brands/zubbix.svg" alt="Zubbix" class="h-6.5 max-h-[26px] max-w-[125px] object-contain select-none pointer-events-none mx-auto">`,
                "techpride": `<img src="images/brands/zubbix.svg" alt="Zubbix" class="h-6.5 max-h-[26px] max-w-[125px] object-contain select-none pointer-events-none mx-auto">`,
                "lexton": `<img src="images/brands/lexton.svg" alt="Lexton" class="h-5.5 max-h-[22px] max-w-[95px] object-contain select-none pointer-events-none">`,
                "aroma plus": `<img src="images/brands/aroma_plus.svg" alt="Aroma Plus" class="h-6.5 max-h-[26px] max-w-[125px] object-contain select-none pointer-events-none mx-auto">`,
                "arish": `<span style="color:#059669; font-weight:900; font-size:14.5px; letter-spacing:1.8px; font-family:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">ARISH</span>`,
                "kabyo": `<img src="images/brands/kabyo.svg" alt="Kabyo" class="h-6.5 max-h-[26px] max-w-[115px] object-contain select-none pointer-events-none mx-auto">`,
                "kavyo": `<img src="images/brands/kabyo.svg" alt="Kavyo" class="h-6.5 max-h-[26px] max-w-[115px] object-contain select-none pointer-events-none mx-auto">`,
                "fire flex": `<img src="images/brands/fire_flex.svg" alt="Fire Flex" class="h-6 max-h-[24px] max-w-[115px] object-contain select-none pointer-events-none mx-auto">`,
                "polyflex": `<img src="images/brands/polyflex.svg" alt="Polyflex" class="h-6 max-h-[24px] max-w-[115px] object-contain select-none pointer-events-none mx-auto">`,
                "nitcap": `<img src="images/brands/nitcap.svg" alt="Nitcap" class="h-6.5 max-h-[26px] max-w-[115px] object-contain select-none pointer-events-none mx-auto">`,
                "paramarsh": `<img src="images/brands/paramarsh.svg" alt="Paramarsh" class="h-6.5 max-h-[26px] max-w-[120px] object-contain select-none pointer-events-none mx-auto">`,
                "generic": `<img src="images/brands/generic.svg" alt="Generic" class="h-6 max-h-[24px] max-w-[110px] object-contain select-none pointer-events-none mx-auto">`
            };
            return brandDesigns[key] || `<span style="font-weight:900; font-size:13px;">${brand}</span>`;
        }

        function styleBrandFilterButton(btn, brand, active = false) {
            btn.classList.add('brand-filter-btn');
            if (active) {
                btn.classList.add('active-brand');
            } else {
                btn.classList.remove('active-brand');
            }
        }

        function initFilters() {
            const categories = ["All", "lights and decoratives light", "Fans", "Appliances", "Modular Plates", "Electrical Accessories", "GI Boxes", "Zip Tie", "Screw and Nuts", "switch and sockets", "accesories", "wiring items", "Pvc plastic items", "wires and cabiles"];
            const catContainer = document.getElementById('category-filter-container');
            catContainer.innerHTML = "";
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = "bg-white border border-teal-700 text-teal-950 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-teal-50 transition cursor-pointer shadow-sm capitalize";
                btn.id = `cat-btn-${cat.replace(/\s+/g, '-')}`;
                btn.onclick = () => { selectCategory(cat); };
                catContainer.appendChild(btn);
            });

            const fixedBrands = ["All", "Philips", "Ecolink", "Pritam", "JJ Ultra", "Kinato", "Pahadi", "Finolex", "Polycab", "Havells", "Crompton", "Atomberg", "Orient", "Taparia", "Duracell", "Starlightx", "priti plast", "star flowrus", "Zubbix", "Lexton", "Aroma plus", "Arish", "Kabyo", "Fire Flex", "Nitcap", "Paramarsh", "Generic"];
            const discoveredBrands = products.map(p => String(p.brand || '').trim()).filter(Boolean);
            const brands = [...new Set([...fixedBrands, ...discoveredBrands])];
            const brandContainer = document.getElementById('brand-filter-container');
            brandContainer.innerHTML = "";

            brands.forEach(br => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = "brand-filter-btn";
                btn.title = `${br} brand`;
                btn.id = `brand-btn-${br.replace(/\s+/g, '-')}`;
                btn.dataset.brand = br;
                btn.innerHTML = getBrandTypographyHtml(br);

                btn.onclick = () => {
                    selectedBrand = br;
                    updateFilterButtonsHighlight();
                    renderProducts();
                };
                styleBrandFilterButton(btn, br, selectedBrand.toLowerCase() === br.toLowerCase());
                brandContainer.appendChild(btn);
            });

            updateFilterButtonsHighlight();
        }

        function updateFilterButtonsHighlight() {
            document.querySelectorAll('#category-filter-container button').forEach(b => b.classList.remove('active-filter'));
            document.querySelectorAll('#brand-filter-container button').forEach(b => {
                const brand = b.dataset.brand || b.innerText.trim();
                styleBrandFilterButton(b, brand, selectedBrand.toLowerCase() === brand.toLowerCase());
            });

            const cBtn = document.getElementById(`cat-btn-${selectedCategory.replace(/\s+/g, '-')}`);
            if(cBtn) cBtn.classList.add('active-filter');

            const bBtn = document.getElementById(`brand-btn-${selectedBrand.replace(/\s+/g, '-')}`);
            if(bBtn) {
                const brand = bBtn.dataset.brand || bBtn.innerText.trim();
                styleBrandFilterButton(bBtn, brand, true);
            }
        }

        function resetFilters() {
            selectedCategory = "All";
            selectedBrand = "All";
            document.getElementById('search-input').value = "";
            updateFilterButtonsHighlight();
            renderCategoryCards();
            renderProducts();
        }

        function handlePriceChange(id, newPriceVal) {
            if(isPermanentlySaved) {
                alert("Website is permanently locked. Unlock system to edit prices.");
                renderProducts();
                return;
            }
            let val = parseFloat(newPriceVal);
            if(isNaN(val)) return;
            const p = products.find(item => item.id === id);
            if(p) {
                p.price = val;
                saveDataToStorage();
                updateWaLink(id);
            }
        }

        function handlePropertyChange(id, propertyName, newVal) {
            if(isPermanentlySaved) {
                alert("Website is permanently locked. Unlock system to edit properties.");
                renderProducts();
                return;
            }
            const p = products.find(item => item.id === id);
            if(p) {
                p[propertyName] = newVal.trim();
                saveDataToStorage();
                updateWaLink(id);
                if (typeof roxCurrentProductId !== 'undefined' && roxCurrentProductId === id && typeof roxRenderDiagram === 'function') {
                    roxRenderDiagram(p);
                }
            }
        }

        function updateQuantity(id, val) {
            let qtyVal = parseInt(val);
            if(isNaN(qtyVal) || qtyVal < 1) qtyVal = 1;
            if(qtyVal > 500) qtyVal = 500;
            
            const p = products.find(item => item.id === id);
            if(p) {
                p.qty = qtyVal;
                
                const inputEl = document.getElementById(`qty-num-${id}`);
                const sliderEl = document.getElementById(`qty-range-${id}`);
                const badgeEl = document.getElementById(`qty-badge-${id}`);
                
                if(inputEl) inputEl.value = qtyVal;
                if(sliderEl) sliderEl.value = qtyVal;
                if(badgeEl) badgeEl.innerText = `${qtyVal} Pcs`;
                
                updateWaLink(id);
            }
        }

        function changeQtyByStep(id, delta) {
            const p = products.find(item => item.id === id);
            if(p) {
                let newQty = (p.qty || 1) + delta;
                if(newQty < 1) newQty = 1;
                if(newQty > 500) newQty = 500;
                updateQuantity(id, newQty);
            }
        }

        function updateWaLink(id) {
            const p = products.find(item => item.id === id);
            if(!p) return;

            const btnEl = document.getElementById(`wa-btn-${id}`);
            if(btnEl) {
                const displayName = getLocalizedProductName(p.name);
                const qty = p.qty || 1;
                const info = getDiscountInfo(p);
                const totalCost = info.salePrice * qty;
                let message = `Hi E-ZONE Electric, I want to check availability and place an order:\nID: ${p.id}\nItem: ${displayName}\nBrand: ${p.brand}\n`;
                if(info.discountPercent > 0) {
                    message += `MRP: ₹${Math.round(info.mrp)}/-\nDiscount: ${info.discountPercent}% OFF\nSelling Price: ₹${info.salePrice}/-\n`;
                } else {
                    message += `Unit Price: ₹${info.salePrice}/-\n`;
                }
                message += `Quantity: ${qty} Pcs\nEstimated Total: ₹${Math.round(totalCost)}/-\n\nUPI ID: 9330507738@ybl (ROHIT DAS)`;
                btnEl.href = `https://wa.me/919330507738?text=${encodeURIComponent(message)}`;
            }
        }

        function updateAllWhatsAppLinks() {
            products.forEach(p => updateWaLink(p.id));
        }

        function saveDataToStorage() {
            let dataToSave = {};
            products.forEach(p => {
                let origItem = originalProducts.find(op => op.id === p.id);
                if (!origItem || p.price !== origItem.price || Number(p.discountPercent || 0) !== Number(origItem.discountPercent || 0) || p.customImage || p.name !== origItem.name || p.brand !== origItem.brand || p.category !== origItem.category || p.spec !== origItem.spec || (p.details || '') !== (origItem.details || '') || (p.subVariantPrices && Object.keys(p.subVariantPrices).length > 0)) {
                    dataToSave[p.id] = {
                        price: p.price,
                        discountPercent: Number(p.discountPercent || 0),
                        customImage: p.customImage || null,
                        name: p.name,
                        brand: p.brand,
                        category: p.category,
                        spec: p.spec,
                        details: p.details || '',
                        subVariantPrices: p.subVariantPrices || {}
                    };
                }
            });
            try {
                localStorage.setItem('ezone_products_data', JSON.stringify(dataToSave));
            } catch (e) {
                console.warn("Storage limit reached.");
            }
        }
