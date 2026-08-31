// ================================================================
// E-ZONE MAIN APPLICATION ENTRY POINT & PRODUCT GRID RENDERER
// ================================================================

        
        function toggleLangMenu() {
            const menu = document.getElementById('lang-menu');
            if (menu) menu.classList.toggle('hidden');
        }

        function changeLanguage(langCode) {
            currentLang = langCode || 'bn';
            window.currentLang = currentLang;
            try { localStorage.setItem('ezone_language', currentLang); } catch(e) {}
            
            const menu = document.getElementById('lang-menu');
            if (menu) menu.classList.add('hidden');
            
            let labelText = "Language";
            if(currentLang === 'bn') labelText = "ভাষা (Bengali)";
            if(currentLang === 'hi') labelText = "भाषा (Hindi)";
            const labelEl = document.getElementById('current-lang-label');
            if (labelEl) labelEl.innerText = labelText;

            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.getAttribute('data-key');
                const dict = (typeof locales !== 'undefined' && locales[currentLang]) ? locales[currentLang] : (window.locales ? window.locales[currentLang] : null);
                if(dict && dict[key]) {
                    el.innerText = dict[key];
                }
            });
            
            if (typeof renderCategoryCards === 'function') renderCategoryCards();
            renderProducts();
            if (typeof roxLang !== 'undefined') roxLang = currentLang;
            if (window.roxStartupWelcome) {
                setTimeout(function(){ window.roxStartupWelcome(currentLang); }, 250);
            }
        }

        function getLocalizedProductName(originalName) {
            if (!originalName) return '';
            const key = String(originalName).trim();
            const bnDict = typeof translationsBn !== 'undefined' ? translationsBn : (window.translationsBn || {});
            const hiDict = typeof translationsHi !== 'undefined' ? translationsHi : (window.translationsHi || {});

            if(currentLang === 'bn') {
                if(bnDict[key]) return bnDict[key];
                if(bnDict[originalName]) return bnDict[originalName];
            }
            if(currentLang === 'hi') {
                if(hiDict[key]) return hiDict[key];
                if(hiDict[originalName]) return hiDict[originalName];
            }
            return originalName;
        }

        function openProductPage(productId) {
            if (!productId) return;
            window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
        }

        if (typeof window !== "undefined") {
            window.toggleLangMenu = toggleLangMenu;
            window.changeLanguage = changeLanguage;
            window.getLocalizedProductName = getLocalizedProductName;
            window.renderProducts = renderProducts;
            window.openProductPage = openProductPage;
        }

        function renderProducts() {
            const grid = document.getElementById('products-grid-container');
            if (!grid) return;
            grid.innerHTML = "";

            const searchInput = document.getElementById('search-input');
            const rawQuery = searchInput ? searchInput.value.trim() : "";
            const query = (typeof normalizeSearchText === 'function') ? normalizeSearchText(rawQuery) : rawQuery.toLowerCase();

            const prodList = window.products || (typeof products !== 'undefined' ? products : []);
            const curCat = window.selectedCategory || (typeof selectedCategory !== 'undefined' ? selectedCategory : "All");
            const curBrand = window.selectedBrand || (typeof selectedBrand !== 'undefined' ? selectedBrand : "All");

            const baseFiltered = prodList.filter(p => {
                const matchesCat = (curCat === "All" || p.category === curCat);
                const matchesBrand = (curBrand === "All" || String(p.brand || '').toLowerCase() === curBrand.toLowerCase());
                return matchesCat && matchesBrand;
            });

            let directResults = [];
            let similarResults = [];

            if (!query) {
                directResults = baseFiltered.map((p, index) => ({ product: p, meta: { score: 0 }, index }));
            } else {
                baseFiltered.forEach((p, index) => {
                    const meta = (typeof getSearchMeta === 'function') ? getSearchMeta(p, query) : { direct: p.name.toLowerCase().includes(query), score: 1000 };
                    // Ignore genuinely unrelated products. Keep a generous threshold
                    // so misspellings and closely related items still appear as Similar.
                    if (meta.direct || meta.score >= 700) {
                        const entry = { product: p, meta, index };
                        if (meta.direct) directResults.push(entry);
                        else similarResults.push(entry);
                    }
                });

                const sorter = (a, b) => {
                    if (b.meta.score !== a.meta.score) return b.meta.score - a.meta.score;
                    if (b.meta.nameTokenHits !== a.meta.nameTokenHits) return b.meta.nameTokenHits - a.meta.nameTokenHits;
                    return a.index - b.index;
                };
                directResults.sort(sorter);
                similarResults.sort(sorter);
            }

            const orderedResults = [...directResults, ...similarResults];
            const dispCountEl = document.getElementById('displayed-count');
            if (dispCountEl) dispCountEl.innerText = orderedResults.length;

            const totalCountEl = document.getElementById('total-count');
            if (totalCountEl) totalCountEl.innerText = prodList.length;

            if (orderedResults.length === 0) {
                grid.innerHTML = `<div class="col-span-full text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200 text-xs">
                    <i class="fas fa-search-minus text-3xl mb-1.5 text-gray-300"></i>
                    <p class="font-bold">No items match your active filters.</p>
                    ${query ? `<p class="mt-1 text-[10px] text-gray-400">Try the product name, brand, category or a shorter keyword.</p>` : ''}
                </div>`;
                return;
            }

            const activeLang = window.currentLang || (typeof currentLang !== 'undefined' ? currentLang : 'bn');
            const locDict = (typeof locales !== 'undefined' && locales[activeLang]) ? locales[activeLang] : (window.locales ? window.locales[activeLang] : {});
            const enqButtonLabel = locDict["btn-enquiry"] || "WhatsApp Enquiry";
            const qtyLabel = locDict["qty-lbl"] || "Quantity:";

            const renderOneProduct = (p) => {
                const card = document.createElement('div');
                card.className = `product-card bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow transition flex flex-col justify-between ${deleteModeActive ? 'border-red-500 ring-2 ring-red-300 bg-red-50/10' : 'border-gray-200'}`;

                let imgHtml = "";
                let displayName = getLocalizedProductName(p.name);

                const embeddedImage = getEmbeddedProductImage(p);
                const configuredImageName = typeof PRODUCT_IMAGES[p.id] === 'string' ? PRODUCT_IMAGES[p.id].trim() : '';
                const productImage = p.customImage || embeddedImage;
                const imageBase = configuredImageName && !/^(data:|https?:|blob:|\.\.\/|\/)/i.test(configuredImageName)
                    ? configuredImageName.replace(/\.(jpe?g|png|webp|avif)$/i, '') : '';

                const secondaryAngle = (Array.isArray(p.images) && p.images.length > 1) ? p.images[1] : '';

                if(productImage) {
                    const safeImage = String(productImage).replace(/'/g, "\\'");
                    const safeSecondary = secondaryAngle ? String(secondaryAngle).replace(/'/g, "\\'") : '';
                    imgHtml = `<div class="w-full h-44 bg-gray-100 flex items-center justify-center relative group overflow-hidden cursor-pointer" onclick="openProductPage('${p.id}')" title="Click to view full details & options"${safeSecondary ? ` onmouseenter="const img=this.querySelector('.main-prod-img'); if(img) img.src='${safeSecondary}';" onmouseleave="const img=this.querySelector('.main-prod-img'); if(img) img.src='${safeImage}';"` : ''}>
                        <img src="${safeImage}" alt="${displayName}" class="main-prod-img w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" data-image-base="${imageBase}" data-ext-index="0" data-emoji="${String(p.emoji || '💡').replace(/"/g, '&quot;')}" onerror="tryNextProductImage(this)">
                        ${safeSecondary ? `<div class="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 pointer-events-none shadow"><i class="fas fa-camera text-[8px] text-amber-400"></i> 2 Angles</div>` : ''}
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition duration-200">
                            <span class="bg-white/95 text-cyan-950 text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition"><i class="fas fa-eye text-teal-700"></i> View Details</span>
                            ${!isPermanentlySaved ? `<button onclick="event.stopPropagation(); triggerUpload('product', '${p.id}')" class="bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow">Change</button>` : ''}
                        </div>
                    </div>`;
                } else {
                    imgHtml = `<div class="w-full h-44 bg-teal-50 flex items-center justify-center text-4xl relative group cursor-pointer" onclick="openProductPage('${p.id}')" title="Click to view full details & options">
                        ${p.emoji}
                        <div class="absolute top-1 left-1 bg-cyan-950/20 text-[8px] font-mono px-1 rounded text-cyan-950">${p.id}</div>
                        <div class="absolute inset-0 bg-teal-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition duration-200">
                            <span class="bg-white/95 text-cyan-950 text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition"><i class="fas fa-eye text-teal-700"></i> View Details</span>
                            ${!isPermanentlySaved ? `<button onclick="event.stopPropagation(); triggerUpload('product', '${p.id}')" class="bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow">Upload</button>` : ''}
                        </div>
                    </div>`;
                }

                const currentQty = p.qty || 1;
                const totalCost = p.price * currentQty;
                const waText = encodeURIComponent(`Hi E-ZONE Electric, I want to check availability and place an order:\nID: ${p.id}\nItem: ${displayName}\nBrand: ${p.brand}\nUnit Price: ₹${p.price}/-\nQuantity: ${p.qty || 1} Pcs\nEstimated Total: ₹${totalCost}/-\n\nUPI ID: 9330507738@ybl (ROHIT DAS)`);
                const waLink = `https://wa.me/919330507738?text=${waText}`;

                const discountInfo = getDiscountInfo(p);
                const discountPercent = discountInfo.discountPercent;
                const originalEstimatePrice = Math.round(discountInfo.mrp * 100) / 100;

                let deleteBadgeOrButton = "";
                if(deleteModeActive) {
                    deleteBadgeOrButton = `
                        <div class="bg-red-600 p-2 text-center">
                            <button onclick="deleteSpecificProduct('${p.id}')" class="w-full bg-white hover:bg-red-50 text-red-700 font-black text-xs py-1.5 px-3 rounded shadow cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <i class="fas fa-trash-alt"></i> Delete This Product
                            </button>
                        </div>
                    `;
                }

                let hasSubVariants = (p.isGiBox || p.isShuttleClips || p.isZipTie || p.isMcb || p.isDbBox || p.isBattery || p.isWattBulb || p.isColorBulb || (p.subVariantPrices && Object.keys(p.subVariantPrices).length > 0));
                let subSectionHtml = "";
                if (hasSubVariants) {
                    let subTitle = "Available Variants / Options:";
                    let variantsMap = p.subVariantPrices || {};
                    let sampleKeys = Object.keys(variantsMap);
                    if(sampleKeys.length === 0) {
                        if(p.isMcb) sampleKeys = ["6Amp", "16Amp", "32Amp"];
                        else if(p.isGiBox) sampleKeys = ["4*4", "4*8", "4*12"];
                        else if(p.isWattBulb) sampleKeys = ["3W", "9W", "12W", "20W"];
                        else if(p.isColorBulb) sampleKeys = ["Cool Day Light", "Warm White", "RGB"];
                        else sampleKeys = ["Standard"];
                    } else sampleKeys = sampleKeys.slice(0, 3);
                    subSectionHtml = `
                        <div class="bg-teal-50/70 p-2 rounded-lg border border-teal-200 space-y-1.5 my-1">
                            <p class="text-[9px] font-black text-teal-900 uppercase">${subTitle}</p>
                            <div class="flex flex-wrap gap-1">
                                ${sampleKeys.map(sz => `<button onclick="event.stopPropagation(); handleCardClickForVariants('${p.id}', event)" class="bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow cursor-pointer transition flex items-center gap-1">${sz} <i class="fas fa-chevron-right text-[7px]"></i></button>`).join('')}
                                <button onclick="event.stopPropagation(); handleCardClickForVariants('${p.id}', event)" class="bg-teal-800 hover:bg-teal-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow cursor-pointer transition">More...</button>
                            </div>
                        </div>`;
                } else {
                    subSectionHtml = `
                        <div class="bg-gray-50 p-1.5 rounded border border-gray-100 flex items-center justify-between text-[10px] text-gray-600 my-0.5">
                            <span class="font-bold text-teal-800"><i class="fas fa-check-circle mr-1"></i>In Stock</span>
                            <span class="bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-mono font-bold text-[9px]">Wholesale Ready</span>
                        </div>`;
                }

                const isWish = typeof isProductWishlisted === 'function' && isProductWishlisted(p.id);

                card.innerHTML = `
                    <div class="flex flex-col">
                        <div class="relative">
                            ${imgHtml}
                            <button type="button" onclick="event.stopPropagation(); toggleWishlistItem('${p.id}', event)" data-wishlist-id="${p.id}" class="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition active:scale-90 cursor-pointer ${isWish ? 'wishlisted' : ''}" title="Add to Wishlist" aria-label="Add to Wishlist">
                                <i class="${isWish ? 'fas fa-heart text-rose-600' : 'far fa-heart text-gray-400 hover:text-rose-500'} text-xs"></i>
                            </button>
                            <button type="button" onclick="event.stopPropagation(); shareProduct('${p.id}', event)" class="product-share-btn absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition active:scale-90 cursor-pointer text-gray-600 hover:text-teal-700 hover:scale-110" title="Share this Product" aria-label="Share this Product">
                                <i class="fas fa-share-alt text-xs"></i>
                            </button>
                            ${discountPercent > 0 ? `<span class="brand-discount-badge absolute bottom-1 right-1 bg-yellow-300 text-yellow-950 text-[9px] font-black px-2 py-1 rounded-md shadow-lg border border-yellow-400"><i class="fas fa-bolt mr-0.5"></i>${discountPercent}% OFF</span>` : ''}
                        </div>
                        <div class="p-2.5 space-y-1">
                            <div class="flex justify-between items-center text-[9px] uppercase font-black tracking-wide text-teal-700">
                                <span class="font-bold text-teal-700 uppercase truncate">${p.brand || 'E-ZONE'}</span>
                                <span class="text-gray-400 font-medium lowercase truncate max-w-[70px]">${p.category}</span>
                            </div>
                            <h4 onclick="openProductPage('${p.id}')" class="font-bold text-xs text-cyan-950 leading-tight min-h-[30px] line-clamp-2 cursor-pointer hover:text-teal-700 transition">${displayName}</h4>
                            <p class="text-[10px] text-gray-500 truncate">${p.spec || ''}</p>
                            ${p.details ? `<p class="text-[10px] text-gray-500 line-clamp-2">${p.details}</p>` : ''}
                            ${subSectionHtml}
                        </div>
                    </div>
                    <div>
                        <div class="p-2.5 pt-0 space-y-2">
                            <div class="rounded-lg bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 px-2.5 py-1.5 border border-amber-200">
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-1">
                                        <span class="text-xs sm:text-sm font-black text-emerald-800 tracking-tight">₹${Number(p.price).toLocaleString('en-IN')}/-</span>
                                    </div>
                                    <div class="text-right leading-tight">
                                        ${discountPercent > 0 ? `<div class="text-[9px] text-gray-400 line-through">MRP ₹${Number(originalEstimatePrice).toLocaleString('en-IN')}</div>` : ''}
                                        <div class="text-[9px] font-black text-amber-700">${discountPercent > 0 ? `${discountPercent}% OFF` : 'BEST PRICE'}</div>
                                    </div>
                                </div>
                            </div>
                            <button onclick="${hasSubVariants ? `handleCardClickForVariants('${p.id}', event)` : `addToCart('${p.id}', event)`}" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-2 rounded-md flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer mb-1.5">
                                <i class="fas fa-cart-plus"></i> ${hasSubVariants ? 'SELECT & ADD TO BAG' : 'ADD TO BAG'}
                            </button>
                            <div class="grid grid-cols-2 gap-1.5 mb-1.5">
                                <button type="button" onclick="event.stopPropagation(); openRoxProduct('${p.id}')" class="rox-product-btn !mt-0 !w-full" title="Ask ROX about this product">
                                    <i class="fas fa-robot"></i> ${(window.roxUiText && window.roxUiText[activeLang]) ? window.roxUiText[activeLang].ask : 'ROX AI'}
                                </button>
                                <button type="button" onclick="event.stopPropagation(); shareProduct('${p.id}', event)" class="w-full bg-slate-100 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-teal-900 text-[11px] font-bold py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95" title="Share this product">
                                    <i class="fas fa-share-alt text-teal-700 text-xs"></i> <span>Share</span>
                                </button>
                            </div>
                            <a id="wa-btn-${p.id}" href="${waLink}" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition shadow-sm">
                                <i class="fab fa-whatsapp text-xs"></i> ${enqButtonLabel}
                            </a>
                        </div>
                    </div>`;
                grid.appendChild(card);
            };

            if (query && directResults.length) {
                grid.appendChild(createSearchGroupHeading('Main Search Results', directResults.length, 'main'));
                directResults.forEach(entry => renderOneProduct(entry.product));
            } else if (query && !directResults.length && similarResults.length) {
                grid.appendChild(createSearchGroupHeading('Closest Matches', similarResults.length, 'similar'));
            }

            if (query && similarResults.length) {
                if (directResults.length) grid.appendChild(createSearchGroupHeading('Similar Products', similarResults.length, 'similar'));
                similarResults.forEach(entry => renderOneProduct(entry.product));
            }

            if (!query) {
                directResults.forEach(entry => renderOneProduct(entry.product));
            }
        }

        function initApp() {
            try {
                const saved = localStorage.getItem('ezone_language');
                if (saved && ['bn', 'en', 'hi'].includes(saved)) {
                    currentLang = saved;
                }
            } catch(e) {}

            if (typeof initFilters === 'function') initFilters();
            if (typeof renderCategoryCards === 'function') renderCategoryCards();
            changeLanguage(currentLang || 'bn');
            if (typeof keepBagFixedOnPhysicalScreen === 'function') keepBagFixedOnPhysicalScreen();

            const totalCountEl = document.getElementById('total-count');
            const pList = window.products || (typeof products !== 'undefined' ? products : []);
            if (totalCountEl) totalCountEl.innerText = pList.length;

            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        triggerSearch();
                    }
                });
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initApp);
        } else {
            initApp();
        }
