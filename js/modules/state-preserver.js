// ================================================================
// E-ZONE EARLY STATE RELOAD
// ================================================================
    (function(){
        try{
            if(sessionStorage.getItem('ezone_view_state_v2')){
                document.documentElement.classList.add('ezone-preserve-reload');
            }
        }catch(e){}
    })();

// ================================================================
// E-ZONE VIEW-SWITCH STATE PRESERVER
// ================================================================
    (function(){
        const STATE_KEY = 'ezone_view_state_v2';

        function safeCartSnapshot() {
            try {
                if (!Array.isArray(cart)) return [];
                return cart.map(function(item){
                    return {
                        id: item.id,
                        name: item.name,
                        brand: item.brand,
                        price: Number(item.price) || 0,
                        qty: Math.max(1, Number(item.qty) || 1),
                        selectedVariant: item.selectedVariant || null,
                        discountPercent: Number(item.discountPercent) || 0,
                        emoji: item.emoji || '📦'
                    };
                });
            } catch(e) {
                return [];
            }
        }

        function saveViewState() {
            try {
                const modal = document.getElementById('cart-summary-modal');
                const state = {
                    version: 2,
                    scrollX: window.scrollX || 0,
                    scrollY: window.scrollY || 0,
                    lang: (typeof currentLang !== 'undefined' ? currentLang : 'bn'),
                    selectedCategory: (typeof selectedCategory !== 'undefined' ? selectedCategory : 'All'),
                    selectedBrand: (typeof selectedBrand !== 'undefined' ? selectedBrand : 'All'),
                    search: document.getElementById('search-input')?.value || '',
                    cart: safeCartSnapshot(),
                    cartModalOpen: !!(modal && modal.classList.contains('flex')),
                    savedAt: Date.now()
                };
                sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
            } catch(e) {}
        }

        function restoreViewState() {
            let raw = null;
            try {
                raw = sessionStorage.getItem(STATE_KEY);
                if (!raw) return;
                sessionStorage.removeItem(STATE_KEY);
            } catch(e) {
                return;
            }

            let state;
            try { state = JSON.parse(raw); } catch(e) { return; }
            if (!state || state.version !== 2) return;

            try {
                if (typeof currentLang !== 'undefined' && ['bn','en','hi'].includes(state.lang)) {
                    currentLang = state.lang;
                }
                if (typeof selectedCategory !== 'undefined') {
                    selectedCategory = state.selectedCategory || 'All';
                }
                if (typeof selectedBrand !== 'undefined') {
                    selectedBrand = state.selectedBrand || 'All';
                }

                const search = document.getElementById('search-input');
                if (search) search.value = state.search || '';

                if (Array.isArray(state.cart) && typeof cart !== 'undefined') {
                    cart = state.cart.filter(function(item){
                        return item && item.id && Number(item.price) >= 0;
                    }).map(function(item){
                        return {
                            ...item,
                            qty: Math.max(1, Number(item.qty) || 1),
                            price: Number(item.price) || 0
                        };
                    });
                }

                if (typeof changeLanguage === 'function' && ['bn','en','hi'].includes(state.lang)) {
                    try {
                        changeLanguage(state.lang);
                        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    } catch(e) {}
                } else if (typeof renderProducts === 'function') {
                    renderProducts();
                }

                if (typeof updateFilterButtonsHighlight === 'function') updateFilterButtonsHighlight();
                if (typeof renderCategoryCards === 'function') renderCategoryCards();
                if (typeof renderProducts === 'function') renderProducts();
                if (typeof updateCartCount === 'function') updateCartCount();

                const splash = document.getElementById('rox-splash');
                if (splash) {
                    splash.classList.add('rox-splash-hide');
                    setTimeout(function(){
                        if (splash && splash.parentNode) splash.remove();
                    }, 40);
                }
                document.documentElement.classList.remove('ezone-preserve-reload');

                const targetX = Number.isFinite(Number(state.scrollX)) ? Number(state.scrollX) : 0;
                const targetY = Number.isFinite(Number(state.scrollY)) ? Number(state.scrollY) : 0;

                requestAnimationFrame(function(){
                    requestAnimationFrame(function(){
                        window.scrollTo({left: targetX, top: targetY, behavior: 'auto'});
                        setTimeout(function(){
                            window.scrollTo({left: targetX, top: targetY, behavior: 'auto'});
                            if (state.cartModalOpen && cart.length && typeof openCartWhatsApp === 'function') {
                                openCartWhatsApp();
                            }
                        }, 120);
                    });
                });
            } catch(e) {
                document.documentElement.classList.remove('ezone-preserve-reload');
            }
        }

        window.addEventListener('beforeunload', saveViewState, {capture:true});
        window.addEventListener('pagehide', saveViewState, {capture:true});
        document.addEventListener('visibilitychange', function(){
            if (document.visibilityState === 'hidden') saveViewState();
        }, {capture:true});

        window.addEventListener('DOMContentLoaded', function(){
            /* The original app initialization runs first because this listener is registered later. */
            setTimeout(restoreViewState, 30);
        });
    })();