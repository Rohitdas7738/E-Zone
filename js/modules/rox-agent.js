        /* ================= ROX PRODUCT MARKETING AGENT LOGIC ================= */
        var roxCurrentProductId = null;
        var roxLang = 'bn';

        var roxUiText = {
            bn: {
                subtitle: 'প্রোডাক্ট মার্কেটিং এজেন্ট',
                speak: 'শুনুন',
                stop: 'বন্ধ করুন',
                note: 'ROX এই ওয়েবসাইটের পণ্য তথ্যের ভিত্তিতেই উত্তর দিচ্ছে।',
                brand: 'ব্র্যান্ড',
                category: 'ক্যাটাগরি',
                details: 'পণ্যের বিবরণ',
                price: 'বর্তমান মূল্য',
                variants: 'ভ্যারিয়েন্ট / অপশন',
                unavailable: 'এই পণ্যের জন্য অতিরিক্ত ভ্যারিয়েন্ট তথ্য দেওয়া নেই।',
                intro: 'নমস্কার। আমি ROX।',
                priceLine: 'এই পণ্যের বর্তমান ওয়েবসাইটের মূল্য',
                useful: 'ওয়েবসাইটে দেওয়া বিবরণ অনুযায়ী এই পণ্যটি',
                ask: 'ROX AI'
            },
            en: {
                subtitle: 'Product Marketing Agent',
                speak: 'Listen',
                stop: 'Stop',
                note: 'ROX responds only from the product information available on this website.',
                brand: 'Brand',
                category: 'Category',
                details: 'Product Details',
                price: 'Current Price',
                variants: 'Variants / Options',
                unavailable: 'No additional variant information is listed for this product.',
                intro: 'Hello. I am ROX.',
                priceLine: 'The current website price of this product is',
                useful: 'According to the information listed on this website, this product',
                ask: 'ROX AI'
            },
            hi: {
                subtitle: 'प्रोडक्ट मार्केटिंग एजेंट',
                speak: 'सुनें',
                stop: 'रोकें',
                note: 'ROX केवल इस वेबसाइट पर उपलब्ध प्रोडक्ट जानकारी के आधार पर जवाब देता है।',
                brand: 'ब्रांड',
                category: 'श्रेणी',
                details: 'प्रोडक्ट विवरण',
                price: 'वर्तमान कीमत',
                variants: 'वेरिएंट / विकल्प',
                unavailable: 'इस प्रोडक्ट के लिए अतिरिक्त वेरिएंट जानकारी उपलब्ध नहीं है।',
                intro: 'नमस्ते। मैं ROX हूँ।',
                priceLine: 'इस प्रोडक्ट की वेबसाइट पर दी गई वर्तमान कीमत है',
                useful: 'वेबसाइट पर दी गई जानकारी के अनुसार यह प्रोडक्ट',
                ask: 'ROX AI'
            }
        };

        function roxSafeText(value) {
            return String(value ?? '').replace(/[<>&"]/g, function(ch) {
                return ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[ch]);
            });
        }

        function roxGetProduct(id) {
            return products.find(item => item.id === id) || null;
        }

        function roxGetVariantText(p, lang) {
            const map = p.subVariantPrices || {};
            const keys = Object.keys(map);
            if(keys.length) return keys.join(', ');
            if(p.isMcb) return lang === 'bn' ? '৬A, ১০A, ১৬A, ২০A, ২৫A, ৩২A, ৪০A' : (lang === 'hi' ? '6A, 10A, 16A, 20A, 25A, 32A, 40A' : '6A, 10A, 16A, 20A, 25A, 32A, 40A');
            if(p.isGiBox || p.isDbBox) return '4×4, 4×6, 4×8, 4×10, 4×12';
            if(p.isBattery) return lang === 'bn' ? 'AA, AAA, C, D, 9V, 12V' : 'AA, AAA, C, D, 9V, 12V';
            if(p.isWattBulb) return lang === 'bn' ? 'বিভিন্ন ওয়াট অপশন' : (lang === 'hi' ? 'विभिन्न वॉट विकल्प' : 'Different watt options');
            if(p.isColorBulb) return lang === 'bn' ? 'Cool Day Light, Warm White, RGB ও অন্যান্য রং' : (lang === 'hi' ? 'Cool Day Light, Warm White, RGB और अन्य रंग' : 'Cool Day Light, Warm White, RGB and other colors');
            return lang === 'bn' ? 'প্রয়োজন অনুযায়ী বিভিন্ন অপশন/ভ্যারিয়েন্ট পাওয়া যেতে পারে।' : (lang === 'hi' ? 'आवश्यकता के अनुसार अलग-अलग विकल्प/वेरिएंट मिल सकते हैं।' : 'Different options or variants may be available depending on the requirement.');
        }

        /* 
         * ROX PRODUCT KNOWLEDGE LAYER
         * General product information is combined with the product card's own
         * name, brand, category and specification. Manufacturer-specific facts
         * are used only where the brand/product family is recognizable.
         */
        function roxGetKnowledge(p, lang) {
            const n = String(p.name || '').toLowerCase();
            const b = String(p.brand || '').toLowerCase();
            const c = String(p.category || '').toLowerCase();
            let bn = 'এটি দৈনন্দিন বৈদ্যুতিক কাজের জন্য ব্যবহৃত একটি ব্যবহারিক পণ্য। সঠিক মাপ, রেটিং ও লোড অনুযায়ী ব্যবহার করা উচিত এবং ইনস্টলেশনের কাজ যোগ্য ইলেকট্রিশিয়ান দিয়ে করানো নিরাপদ।';
            let hi = 'यह रोज़मर्रा के इलेक्ट्रिकल काम के लिए उपयोगी प्रोडक्ट है। इसे सही साइज, रेटिंग और लोड के अनुसार इस्तेमाल करना चाहिए और इंस्टॉलेशन योग्य इलेक्ट्रीशियन से कराना सुरक्षित है।';
            let en = 'This is a practical electrical product for everyday installation or maintenance work. It should be selected according to the correct size, rating and load, with installation handled safely by a qualified electrician.';

            if (n.includes('wire') || n.includes('cable') || c.includes('wire') || c.includes('cable')) {
                bn = 'এই wire/cable সাধারণত ঘর, দোকান বা commercial electrical wiring-এ power supply দেওয়ার কাজে ব্যবহৃত হয়। এর conductor size বা sq mm যত গুরুত্বপূর্ণ, ততটাই গুরুত্বপূর্ণ insulation, current-carrying capacity এবং installation method।';
                hi = 'यह wire/cable आमतौर पर घर, दुकान या commercial electrical wiring में power supply के लिए इस्तेमाल होता है। इसमें conductor size या sq mm के साथ insulation, current-carrying capacity और installation method महत्वपूर्ण हैं।';
                en = 'This wire/cable is generally used for power distribution in residential, shop or commercial wiring. Conductor size, insulation, current-carrying capacity and the installation method are important when selecting it.';
                if (b.includes('finolex')) {
                    bn += ' Finolex-এর electrical house-wire range-এ flame-retardant PVC insulation এবং high-purity electrolytic copper conductor-এর মতো construction features পাওয়া যায়; নির্দিষ্ট product-এর datasheet অনুযায়ী final specification যাচাই করা উচিত।';
                    hi += ' Finolex की electrical house-wire range में flame-retardant PVC insulation और high-purity electrolytic copper conductor जैसे construction features मिलते हैं; अंतिम specification के लिए संबंधित product datasheet देखना चाहिए।';
                    en += ' Finolex electrical house-wire ranges include construction features such as flame-retardant PVC insulation and high-purity electrolytic copper conductors; the exact product datasheet should be checked for final specifications.';
                }
                if (b.includes('polycab')) {
                    bn += ' Polycab-এর building-wire ranges-এ fire-retardant, low-emission এবং বিভিন্ন insulation technology-র options রয়েছে; exact rating ও construction product model অনুযায়ী আলাদা হতে পারে।';
                    hi += ' Polycab की building-wire ranges में fire-retardant, low-emission और अलग-अलग insulation technologies के options मिलते हैं; exact rating और construction model के अनुसार बदल सकते हैं।';
                    en += ' Polycab building-wire ranges include fire-retardant, low-emission and different insulation technologies; exact ratings and construction vary by model.';
                }
            } else if (n.includes('mcb') || n.includes('circuit breaker') || c.includes('mcb')) {
                bn = 'MCB একটি protective switching device, যা অতিরিক্ত current বা short-circuit condition হলে circuit বিচ্ছিন্ন করে wiring ও connected equipment-কে সুরক্ষায় সাহায্য করে। Ampere rating circuit load ও cable capacity অনুযায়ী নির্বাচন করতে হয়।';
                hi = 'MCB एक protective switching device है, जो overcurrent या short-circuit condition में circuit को disconnect करके wiring और connected equipment की सुरक्षा में मदद करता है। Ampere rating load और cable capacity के अनुसार चुननी चाहिए।';
                en = 'An MCB is a protective switching device that helps disconnect a circuit during overcurrent or short-circuit conditions. Its ampere rating should be selected according to the circuit load and cable capacity.';
            } else if (n.includes('socket') || n.includes('switch') || c.includes('switch') || c.includes('socket')) {
                bn = 'এই switch/socket সাধারণত modular electrical installation-এ appliances ও lighting circuit control বা connection-এর জন্য ব্যবহৃত হয়। Current rating, terminal quality এবং compatible modular plate দেখে নির্বাচন করা উচিত।';
                hi = 'यह switch/socket modular electrical installation में appliances और lighting circuit के control या connection के लिए इस्तेमाल होता है। Current rating, terminal quality और compatible modular plate देखकर चयन करना चाहिए।';
                en = 'This switch/socket is commonly used in modular electrical installations for controlling or connecting appliances and lighting circuits. Selection should consider current rating, terminal quality and compatible modular plates.';
            } else if (n.includes('bulb') || n.includes('led') || n.includes('light') || c.includes('light') || c.includes('decorative')) {
                bn = 'এই lighting product ঘর, দোকান বা decorative illumination-এর কাজে ব্যবহার করা যায়। Wattage, colour temperature, brightness, fitting type এবং supply voltage দেখে উপযুক্ত model নির্বাচন করা উচিত।';
                hi = 'यह lighting product घर, दुकान या decorative illumination के लिए उपयोग किया जा सकता है। Wattage, colour temperature, brightness, fitting type और supply voltage देखकर सही model चुनना चाहिए।';
                en = 'This lighting product can be used for home, shop or decorative illumination. Choose the model based on wattage, colour temperature, brightness, fitting type and supply voltage.';
            } else if (n.includes('fan') || c.includes('fan')) {
                bn = 'এই fan product সাধারণত indoor air circulation ও cooling-এর জন্য ব্যবহৃত হয়। Size, motor type, power consumption, speed control এবং room size অনুযায়ী model নির্বাচন করা ভালো।';
                hi = 'यह fan indoor air circulation और cooling के लिए इस्तेमाल होता है। Size, motor type, power consumption, speed control और room size के अनुसार model चुनना बेहतर है।';
                en = 'This fan is generally used for indoor air circulation and cooling. Model selection should consider size, motor type, power consumption, speed control and room size.';
            } else if (n.includes('battery') || c.includes('battery')) {
                bn = 'এই battery portable electrical/electronic equipment-এ power source হিসেবে ব্যবহৃত হয়। Voltage, size/type, capacity এবং device-এর required polarity মিলিয়ে ব্যবহার করতে হবে।';
                hi = 'यह battery portable electrical/electronic equipment में power source के रूप में इस्तेमाल होती है। Voltage, size/type, capacity और device की required polarity मिलाना जरूरी है।';
                en = 'This battery is used as a portable power source for electrical/electronic equipment. Match the voltage, size/type, capacity and required polarity with the device.';
            } else if (n.includes('tester') || n.includes('screwdriver') || c.includes('tool')) {
                bn = 'এই electrical tool installation, checking বা maintenance-এর কাজে ব্যবহার করা হয়। Insulated tool হলে insulation damage হয়েছে কি না পরীক্ষা করে ব্যবহার করা উচিত এবং live circuit-এ কাজ করার সময় যথাযথ electrical safety মেনে চলতে হবে।';
                hi = 'यह electrical tool installation, checking या maintenance के काम में उपयोग होता है। Insulated tool की insulation खराब न हो यह जांचना चाहिए और live circuit पर काम करते समय उचित electrical safety का पालन करना चाहिए।';
                en = 'This electrical tool is useful for installation, checking or maintenance. Inspect insulation for damage where applicable and follow proper electrical safety procedures around live circuits.';
            } else if (n.includes('capacitor') || c.includes('accessor')) {
                bn = 'এই electrical accessory নির্দিষ্ট circuit বা appliance-এর supporting component হিসেবে ব্যবহৃত হয়। Voltage, capacitance/current rating, size এবং appliance compatibility দেখে ব্যবহার করা গুরুত্বপূর্ণ।';
                hi = 'यह electrical accessory किसी circuit या appliance के supporting component के रूप में उपयोग होती है। Voltage, capacitance/current rating, size और appliance compatibility के अनुसार इस्तेमाल करना चाहिए।';
                en = 'This electrical accessory is used as a supporting component in a circuit or appliance. Voltage, capacitance/current rating, size and appliance compatibility should be checked before use.';
            }
            return lang === 'bn' ? bn : (lang === 'hi' ? hi : en);
        }

        function roxBuildSpeech(p, lang) {
            lang = lang || roxLang || (typeof currentLang !== 'undefined' ? currentLang : 'bn');
            const t = roxUiText[lang] || roxUiText['bn'];
            const name = (typeof getLocalizedProductName === 'function') ? getLocalizedProductName(p.name) : p.name;
            const catName = (typeof categoryLabels !== 'undefined' && categoryLabels[p.category] && categoryLabels[p.category][lang]) 
                ? categoryLabels[p.category][lang] 
                : p.category;
            const variants = roxGetVariantText(p, lang);
            const exactDetails = String(p.details || p.spec || '').trim();
            const knowledge = p.details ? '' : roxGetKnowledge(p, lang);

            if(lang === 'bn') {
                return `${t.intro} ${name} পণ্যটি ${p.brand} ব্র্যান্ডের এবং এটি ${catName} ক্যাটাগরির। ${t.useful} ${exactDetails || 'এই পণ্যের জন্য বর্তমানে অতিরিক্ত বিস্তারিত তথ্য দেওয়া নেই।'} ${knowledge ? knowledge + ' ' : ''}${t.priceLine} ₹${p.price}${Number(p.discountPercent) > 0 ? ` (${Math.round(Number(p.discountPercent))}% ডিসকাউন্ট)` : ''}। ${t.variants} হলো ${variants}। আপনি চাইলে এই পণ্যটি কার্টে যোগ করে অর্ডার করতে পারেন, অথবা হোয়াটসঅ্যাপে ইনকোয়ারি পাঠাতে পারেন।`;
            }
            if(lang === 'hi') {
                return `${t.intro} ${name} ${p.brand} ब्रांड का प्रोडक्ट है और यह ${catName} श्रेणी में आता है। ${t.useful} ${exactDetails || 'इस प्रोडक्ट के लिए अभी अतिरिक्त विस्तृत जानकारी उपलब्ध नहीं है।'} ${knowledge ? knowledge + ' ' : ''}${t.priceLine} ₹${p.price}${Number(p.discountPercent) > 0 ? ` (${Math.round(Number(p.discountPercent))}% discount)` : ''}। ${t.variants} हैं: ${variants}। आप इस प्रोडक्ट को कार्ट में जोड़कर ऑर्डर कर सकते हैं या व्हाट्सऐप पर पूछताछ भेज सकते हैं।`;
            }
            return `${t.intro} ${name} is a ${p.brand} brand product in the ${catName} category. ${t.useful} ${exactDetails || 'No additional detailed information is currently listed for this product.'} ${knowledge ? knowledge + ' ' : ''}${t.priceLine} ₹${p.price}. ${t.variants}: ${variants}. You can add this product to the cart or send a WhatsApp enquiry.`;
        }

        function roxRenderDiagram(p) {
            const t = roxUiText[roxLang];
            const name = getLocalizedProductName(p.name);
            const variant = roxGetVariantText(p, roxLang);
            const nodes = [
                [t.details, name],
                [t.brand, p.brand],
                [t.category, p.category],
                [t.details, (p.details || p.spec || '—')],
                [t.price, `₹${p.price}`],
                [t.variants, variant]
            ];
            document.getElementById('rox-diagram').innerHTML = nodes.map(n =>
                `<div class="rox-node"><span class="rox-node-label">${roxSafeText(n[0])}</span><span class="rox-node-value">${roxSafeText(n[1])}</span></div>`
            ).join('');
            document.getElementById('rox-title').textContent = name;
            document.getElementById('rox-speech').textContent = roxBuildSpeech(p, roxLang);
            document.getElementById('rox-agent-subtitle').textContent = t.subtitle;
            document.getElementById('rox-speak-label').textContent = t.speak;
            document.getElementById('rox-stop-label').textContent = t.stop;
            document.getElementById('rox-note').textContent = t.note;
            document.querySelectorAll('#rox-product-modal .rox-language-row button').forEach(b => b.classList.remove('active'));
            const active = document.getElementById(`rox-lang-${roxLang}`);
            if(active) active.classList.add('active');
        }

        function openRoxProduct(id) {
            const p = roxGetProduct(id);
            if(!p) return;
            roxCurrentProductId = id;
            if(typeof currentLang !== 'undefined' && ['bn','en','hi'].includes(currentLang)) {
                roxLang = currentLang;
            } else if(!roxLang) {
                roxLang = 'bn';
            }
            const modal = document.getElementById('rox-product-modal');
            if(modal) modal.classList.add('rox-open');
            document.body.style.overflow = 'hidden';
            roxRenderDiagram(p);
            roxSpeak();
        }

        function closeRoxProduct() {
            roxStopSpeaking();
            const modal = document.getElementById('rox-product-modal');
            if(modal) modal.classList.remove('rox-open');
            document.body.style.overflow = '';
            roxCurrentProductId = null;
        }

        function openRoxChatFromModal() {
            const pid = roxCurrentProductId;
            closeRoxProduct();
            if (pid && typeof window.openRoxChatWithProduct === 'function') {
                window.openRoxChatWithProduct(pid);
            } else if (typeof window.openRoxCustomerChat === 'function') {
                window.openRoxCustomerChat();
            }
        }

        function setRoxLanguage(lang) {
            if(!['bn','en','hi'].includes(lang)) return;
            roxLang = lang;
            if(roxCurrentProductId) {
                roxRenderDiagram(roxGetProduct(roxCurrentProductId));
                roxSpeak();
            }
        }

        function roxStopSpeaking() {
            if('speechSynthesis' in window) window.speechSynthesis.cancel();
        }

        /*
         * ROX VOICE ENGINE
         * - Uses the customer's selected ROX language.
         * - Waits for browser voices to load before speaking.
         * - Prefers an exact regional voice (bn-IN / hi-IN / en-IN).
         * - Converts common electrical/brand terms into native-script
         *   pronunciation helpers for Bengali/Hindi, improving pronunciation
         *   on browsers that otherwise read English technical words poorly.
         */
        const roxPronunciation = {
            bn: [
                [/\bPhonePe\b/gi, 'ফোনপে'], [/\bWhatsApp\b/gi, 'হোয়াটসঅ্যাপ'], [/\bROX AI\b/gi, 'রক্স এ আই'],
                [/\bLED\b/gi, 'এলইডি'], [/\bCOB\b/gi, 'সিওবি'], [/\bMCB\b/gi, 'এমসিবি'], [/\bDB\b/gi, 'ডিবি'],
                [/\bPVC\b/gi, 'পিভিসি'], [/\bGI\b/gi, 'জিআই'], [/\bSMPS\b/gi, 'এসএমপিএস'],
                [/\bWatt\b/gi, 'ওয়াট'], [/\bVolt\b/gi, 'ভোল্ট'], [/\bAmp\b/gi, 'অ্যাম্পিয়ার'], [/\bAmpere\b/gi, 'অ্যাম্পিয়ার'],
                [/\bSwitch\b/gi, 'সুইচ'], [/\bSocket\b/gi, 'সকেট'], [/\bFan\b/gi, 'ফ্যান'], [/\bLight\b/gi, 'লাইট'],
                [/\bBulb\b/gi, 'বাল্ব'], [/\bBattery\b/gi, 'ব্যাটারি'], [/\bWire\b/gi, 'ওয়্যার'], [/\bCable\b/gi, 'কেবল'],
                [/\bTester\b/gi, 'টেস্টার'], [/\bScrewdriver\b/gi, 'স্ক্রু ড্রাইভার'], [/\bCrompton\b/gi, 'ক্রোম্পটন'],
                [/\bPhilips\b/gi, 'ফিলিপস'], [/\bHavells\b/gi, 'হ্যাভেলস'], [/\bPolycab\b/gi, 'পলিক্যাব'],
                [/\bFinolex\b/gi, 'ফিনোলেক্স'], [/\bPritam\b/gi, 'প্রীতম'], [/\bOrient Electric\b/gi, 'ওরিয়েন্ট ইলেকট্রিক'],
                [/\bJJ Ultra\b/gi, 'জেজে আল্ট্রা'], [/\bPrice\b/gi, 'দাম'], [/\bBrand\b/gi, 'ব্র্যান্ড'],
                [/\bCategory\b/gi, 'ক্যাটাগরি'], [/\bProduct\b/gi, 'প্রোডাক্ট'], [/\bDetails\b/gi, 'বিস্তারিত'],
                [/\bCurrent\b/gi, 'বর্তমান'], [/\bOption\b/gi, 'অপশন'], [/\bOptions\b/gi, 'অপশনগুলো'],
                [/\bVariant\b/gi, 'ভ্যারিয়েন্ট'], [/\bVariants\b/gi, 'ভ্যারিয়েন্টগুলো'], [/\bCool Day Light\b/gi, 'কুল ডে লাইট'],
                [/\bWarm White\b/gi, 'ওয়ার্ম হোয়াইট'], [/\bRGB\b/gi, 'আরজিবি'], [/\bPremium\b/gi, 'প্রিমিয়াম'],
                [/\bModern\b/gi, 'মডার্ন'], [/\bPower\b/gi, 'পাওয়ার'], [/\bHigh\b/gi, 'হাই'], [/\bLow\b/gi, 'লো']
            ],
            hi: [
                [/\bPhonePe\b/gi, 'फोनपे'], [/\bWhatsApp\b/gi, 'व्हाट्सऐप'], [/\bROX AI\b/gi, 'रॉक्स ए आई'],
                [/\bLED\b/gi, 'एलईडी'], [/\bCOB\b/gi, 'सीओबी'], [/\bMCB\b/gi, 'एमसीबी'], [/\bDB\b/gi, 'डीबी'],
                [/\bPVC\b/gi, 'पीवीसी'], [/\bGI\b/gi, 'जीआई'], [/\bSMPS\b/gi, 'एसएमपीएस'],
                [/\bWatt\b/gi, 'वॉट'], [/\bVolt\b/gi, 'वोल्ट'], [/\bAmp\b/gi, 'एम्पियर'], [/\bAmpere\b/gi, 'एम्पियर'],
                [/\bSwitch\b/gi, 'स्विच'], [/\bSocket\b/gi, 'सॉकेट'], [/\bFan\b/gi, 'पंखा'], [/\bLight\b/gi, 'लाइट'],
                [/\bBulb\b/gi, 'बल्ब'], [/\bBattery\b/gi, 'बैटरी'], [/\bWire\b/gi, 'वायर'], [/\bCable\b/gi, 'केबल'],
                [/\bTester\b/gi, 'टेस्टर'], [/\bScrewdriver\b/gi, 'स्क्रूड्राइवर'], [/\bCrompton\b/gi, 'क्रॉम्पटन'],
                [/\bPhilips\b/gi, 'फिलिप्स'], [/\bHavells\b/gi, 'हैवेल्स'], [/\bPolycab\b/gi, 'पॉलीकैब'],
                [/\bFinolex\b/gi, 'फिनोलेक्स'], [/\bPritam\b/gi, 'प्रीतम'], [/\bOrient Electric\b/gi, 'ओरिएंट इलेक्ट्रिक'],
                [/\bJJ Ultra\b/gi, 'जेजे अल्ट्रा'], [/\bPrice\b/gi, 'कीमत'], [/\bBrand\b/gi, 'ब्रांड'],
                [/\bCategory\b/gi, 'श्रेणी'], [/\bProduct\b/gi, 'प्रोडक्ट'], [/\bDetails\b/gi, 'विवरण'],
                [/\bCurrent\b/gi, 'वर्तमान'], [/\bOption\b/gi, 'विकल्प'], [/\bOptions\b/gi, 'विकल्प'],
                [/\bVariant\b/gi, 'वेरिएंट'], [/\bVariants\b/gi, 'वेरिएंट'], [/\bCool Day Light\b/gi, 'कूल डे लाइट'],
                [/\bWarm White\b/gi, 'वार्म व्हाइट'], [/\bRGB\b/gi, 'आरजीबी'], [/\bPremium\b/gi, 'प्रीमियम'],
                [/\bModern\b/gi, 'मॉडर्न'], [/\bPower\b/gi, 'पावर'], [/\bHigh\b/gi, 'हाई'], [/\bLow\b/gi, 'लो']
            ]
        };

        function roxMakeSpeechFriendly(text, lang) {
            let result = String(text || '');
            if (lang === 'en') return result;
            const rules = roxPronunciation[lang] || [];
            rules.forEach(([pattern, replacement]) => {
                result = result.replace(pattern, replacement);
            });
            return result;
        }

        function roxPickVoice(lang) {
            if(!('speechSynthesis' in window)) return null;
            const voices = window.speechSynthesis.getVoices() || [];
            if(!voices.length) return null;

            if(lang === 'bn') {
                const bnVoice = voices.find(v => {
                    const l = (v.lang || '').toLowerCase();
                    const n = (v.name || '').toLowerCase();
                    return l.includes('bn') || l.includes('bangla') || l.includes('bengali') || n.includes('bengali') || n.includes('bangla');
                });
                if(bnVoice) return bnVoice;
            } else if(lang === 'hi') {
                const hiVoice = voices.find(v => {
                    const l = (v.lang || '').toLowerCase();
                    const n = (v.name || '').toLowerCase();
                    return l.includes('hi') || l.includes('hindi') || n.includes('hindi');
                });
                if(hiVoice) return hiVoice;
            }

            const preferred = lang === 'bn'
                ? ['bn-IN','bn-BD','bn']
                : (lang === 'hi'
                    ? ['hi-IN','hi']
                    : ['en-IN','en-US','en-GB','en-AU','en']);
            for(const code of preferred) {
                const exact = voices.find(v => (v.lang || '').toLowerCase() === code.toLowerCase());
                if(exact) return exact;
            }
            const prefix = preferred[0].slice(0,2).toLowerCase();
            return voices.find(v => (v.lang || '').toLowerCase().startsWith(prefix)) || null;
        }

        function roxSpeak() {
            const p = roxCurrentProductId ? roxGetProduct(roxCurrentProductId) : null;
            if(!p || !('speechSynthesis' in window)) {
                if(!('speechSynthesis' in window)) alert('এই ব্রাউজারে Voice Speech Support নেই।');
                return;
            }

            const lang = roxLang;
            const text = roxMakeSpeechFriendly(roxBuildSpeech(p, lang), lang);
            const speakNow = () => {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(text);
                utter.lang = lang === 'bn' ? 'bn-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
                utter.rate = lang === 'bn' ? 0.82 : (lang === 'hi' ? 0.86 : 0.92);
                utter.pitch = 1;
                utter.volume = 1;
                const voice = roxPickVoice(lang);
                if(voice) utter.voice = voice;
                window.speechSynthesis.speak(utter);
            };

            // Android/Chrome frequently exposes voices asynchronously.
            if((window.speechSynthesis.getVoices() || []).length === 0) {
                let done = false;
                const handler = () => {
                    if(done) return;
                    done = true;
                    window.speechSynthesis.removeEventListener('voiceschanged', handler);
                    setTimeout(speakNow, 80);
                };
                window.speechSynthesis.addEventListener('voiceschanged', handler);
                setTimeout(() => {
                    if(!done) {
                        done = true;
                        window.speechSynthesis.removeEventListener('voiceschanged', handler);
                        speakNow();
                    }
                }, 700);
            } else {
                speakNow();
            }
        }

        if('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = function() {};
        }



        if (typeof window !== "undefined") {
            window.roxUiText = roxUiText;
            window.openRoxProduct = openRoxProduct;
            window.closeRoxProduct = closeRoxProduct;
            window.openRoxChatFromModal = openRoxChatFromModal;
            window.setRoxLanguage = setRoxLanguage;
            window.roxStopSpeaking = roxStopSpeaking;
            window.roxSpeak = roxSpeak;
            window.roxBuildSpeech = roxBuildSpeech;
            window.roxGetProduct = roxGetProduct;
            window.roxLang = roxLang;
        }
