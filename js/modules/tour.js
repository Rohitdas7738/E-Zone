(function(){
'use strict';
const steps=[
{sel:'nav',k:'01 • HEADER & BRAND',t:{bn:'হেডার ও E-ZONE Electric ব্র্যান্ড',en:'Header & E-ZONE Electric Brand',hi:'Header और E-ZONE Electric Brand'},d:{bn:'এটি E-ZONE Electric-এর প্রধান header। এখানে shop-এর logo, brand identity এবং Home, Products ও Services-এর navigation রয়েছে। এই header থেকেই customer পুরো website-এর journey শুরু করেন।',en:'This is the main E-ZONE Electric header with the shop logo, brand identity and Home, Products and Services navigation. This is where the customer journey begins.',hi:'यह E-ZONE Electric का मुख्य header है, जिसमें shop logo, brand identity और Home, Products तथा Services navigation है। Customer की website journey यहीं से शुरू होती है।'}},
{sel:'button[onclick="toggleLangMenu()"]',k:'02 • LANGUAGE SETTING',t:{bn:'Language Setting — বাংলা, English ও Hindi',en:'Language Settings — Bengali, English and Hindi',hi:'Language Settings — Bengali, English और Hindi'},d:{bn:'Language setting থেকে customer বাংলা, English অথবা Hindi বেছে নিতে পারেন। Tutorial-ও এই তিন ভাষায় শোনা যাবে। Customer নিজের সুবিধামতো language নির্বাচন করে website ব্যবহার করতে পারবেন।',en:'From the language setting, customers can choose Bengali, English or Hindi. This tutorial is also available in all three languages, so the customer can use the website in the language they prefer.',hi:'Language setting से customer Bengali, English या Hindi चुन सकते हैं। यह tutorial भी तीनों भाषाओं में उपलब्ध है, ताकि customer अपनी पसंद की language में website इस्तेमाल कर सके।'}},
{sel:'#search-input',k:'03 • OPTIMIZED SEARCH',t:{bn:'Optimized Search Bar',en:'Optimized Search Bar',hi:'Optimized Search Bar'},d:{bn:'এখানে product name, brand, category, specification বা related keyword লিখে search করা যায়। Direct বা strongest match আগে আসে, তারপর relevant similar products দেখানো হয়। তাই customer যে product খুঁজছেন সেটিই প্রথমে পাওয়া সহজ হয়।',en:'Customers can search by product name, brand, category, specification or related keyword. The strongest direct match appears first, followed by relevant similar products, making the intended product easier to find.',hi:'Customer product name, brand, category, specification या related keyword से search कर सकता है। Strong direct match पहले और relevant similar products बाद में आते हैं, जिससे सही product जल्दी मिलता है।'}},
{sel:'#search-mic-btn',k:'04 • VOICE SEARCH',t:{bn:'Voice Search Microphone',en:'Voice Search Microphone',hi:'Voice Search Microphone'},d:{bn:'Search bar-এর পাশে microphone button-এ চাপলে customer টাইপ না করেও product-এর নাম মুখে বলতে পারবেন। Spoken query search field-এ যাবে এবং একই smart ranking-এর মাধ্যমে result দেখাবে।',en:'The microphone beside the search bar lets customers speak a product name instead of typing. The spoken query is placed into search and processed by the same smart ranking.',hi:'Search bar के पास microphone दबाकर customer बिना type किए product का नाम बोल सकता है। Spoken query search में जाकर उसी smart ranking से result दिखाएगी।'}},
{sel:'#hero',k:'05 • HOME HERO',t:{bn:'Home Section ও Main Banner',en:'Home Section & Main Banner',hi:'Home Section और Main Banner'},d:{bn:'Home section-এ customer প্রথমেই shop-এর primary message, featured presentation এবং প্রধান call-to-action দেখতে পান। এখান থেকেই catalogue-এর দিকে এগোনো যায়।',en:'The Home section introduces the shop with its primary message, featured presentation and main call-to-action, guiding customers toward the catalogue.',hi:'Home section में shop का primary message, featured presentation और main call-to-action दिखाई देता है और customer catalogue की ओर आगे बढ़ सकता है।'}},
{sel:'#category-cards-grid',k:'06 • CATEGORY CARDS',t:{bn:'Category Section — প্রত্যেক category অনুযায়ী product cards',en:'Category Section — Product cards by category',hi:'Category Section — Category के अनुसार product cards'},d:{bn:'Category section-এ প্রতিটি category আলাদা card হিসেবে দেখা যায়। Customer যেমন Lights, Fans, Wires and Cables বা অন্য কোনো category বেছে নিলে সেই category অনুযায়ী product catalogue filter হয়ে যায়। অর্থাৎ category card হলো দ্রুত product group করার সহজ পথ।',en:'The category section presents each category as a separate card. Selecting a category such as Lights, Fans, Wires and Cables filters the catalogue accordingly, making category-wise browsing quick and simple.',hi:'Category section में हर category एक अलग card के रूप में दिखती है। Lights, Fans, Wires and Cables जैसी category चुनने पर catalogue उसी category के अनुसार filter हो जाता है।'}},
{sel:'#brand-filter-container',k:'07 • MANUFACTURER BRANDS',t:{bn:'Filter by Manufacturer Brand',en:'Filter by Manufacturer Brand',hi:'Filter by Manufacturer Brand'},d:{bn:'Manufacturer brand section-এ প্রতিটি brand-এর নিজস্ব professional colour theme-সহ button রয়েছে। Customer Philips, Ecolink, Pritam, Havells, Crompton, Atomberg বা অন্য available manufacturer বেছে নিয়ে সেই brand-এর productগুলো দ্রুত দেখতে পারবেন।',en:'The manufacturer brand section provides professionally themed buttons for each available brand. Customers can select Philips, Ecolink, Pritam, Havells, Crompton, Atomberg and other manufacturers to quickly view their products.',hi:'Manufacturer brand section में हर available brand के लिए professional themed button है। Customer Philips, Ecolink, Pritam, Havells, Crompton, Atomberg और अन्य manufacturer चुनकर उनके products जल्दी देख सकता है।'}},
{sel:'#products-grid-container',k:'08 • PRODUCT CATALOGUE',t:{bn:'Product Catalogue ও Product Card',en:'Product Catalogue & Product Cards',hi:'Product Catalogue और Product Cards'},d:{bn:'এখন আসছে মূল product catalogue। প্রতিটি product card-এ product image, নাম, brand, specification, quantity control, price, discount এবং action buttons থাকে। Customer এখান থেকেই product দেখে সিদ্ধান্ত নিতে পারেন।',en:'This is the main product catalogue. Each product card presents the product image, name, brand, specification, quantity controls, price, discount and action buttons so customers can evaluate the product directly.',hi:'यह मुख्य product catalogue है। हर product card में image, name, brand, specification, quantity control, price, discount और action buttons दिए गए हैं।'}},
{sel:'#products-grid-container button[onclick*="handleCardClickForVariants"]',k:'09 • SELECT PRODUCT',t:{bn:'Product Select করা',en:'Selecting a Product',hi:'Product Select करना'},d:{bn:'Customer প্রথমে পছন্দের product card বেছে নেবেন। যেসব product-এর একাধিক option বা sub-section আছে, সেগুলোর button সাধারণ Add to Bag-এর বদলে SELECT & ADD TO BAG হিসেবে দেখাবে। এখান থেকেই variant selection শুরু হয়।',en:'The customer first chooses the desired product card. Products with multiple options or sub-sections show SELECT & ADD TO BAG instead of a simple Add to Bag button, starting the variant-selection flow.',hi:'Customer पहले पसंद का product card चुनता है। जिन products में multiple options या sub-sections हैं, उनमें SELECT & ADD TO BAG दिखाई देता है और यहीं से variant selection शुरू होती है।'}},
{sel:'#subitem-modal',k:'10 • VARIANT SUB-SECTIONS',t:{bn:'Variant ও Sub-Section কীভাবে ব্যবহার করবেন',en:'How to Use Variant Sub-Sections',hi:'Variant और Sub-Section कैसे इस्तेमाल करें'},d:{bn:'এই selection modal-এ product অনুযায়ী mm, feet, watt, volt, amp, size, colour বা অন্য custom sub-section থাকতে পারে। Customer নিজের প্রয়োজনের option নির্বাচন করবেন। প্রতিটি option-এর সঙ্গে তার আলাদা price দেখানো হয়।',en:'This selection modal can contain product-specific options such as mm, feet, watt, volt, amp, size, colour or other custom sub-sections. The customer chooses the required option, and each option shows its own price.',hi:'इस selection modal में product के अनुसार mm, feet, watt, volt, amp, size, colour या अन्य custom sub-sections हो सकते हैं। Customer अपनी जरूरत का option चुनता है और हर option के साथ उसका अलग price दिखता है।'}},
{sel:'#customer-variants-list',k:'11 • CHOOSE VARIANT',t:{bn:'সঠিক Variant বেছে নেওয়া',en:'Choosing the Correct Variant',hi:'सही Variant चुनना'},d:{bn:'ধরুন bulb-এর watt, wire-এর size বা battery-এর type দরকার—customer list থেকে প্রয়োজনীয় exact variant-এ tap করবেন। ভুল variant না নিয়ে নিজের প্রয়োজনের specification দেখে তারপর add করবেন।',en:'For example, if a bulb needs a particular watt, a wire needs a particular size or a battery needs a particular type, the customer taps the exact required option and checks its specification before adding it.',hi:'उदाहरण के लिए bulb का watt, wire का size या battery का type चुनना हो तो customer list से सही variant पर tap करे और specification देखकर add करे।'}},
{sel:'#products-grid-container button[onclick*="addToCart"]',k:'12 • ADD TO BAG',t:{bn:'Add to Bag কীভাবে কাজ করে',en:'How Add to Bag Works',hi:'Add to Bag कैसे काम करता है'},d:{bn:'সাধারণ product হলে Add to Bag-এ click করলেই product cart-এ চলে যায়। আর variant product হলে আগে exact sub-section নির্বাচন করতে হয়, তারপর সেই selected variant-ই cart-এ যোগ হয়। Quantity-ও product card থেকেই বাড়ানো বা কমানো যায়।',en:'For a standard product, clicking Add to Bag sends the product directly to the cart. For a variant product, the exact sub-section must be selected first, and that selected variant is then added. Quantity can also be adjusted from the product card.',hi:'Standard product में Add to Bag दबाते ही product cart में चला जाता है। Variant product में पहले exact sub-section चुनना होता है और वही selected variant cart में जुड़ता है। Quantity भी product card से बदली जा सकती है।'}},
{sel:'#nav-cart-btn',k:'13 • SHOPPING BAG',t:{bn:'Shopping Bag ও Cart Count',en:'Shopping Bag & Cart Count',hi:'Shopping Bag और Cart Count'},d:{bn:'Product add হওয়ার পর navbar shopping bag icon-এ cart count দেখা যায়। Customer bag icon-এ click করে selected products review করতে পারবেন এবং final order flow-এ যেতে পারবেন।',en:'After products are added, the shopping bag in the navigation bar shows the cart count. Clicking the bag lets customers review selected products and continue to the final order flow.',hi:'Product add होने के बाद navbar shopping bag में cart count दिखाई देता है। Bag पर click करके customer selected products review करके final order flow में जा सकता है।'}},
{sel:'#cart-summary-items',k:'14 • REVIEW CART',t:{bn:'Cart-এ Product Review',en:'Reviewing Products in the Cart',hi:'Cart में Product Review'},d:{bn:'Cart summary-তে selected products, chosen variant, quantity এবং price দেখা যায়। Customer প্রয়োজন হলে item remove করে বা quantity ঠিক করে final summary-এর আগে orderটি যাচাই করতে পারবেন।',en:'The cart summary shows selected products, chosen variants, quantities and prices. Customers can review the order, adjust quantities or remove items before moving to the final summary.',hi:'Cart summary में selected products, chosen variants, quantities और prices दिखाई देते हैं। Customer final summary से पहले quantity बदल या item remove करके order review कर सकता है।'}},
{sel:'#cart-summary-total',k:'15 • DISCOUNT & SAVINGS',t:{bn:'Discount, MRP ও Savings',en:'Discount, MRP & Savings',hi:'Discount, MRP और Savings'},d:{bn:'Product card এবং final summary-তে original MRP, discount percentage, discounted price এবং customer কত টাকা save করছেন—এসব পরিষ্কারভাবে দেখানো হয়। ফলে customer actual payable amount সহজে বুঝতে পারেন।',en:'The product card and final summary show original MRP, discount percentage, discounted price and the amount saved, so customers can clearly understand the actual payable amount.',hi:'Product card और final summary में original MRP, discount percentage, discounted price और customer की savings साफ दिखाई जाती है, जिससे actual payable amount समझना आसान होता है।'}},
{sel:'#rox-ai-modal',k:'16 • ROX AI',t:{bn:'রক্স AI — Product Assistant',en:'Rox AI — Product Assistant',hi:'रॉक्स AI — Product Assistant'},d:{bn:'রক্স AI হলো website-এর product assistant। Customer product সম্পর্কে প্রশ্ন করতে পারেন, available information শুনতে পারেন এবং Bengali, English বা Hindi-তে voice assistance ব্যবহার করতে পারেন। রক্স AI product catalogue-এর তথ্যের ভিত্তিতেই সাহায্য করে।',en:'Rox AI is the website product assistant. Customers can ask about products, listen to available information and use voice assistance in Bengali, English or Hindi. Rox AI works from the product information available in the catalogue.',hi:'रॉक्स AI website का product assistant है। Customer product के बारे में पूछ सकता है, available information सुन सकता है और Bengali, English या Hindi में voice assistance ले सकता है। रॉक्स AI catalogue की available product information पर काम करता है।'}},
{sel:'#services-section',k:'17 • SERVICES',t:{bn:'Services Section',en:'Services Section',hi:'Services Section'},d:{bn:'Services section-এ website-এর electrical service offerings এবং customer support সম্পর্কিত information পাওয়া যায়। Customer product কেনার পাশাপাশি প্রয়োজনীয় service information-ও এখান থেকে দেখতে পারেন।',en:'The Services section presents the website’s electrical service offerings and customer-support information, so customers can explore service-related help in addition to products.',hi:'Services section में electrical service offerings और customer-support information दी गई है, जिससे customer products के साथ service-related help भी देख सकता है।'}},
{sel:'#inventory-manager',k:'18 • INVENTORY MANAGER',t:{bn:'Inventory Manager',en:'Inventory Manager',hi:'Inventory Manager'},d:{bn:'Inventory Manager website-এর owner বা authorized management-এর জন্য catalogue control-এর জায়গা। এখানে product information ও inventory-related management করা যায়। Customer সাধারণ browsing-এর সময় এই অংশ ব্যবহার করবেন না।',en:'The Inventory Manager is an owner or authorized management area for catalogue and inventory control. It is not a normal customer browsing feature and should be used only by authorized management.',hi:'Inventory Manager owner या authorized management के लिए catalogue और inventory control area है। यह normal customer browsing feature नहीं है और केवल authorized management को इस्तेमाल करना चाहिए।'}},
{sel:'.bg-red-950.border-red-600',k:'19 • RESTRICTED ADMIN',t:{bn:'Restricted Admin Control — শুধু Owner / Developer',en:'Restricted Admin Control — Owner / Developer Only',hi:'Restricted Admin Control — केवल Owner / Developer'},d:{bn:'লাল restricted sectionটি strictly owner বা authorized developer-এর জন্য। এখানে PIN protection-এর মাধ্যমে product, price, discount এবং custom variant sub-section edit করা যায়। Customer-এর এই section-এ কোনো পরিবর্তন করা উচিত নয়।',en:'This red restricted section is strictly for the owner or authorized developer. PIN protection controls product, price, discount and custom variant editing. Customers should never modify this area.',hi:'यह red restricted section केवल owner या authorized developer के लिए है। PIN protection से product, price, discount और custom variant editing control होती है। Customer को इस section में बदलाव नहीं करना चाहिए।'}},
{sel:'#edit-variants-container',k:'20 • ADMIN VARIANT BUILDER',t:{bn:'Owner কীভাবে Sub-Section / Variant তৈরি করবেন',en:'How the Owner Creates Sub-Sections / Variants',hi:'Owner Sub-Section / Variant कैसे बनाता है'},d:{bn:'Owner বা developer product editor-এ custom sub-section যোগ করতে পারেন—যেমন mm, feet, watt, volt, amp, size বা colour। প্রতিটি label-এর সঙ্গে আলাদা price দেওয়া যায়। এই setup-ই customer-এর selection modal-এ পরে option হিসেবে দেখা যায়।',en:'In the product editor, the owner or developer can create custom sub-sections such as mm, feet, watt, volt, amp, size or colour and assign a separate price to each. Those settings later appear in the customer selection modal.',hi:'Product editor में owner या developer mm, feet, watt, volt, amp, size या colour जैसे custom sub-sections बना सकता है और हर option की अलग price तय कर सकता है। यही settings बाद में customer selection modal में दिखाई देती हैं।'}},
{sel:'#cart-summary-modal',k:'21 • FINAL ORDER SUMMARY',t:{bn:'Final Order Summary',en:'Final Order Summary',hi:'Final Order Summary'},d:{bn:'এখন final order summary। এখানে selected product, quantity, variant, total MRP, discount, savings এবং final payable amount একসঙ্গে দেখা যায়। Customer payment করার আগে পুরো orderটি ভালোভাবে যাচাই করবেন।',en:'This is the final order summary. It brings together selected products, quantities, variants, total MRP, discount, savings and final payable amount. Customers should review the entire order before payment.',hi:'यह final order summary है। इसमें selected products, quantities, variants, total MRP, discount, savings और final payable amount एक साथ दिखाई देते हैं। Payment से पहले पूरा order review करना चाहिए।'}},
{sel:'#cart-summary-modal img[alt*="Payment QR"]',k:'22 • ONLINE PAYMENT QR',t:{bn:'QR Code দিয়ে Online Payment',en:'Online Payment via QR Code',hi:'QR Code से Online Payment'},d:{bn:'Final order summary-তে Payment QR Code রয়েছে। Customer এই QR scan করে online payment করবেন। Payment সম্পন্ন করার পরে order-এর customer details ঠিকভাবে পূরণ করে তারপর order placement-এর জন্য এগোতে হবে।',en:'The final order summary contains the Payment QR Code. The customer can scan the QR and complete the online payment. After payment, the customer should fill in the required customer details correctly before proceeding with the order placement.',hi:'Final order summary में Payment QR Code दिया गया है। Customer QR scan करके online payment कर सकता है। Payment के बाद customer details सही भरकर order placement के लिए आगे बढ़ना चाहिए।'}},
{sel:'#order-customer-name',k:'23 • CUSTOMER DETAILS',t:{bn:'Customer Details পূরণ করা',en:'Filling Customer Details',hi:'Customer Details भरना'},d:{bn:'Order placement-এর আগে customer name, phone number এবং proper delivery address পূরণ করতে হবে। এগুলো সঠিকভাবে দেওয়া জরুরি, যাতে order communication এবং delivery coordination ঠিকভাবে করা যায়।',en:'Before placing the order, the customer must enter the name, phone number and proper delivery address. Accurate details are important for order communication and delivery coordination.',hi:'Order place करने से पहले customer को name, phone number और proper delivery address भरना होगा। सही details order communication और delivery coordination के लिए जरूरी हैं।'}},
{sel:'#cart-summary-modal button[onclick="placeOrderOnWhatsApp()"]',k:'24 • PLACE ORDER ON WHATSAPP',t:{bn:'Payment-এর পরে Order Place করা',en:'Placing the Order After Payment',hi:'Payment के बाद Order Place करना'},d:{bn:'Payment complete এবং customer details verify করার পরে ORDER PLACED ON WHATSAPP button ব্যবহার করা হবে। এতে selected order information WhatsApp order flow-তে যাবে। Customer payment করার আগে এই button ব্যবহার করবেন না।',en:'After payment is completed and customer details are verified, use ORDER PLACED ON WHATSAPP. This sends the selected order information into the WhatsApp order flow. Do not treat this as the payment step itself.',hi:'Payment पूरा होने और customer details verify करने के बाद ORDER PLACED ON WHATSAPP button इस्तेमाल करें। इससे selected order information WhatsApp order flow में जाएगी। इसे payment step न समझें।'}},
{sel:'#rox-product-modal',k:'25 • ROX PRODUCT DETAIL',t:{bn:'রক্স AI Product Detail View',en:'Rox AI Product Detail View',hi:'रॉक्स AI Product Detail View'},d:{bn:'কোনো নির্দিষ্ট product-এর রক্স AI detail view খুললে customer product-specific information, features এবং available guidance আরও বিস্তারিতভাবে শুনতে বা পড়তে পারবেন।',en:'When the Rox AI detail view is opened for a specific product, customers can read or listen to more detailed product-specific information, features and available guidance.',hi:'किसी specific product का रॉक्स AI detail view खोलने पर customer product-specific information, features और available guidance को विस्तार से पढ़ या सुन सकता है।'}},
{sel:'footer',k:'26 • FOOTER CONTACT',t:{bn:'Footer — Location, Timing ও Contact',en:'Footer — Location, Timing & Contact',hi:'Footer — Location, Timing और Contact'},d:{bn:'Website-এর একেবারে নিচে footer-এ shop location, call numbers, shop timing, customer-help information এবং অন্যান্য contact details থাকে। Customer প্রয়োজনীয় contact information এখানেই পাবেন।',en:'At the bottom, the footer contains the shop location, call numbers, shop timing, customer-help information and other contact details, giving customers one place for essential contact information.',hi:'सबसे नीचे footer में shop location, call numbers, shop timing, customer-help information और अन्य contact details दिए गए हैं।'}},
{sel:'.ezone-powered-by-rox',k:'27 • POWERED BY ROX AI',t:{bn:'Powered by রক্স AI',en:'Powered by Rox AI',hi:'Powered by रॉक्स AI'},d:{bn:'Footer credit-এর ঠিক উপরে Powered by রক্স AI branding রয়েছে। এটি website-এর AI assistance layer-এর পরিচয় দেয়।',en:'Just above the footer credit, the Powered by Rox AI branding identifies the website’s AI assistance layer.',hi:'Footer credit के ठीक ऊपर Powered by रॉक्स AI branding website की AI assistance layer को identify करती है।'}},
{sel:'footer',k:'28 • DEVELOPED BY ROHIT DAS',t:{bn:'Developed and design by Rohit Das',en:'Developed and design by Rohit Das',hi:'Developed and design by Rohit Das'},d:{bn:'সবশেষে website footer-এ “Developed and design by Rohit Das” credit রয়েছে। এটিই website-এর final creator credit এবং A to Z journey-এর শেষ অংশ।',en:'Finally, the website footer contains the “Developed and design by Rohit Das” creator credit. This is the final part of the A to Z journey.',hi:'अंत में website footer में “Developed and design by Rohit Das” creator credit दिया गया है। यही A to Z journey का अंतिम हिस्सा है।'}},
{sel:'footer',k:'29 • COMPLETE WORKFLOW',t:{bn:'সম্পূর্ণ Customer Workflow — Search থেকে Order',en:'Complete Customer Workflow — Search to Order',hi:'Complete Customer Workflow — Search से Order'},d:{bn:'পুরো workflow একবার মনে রাখুন: language বাছুন, product search বা voice search করুন, category বা manufacturer brand filter ব্যবহার করুন, product নির্বাচন করুন, প্রয়োজন হলে variant sub-section বাছুন, Add to Bag করুন, cart review করুন, discount ও final total দেখুন, QR দিয়ে online payment করুন, customer details পূরণ করুন এবং payment-এর পরে WhatsApp-এ order place করুন।',en:'The complete workflow is: choose a language, search by text or voice, use category or manufacturer filters, select a product, choose a variant when required, add to bag, review the cart, check discount and final total, pay online through the QR, enter customer details and place the order on WhatsApp after payment.',hi:'पूरा workflow याद रखें: language चुनें, text या voice search करें, category या manufacturer filter लगाएँ, product चुनें, जरूरत हो तो variant चुनें, Add to Bag करें, cart review करें, discount और final total देखें, QR से online payment करें, customer details भरें और payment के बाद WhatsApp पर order place करें।'}},
{sel:'footer',k:'30 • A TO Z COMPLETE',t:{bn:'A to Z Tutorial সম্পূর্ণ — ধন্যবাদ',en:'A to Z Tutorial Complete — Thank You',hi:'A to Z Tutorial Complete — धन्यवाद'},d:{bn:'এতেই E-ZONE Electric-এর সম্পূর্ণ A to Z tutorial শেষ হলো—header থেকে language setting, optimized search ও voice search, Home, category cards, manufacturer brands, product selection, variants ও sub-sections, Add to Bag, cart, discount, রক্স AI, Services, owner-only restricted controls, final bill, QR payment, WhatsApp order এবং footer credit—সবকিছু ধাপে ধাপে দেখানো হলো।',en:'This completes the full A to Z E-ZONE Electric tutorial—from the header, language settings, optimized and voice search, Home, category cards, manufacturer brands, product selection, variants and sub-sections, Add to Bag, cart, discounts, Rox AI, Services, owner-only restricted controls, final bill, QR payment, WhatsApp order and footer credits.',hi:'यह E-ZONE Electric का पूरा A to Z tutorial है—header, language setting, optimized और voice search, Home, category cards, manufacturer brands, product selection, variants और sub-sections, Add to Bag, cart, discount, रॉक्स AI, Services, owner-only restricted controls, final bill, QR payment, WhatsApp order और footer credit तक सब कुछ step-by-step बताया गया है।'}}
];

const bnWordMappings = [
  [
    "E-ZONE Electric",
    "ই-জোন ইলেকট্রিক"
  ],
  [
    "E-ZONE",
    "ই-জোন"
  ],
  [
    "Electric",
    "ইলেকট্রিক"
  ],
  [
    "electrical",
    "ইলেকট্রিক্যাল"
  ],
  [
    "ROX AI",
    "রক্স এ আই"
  ],
  [
    "Rox AI",
    "রক্স এ আই"
  ],
  [
    "ROX",
    "রক্স"
  ],
  [
    "Rox",
    "রক্স"
  ],
  [
    "AI",
    "এ আই"
  ],
  [
    "PhonePe",
    "ফোনপে"
  ],
  [
    "WhatsApp",
    "হোয়াটসঅ্যাপ"
  ],
  [
    "Home Section",
    "হোম সেকশন"
  ],
  [
    "Home section",
    "হোম সেকশন"
  ],
  [
    "Home",
    "হোম"
  ],
  [
    "Products",
    "প্রোডাক্টসমূহ"
  ],
  [
    "Product Catalogue",
    "প্রোডাক্ট ক্যাটালগ"
  ],
  [
    "product catalogue",
    "প্রোডাক্ট ক্যাটালগ"
  ],
  [
    "Product Card",
    "প্রোডাক্ট কার্ড"
  ],
  [
    "product card",
    "প্রোডাক্ট কার্ড"
  ],
  [
    "Product",
    "প্রোডাক্ট"
  ],
  [
    "product",
    "প্রোডাক্ট"
  ],
  [
    "Services Section",
    "সার্ভিসেস সেকশন"
  ],
  [
    "services section",
    "সার্ভিসেস সেকশন"
  ],
  [
    "Services",
    "সার্ভিসেস"
  ],
  [
    "Service",
    "সার্ভিস"
  ],
  [
    "service",
    "সার্ভিস"
  ],
  [
    "Shop",
    "দোকান"
  ],
  [
    "shop",
    "দোকান"
  ],
  [
    "Header",
    "হেডার"
  ],
  [
    "header",
    "হেডার"
  ],
  [
    "Logo",
    "লোগো"
  ],
  [
    "logo",
    "লোগো"
  ],
  [
    "Brand identity",
    "ব্র্যান্ড পরিচিতি"
  ],
  [
    "brand identity",
    "ব্র্যান্ড পরিচিতি"
  ],
  [
    "Manufacturer Brands",
    "ম্যানুফ্যাকচারার ব্র্যান্ডসমূহ"
  ],
  [
    "manufacturer brands",
    "ম্যানুফ্যাকচারার ব্র্যান্ডসমূহ"
  ],
  [
    "Manufacturer Brand",
    "ম্যানুফ্যাকচারার ব্র্যান্ড"
  ],
  [
    "manufacturer brand",
    "ম্যানুফ্যাকচারার ব্র্যান্ড"
  ],
  [
    "Manufacturer",
    "ম্যানুফ্যাকচারার"
  ],
  [
    "manufacturer",
    "ম্যানুফ্যাকচারার"
  ],
  [
    "Brand",
    "ব্র্যান্ড"
  ],
  [
    "brand",
    "ব্র্যান্ড"
  ],
  [
    "Brands",
    "ব্র্যান্ডসমূহ"
  ],
  [
    "brands",
    "ব্র্যান্ডসমূহ"
  ],
  [
    "Navigation",
    "ন্যাভিগেশন"
  ],
  [
    "navigation",
    "ন্যাভিগেশন"
  ],
  [
    "Customer Details",
    "কাস্টমার বিবরণ"
  ],
  [
    "customer details",
    "কাস্টমার বিবরণ"
  ],
  [
    "Customer",
    "কাস্টমার"
  ],
  [
    "customer",
    "কাস্টমার"
  ],
  [
    "Website",
    "ওয়েবসাইট"
  ],
  [
    "website",
    "ওয়েবসাইট"
  ],
  [
    "Journey",
    "জার্নি"
  ],
  [
    "journey",
    "জার্নি"
  ],
  [
    "Language Settings",
    "ভাষা সেটিংস"
  ],
  [
    "language settings",
    "ভাষা সেটিংস"
  ],
  [
    "Language Setting",
    "ভাষা সেটিং"
  ],
  [
    "language setting",
    "ভাষা সেটিং"
  ],
  [
    "Language",
    "ভাষা"
  ],
  [
    "language",
    "ভাষা"
  ],
  [
    "Settings",
    "সেটিংস"
  ],
  [
    "settings",
    "সেটিংস"
  ],
  [
    "Setting",
    "সেটিং"
  ],
  [
    "setting",
    "সেটিং"
  ],
  [
    "English",
    "ইংলিশ"
  ],
  [
    "Hindi",
    "হিন্দি"
  ],
  [
    "Bengali",
    "বাংলা"
  ],
  [
    "Tutorial",
    "টিউটোরিয়াল"
  ],
  [
    "tutorial",
    "টিউটোরিয়াল"
  ],
  [
    "Optimized Search Bar",
    "অপ্টিমাইজড সার্চ বার"
  ],
  [
    "Optimized Search",
    "অপ্টিমাইজড সার্চ"
  ],
  [
    "optimized search",
    "অপ্টিমাইজড সার্চ"
  ],
  [
    "Search bar",
    "সার্চ বার"
  ],
  [
    "search bar",
    "সার্চ বার"
  ],
  [
    "Search Bar",
    "সার্চ বার"
  ],
  [
    "Search field",
    "সার্চ ফিল্ড"
  ],
  [
    "search field",
    "সার্চ ফিল্ড"
  ],
  [
    "field",
    "ফিল্ড"
  ],
  [
    "Search",
    "সার্চ"
  ],
  [
    "search",
    "সার্চ"
  ],
  [
    "Voice Search Microphone",
    "ভয়েস সার্চ মাইক্রোফোন"
  ],
  [
    "Voice Search",
    "ভয়েস সার্চ"
  ],
  [
    "voice search",
    "ভয়েস সার্চ"
  ],
  [
    "Microphone",
    "মাইক্রোফোন"
  ],
  [
    "microphone",
    "মাইক্রোফোন"
  ],
  [
    "Spoken query",
    "মুখে বলা সার্চ কোয়েরি"
  ],
  [
    "spoken query",
    "মুখে বলা সার্চ কোয়েরি"
  ],
  [
    "smart ranking",
    "স্মার্ট র‍্যাঙ্কিং"
  ],
  [
    "Direct",
    "ডাইরেক্ট"
  ],
  [
    "direct",
    "ডাইরেক্ট"
  ],
  [
    "strongest match",
    "সর্বাধিক মিল"
  ],
  [
    "similar products",
    "সদৃশ প্রোডাক্টসমূহ"
  ],
  [
    "similar",
    "সদৃশ"
  ],
  [
    "relevant",
    "প্রাসঙ্গিক"
  ],
  [
    "keyword",
    "কীওয়ার্ড"
  ],
  [
    "related",
    "সম্পর্কিত"
  ],
  [
    "name",
    "নাম"
  ],
  [
    "result",
    "ফলাফল"
  ],
  [
    "Main Banner",
    "প্রধান ব্যানার"
  ],
  [
    "main banner",
    "প্রধান ব্যানার"
  ],
  [
    "Banner",
    "ব্যানার"
  ],
  [
    "banner",
    "ব্যানার"
  ],
  [
    "primary message",
    "প্রধান বার্তা"
  ],
  [
    "featured presentation",
    "বিশেষ উপস্থাপনা"
  ],
  [
    "call-to-action",
    "কল টু অ্যাকশন"
  ],
  [
    "Catalogue",
    "ক্যাটালগ"
  ],
  [
    "catalogue",
    "ক্যাটালগ"
  ],
  [
    "Category Section",
    "ক্যাটাগরি সেকশন"
  ],
  [
    "category section",
    "ক্যাটাগরি সেকশন"
  ],
  [
    "Category Cards",
    "ক্যাটাগরি কার্ডসমূহ"
  ],
  [
    "category cards",
    "ক্যাটাগরি কার্ডসমূহ"
  ],
  [
    "Category Card",
    "ক্যাটাগরি কার্ড"
  ],
  [
    "category card",
    "ক্যাটাগরি কার্ড"
  ],
  [
    "Category",
    "ক্যাটাগরি"
  ],
  [
    "category",
    "ক্যাটাগরি"
  ],
  [
    "Categories",
    "ক্যাটাগরিসমূহ"
  ],
  [
    "categories",
    "ক্যাটাগরিসমূহ"
  ],
  [
    "group",
    "গ্রুপ"
  ],
  [
    "Cards",
    "কার্ডসমূহ"
  ],
  [
    "cards",
    "কার্ডসমূহ"
  ],
  [
    "Card",
    "কার্ড"
  ],
  [
    "card",
    "কার্ড"
  ],
  [
    "Lights",
    "লাইটস"
  ],
  [
    "Fans",
    "ফ্যানস"
  ],
  [
    "Wires and Cables",
    "তার ও কেবলস"
  ],
  [
    "Wires & Cables",
    "তার ও কেবলস"
  ],
  [
    "Wire",
    "তার"
  ],
  [
    "wire",
    "তার"
  ],
  [
    "Cable",
    "কেবল"
  ],
  [
    "cable",
    "কেবল"
  ],
  [
    "Filter by Manufacturer Brand",
    "ম্যানুফ্যাকচারার ব্র্যান্ড অনুযায়ী ফিল্টার"
  ],
  [
    "Filter",
    "ফিল্টার"
  ],
  [
    "filter",
    "ফিল্টার"
  ],
  [
    "professional",
    "প্রফেশনাল"
  ],
  [
    "theme",
    "থিম"
  ],
  [
    "available",
    "উপলব্ধ"
  ],
  [
    "Philips",
    "ফিলিপস"
  ],
  [
    "Ecolink",
    "ইকোলিঙ্ক"
  ],
  [
    "Pritam",
    "প্রীতম"
  ],
  [
    "Havells",
    "হ্যাভেলস"
  ],
  [
    "Crompton",
    "ক্রোম্পটন"
  ],
  [
    "Atomberg",
    "অ্যাটমবার্গ"
  ],
  [
    "Button",
    "বাটন"
  ],
  [
    "button",
    "বাটন"
  ],
  [
    "Buttons",
    "বাটনগুলো"
  ],
  [
    "buttons",
    "বাটনগুলো"
  ],
  [
    "Image",
    "ছবি"
  ],
  [
    "image",
    "ছবি"
  ],
  [
    "Specification",
    "স্পেসিফিকেশন"
  ],
  [
    "specification",
    "স্পেসিফিকেশন"
  ],
  [
    "Quantity control",
    "পরিমাণ নিয়ন্ত্রণ"
  ],
  [
    "quantity control",
    "পরিমাণ নিয়ন্ত্রণ"
  ],
  [
    "Quantity",
    "পরিমাণ"
  ],
  [
    "quantity",
    "পরিমাণ"
  ],
  [
    "Price",
    "দাম"
  ],
  [
    "price",
    "দাম"
  ],
  [
    "Discount percentage",
    "ডিসকাউন্ট শতাংশ"
  ],
  [
    "discount percentage",
    "ডিসকাউন্ট শতাংশ"
  ],
  [
    "Discounted price",
    "ছাড়ের দাম"
  ],
  [
    "discounted price",
    "ছাড়ের দাম"
  ],
  [
    "Discount",
    "ডিসকাউন্ট"
  ],
  [
    "discount",
    "ডিসকাউন্ট"
  ],
  [
    "discounted",
    "ছাড়কৃত"
  ],
  [
    "Action buttons",
    "অ্যাকশন বাটনসমূহ"
  ],
  [
    "action buttons",
    "অ্যাকশন বাটনসমূহ"
  ],
  [
    "action",
    "অ্যাকশন"
  ],
  [
    "SELECT PRODUCT",
    "প্রোডাক্ট সিলেক্ট"
  ],
  [
    "Select Product",
    "প্রোডাক্ট সিলেক্ট"
  ],
  [
    "Select",
    "সিলেক্ট"
  ],
  [
    "select",
    "সিলেক্ট"
  ],
  [
    "selected",
    "নির্বাচিত"
  ],
  [
    "Selecting a Product",
    "প্রোডাক্ট নির্বাচন করা"
  ],
  [
    "Selecting",
    "নির্বাচন করা"
  ],
  [
    "selection",
    "নির্বাচন"
  ],
  [
    "Options",
    "অপশনগুলো"
  ],
  [
    "options",
    "অপশনগুলো"
  ],
  [
    "Option",
    "অপশন"
  ],
  [
    "option",
    "অপশন"
  ],
  [
    "Sub-Sections",
    "সাব-সেকশনগুলো"
  ],
  [
    "sub-sections",
    "সাব-সেকশনগুলো"
  ],
  [
    "Sub-Section",
    "সাব-সেকশন"
  ],
  [
    "sub-section",
    "সাব-সেকশন"
  ],
  [
    "SELECT & ADD TO BAG",
    "সিলেক্ট অ্যান্ড অ্যাড টু ব্যাগ"
  ],
  [
    "SELECT & ADD",
    "সিলেক্ট অ্যান্ড অ্যাড"
  ],
  [
    "Add to Bag",
    "অ্যাড টু ব্যাগ"
  ],
  [
    "ADD TO BAG",
    "অ্যাড টু ব্যাগ"
  ],
  [
    "add",
    "যুক্ত"
  ],
  [
    "Variant selection",
    "ভ্যারিয়েন্ট সিলেকশন"
  ],
  [
    "variant selection",
    "ভ্যারিয়েন্ট সিলেকশন"
  ],
  [
    "Variants",
    "ভ্যারিয়েন্টগুলো"
  ],
  [
    "variants",
    "ভ্যারিয়েন্টগুলো"
  ],
  [
    "Variant",
    "ভ্যারিয়েন্ট"
  ],
  [
    "variant",
    "ভ্যারিয়েন্ট"
  ],
  [
    "Selection modal",
    "সিলেকশন মোডাল"
  ],
  [
    "selection modal",
    "সিলেকশন মোডাল"
  ],
  [
    "Modal",
    "মোডাল"
  ],
  [
    "modal",
    "মোডাল"
  ],
  [
    "mm",
    "মিলিমিটার"
  ],
  [
    "feet",
    "ফুট"
  ],
  [
    "watt",
    "ওয়াট"
  ],
  [
    "volt",
    "ভোল্ট"
  ],
  [
    "amp",
    "অ্যাম্পিয়ার"
  ],
  [
    "size",
    "সাইজ"
  ],
  [
    "colour",
    "রং"
  ],
  [
    "color",
    "রং"
  ],
  [
    "Custom",
    "কাস্টম"
  ],
  [
    "custom",
    "কাস্টম"
  ],
  [
    "CHOOSE VARIANT",
    "ভ্যারিয়েন্ট বেছে নিন"
  ],
  [
    "Choose Variant",
    "ভ্যারিয়েন্ট বেছে নিন"
  ],
  [
    "chosen",
    "বাছাইকৃত"
  ],
  [
    "Bulb",
    "বাল্ব"
  ],
  [
    "bulb",
    "বাল্ব"
  ],
  [
    "Battery",
    "ব্যাটারি"
  ],
  [
    "battery",
    "ব্যাটারি"
  ],
  [
    "List",
    "তালিকা"
  ],
  [
    "list",
    "তালিকা"
  ],
  [
    "type",
    "টাইপ"
  ],
  [
    "Exact variant",
    "সঠিক ভ্যারিয়েন্ট"
  ],
  [
    "exact variant",
    "সঠিক ভ্যারিয়েন্ট"
  ],
  [
    "exact",
    "সঠিক"
  ],
  [
    "Tap",
    "ট্যাপ"
  ],
  [
    "tap",
    "ট্যাপ"
  ],
  [
    "Click",
    "ক্লিক"
  ],
  [
    "click",
    "ক্লিক"
  ],
  [
    "Shopping Bag",
    "শপিং ব্যাগ"
  ],
  [
    "shopping bag",
    "শপিং ব্যাগ"
  ],
  [
    "Cart Count",
    "কার্ট সংখ্যা"
  ],
  [
    "cart count",
    "কার্ট সংখ্যা"
  ],
  [
    "Floating",
    "ফ্লোটিং"
  ],
  [
    "floating",
    "ফ্লোটিং"
  ],
  [
    "Bag icon",
    "ব্যাগ আইকন"
  ],
  [
    "bag icon",
    "ব্যাগ আইকন"
  ],
  [
    "icon",
    "আইকন"
  ],
  [
    "Bag",
    "ব্যাগ"
  ],
  [
    "bag",
    "ব্যাগ"
  ],
  [
    "Cart summary",
    "কার্ট সামারি"
  ],
  [
    "cart summary",
    "কার্ট সামারি"
  ],
  [
    "Cart",
    "কার্ট"
  ],
  [
    "cart",
    "কার্ট"
  ],
  [
    "Review",
    "রিভিউ"
  ],
  [
    "review",
    "রিভিউ"
  ],
  [
    "Final order flow",
    "ফাইনাল অর্ডার ফ্লো"
  ],
  [
    "final order flow",
    "ফাইনাল অর্ডার ফ্লো"
  ],
  [
    "summary",
    "সামারি"
  ],
  [
    "Items",
    "আইটেমগুলো"
  ],
  [
    "items",
    "আইটেমগুলো"
  ],
  [
    "Item",
    "আইটেম"
  ],
  [
    "item",
    "আইটেম"
  ],
  [
    "Remove",
    "রিমুভ"
  ],
  [
    "remove",
    "রিমুভ"
  ],
  [
    "Final summary",
    "ফাইনাল সামারি"
  ],
  [
    "final summary",
    "ফাইনাল সামারি"
  ],
  [
    "Order",
    "অর্ডার"
  ],
  [
    "order",
    "অর্ডার"
  ],
  [
    "MRP",
    "এম আর পি"
  ],
  [
    "mrp",
    "এম আর পি"
  ],
  [
    "original",
    "মূল"
  ],
  [
    "Savings",
    "সঞ্চয়"
  ],
  [
    "savings",
    "সঞ্চয়"
  ],
  [
    "save",
    "সঞ্চয়"
  ],
  [
    "percentage",
    "শতাংশ"
  ],
  [
    "Payable amount",
    "পরিশোধের পরিমাণ"
  ],
  [
    "payable amount",
    "পরিশোধের পরিমাণ"
  ],
  [
    "Actual payable amount",
    "প্রকৃত পরিশোধের পরিমাণ"
  ],
  [
    "actual payable amount",
    "প্রকৃত পরিশোধের পরিমাণ"
  ],
  [
    "actual",
    "প্রকৃত"
  ],
  [
    "amount",
    "পরিমাণ"
  ],
  [
    "Product Assistant",
    "প্রোডাক্ট অ্যাসিস্ট্যান্ট"
  ],
  [
    "product assistant",
    "প্রোডাক্ট অ্যাসিস্ট্যান্ট"
  ],
  [
    "assistant",
    "অ্যাসিস্ট্যান্ট"
  ],
  [
    "Voice assistance",
    "ভয়েস সহায়তা"
  ],
  [
    "voice assistance",
    "ভয়েস সহায়তা"
  ],
  [
    "assistance",
    "সহায়তা"
  ],
  [
    "information",
    "তথ্য"
  ],
  [
    "Support",
    "সহায়তা"
  ],
  [
    "support",
    "সহায়তা"
  ],
  [
    "Offerings",
    "অফারিং"
  ],
  [
    "offerings",
    "অফারিং"
  ],
  [
    "Inventory Manager",
    "ইনভেন্টরি ম্যানেজার"
  ],
  [
    "inventory manager",
    "ইনভেন্টরি ম্যানেজার"
  ],
  [
    "Inventory",
    "ইনভেন্টরি"
  ],
  [
    "inventory",
    "ইনভেন্টরি"
  ],
  [
    "Manager",
    "ম্যানেজার"
  ],
  [
    "manager",
    "ম্যানেজার"
  ],
  [
    "Authorized management",
    "অনুমোদিত ম্যানেজমেন্ট"
  ],
  [
    "authorized management",
    "অনুমোদিত ম্যানেজমেন্ট"
  ],
  [
    "authorized",
    "অনুমোদিত"
  ],
  [
    "Management",
    "ম্যানেজমেন্ট"
  ],
  [
    "management",
    "ম্যানেজমেন্ট"
  ],
  [
    "Owner",
    "মালিক"
  ],
  [
    "owner",
    "মালিক"
  ],
  [
    "Browsing",
    "ব্রাউজিং"
  ],
  [
    "browsing",
    "ব্রাউজিং"
  ],
  [
    "Restricted Admin Control",
    "রেস্ট্রিক্টেড অ্যাডমিন কন্ট্রোল"
  ],
  [
    "restricted admin control",
    "রেস্ট্রিক্টেড অ্যাডমিন কন্ট্রোল"
  ],
  [
    "Restricted Admin",
    "রেস্ট্রিক্টেড অ্যাডমিন"
  ],
  [
    "restricted admin",
    "রেস্ট্রিক্টেড অ্যাডমিন"
  ],
  [
    "Restricted",
    "রেস্ট্রিক্টেড"
  ],
  [
    "restricted",
    "রেস্ট্রিক্টেড"
  ],
  [
    "strictly",
    "কড়াকড়িভাবে"
  ],
  [
    "Admin",
    "অ্যাডমিন"
  ],
  [
    "admin",
    "অ্যাডমিন"
  ],
  [
    "Developer Only",
    "শুধু ডেভেলপার"
  ],
  [
    "developer only",
    "শুধু ডেভেলপার"
  ],
  [
    "Developer",
    "ডেভেলপার"
  ],
  [
    "developer",
    "ডেভেলপার"
  ],
  [
    "only",
    "শুধুমাত্র"
  ],
  [
    "PIN protection",
    "পিন সুরক্ষা"
  ],
  [
    "pin protection",
    "পিন সুরক্ষা"
  ],
  [
    "PIN",
    "পিন"
  ],
  [
    "pin",
    "পিন"
  ],
  [
    "Edit",
    "এডিট"
  ],
  [
    "edit",
    "এডিট"
  ],
  [
    "Section",
    "সেকশন"
  ],
  [
    "section",
    "সেকশন"
  ],
  [
    "Admin Variant Builder",
    "অ্যাডমিন ভ্যারিয়েন্ট বিল্ডার"
  ],
  [
    "Product editor",
    "প্রোডাক্ট এডিটর"
  ],
  [
    "product editor",
    "প্রোডাক্ট এডিটর"
  ],
  [
    "Editor",
    "এডিটর"
  ],
  [
    "editor",
    "এডিটর"
  ],
  [
    "Setup",
    "সেটআপ"
  ],
  [
    "setup",
    "সেটআপ"
  ],
  [
    "label",
    "লেবেল"
  ],
  [
    "FINAL ORDER SUMMARY",
    "ফাইনাল অর্ডার সামারি"
  ],
  [
    "Final Order Summary",
    "ফাইনাল অর্ডার সামারি"
  ],
  [
    "final order summary",
    "ফাইনাল অর্ডার সামারি"
  ],
  [
    "Final",
    "ফাইনাল"
  ],
  [
    "final",
    "ফাইনাল"
  ],
  [
    "Total",
    "মোট"
  ],
  [
    "total",
    "মোট"
  ],
  [
    "Bill",
    "বিল"
  ],
  [
    "bill",
    "বিল"
  ],
  [
    "Payment QR Code",
    "পেমেন্ট কিউ আর কোড"
  ],
  [
    "payment QR code",
    "পেমেন্ট কিউ আর কোড"
  ],
  [
    "Payment QR",
    "পেমেন্ট কিউ আর"
  ],
  [
    "payment QR",
    "পেমেন্ট কিউ আর"
  ],
  [
    "Payment",
    "পেমেন্ট"
  ],
  [
    "payment",
    "পেমেন্ট"
  ],
  [
    "QR Code",
    "কিউ আর কোড"
  ],
  [
    "qr code",
    "কিউ আর কোড"
  ],
  [
    "QR code",
    "কিউ আর কোড"
  ],
  [
    "QR",
    "কিউ আর"
  ],
  [
    "qr",
    "কিউ আর"
  ],
  [
    "Online Payment",
    "অনলাইন পেমেন্ট"
  ],
  [
    "online payment",
    "অনলাইন পেমেন্ট"
  ],
  [
    "Online",
    "অনলাইন"
  ],
  [
    "online",
    "অনলাইন"
  ],
  [
    "Scan",
    "স্ক্যান"
  ],
  [
    "scan",
    "স্ক্যান"
  ],
  [
    "Order placement",
    "অর্ডার সম্পন্নকরণ"
  ],
  [
    "order placement",
    "অর্ডার সম্পন্নকরণ"
  ],
  [
    "placement",
    "সম্পন্নকরণ"
  ],
  [
    "Details",
    "বিবরণ"
  ],
  [
    "details",
    "বিবরণ"
  ],
  [
    "Delivery address",
    "ডেলিভারি ঠিকানা"
  ],
  [
    "delivery address",
    "ডেলিভারি ঠিকানা"
  ],
  [
    "Address",
    "ঠিকানা"
  ],
  [
    "address",
    "ঠিকানা"
  ],
  [
    "proper",
    "সঠিক"
  ],
  [
    "Phone number",
    "ফোন নম্বর"
  ],
  [
    "phone number",
    "ফোন নম্বর"
  ],
  [
    "Phone",
    "ফোন"
  ],
  [
    "phone",
    "ফোন"
  ],
  [
    "Communication",
    "যোগাযোগ"
  ],
  [
    "communication",
    "যোগাযোগ"
  ],
  [
    "Delivery coordination",
    "ডেলিভারি সমন্বয়"
  ],
  [
    "delivery coordination",
    "ডেলিভারি সমন্বয়"
  ],
  [
    "Coordination",
    "সমন্বয়"
  ],
  [
    "coordination",
    "সমন্বয়"
  ],
  [
    "Delivery",
    "ডেলিভারি"
  ],
  [
    "delivery",
    "ডেলিভারি"
  ],
  [
    "PLACE ORDER ON WHATSAPP",
    "প্লেস অর্ডার অন হোয়াটসঅ্যাপ"
  ],
  [
    "Place Order on WhatsApp",
    "হোয়াটসঅ্যাপে অর্ডার দিন"
  ],
  [
    "ORDER PLACED ON WHATSAPP",
    "অর্ডার প্লেসড অন হোয়াটসঅ্যাপ"
  ],
  [
    "Order Placed on WhatsApp",
    "হোয়াটসঅ্যাপে অর্ডার সম্পন্ন"
  ],
  [
    "PLACED",
    "প্লেসড"
  ],
  [
    "ON",
    "অন"
  ],
  [
    "place",
    "প্লেস"
  ],
  [
    "complete",
    "সম্পূর্ণ"
  ],
  [
    "verify",
    "যাচাই"
  ],
  [
    "WhatsApp order flow",
    "হোয়াটসঅ্যাপ অর্ডার ফ্লো"
  ],
  [
    "whatsapp order flow",
    "হোয়াটসঅ্যাপ অর্ডার ফ্লো"
  ],
  [
    "Flow",
    "ফ্লো"
  ],
  [
    "flow",
    "ফ্লো"
  ],
  [
    "Detail View",
    "বিস্তারিত বিবরণ ভিউ"
  ],
  [
    "detail view",
    "বিস্তারিত বিবরণ ভিউ"
  ],
  [
    "specific",
    "নির্দিষ্ট"
  ],
  [
    "Features",
    "ফিচারগুলো"
  ],
  [
    "features",
    "ফিচারগুলো"
  ],
  [
    "Guidance",
    "নির্দেশনা"
  ],
  [
    "guidance",
    "নির্দেশনা"
  ],
  [
    "FOOTER CONTACT",
    "ফুটার ও যোগাযোগ"
  ],
  [
    "Footer Contact",
    "ফুটার ও যোগাযোগ"
  ],
  [
    "Footer",
    "ফুটার"
  ],
  [
    "footer",
    "ফুটার"
  ],
  [
    "Location",
    "লোকেশন"
  ],
  [
    "location",
    "লোকেশন"
  ],
  [
    "Timing",
    "সময়সূচী"
  ],
  [
    "timing",
    "সময়সূচী"
  ],
  [
    "Contact",
    "যোগাযোগ"
  ],
  [
    "contact",
    "যোগাযোগ"
  ],
  [
    "Call numbers",
    "ফোন নম্বরসমূহ"
  ],
  [
    "call numbers",
    "ফোন নম্বরসমূহ"
  ],
  [
    "call",
    "কল"
  ],
  [
    "help",
    "সাহায্য"
  ],
  [
    "POWERED BY ROX AI",
    "পাওয়ার্ড বাই রক্স এ আই"
  ],
  [
    "Powered by ROX AI",
    "পাওয়ার্ড বাই রক্স এ আই"
  ],
  [
    "Powered by Rox AI",
    "পাওয়ার্ড বাই রক্স এ আই"
  ],
  [
    "Powered by",
    "পাওয়ার্ড বাই"
  ],
  [
    "powered by",
    "পাওয়ার্ড বাই"
  ],
  [
    "Branding",
    "ব্র্যান্ডিং"
  ],
  [
    "branding",
    "ব্র্যান্ডিং"
  ],
  [
    "AI assistance layer",
    "এ আই অ্যাসিস্ট্যান্স লেয়ার"
  ],
  [
    "ai assistance layer",
    "এ আই অ্যাসিস্ট্যান্স লেয়ার"
  ],
  [
    "layer",
    "লেয়ার"
  ],
  [
    "DEVELOPED BY ROHIT DAS",
    "ডেভেলপড বাই রোহিত দাস"
  ],
  [
    "Developed and design by Rohit Das",
    "ডেভেলপড অ্যান্ড ডিজাইনড বাই রোহিত দাস"
  ],
  [
    "Developed by Rohit Das",
    "ডেভেলপড বাই রোহিত দাস"
  ],
  [
    "Rohit Das",
    "রোহিত দাস"
  ],
  [
    "Rohit",
    "রোহিত"
  ],
  [
    "Das",
    "দাস"
  ],
  [
    "Developed",
    "ডেভেলপড"
  ],
  [
    "design",
    "ডিজাইন"
  ],
  [
    "creator",
    "নির্মাতা"
  ],
  [
    "Credit",
    "ক্রেডিট"
  ],
  [
    "credit",
    "ক্রেডিট"
  ],
  [
    "Workflow",
    "ওয়ার্কফ্লো"
  ],
  [
    "workflow",
    "ওয়ার্কফ্লো"
  ],
  [
    "A TO Z COMPLETE",
    "এ টু জেড সম্পূর্ণ"
  ],
  [
    "A to Z Complete",
    "এ টু জেড সম্পূর্ণ"
  ],
  [
    "A to Z Tutorial",
    "এ টু জেড টিউটোরিয়াল"
  ],
  [
    "A to Z",
    "এ টু জেড"
  ],
  [
    "A TO Z",
    "এ টু জেড"
  ],
  [
    "Scene",
    "দৃশ্য"
  ],
  [
    "scene",
    "দৃশ্য"
  ],
  [
    "Voice",
    "ভয়েস"
  ],
  [
    "voice",
    "ভয়েস"
  ],
  [
    "Narration",
    "বক্তব্য"
  ],
  [
    "narration",
    "বক্তব্য"
  ],
  [
    "control",
    "কন্ট্রোল"
  ],
  [
    "controls",
    "কন্ট্রোল"
  ]
];

const langs = { bn: { voice: 'bn-IN' }, en: { voice: 'en-IN' }, hi: { voice: 'hi-IN' } };
let idx = 0;
let lang = (typeof currentLang !== "undefined" && ["bn", "en", "hi"].includes(currentLang)) ? currentLang : "bn";
let playing = false;
let timer = null;
let speechToken = 0;
let recording = false;
let recorder = null;
let recordStream = null;

const root = document.getElementById('ezone-cinematic-tour'),
      launch = document.getElementById('ezone-tour-launcher'),
      shade = document.getElementById('ez-tour-shade'),
      spot = document.getElementById('ez-tour-spotlight'),
      title = document.getElementById('ez-tour-title'),
      desc = document.getElementById('ez-tour-desc'),
      caption = document.getElementById('ez-tour-caption'),
      counter = document.getElementById('ez-tour-counter'),
      kicker = document.getElementById('ez-tour-kicker'),
      bar = document.getElementById('ez-tour-progress'),
      play = document.getElementById('ez-tour-play'),
      time = document.getElementById('ez-tour-time'),
      recordBtn = document.getElementById('ez-tour-record');

function txt(o) { return o[lang] || o.en; }

function firstProductButton(kind) {
  const grid = document.getElementById('products-grid-container');
  if (!grid) return null;
  const buttons = [...grid.querySelectorAll('button')];
  if (kind === 'variant') return buttons.find(b => /SELECT & ADD TO BAG/i.test(b.textContent)) || buttons.find(b => /ADD TO BAG/i.test(b.textContent));
  return buttons.find(b => /ADD TO BAG/i.test(b.textContent));
}

function findTarget(sel) {
  if (sel === 'body') return document.body;
  let el = document.querySelector(sel);
  if (!el && sel === '#hero') el = document.querySelector('header') || document.querySelector('section');
  if (!el && sel === '#rox-ai-modal') el = document.querySelector('[id*="rox-ai"]') || document.querySelector('#rox-product-modal');
  if (!el && sel === '#inventory-manager') el = [...document.querySelectorAll('section,div')].find(x => /Inventory Manager/i.test(x.textContent || ''));
  if (!el && sel === '.bg-red-950.border-red-600') el = document.getElementById('admin-floating-lock-btn') || [...document.querySelectorAll('div')].find(x => /ADMIN CONTROL PANEL — RESTRICTED ACCESS/i.test(x.textContent || ''));
  if (!el && sel === '#products-grid-container button[onclick*="handleCardClickForVariants"]') el = firstProductButton('variant');
  if (!el && sel === '#products-grid-container button[onclick*="addToCart"]') el = firstProductButton('normal');
  if (!el && sel === '#cart-summary-modal button[onclick="placeOrderOnWhatsApp()"]') el = document.querySelector('#cart-summary-modal button[onclick="placeOrderOnWhatsApp()"]');
  return el || document.body;
}

function ensureModalForStep() {
  const sel = steps[idx].sel;
  if (sel === '#subitem-modal' || sel === '#customer-variants-list') {
    const btn = firstProductButton('variant');
    if (btn) {
      const m = btn.getAttribute('onclick') || '';
      const match = m.match(/handleCardClickForVariants\('([^']+)'/);
      if (match && typeof window.handleCardClickForVariants === 'function') {
        try { window.handleCardClickForVariants(match[1], { currentTarget: btn, stopPropagation() {} }); } catch (e) {}
      }
    }
  }
  if (sel === '#cart-summary-modal' || sel === '#cart-summary-modal img[alt*="Payment QR"]' || sel === '#order-customer-name' || sel === '#cart-summary-modal button[onclick="placeOrderOnWhatsApp()"]') {
    if (typeof window.openCartWhatsApp === 'function') try { window.openCartWhatsApp(); } catch (e) {}
  }
}

function cleanupStepOverlays() {
  const sub = document.getElementById('subitem-modal');
  if (sub && idx !== 9 && idx !== 10) sub.classList.add('hidden');
}

function positionTarget() {
  ensureModalForStep();
  const el = findTarget(steps[idx].sel);
  if (el && el !== document.body) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    setTimeout(() => {
      const r = el.getBoundingClientRect(), pad = 8;
      spot.style.left = (Math.max(4, r.left - pad)) + 'px';
      spot.style.top = (Math.max(78, r.top - pad)) + 'px';
      spot.style.width = Math.min(window.innerWidth - 8, Math.max(70, r.width + pad * 2)) + 'px';
      spot.style.height = Math.min(window.innerHeight - 90, Math.max(50, r.height + pad * 2)) + 'px';
    }, 420);
  } else {
    spot.style.left = '4vw';
    spot.style.top = '18vh';
    spot.style.width = '92vw';
    spot.style.height = '58vh';
  }
}

function speechText(obj) {
  let text = txt(obj);
  if (lang === 'bn') {
    for (let i = 0; i < bnWordMappings.length; i++) {
      const pair = bnWordMappings[i];
      const word = pair[0];
      const repl = pair[1];
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp('(\\b|(?<=[\\u0980-\\u09FF\\s\\-_]))' + escaped + '(\\b|(?=[\\u0980-\\u09FF\\s\\-_]))', 'gi');
      text = text.replace(reg, repl);
    }
  } else if (lang === 'hi') {
    text = text.replace(/ROX AI/g, 'रॉक्स AI');
    text = text.replace(/Rox AI/g, 'रॉक्स AI');
  } else {
    text = text.replace(/ROX AI/g, 'Rox AI');
  }
  return text;
}

function chooseVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;

  if (lang === 'bn') {
    const bnVoice = voices.find(v => {
      const l = String(v.lang || '').toLowerCase();
      const n = String(v.name || '').toLowerCase();
      return l.includes('bn') || l.includes('bangla') || l.includes('bengali') || n.includes('bengali') || n.includes('bangla');
    });
    if (bnVoice) return bnVoice;
  } else if (lang === 'hi') {
    const hiVoice = voices.find(v => {
      const l = String(v.lang || '').toLowerCase();
      const n = String(v.name || '').toLowerCase();
      return l.includes('hi') || l.includes('hindi') || n.includes('hindi');
    });
    if (hiVoice) return hiVoice;
  }

  const pref = langs[lang].voice.toLowerCase();
  return voices.find(v => String(v.lang || '').toLowerCase() === pref)
      || voices.find(v => String(v.lang || '').toLowerCase().startsWith(pref.slice(0, 2)))
      || (lang === 'en' ? voices.find(v => String(v.lang || '').toLowerCase().startsWith('en')) : null);
}

function speak() {
  if (!('speechSynthesis' in window)) {
    const s = steps[idx];
    const words = txt(s.d).trim().split(/\s+/).filter(Boolean).length;
    const waitMs = Math.max(6000, words * 320);
    clearTimeout(timer);
    if (playing) {
      timer = setTimeout(() => { if (playing) next(); }, waitMs);
    }
    return;
  }

  const token = ++speechToken;
  clearTimeout(timer);
  try { window.speechSynthesis.cancel(); } catch(e) {}

  const text = speechText(steps[idx].d);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadMs = Math.max(7000, Math.ceil(wordCount * 330));
  const startTime = Date.now();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = langs[lang].voice;
  u.rate = lang === 'bn' ? 0.86 : (lang === 'hi' ? 0.88 : 0.94);
  u.pitch = 1.0;
  u.volume = 1.0;

  const v = chooseVoice();
  if (v) u.voice = v;

  let ended = false;
  const goNext = () => {
    if (ended || token !== speechToken) return;
    ended = true;
    clearTimeout(timer);
    if (playing) next();
  };

  u.onend = () => {
    if (token !== speechToken) return;
    const elapsed = Date.now() - startTime;
    // Prevent premature fast-forwarding if browser engine ends too fast
    if (elapsed < 3500 && wordCount > 8) {
      const remainingMs = Math.max(2500, estimatedReadMs - elapsed);
      clearTimeout(timer);
      timer = setTimeout(goNext, remainingMs);
    } else {
      // Natural 1.4s pause after speech finishes before moving to next scene
      clearTimeout(timer);
      timer = setTimeout(goNext, 1400);
    }
  };

  u.onerror = (e) => {
    // If canceled/interrupted by user interaction or language switch, do not advance
    if (e && (e.error === 'canceled' || e.error === 'interrupted')) {
      return;
    }
    if (token === speechToken && playing) {
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(3000, estimatedReadMs - elapsed);
      clearTimeout(timer);
      timer = setTimeout(goNext, remainingMs);
    }
  };

  // Safe fallback timer so tour never hangs if onend is not fired by browser
  timer = setTimeout(goNext, estimatedReadMs + 6000);

  try {
    window.speechSynthesis.speak(u);
  } catch(err) {
    timer = setTimeout(goNext, estimatedReadMs);
  }

  if (time) {
    time.textContent = lang === 'bn'
      ? 'Voice narration চলছে (বাংলা) — কথা শেষ হলে পরের দৃশ্য আসবে'
      : (lang === 'hi' ? 'Voice narration चल रहा है — narration खत्म होने पर अगला scene आएगा' : 'Voice narration playing — the next scene waits for narration to finish');
  }
}

function render() {
  cleanupStepOverlays();
  const s = steps[idx];
  if (title) title.textContent = txt(s.t);
  if (desc) desc.textContent = txt(s.d);
  if (caption) caption.textContent = lang === 'bn' ? 'AI voice-over • বাংলা • narration-synced' : lang === 'hi' ? 'AI voice-over • हिन्दी • narration-synced' : 'AI voice-over • English • narration-synced';
  if (kicker) kicker.textContent = s.k;
  if (counter) counter.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(steps.length).padStart(2, '0');
  if (bar) bar.style.width = ((idx + 1) / steps.length * 100) + '%';
  positionTarget();
  if (playing) speak();
}

function openTour() {
  if (!root) return;
  speechToken++;
  clearTimeout(timer);
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
  lang = (typeof currentLang !== "undefined" && ["bn", "en", "hi"].includes(currentLang)) ? currentLang : "bn";
  document.querySelectorAll('[data-tour-lang]').forEach(x => {
    x.classList.toggle('active', (x.getAttribute('data-tour-lang') || (x.dataset && x.dataset.tourLang)) === lang);
  });
  root.classList.add('open');
  root.setAttribute('aria-hidden', 'false');
  document.body.classList.add('ez-tour-active');
  playing = true;
  idx = 0;
  render();
  if (play) play.innerHTML = '<i class="fas fa-pause"></i> Pause Tour';
}

function closeTour() {
  playing = false;
  speechToken++;
  clearTimeout(timer);
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
  stopRecording();
  const sub = document.getElementById('subitem-modal');
  if (sub) sub.classList.add('hidden');
  const cart = document.getElementById('cart-summary-modal');
  if (cart) cart.classList.add('hidden');
  if (root) {
    root.classList.remove('open');
    root.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('ez-tour-active');
  if (time) time.textContent = 'Tour closed';
}

function next() {
  speechToken++;
  clearTimeout(timer);
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
  if (idx < steps.length - 1) {
    idx++;
    render();
  } else {
    playing = false;
    if (play) play.innerHTML = '<i class="fas fa-redo"></i> Replay';
    if (time) time.textContent = lang === 'bn' ? 'Tutorial সম্পূর্ণ হয়েছে' : lang === 'hi' ? 'Tutorial पूरा हो गया' : 'Tutorial complete';
  }
}

function prev() {
  speechToken++;
  clearTimeout(timer);
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
  idx = Math.max(0, idx - 1);
  render();
}

async function startRecording() {
  if (recording) { stopRecording(); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia || !window.MediaRecorder) {
    alert(lang === 'bn' ? 'এই browser-এ screen recording support নেই।' : 'Screen recording is not supported by this browser.');
    return;
  }
  try {
    recordStream = await navigator.mediaDevices.getDisplayMedia({ video: { width: { ideal: 3840 }, height: { ideal: 2160 }, frameRate: { ideal: 60, max: 60 } }, audio: true });
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(x => MediaRecorder.isTypeSupported(x)) || '';
    recorder = new MediaRecorder(recordStream, mime ? { mimeType: mime, videoBitsPerSecond: 24000000 } : {});
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'E-ZONE-Electric-AtoZ-Tutorial-4K-ready.webm';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    };
    recordStream.getVideoTracks()[0].addEventListener('ended', stopRecording);
    recorder.start(1000);
    recording = true;
    if (root) root.classList.add('ez-tour-recording');
    if (recordBtn) recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
    if (time) time.textContent = 'Recording started • choose a 3840×2160 capture source for 4K';
  } catch (e) {
    recordStream = null;
    recorder = null;
  }
}

function stopRecording() {
  if (!recording) return;
  recording = false;
  if (root) root.classList.remove('ez-tour-recording');
  if (recorder && recorder.state !== 'inactive') recorder.stop();
  if (recordStream) recordStream.getTracks().forEach(t => t.stop());
  recordStream = null;
  recorder = null;
  if (recordBtn) recordBtn.innerHTML = '<i class="fas fa-video"></i> 4K Record';
}

if (launch) {
  launch.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openTour();
  });
}

const closeBtn = document.getElementById('ez-tour-close');
if (closeBtn) closeBtn.addEventListener('click', closeTour);
if (shade) shade.addEventListener('click', closeTour);

const nextBtn = document.getElementById('ez-tour-next');
if (nextBtn) nextBtn.addEventListener('click', next);

const prevBtn = document.getElementById('ez-tour-prev');
if (prevBtn) prevBtn.addEventListener('click', prev);

if (recordBtn) recordBtn.addEventListener('click', startRecording);

if (play) {
  play.addEventListener('click', () => {
    if (idx === steps.length - 1) {
      idx = 0;
      playing = true;
      render();
      play.innerHTML = '<i class="fas fa-pause"></i> Pause Tour';
      return;
    }
    playing = !playing;
    if (playing) {
      render();
      play.innerHTML = '<i class="fas fa-pause"></i> Pause Tour';
    } else {
      speechToken++;
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch(e) {}
      }
      play.innerHTML = '<i class="fas fa-play"></i> Resume Tour';
      if (time) time.textContent = lang === 'bn' ? 'Paused' : (lang === 'hi' ? 'रुका हुआ' : 'Paused');
    }
  });
}

document.querySelectorAll('[data-tour-lang]').forEach(b => b.addEventListener('click', (e) => {
  e.stopPropagation();
  speechToken++;
  clearTimeout(timer);
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch(err) {}
  }
  lang = b.getAttribute('data-tour-lang') || (b.dataset && b.dataset.tourLang) || 'bn';
  document.querySelectorAll('[data-tour-lang]').forEach(x => {
    x.classList.toggle('active', (x.getAttribute('data-tour-lang') || (x.dataset && x.dataset.tourLang)) === lang);
  });
  if (root && root.classList.contains('open')) {
    render();
  }
}));

document.addEventListener('keydown', e => {
  if (!root || !root.classList.contains('open')) return;
  if (e.key === 'Escape') closeTour();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === ' ') {
    e.preventDefault();
    if (play) play.click();
  }
});

if (typeof window !== "undefined") {
  window.openTour = openTour;
  window.closeTour = closeTour;
  if ('speechSynthesis' in window) window.speechSynthesis.addEventListener('voiceschanged', () => {});
}

})();
