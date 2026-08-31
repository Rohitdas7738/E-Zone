// ================================================================
// E-ZONE UNIVERSAL PRODUCT SHARE MODULE
// ================================================================

(function () {
    'use strict';

    let currentShareProduct = null;

    /**
     * Resolve product object from ID or object
     */
    function resolveProduct(productOrId) {
        if (!productOrId) return null;
        if (typeof productOrId === 'object' && productOrId.name) return productOrId;
        const idStr = String(productOrId);
        if (typeof products !== 'undefined' && Array.isArray(products)) {
            const found = products.find(p => String(p.id) === idStr);
            if (found) return found;
        }
        if (typeof currentProduct !== 'undefined' && currentProduct && String(currentProduct.id) === idStr) {
            return currentProduct;
        }
        return { id: idStr, name: 'Product ' + idStr, price: 0, brand: 'E-ZONE', category: 'Electrical' };
    }

    /**
     * Get absolute canonical URL for a product
     */
    function getProductUrl(productId) {
        try {
            const loc = window.location;
            let baseUrl = loc.origin + loc.pathname;
            // If already on product.html or index.html, replace appropriately
            if (baseUrl.endsWith('/index.html') || baseUrl.endsWith('/')) {
                baseUrl = baseUrl.replace(/\/index\.html$/, '/').replace(/\/+$/, '') + '/product.html';
            } else if (baseUrl.endsWith('.html')) {
                baseUrl = baseUrl.replace(/\/[^\/]+\.html$/, '/product.html');
            } else {
                baseUrl = baseUrl.replace(/\/+$/, '') + '/product.html';
            }
            return `${baseUrl}?id=${encodeURIComponent(productId)}`;
        } catch (e) {
            return `product.html?id=${encodeURIComponent(productId)}`;
        }
    }

    /**
     * Get share text metadata
     */
    function getShareData(product) {
        const p = resolveProduct(product);
        if (!p) return null;

        const displayName = (typeof getLocalizedProductName === 'function') ? getLocalizedProductName(p.name) : p.name;
        const brand = p.brand || 'E-ZONE';
        const price = p.price ? `₹${Number(p.price).toLocaleString('en-IN')}/-` : '';
        const url = getProductUrl(p.id);

        const title = `${displayName} | E-ZONE Electric Shop`;
        const text = `⚡ Check out "${displayName}" (${brand}${price ? ' - ' + price : ''}) at E-ZONE Electric Shop Kataganj! Best rates guaranteed.`;
        
        return {
            product: p,
            displayName,
            brand,
            price,
            url,
            title,
            text
        };
    }

    /**
     * Main Share function - triggers Web Share API or opens custom modal
     */
    window.shareProduct = function (productOrId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        const data = getShareData(productOrId);
        if (!data) return;

        // Try Web Share API (native share on mobile/modern browsers)
        if (navigator.share && typeof navigator.share === 'function') {
            navigator.share({
                title: data.title,
                text: data.text,
                url: data.url
            }).then(() => {
                if (typeof showToastMessage === 'function') {
                    showToastMessage('✨ Shared successfully!');
                }
            }).catch((err) => {
                // If user aborted/cancelled, do nothing. If not supported, open modal.
                if (err && err.name !== 'AbortError') {
                    openShareModal(data.product);
                }
            });
        } else {
            // Fallback to rich in-app Share Modal
            openShareModal(data.product);
        }
    };

    /**
     * Fast 1-Click Copy Link with Toast
     */
    window.copyProductLink = function (productOrId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        const data = getShareData(productOrId);
        if (!data) return;

        copyTextToClipboard(data.url, () => {
            if (typeof showToastMessage === 'function') {
                showToastMessage(`🔗 Copied link for "${data.displayName}"!`);
            } else {
                alert(`Link copied: ${data.url}`);
            }
        });
    };

    /**
     * Open custom styled Share Modal
     */
    window.openShareModal = function (productOrId) {
        const data = getShareData(productOrId);
        if (!data) return;
        currentShareProduct = data;

        ensureShareModalExists();

        // Populate Modal Fields
        const modal = document.getElementById('share-product-modal');
        if (!modal) return;

        const p = data.product;
        const imgUrl = p.customImage || (typeof getEmbeddedProductImage === 'function' ? getEmbeddedProductImage(p) : '') || 'images/logo.webp';

        document.getElementById('share-modal-title').textContent = data.displayName;
        document.getElementById('share-modal-brand').textContent = `${data.brand} • ${p.category || 'Electric'}`;
        document.getElementById('share-modal-price').textContent = data.price || `₹${p.price}/-`;
        document.getElementById('share-modal-url-input').value = data.url;

        const imgEl = document.getElementById('share-modal-img');
        if (imgEl) {
            imgEl.src = imgUrl;
            imgEl.onerror = function () { this.onerror = null; this.src = 'images/logo.png'; };
        }

        // Generate QR code inside modal if qrcodejs is loaded
        const qrContainer = document.getElementById('share-modal-qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            if (typeof QRCode !== 'undefined') {
                try {
                    new QRCode(qrContainer, {
                        text: data.url,
                        width: 84,
                        height: 84,
                        colorDark: '#042f2e',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.M
                    });
                } catch (e) {
                    qrContainer.innerHTML = '<i class="fas fa-qrcode text-3xl text-teal-700"></i>';
                }
            } else {
                qrContainer.innerHTML = '<i class="fas fa-qrcode text-3xl text-teal-700"></i>';
            }
        }

        // Update Direct Social Share Links
        const waMsg = encodeURIComponent(`⚡ *${data.displayName}*\nBrand: ${data.brand}\nPrice: ${data.price}\n\n👉 View Product Details:\n${data.url}\n\nE-ZONE Electric Shop Kataganj | 📞 8276969741`);
        const waBtn = document.getElementById('share-btn-whatsapp');
        if (waBtn) waBtn.href = `https://api.whatsapp.com/send?text=${waMsg}`;

        const fbBtn = document.getElementById('share-btn-facebook');
        if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;

        const twBtn = document.getElementById('share-btn-twitter');
        if (twBtn) twBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;

        const tgBtn = document.getElementById('share-btn-telegram');
        if (tgBtn) tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`;

        const emailSubj = encodeURIComponent(`Check out ${data.displayName} at E-ZONE Electric`);
        const emailBody = encodeURIComponent(`Hi,\n\nI found this product on E-ZONE Electric Shop:\n\n${data.displayName}\nBrand: ${data.brand}\nPrice: ${data.price}\n\nProduct Link:\n${data.url}\n\nE-ZONE Electric - Kataganj, Nadia.`);
        const emBtn = document.getElementById('share-btn-email');
        if (emBtn) emBtn.href = `mailto:?subject=${emailSubj}&body=${emailBody}`;

        // Reset copy button state
        const copyBtnText = document.getElementById('share-modal-copy-btn-text');
        if (copyBtnText) copyBtnText.textContent = 'Copy';

        // Show Modal with Animation
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    /**
     * Close Share Modal
     */
    window.closeShareModal = function () {
        const modal = document.getElementById('share-product-modal');
        if (!modal) return;
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    /**
     * Handle Copy inside Modal
     */
    window.handleModalCopyLink = function () {
        const input = document.getElementById('share-modal-url-input');
        if (!input) return;
        const text = input.value;

        copyTextToClipboard(text, () => {
            const copyBtnText = document.getElementById('share-modal-copy-btn-text');
            const copyBtnIcon = document.getElementById('share-modal-copy-btn-icon');
            if (copyBtnText) copyBtnText.textContent = 'Copied!';
            if (copyBtnIcon) copyBtnIcon.className = 'fas fa-check text-emerald-400';

            if (typeof showToastMessage === 'function') {
                showToastMessage('✅ Link copied to clipboard!');
            }

            setTimeout(() => {
                if (copyBtnText) copyBtnText.textContent = 'Copy';
                if (copyBtnIcon) copyBtnIcon.className = 'fas fa-copy';
            }, 2500);
        });
    };

    /**
     * Copy to clipboard helper
     */
    function copyTextToClipboard(text, onSuccess) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
                fallbackCopyText(text, onSuccess);
            });
        } else {
            fallbackCopyText(text, onSuccess);
        }
    }

    function fallbackCopyText(text, onSuccess) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            if (onSuccess) onSuccess();
        } catch (e) {
            prompt('Copy this link:', text);
        }
    }

    /**
     * Ensure Share Modal DOM structure is ready
     */
    function ensureShareModalExists() {
        if (document.getElementById('share-product-modal')) return;

        const modalHtml = `
        <div id="share-product-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000001] hidden items-center justify-center p-3 sm:p-4" onclick="if(event.target===this) closeShareModal()">
            <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-teal-700/40 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                
                <!-- Header -->
                <div class="bg-gradient-to-r from-cyan-950 via-teal-900 to-teal-800 text-white px-5 py-4 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-amber-400 text-cyan-950 flex items-center justify-center text-sm font-black shadow">
                            <i class="fas fa-share-alt"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-black tracking-wide leading-tight">Share Product</h3>
                            <p class="text-[10px] text-teal-200 font-medium">E-ZONE Electric Catalog</p>
                        </div>
                    </div>
                    <button type="button" onclick="closeShareModal()" class="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-sm transition cursor-pointer" aria-label="Close Share Modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Product Preview Snippet -->
                <div class="p-4 sm:p-5 space-y-4">
                    <div class="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3">
                        <div class="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <img id="share-modal-img" src="images/logo.webp" alt="Product" class="w-full h-full object-contain" onerror="this.src='images/logo.png'">
                        </div>
                        <div class="flex-1 min-w-0">
                            <div id="share-modal-brand" class="text-[10px] font-black uppercase tracking-wider text-teal-700 truncate">E-ZONE • Electrical</div>
                            <h4 id="share-modal-title" class="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 mt-0.5">Product Name</h4>
                            <div class="flex items-center gap-2 mt-1">
                                <span id="share-modal-price" class="text-xs sm:text-sm font-black text-emerald-700">₹0/-</span>
                                <span class="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full">Genuine E-Zone Item</span>
                            </div>
                        </div>
                    </div>

                    <!-- Social Channels Grid -->
                    <div>
                        <label class="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 block">Share Directly Via</label>
                        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 text-center">
                            
                            <!-- WhatsApp -->
                            <a id="share-btn-whatsapp" href="#" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center justify-center p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition-all hover:scale-105 shadow-sm">
                                <div class="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg mb-1 group-hover:bg-white group-hover:text-emerald-600 transition shadow">
                                    <i class="fab fa-whatsapp"></i>
                                </div>
                                <span class="text-[10px] font-bold truncate w-full">WhatsApp</span>
                            </a>

                            <!-- Facebook -->
                            <a id="share-btn-facebook" href="#" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center justify-center p-2 rounded-2xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition-all hover:scale-105 shadow-sm">
                                <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-base mb-1 group-hover:bg-white group-hover:text-blue-600 transition shadow">
                                    <i class="fab fa-facebook-f"></i>
                                </div>
                                <span class="text-[10px] font-bold truncate w-full">Facebook</span>
                            </a>

                            <!-- X (Twitter) -->
                            <a id="share-btn-twitter" href="#" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-100 hover:bg-black text-slate-800 hover:text-white border border-slate-300 transition-all hover:scale-105 shadow-sm">
                                <div class="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm mb-1 group-hover:bg-white group-hover:text-black transition shadow">
                                    <i class="fab fa-x-twitter"></i>
                                </div>
                                <span class="text-[10px] font-bold truncate w-full">X / Twitter</span>
                            </a>

                            <!-- Telegram -->
                            <a id="share-btn-telegram" href="#" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center justify-center p-2 rounded-2xl bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white border border-sky-200 transition-all hover:scale-105 shadow-sm">
                                <div class="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center text-base mb-1 group-hover:bg-white group-hover:text-sky-500 transition shadow">
                                    <i class="fab fa-telegram-plane"></i>
                                </div>
                                <span class="text-[10px] font-bold truncate w-full">Telegram</span>
                            </a>

                            <!-- Email -->
                            <a id="share-btn-email" href="#" class="group flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-200 transition-all hover:scale-105 shadow-sm hidden sm:flex">
                                <div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-base mb-1 group-hover:bg-white group-hover:text-amber-600 transition shadow">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <span class="text-[10px] font-bold truncate w-full">Email</span>
                            </a>
                        </div>
                    </div>

                    <!-- Copy Link Input Row -->
                    <div class="space-y-1.5 pt-1">
                        <label class="text-[11px] font-black uppercase tracking-wider text-slate-500 block">Product Direct Link</label>
                        <div class="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-2xl p-1.5">
                            <input type="text" id="share-modal-url-input" readonly class="w-full bg-transparent px-2.5 text-xs text-slate-700 font-mono truncate focus:outline-none select-all" value="">
                            <button type="button" onclick="handleModalCopyLink()" class="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow">
                                <i id="share-modal-copy-btn-icon" class="fas fa-copy"></i>
                                <span id="share-modal-copy-btn-text">Copy</span>
                            </button>
                        </div>
                    </div>

                    <!-- QR Code Quick Scan Row -->
                    <div class="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-3 border border-teal-200 flex items-center gap-3">
                        <div id="share-modal-qrcode" class="w-[84px] h-[84px] bg-white rounded-xl border border-teal-200 p-1 flex items-center justify-center shrink-0 shadow-inner">
                            <!-- QR Injected Here -->
                        </div>
                        <div>
                            <p class="text-xs font-black text-teal-900 leading-tight">Instant QR Scan</p>
                            <p class="text-[10px] text-slate-600 leading-relaxed mt-0.5">Scan with any mobile camera or UPI/QR scanner to open this exact product instantly.</p>
                        </div>
                    </div>

                </div>

                <!-- Footer -->
                <div class="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>E-ZONE Electric Store</span>
                    <button type="button" onclick="closeShareModal()" class="text-teal-700 hover:text-teal-900 font-bold cursor-pointer">Done</button>
                </div>

            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Auto-setup on document ready
    document.addEventListener('DOMContentLoaded', () => {
        ensureShareModalExists();
    });

})();
