// ================================================================
// E-ZONE WISHLIST MODULE
// ================================================================

(function(){
    let wishlist = [];

    function loadWishlist() {
        try {
            const stored = localStorage.getItem('ezone_wishlist');
            wishlist = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(wishlist)) wishlist = [];
        } catch(e) {
            wishlist = [];
        }
        updateWishlistCount();
    }

    function saveWishlist() {
        try {
            localStorage.setItem('ezone_wishlist', JSON.stringify(wishlist));
        } catch(e) {}
        updateWishlistCount();
    }

    function isWishlisted(id) {
        return wishlist.includes(String(id));
    }

    function updateWishlistCount() {
        const count = wishlist.length;
        const navBadge = document.getElementById('nav-wishlist-count');
        if (navBadge) {
            navBadge.textContent = count;
            navBadge.style.display = count > 0 ? 'flex' : 'none';
        }
        const countText = document.getElementById('wishlist-items-count-text');
        if (countText) {
            countText.textContent = `${count} ${count === 1 ? 'item' : 'items'} saved`;
        }
        const addAllBtn = document.getElementById('wishlist-add-all-btn');
        if (addAllBtn) {
            addAllBtn.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    window.toggleWishlistItem = function(id, event) {
        if (event) event.stopPropagation();
        const strId = String(id);
        const index = wishlist.indexOf(strId);
        let added = false;

        if (index > -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(strId);
            added = true;
        }

        saveWishlist();

        // Update all heart icons on page
        document.querySelectorAll(`[data-wishlist-id="${strId}"]`).forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (added) {
                    icon.className = 'fas fa-heart text-rose-600 text-sm';
                    btn.classList.add('wishlisted');
                } else {
                    icon.className = 'far fa-heart text-gray-400 hover:text-rose-500 text-sm';
                    btn.classList.remove('wishlisted');
                }
            }
        });

        // Show toast
        const p = typeof products !== 'undefined' ? products.find(x => String(x.id) === strId) : null;
        const name = p ? p.name : 'Item';
        if (typeof showToastMessage === 'function') {
            showToastMessage(added ? `❤️ Added "${name}" to Wishlist` : `Removed from Wishlist`);
        }

        // If modal open, re-render
        const modal = document.getElementById('wishlist-modal');
        if (modal && !modal.classList.contains('hidden')) {
            renderWishlistItems();
        }
    };

    window.openWishlistModal = function() {
        const modal = document.getElementById('wishlist-modal');
        if (!modal) return;
        renderWishlistItems();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    window.closeWishlistModal = function() {
        const modal = document.getElementById('wishlist-modal');
        if (!modal) return;
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    function renderWishlistItems() {
        const container = document.getElementById('wishlist-items-container');
        if (!container) return;

        if (wishlist.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 px-4 space-y-3">
                    <div class="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                        <i class="far fa-heart"></i>
                    </div>
                    <h4 class="text-base font-black text-gray-800">Your Wishlist is Empty</h4>
                    <p class="text-xs text-gray-500 max-w-xs mx-auto">Explore our store and tap the heart icon on any product to save your favorite electrical goods here!</p>
                    <button type="button" onclick="closeWishlistModal()" class="mt-2 bg-gradient-to-r from-rose-600 to-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow hover:opacity-95 transition cursor-pointer">
                        Browse Products
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        wishlist.forEach(id => {
            const p = typeof products !== 'undefined' ? products.find(x => String(x.id) === String(id)) : null;
            if (!p) return;

            const mrp = (p.price * 1.25).toFixed(0);
            const discount = p.discountPercent || 20;
            const imgUrl = p.customImage || (typeof getEmbeddedProductImage === 'function' ? getEmbeddedProductImage(p) : 'images/logo.webp') || 'images/logo.webp';
            const displayName = typeof getLocalizedProductName === 'function' ? getLocalizedProductName(p.name) : p.name;

            html += `
                <div class="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center gap-3.5">
                    <div class="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img src="${imgUrl}" alt="${displayName}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='images/logo.png';">
                    </div>
                    <div class="flex-1 min-w-0 text-center sm:text-left">
                        <div class="text-[10px] font-black text-teal-700 uppercase tracking-wider">${p.brand || 'E-ZONE'} • ${p.category}</div>
                        <h4 class="font-bold text-xs text-gray-900 leading-tight truncate mt-0.5" title="${displayName}">${displayName}</h4>
                        <div class="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                            <span class="text-sm font-black text-emerald-700">₹${Number(p.price).toLocaleString('en-IN')}/-</span>
                            <span class="text-[10px] text-gray-400 line-through">₹${mrp}</span>
                            <span class="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">${discount}% OFF</span>
                        </div>
                    </div>
                    <div class="flex sm:flex-col gap-1.5 w-full sm:w-auto shrink-0 justify-end">
                        <button type="button" onclick="moveWishlistToCart('${p.id}', event)" class="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer">
                            <i class="fas fa-cart-plus"></i> Add to Bag
                        </button>
                        <div class="flex gap-1.5 w-full">
                            <button type="button" onclick="if(window.shareProduct) window.shareProduct('${p.id}', event)" class="flex-1 bg-slate-100 hover:bg-teal-50 text-teal-800 text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-1 shadow-sm transition cursor-pointer" title="Share Product">
                                <i class="fas fa-share-alt text-teal-700"></i> Share
                            </button>
                            <button type="button" onclick="toggleWishlistItem('${p.id}', event)" class="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer" title="Remove from Wishlist">
                                <i class="fas fa-trash-alt"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    window.moveWishlistToCart = function(id, event) {
        if (event) event.stopPropagation();
        if (typeof window.addToCart === 'function') {
            window.addToCart(id, event);
        }
        // Remove from wishlist
        const index = wishlist.indexOf(String(id));
        if (index > -1) {
            wishlist.splice(index, 1);
            saveWishlist();
            renderWishlistItems();
        }
    };

    window.addAllWishlistToCart = function() {
        if (wishlist.length === 0) return;
        const copy = [...wishlist];
        copy.forEach(id => {
            if (typeof window.addToCart === 'function') {
                window.addToCart(id);
            }
        });
        wishlist = [];
        saveWishlist();
        renderWishlistItems();
        if (typeof showToastMessage === 'function') {
            showToastMessage("🎉 All wishlist items moved to your shopping bag!");
        }
    };

    window.clearWishlist = function() {
        if (wishlist.length === 0) return;
        if (confirm("Are you sure you want to clear your entire wishlist?")) {
            wishlist = [];
            saveWishlist();
            renderWishlistItems();
            document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'far fa-heart text-gray-400 hover:text-rose-500 text-sm';
            });
        }
    };

    window.isProductWishlisted = isWishlisted;

    // Toast helper if not present
    function showToastMessage(msg) {
        let toast = document.getElementById('ezone-global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ezone-global-toast';
            toast.className = 'fixed top-5 right-5 z-[2000000] bg-cyan-950 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-teal-500 transition-all duration-300 transform translate-y-[-20px] opacity-0 pointer-events-none flex items-center gap-2';
            document.body.appendChild(toast);
        }
        toast.innerHTML = msg;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.transform = 'translateY(-20px)';
            toast.style.opacity = '0';
        }, 2600);
    }
    window.showToastMessage = showToastMessage;

    document.addEventListener('DOMContentLoaded', loadWishlist);
    window.loadWishlist = loadWishlist;
})();
