        /* ================================================================
         * DYNAMIC UPI PAYMENT QR
         * Same UPI account as the original QR: 9330507738@ybl
         * The amount is generated from the exact final cart total.
         * ================================================================ */
        function updateDynamicPaymentQR(grandTotal) {
            const qrImage = document.getElementById('payment-qr-image');
            const amountLabel = document.getElementById('payment-qr-amount');
            if (!qrImage || !Number.isFinite(Number(grandTotal)) || Number(grandTotal) <= 0) return;

            const exactAmount = Math.round(Number(grandTotal) * 100) / 100;
            const upiPayload =
                'upi://pay?pa=' + encodeURIComponent('9330507738@ybl') +
                '&pn=' + encodeURIComponent('ROHIT DAS') +
                '&am=' + encodeURIComponent(exactAmount.toFixed(2)) +
                '&cu=INR' +
                '&tn=' + encodeURIComponent('E-ZONE Electric Order');

            if (amountLabel) {
                amountLabel.textContent = 'Scan to pay exact final amount: ₹' + exactAmount.toLocaleString('en-IN') + '/-';
            }

            /* Keep the original QR visible if the external QR engine is unavailable.
               Retry once after the CDN has had time to finish loading. */
            if (typeof QRCode === 'undefined') {
                if (!qrImage.dataset.qrRetryScheduled) {
                    qrImage.dataset.qrRetryScheduled = '1';
                    setTimeout(function(){
                        qrImage.dataset.qrRetryScheduled = '';
                        updateDynamicPaymentQR(grandTotal);
                    }, 700);
                }
                return;
            }

            let generator = document.getElementById('payment-qr-generator');
            if (!generator) {
                generator = document.createElement('div');
                generator.id = 'payment-qr-generator';
                document.body.appendChild(generator);
            }

            try {
                generator.innerHTML = '';
                new QRCode(generator, {
                    text: upiPayload,
                    width: 250,
                    height: 250,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });

                const canvas = generator.querySelector('canvas');
                const generatedImg = generator.querySelector('img');

                if (canvas && canvas.toDataURL) {
                    qrImage.src = canvas.toDataURL('image/png');
                    qrImage.removeAttribute('srcset');
                } else if (generatedImg && generatedImg.src) {
                    qrImage.src = generatedImg.src;
                    qrImage.removeAttribute('srcset');
                }

                qrImage.dataset.upiPayload = upiPayload;
                qrImage.dataset.paymentAmount = exactAmount.toFixed(2);
            } catch (e) {
                /* Fallback is intentionally silent: the original static QR remains usable. */
                console.warn('Dynamic UPI QR generation failed; original QR retained.', e);
            }
        }

        function renderCartSummary() {
            const list = document.getElementById('cart-summary-items');
            const empty = document.getElementById('cart-summary-empty');
            const totalBox = document.getElementById('cart-summary-total');
            const totalEl = document.getElementById('cart-summary-grand-total');
            if (!list || !empty || !totalBox || !totalEl) return;

            if (cart.length === 0) {
                list.innerHTML = '';
                empty.classList.remove('hidden');
                totalBox.classList.add('hidden');
                totalEl.innerText = '₹0/-';
                return;
            }

            empty.classList.add('hidden');
            totalBox.classList.remove('hidden');

            let mrpGrandTotal = 0;
            let grandTotal = 0;
            let totalSavings = 0;

            list.innerHTML = cart.map((item, index) => {
                const qty = Math.max(1, Number(item.qty) || 1);
                const info = getDiscountInfo(item);
                const itemTotal = info.salePrice * qty;
                const itemMrpTotal = info.mrp * qty;
                const itemSavings = info.savings * qty;

                mrpGrandTotal += itemMrpTotal;
                grandTotal += itemTotal;
                totalSavings += itemSavings;

                const safeName = String(item.name || 'Product').replace(/[<>&"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]));
                const safeBrand = String(item.brand || '—').replace(/[<>&"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]));
                const safeVariant = item.selectedVariant
                    ? `<div class="text-[10px] text-teal-700 font-bold mt-0.5">${String(item.selectedVariant).replace(/[<>&"]/g, ch => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]))}</div>`
                    : '';

                return `
                    <div class="rounded-2xl border border-gray-200 bg-white p-3 md:p-4 shadow-sm flex gap-3 items-center">
                        <div class="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                            ${item.image
                                ? `<img src="${item.image}" alt="" class="w-full h-full object-contain">`
                                : `<span class="text-2xl">${item.emoji || '📦'}`}
                            ${info.discountPercent > 0 ? `<span class="absolute top-0.5 right-0.5 bg-yellow-300 text-yellow-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow">${info.discountPercent}% OFF</span>` : ''}
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="font-black text-cyan-950 text-sm md:text-base truncate">${safeName}</div>
                            <div class="text-[10px] md:text-xs text-gray-500 font-bold">${safeBrand}</div>
                            ${safeVariant}
                            <div class="flex flex-wrap items-baseline gap-2 mt-1">
                                ${info.discountPercent > 0 ? `<span class="text-[10px] text-gray-400 line-through">₹${info.mrp.toLocaleString('en-IN')}</span>` : ''}
                                <span class="text-sm text-emerald-700 font-black">₹${info.salePrice.toLocaleString('en-IN')}</span>
                                ${info.discountPercent > 0 ? `<span class="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">${info.discountPercent}% OFF</span>` : ''}
                            </div>
                            <div class="text-[10px] text-gray-500 font-semibold mt-0.5">₹${info.salePrice.toLocaleString('en-IN')} × ${qty} = <b class="text-teal-800">₹${itemTotal.toLocaleString('en-IN')}</b></div>
                            ${info.discountPercent > 0 ? `<div class="text-[9px] text-emerald-700 font-bold mt-0.5">You save ₹${itemSavings.toLocaleString('en-IN')}</div>` : ''}
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button type="button" onclick="changeCartItemQty(${index}, -1)" class="w-7 h-7 bg-gray-50 hover:bg-gray-100 font-black cursor-pointer">−</button>
                                <span class="w-8 text-center text-xs font-black">${qty}</span>
                                <button type="button" onclick="changeCartItemQty(${index}, 1)" class="w-7 h-7 bg-gray-50 hover:bg-gray-100 font-black cursor-pointer">+</button>
                            </div>
                            <button type="button" onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800 text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer">
                                <i class="fas fa-trash-alt"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            totalEl.innerText = `₹${grandTotal.toLocaleString('en-IN')}/-`;
            updateDynamicPaymentQR(grandTotal);

            // Add a professional marketplace-style savings breakdown without changing the existing modal structure.
            let breakdown = document.getElementById('discount-summary-breakdown');
            if (!breakdown) {
                breakdown = document.createElement('div');
                breakdown.id = 'discount-summary-breakdown';
                totalBox.appendChild(breakdown);
            }
            breakdown.innerHTML = `
                <div class="mt-3 pt-3 border-t border-amber-200 space-y-1.5 text-xs">
                    <div class="flex justify-between gap-3"><span class="text-gray-500">Total MRP</span><span class="font-bold text-gray-500 line-through">₹${Math.round(mrpGrandTotal).toLocaleString('en-IN')}</span></div>
                    <div class="flex justify-between gap-3"><span class="text-amber-700 font-black">Total Discount</span><span class="font-black text-amber-700">− ₹${Math.round(totalSavings).toLocaleString('en-IN')}</span></div>
                    <div class="flex justify-between gap-3 pt-1"><span class="font-black text-cyan-950">You Pay</span><span class="font-black text-emerald-700">₹${Math.round(grandTotal).toLocaleString('en-IN')}/-</span></div>
                </div>`;
        }

        function placeOrderOnWhatsApp() {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add products first.");
                return;
            }

            const customerName = document.getElementById('order-customer-name').value.trim();
            const customerPhone = document.getElementById('order-customer-phone').value.trim();
            const customerAddress = document.getElementById('order-customer-address').value.trim();

            if (!customerName || !customerPhone || !customerAddress) {
                alert("Please enter your Name, Phone Number and Proper Address before placing the order.");
                return;
            }

            const digitsOnly = customerPhone.replace(/\D/g, '');
            if (digitsOnly.length < 10) {
                alert("Please enter a valid phone number.");
                return;
            }

            let msg = "Hi E-ZONE Electric, I want to place an order.\n\n";
            msg += "👤 CUSTOMER DETAILS:\n";
            msg += `• Name: ${customerName}\n`;
            msg += `• Phone: ${customerPhone}\n`;
            msg += `• Address: ${customerAddress}\n\n`;
            msg += "🛒 FINAL PRODUCT SUMMARY WITH DISCOUNT:\n";

            let mrpGrandTotal = 0;
            let grandTotal = 0;
            let totalSavings = 0;

            cart.forEach((item, index) => {
                const qty = Math.max(1, Number(item.qty) || 1);
                const info = getDiscountInfo(item);
                const itemTotal = info.salePrice * qty;
                const itemMrpTotal = info.mrp * qty;
                const itemSavings = info.savings * qty;

                mrpGrandTotal += itemMrpTotal;
                grandTotal += itemTotal;
                totalSavings += itemSavings;

                msg += `${index + 1}. ${item.name}`;
                if (item.brand) msg += ` (${item.brand})`;
                if (item.selectedVariant) msg += ` - ${item.selectedVariant}`;
                msg += `\n   Quantity: ${qty} Pcs\n`;
                if (info.discountPercent > 0) {
                    msg += `   MRP: ₹${Math.round(info.mrp)}/-\n`;
                    msg += `   Discount: ${info.discountPercent}% OFF (Save ₹${Math.round(info.savings)}/- per piece)\n`;
                }
                msg += `   Selling Price: ₹${info.salePrice}/-\n`;
                msg += `   Item Total: ₹${Math.round(itemTotal)}/-\n\n`;
            });

            msg += "----------------------------------\n";
            msg += `Total MRP: ₹${Math.round(mrpGrandTotal)}/-\n`;
            msg += `Total Discount: ₹${Math.round(totalSavings)}/-\n`;
            msg += `FINAL PAYABLE AMOUNT: ₹${Math.round(grandTotal)}/-\n\n`;
            msg += "💳 PAYMENT & UPI DETAILS:\n";
            msg += "• UPI ID: 9330507738@ybl\n";
            msg += "• Receiver Name: ROHIT DAS\n";
            msg += "• Payment QR Code is displayed on the final order summary page.\n";
            msg += "• After payment, please share the payment screenshot here to confirm the order.";

            const encoded = encodeURIComponent(msg);
            window.open(`https://wa.me/919330507738?text=${encoded}`, '_blank');
        }

        if (typeof window !== "undefined") {
            window.renderCartSummary = renderCartSummary;
            window.updateDynamicPaymentQR = updateDynamicPaymentQR;
            window.placeOrderOnWhatsApp = placeOrderOnWhatsApp;
        }
