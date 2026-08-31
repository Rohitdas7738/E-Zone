// ================================================================
// E-ZONE GLOBAL APPLICATION STATE
// ================================================================

// Purge any stale admin overrides or old cached custom prices from browser storage
try {
    localStorage.removeItem('ezone_products_data');
    localStorage.removeItem('ezone_deleted_product_ids');
    localStorage.removeItem('ezone_custom_added_products');
    localStorage.removeItem('ezone_permanent_lock');
    sessionStorage.removeItem('ezone_admin_session');
} catch(e) {}

let currentLang = 'bn';
if (typeof window !== "undefined") window.currentLang = currentLang;
let cart = [];

let isPermanentlySaved = true;
let deleteModeActive = false;
let pendingActionType = null;
let currentAdminPricingId = null;
let selectedSubItemData = null;

let deletedProductIds = [];
let savedCustomData = {};
let savedCategoryImages = {};
let customAddedProducts = [];

// Direct clean mapping from product catalogue
let products = originalProducts.map(p => ({
    ...p,
    qty: 1,
    discountPercent: Number.isFinite(Number(p.discountPercent)) ? Math.min(90, Math.max(0, Number(p.discountPercent))) : 20
}));

const categoryLabels = {
    "All": { en: "All Items", bn: "সব পণ্য", hi: "सभी उत्पाद" },
    "lights and decoratives light": { en: "Decoratives & Lights", bn: "ডেকোরেটিভ ও লাইটস", hi: "सजावटी और लाइट" },
    "Fans": { en: "Fans Section", bn: "ফ্যান সেকশন", hi: "पंखा सेक्शन" },
    "Electrical Accessories": { en: "Electrical Accessories", bn: "ইলেকট্রিক্যাল অ্যাক্সেসরিজ", hi: "इलेक्ट्रिकल एक्सेसरीज" },
    "GI Boxes": { en: "GI Boxes", bn: "জিআই বক্স", hi: "जीआई बॉक्स" },
    "Zip Tie": { en: "Zip Tie", bn: "জিপ টাই", hi: "ज़िप टाई" },
    "Screw and Nuts": { en: "Screw and Nuts", bn: "স্ক্রু ও নাট", hi: "स्क्रू और नट्स" },
    "Modular Plates": { en: "Modular Plates", bn: "মডুলার প্লেট", hi: "मॉड्यूलर प्लेट्स" },
    "Appliances": { en: "Appliances", bn: "অ্যাপ্লায়েন্স", hi: "उपकरण (एप्लायंसेज)" },
    "switch and sockets": { en: "Switch & Sockets", bn: "সুইচ ও সকেট", hi: "स्विच और सॉकेट" },
    "accesories": { en: "Accessories", bn: "অ্যাক্সেসরিজ", hi: "एक्सेसरीज" },
    "wiring items": { en: "Wiring & Tapes", bn: "ওয়্যারিং ও টেপ", hi: "वायरिंग और टेप" },
    "Pvc plastic items": { en: "PVC & Plastic Items", bn: "পিভিসি ও প্লাস্টিক পণ্য", hi: "पीवीसी और प्लास्टिक" },
    "wires and cabiles": { en: "Wires & Cables", bn: "তার ও কেবল", hi: "तार और केबल" }
};
if (typeof window !== "undefined") window.categoryLabels = categoryLabels;

const categoriesList = [
    { name: "All", label: "All Items", icon: "fas fa-th-large" },
    { name: "lights and decoratives light", label: "Decoratives & Lights", icon: "fas fa-lightbulb" },
    { name: "Fans", label: "Fans Section", icon: "fas fa-fan" },
    { name: "Appliances", label: "Appliances", icon: "fas fa-plug-circle-check" },
    { name: "Modular Plates", label: "Modular Plates", icon: "fas fa-border-all" },
    { name: "Electrical Accessories", label: "Electrical Accessories", icon: "fas fa-plug-circle-bolt" },
    { name: "GI Boxes", label: "GI Boxes", icon: "fas fa-box" },
    { name: "Zip Tie", label: "Zip Tie", icon: "fas fa-link" },
    { name: "Screw and Nuts", label: "Screw and Nuts", icon: "fas fa-screwdriver-wrench" },
    { name: "switch and sockets", label: "Switch & Sockets", icon: "fas fa-toggle-on" },
    { name: "accesories", label: "Accessories", icon: "fas fa-plug" },
    { name: "wiring items", label: "Wiring & Tapes", icon: "fas fa-tape" },
    { name: "Pvc plastic items", label: "PVC & Plastic Items", icon: "fas fa-boxes" },
    { name: "wires and cabiles", label: "Wires & Cables", icon: "fas fa-project-diagram" }
];

let selectedCategory = "All";
let selectedBrand = "All";

window.addEventListener('DOMContentLoaded', () => {
    isPermanentlySaved = true;
    const totalCountEl = document.getElementById('total-count');
    if (totalCountEl) totalCountEl.innerText = products.length;
    initFilters();
    renderCategoryCards();
    renderProducts();
    keepBagFixedOnPhysicalScreen();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                triggerSearch();
            }
        });
    }
});

const ADMIN_PIN_BANK = [];
