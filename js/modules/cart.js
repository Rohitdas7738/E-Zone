// ================================================================
// E-ZONE CART & SUB-ITEM VARIANTS ENGINE
// ================================================================
        function keepBagFixedOnPhysicalScreen() {
            const cartContainer = document.getElementById('cart-icon-container');
            if (!cartContainer) return;

            if (window.visualViewport) {
                const vv = window.visualViewport;
                const scale = vv.scale || 1;
                
                const offsetRight = (window.innerWidth - (vv.offsetLeft + vv.width));
                const offsetBottom = (window.innerHeight - (vv.offsetTop + vv.height));

                cartContainer.style.right = `${Math.max(16, offsetRight + 24)}px`;
                cartContainer.style.bottom = `${Math.max(16, offsetBottom + 24)}px`;
                cartContainer.style.transform = `scale(${1 / scale})`;
            }
        }

        if (typeof window !== 'undefined' && window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
            window.visualViewport.addEventListener('resize', keepBagFixedOnPhysicalScreen);
            window.visualViewport.addEventListener('scroll', keepBagFixedOnPhysicalScreen);
        }
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener('scroll', keepBagFixedOnPhysicalScreen, { passive: true });
            window.addEventListener('resize', keepBagFixedOnPhysicalScreen);
        }

        function toggleSubSectionInputs() {
            const isChecked = document.getElementById('enable-sub-section-toggle').checked;
            const wrap = document.getElementById('sub-section-inputs-wrap');
            if(isChecked) {
                wrap.classList.remove('hidden');
            } else {
                wrap.classList.add('hidden');
            }
        }

        function handleCardClickForVariants(id, event) {
            const p = products.find(item => item.id === id);
            if(!p) return;
            
            selectedSubItemData = { id, p };
            const titleEl = document.getElementById('modal-subitem-title');
            const listEl = document.getElementById('customer-variants-list');
            
            titleEl.innerText = p.name;
            listEl.innerHTML = "";
            
            let variantsMap = p.subVariantPrices || {};
            let keys = Object.keys(variantsMap);
            if(keys.length === 0) {
                if(p.isGiBox) keys = ["4*4", "4*6", "4*8", "4*10", "4*12"];
                else if(p.isShuttleClips) keys = ["4mm", "5mm", "6mm", "8mm", "10mm", "12mm", "14mm", "16mm", "20mm"];
                else if(p.isZipTie) keys = ["50mm", "100mm", "150mm", "200mm", "250mm", "300mm"];
                else if(p.isMcb) keys = ["6Amp", "10Amp", "16Amp", "20Amp", "25Amp", "32Amp", "40Amp"];
                else if(p.isDbBox) keys = ["2 Way", "4 Way", "6 Way", "8 Way", "10 Way", "12 Way", "18 Way"];
                else if(p.isBattery) keys = ["Pencil Battery (AA)", "AAA Battery", "C Battery", "D Battery", "9 Volt", "12 Volt"];
                else if(p.isWattBulb) keys = ["3W", "5W", "7W", "9W", "12W", "15W", "18W", "20W", "30W", "50W"];
                else if(p.isColorBulb) keys = ["Cool Day Light", "Warm White", "Red", "Blue", "Green", "Pink", "RGB Multi-Color"];
                else keys = ["Standard"];
            }

            keys.forEach(k => {
                let price = variantsMap[k] !== undefined ? variantsMap[k] : p.price;
                let btn = document.createElement('div');
                btn.className = "flex justify-between items-center bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-600 p-2.5 rounded-lg cursor-pointer transition shadow-sm";
                btn.innerHTML = `
                    <span class="font-bold text-xs text-cyan-950">${k}</span>
                    <div class="flex items-center gap-3">
                        <span class="font-black text-xs text-amber-600">₹${price}/-</span>
                        <span class="bg-teal-700 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">Add to Cart <i class="fas fa-cart-plus ml-0.5"></i></span>
                    </div>
                `;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    addToCartWithVariant(id, k, price, event);
                    closeSubItemModal();
                };
                listEl.appendChild(btn);
            });

            document.getElementById('subitem-modal').classList.remove('hidden');
        }

        function closeSubItemModal() {
            document.getElementById('subitem-modal').classList.add('hidden');
            selectedSubItemData = null;
        }

        function addToCart(id, event) {
            const p = products.find(item => item.id === id);
            if(!p) return;
            const currentQty = p.qty || 1;
            
            let existing = cart.find(item => item.id === id && !item.selectedVariant);
            if(existing) {
                existing.qty += currentQty;
            } else {
                cart.push({ ...p, qty: currentQty, selectedVariant: null });
            }
            updateCartCount();
            animateToBagMacGenie(event ? event.currentTarget : null);
        }

        function addToCartWithVariant(id, variantName, variantPrice, event) {
            const p = products.find(item => item.id === id);
            if(!p) return;
            const currentQty = p.qty || 1;
            
            let variantLabel = `[Option: ${variantName}]`;
            let existing = cart.find(item => item.id === id && item.selectedVariant === variantName);
            if(existing) {
                existing.qty += currentQty;
                existing.price = variantPrice;
            } else {
                cart.push({ 
                    ...p, 
                    name: `${p.name} ${variantLabel}`, 
                    price: variantPrice, 
                    qty: currentQty, 
                    selectedVariant: variantName 
                });
            }
            updateCartCount();
            animateToBagMacGenie(event ? event.currentTarget : null);
        }

        function openAdminPricingModal(id) {
            if(isPermanentlySaved) {
                alert("Website is permanently locked. Unlock system to configure prices.");
                return;
            }
            const p = products.find(item => item.id === id);
            if(!p) return;

            currentAdminPricingId = id;
            document.getElementById('admin-modal-title').innerText = `Configure Prices: ${p.name}`;
            const fieldsContainer = document.getElementById('admin-pricing-fields-container');
            fieldsContainer.innerHTML = "";

            let variantsMap = p.subVariantPrices || {};
            let keys = Object.keys(variantsMap);
            if(keys.length === 0) {
                if(p.isGiBox) keys = ["4*4", "4*6", "4*8", "4*10", "4*12"];
                else if(p.isShuttleClips) keys = ["4mm", "5mm", "6mm", "8mm", "10mm", "12mm", "14mm", "16mm", "20mm"];
                else if(p.isZipTie) keys = ["50mm", "100mm", "150mm", "200mm", "250mm", "300mm"];
                else if(p.isMcb) keys = ["6Amp", "10Amp", "16Amp", "20Amp", "25Amp", "32Amp", "40Amp"];
                else if(p.isDbBox) keys = ["2 Way", "4 Way", "6 Way", "8 Way", "10 Way", "12 Way", "18 Way"];
                else if(p.isBattery) keys = ["Pencil Battery (AA)", "AAA Battery", "C Battery", "D Battery", "9 Volt", "12 Volt"];
                else if(p.isWattBulb) keys = ["3W", "5W", "7W", "9W", "12W", "15W", "18W", "20W", "30W", "50W"];
                else if(p.isColorBulb) keys = ["Cool Day Light", "Warm White", "Red", "Blue", "Green", "Pink", "RGB Multi-Color"];
                else keys = ["Standard"];
            }

            keys.forEach(k => {
                let currentVal = variantsMap[k] !== undefined ? variantsMap[k] : p.price;
                let row = document.createElement('div');
                row.className = "flex items-center justify-between gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200 text-xs";
                row.innerHTML = `
                    <span class="font-bold text-cyan-950 w-36">${k}</span>
                    <div class="flex items-center gap-1">
                        <span class="font-bold text-gray-500">₹</span>
                        <input type="number" id="variant-price-input-${k.replace(/\s+/g, '-')}" value="${currentVal}" class="w-24 px-2 py-1 border border-teal-600 rounded text-center font-bold text-cyan-950 bg-white focus:outline-none focus:ring-1 focus:ring-teal-700">
                    </div>
                `;
                fieldsContainer.appendChild(row);
            });

            document.getElementById('admin-pricing-modal').classList.remove('hidden');
        }

        function closeAdminPricingModal() {
            document.getElementById('admin-pricing-modal').classList.add('hidden');
            currentAdminPricingId = null;
        }

        function saveAdminPricingVariants() {
            if(!currentAdminPricingId) return;
            const p = products.find(item => item.id === currentAdminPricingId);
            if(!p) return;

            let variantsMap = p.subVariantPrices || {};
            let keys = Object.keys(variantsMap);
            if(keys.length === 0) {
                if(p.isGiBox) keys = ["4*4", "4*6", "4*8", "4*10", "4*12"];
                else if(p.isShuttleClips) keys = ["4mm", "5mm", "6mm", "8mm", "10mm", "12mm", "14mm", "16mm", "20mm"];
                else if(p.isZipTie) keys = ["50mm", "100mm", "150mm", "200mm", "250mm", "300mm"];
                else if(p.isMcb) keys = ["6Amp", "10Amp", "16Amp", "20Amp", "25Amp", "32Amp", "40Amp"];
                else if(p.isDbBox) keys = ["2 Way", "4 Way", "6 Way", "8 Way", "10 Way", "12 Way", "18 Way"];
                else if(p.isBattery) keys = ["Pencil Battery (AA)", "AAA Battery", "C Battery", "D Battery", "9 Volt", "12 Volt"];
                else if(p.isWattBulb) keys = ["3W", "5W", "7W", "9W", "12W", "15W", "18W", "20W", "30W", "50W"];
                else if(p.isColorBulb) keys = ["Cool Day Light", "Warm White", "Red", "Blue", "Green", "Pink", "RGB Multi-Color"];
                else keys = ["Standard"];
            }

            if(!p.subVariantPrices) p.subVariantPrices = {};

            keys.forEach(k => {
                const inputEl = document.getElementById(`variant-price-input-${k.replace(/\s+/g, '-')}`);
                if(inputEl) {
                    let val = parseFloat(inputEl.value);
                    if(!isNaN(val)) {
                        p.subVariantPrices[k] = val;
                    }
                }
            });

            saveDataToStorage();
            closeAdminPricingModal();
            renderProducts();
            updateAllWhatsAppLinks();
            alert("Variant prices saved successfully!");
        }

        function updateCartCount() {
            let totalItems = 0;
            cart.forEach(item => totalItems += item.qty);
            const floatingCount = document.getElementById('cart-count');
            if (floatingCount) floatingCount.innerText = totalItems;
            const navCount = document.getElementById('nav-cart-count');
            if (navCount) navCount.innerText = totalItems;
        }

        function animateToBagMacGenie(btnEl) {
            const bagIcon = document.getElementById('nav-cart-btn') || document.getElementById('cart-icon');
            if(!bagIcon) return;

            const bagRect = bagIcon.getBoundingClientRect();
            let startX = window.innerWidth / 2;
            let startY = window.innerHeight / 2;
            let startWidth = 140;
            let startHeight = 90;

            if (btnEl) {
                const cardEl = btnEl.closest('.product-card') || btnEl;
                const cardRect = cardEl.getBoundingClientRect();
                startX = cardRect.left;
                startY = cardRect.top;
                startWidth = cardRect.width;
                startHeight = Math.min(cardRect.height, 160);
            }

            const targetX = bagRect.left + (bagRect.width / 2) - (startWidth / 2);
            const targetY = bagRect.top + (bagRect.height / 2) - (startHeight / 2);

            const tx = targetX - startX;
            const ty = targetY - startY;

            const fly = document.createElement('div');
            fly.className = 'macos-genie-fly bg-gradient-to-br from-teal-700 to-teal-900 border-2 border-teal-400 text-white flex flex-col items-center justify-center p-2';
            fly.style.left = startX + 'px';
            fly.style.top = startY + 'px';
            fly.style.width = startWidth + 'px';
            fly.style.height = startHeight + 'px';
            fly.style.setProperty('--tx', `${tx}px`);
            fly.style.setProperty('--ty', `${ty}px`);

            fly.innerHTML = `
                <i class="fas fa-box-open text-amber-300 text-2xl mb-1"></i>
                <span class="text-[10px] font-bold tracking-wider uppercase text-teal-100">Adding to Bag...</span>
            `;

            document.body.appendChild(fly);

            setTimeout(() => {
                bagIcon.classList.remove('bag-bounce');
                void bagIcon.offsetWidth;
                bagIcon.classList.add('bag-bounce');
            }, 350);

            setTimeout(() => {
                fly.remove();
            }, 450);
        }

        function openCartWhatsApp() {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add items using the ADD TO BAG button.");
                return;
            }
            renderCartSummary();
            const modal = document.getElementById('cart-summary-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.classList.add('overflow-hidden');

            const cartContainer = document.getElementById('cart-icon-container');
            if (cartContainer) {
                cartContainer.style.opacity = '0';
                cartContainer.style.visibility = 'hidden';
                cartContainer.style.pointerEvents = 'none';
            }
        }

        function closeCartSummary() {
            const modal = document.getElementById('cart-summary-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');

            const cartContainer = document.getElementById('cart-icon-container');
            if (cartContainer && document.body.classList.contains('home-loaded')) {
                cartContainer.style.opacity = '1';
                cartContainer.style.visibility = 'visible';
                cartContainer.style.pointerEvents = 'auto';
            }
        }

        function removeFromCart(index) {
            if (index < 0 || index >= cart.length) return;
            cart.splice(index, 1);
            updateCartCount();

            if (cart.length === 0) {
                closeCartSummary();
                return;
            }
            renderCartSummary();
        }

        function changeCartItemQty(index, delta) {
            if (index < 0 || index >= cart.length) return;
            const item = cart[index];
            item.qty = Math.max(1, (Number(item.qty) || 1) + delta);
            updateCartCount();
            renderCartSummary();
        }

        function getDiscountInfo(item) {
            const d = Number(item?.discountPercent);
            const discountPercent = Number.isFinite(d) ? Math.min(90, Math.max(0, d)) : 20;
            const salePrice = Math.max(0, Number(item?.price) || 0);

            /*
             * The website stores the customer-facing Selling Price + Discount %.
             * MRP is reconstructed from those two values, so the same MRP remains
             * stable after a price edit when the discount is recalculated automatically.
             */
            const mrp = discountPercent > 0
                ? (salePrice / (1 - discountPercent / 100))
                : salePrice;

            const savings = Math.max(0, mrp - salePrice);
            return {
                discountPercent,
                salePrice,
                mrp,
                savings
            };
        }

        function calculateDiscountFromMrp(mrp, sellingPrice) {
            const baseMrp = Number(mrp);
            const newPrice = Number(sellingPrice);

            if (!Number.isFinite(baseMrp) || baseMrp <= 0 || !Number.isFinite(newPrice) || newPrice < 0) {
                return 0;
            }

            const raw = ((baseMrp - newPrice) / baseMrp) * 100;
            return Math.min(90, Math.max(0, Math.round(raw * 100) / 100));
        }

        if (typeof window !== "undefined") {
            window.keepBagFixedOnPhysicalScreen = keepBagFixedOnPhysicalScreen;
            window.toggleSubSectionInputs = toggleSubSectionInputs;
            window.handleCardClickForVariants = handleCardClickForVariants;
            window.addToCart = addToCart;
            window.updateCartCount = updateCartCount;
            window.openCartWhatsApp = openCartWhatsApp;
            window.closeCartSummary = closeCartSummary;
            window.removeFromCart = removeFromCart;
            window.changeCartItemQty = changeCartItemQty;
            window.getDiscountInfo = getDiscountInfo;
            window.calculateDiscountFromMrp = calculateDiscountFromMrp;
        }
