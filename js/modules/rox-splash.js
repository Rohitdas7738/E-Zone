(function(){
    /* ================================================================
       ROX AI ADVANCED CONVERSATIONAL ENGINE (POWERED BY GROQ LLM)
       ================================================================ */

    const splash = document.getElementById('rox-splash');
    const status = document.getElementById('rox-start-status');

    let currentChatLanguage = localStorage.getItem('ezone_roxx_lang') || (typeof currentLang !== 'undefined' ? currentLang : 'bn');
    if (!['bn', 'en', 'hi'].includes(currentChatLanguage)) currentChatLanguage = 'bn';

    const welcome = {
      bn: "নমস্কার! E-ZONE ELECTRIC-এ আপনাকে স্বাগতম। আমি Rox Ai — আপনার স্মার্ট ইলেকট্রিক সহকারী। যেকোনো পণ্য, তারের সাইজ বা ওয়েবসাইট সম্পর্কে আমাকে জিজ্ঞাসা করুন।",
      hi: "नमस्ते! E-ZONE ELECTRIC में आपका स्वागत है। मैं Rox Ai हूँ — आपका स्मार्ट इलेक्ट्रिक असिस्टेंट। किसी भी प्रोडक्ट, वायरिंग सलाह या वेबसाइट के बारे में मुझसे पूछें।",
      en: "Hello! Welcome to E-ZONE ELECTRIC. I am Rox Ai — your intelligent electrical shopping assistant. Feel free to ask me anything about our products, house wiring, or website."
    };

    const suggestionChipsByLang = {
      bn: [
        { label: "💡 LED লাইট", query: "LED Lights" },
        { label: "⚡ তারের সাইজ", query: "House Wiring Sizing" },
        { label: "🌀 BLDC ফ্যান", query: "BLDC Fan Savings" },
        { label: "🔌 MCB ও সুরক্ষা", query: "MCB Safety ratings" },
        { label: "📦 অর্ডার করার নিয়ম", query: "How to order?" },
        { label: "💳 UPI QR পেমেন্ট", query: "UPI QR Payment" },
        { label: "🕒 দোকানের সময়", query: "Shop Timing" },
        { label: "❄️ AC ওয়্যারিং পরামর্শ", query: "Wire size for AC" }
      ],
      hi: [
        { label: "💡 LED लाइट्स", query: "LED Lights" },
        { label: "⚡ वायर साइज सलाह", query: "House Wiring" },
        { label: "🌀 BLDC पंखे", query: "BLDC Fan benefits" },
        { label: "🔌 MCB सुरक्षा", query: "MCB Breaker ratings" },
        { label: "📦 ऑर्डर कैसे करें", query: "How to order?" },
        { label: "💳 UPI QR पेमेंट", query: "UPI QR Payment" },
        { label: "🕒 दुकान का समय", query: "Shop Timing" },
        { label: "❄️ AC वायरिंग गाइड", query: "Wire size for AC" }
      ],
      en: [
        { label: "💡 LED Lights", query: "LED Lights" },
        { label: "⚡ House Wiring", query: "House Wiring Sizing" },
        { label: "🌀 BLDC Fans", query: "BLDC Fan Savings" },
        { label: "🔌 MCB Safety", query: "MCB Breaker Guide" },
        { label: "📦 How to Order", query: "How to order?" },
        { label: "💳 UPI QR Payment", query: "UPI QR Payment" },
        { label: "🕒 Shop Hours", query: "Shop Timing" },
        { label: "❄️ AC Wiring Advice", query: "Wire size for AC" }
      ]
    };

    function normalizeLang(){
      return currentChatLanguage || (typeof currentLang !== 'undefined' ? currentLang : 'bn');
    }

    let startupSpeechPending = false;
    let startupSpeechPlayed = false;
    let currentSplashAudio = null;
    let roxxSoundEnabled = true;
    let roxChatHistory = [];

    function getBengaliVoice() {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices() || [];
      return voices.find(v => {
        const l = (v.lang || '').toLowerCase();
        const n = (v.name || '').toLowerCase();
        return l.includes('bn') || l.includes('bangla') || l.includes('bengali') || n.includes('bengali') || n.includes('bangla');
      }) || null;
    }

    function speakRox(text, lang){
      if (!roxxSoundEnabled) return false;
      if (currentSplashAudio) {
        try { currentSplashAudio.pause(); } catch(e) {}
        currentSplashAudio = null;
      }
      const cleanText = text.replace(/<[^>]+>/g, '').replace(/\[\[PRODUCT:[^\]]+\]\]/g, '').trim();
      if (!cleanText) return false;

      const targetLang = lang || normalizeLang();

      if (targetLang === 'bn') {
        const bnVoice = getBengaliVoice();
        if (bnVoice && ('speechSynthesis' in window)) {
          try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(cleanText.substring(0, 250));
            u.voice = bnVoice;
            u.lang = 'bn-IN';
            u.rate = 0.88;
            u.pitch = 1.0;
            u.onstart = () => { startupSpeechPending = false; startupSpeechPlayed = true; };
            window.speechSynthesis.speak(u);
            return true;
          } catch(e) {}
        }

        // Fallback to Google Translate TTS Audio or standard SpeechSynthesis
        const shortText = cleanText.substring(0, 180);
        const url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=' + encodeURIComponent(shortText);
        const a = new Audio(url);
        currentSplashAudio = a;
        const playPromise = a.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            startupSpeechPending = false;
            startupSpeechPlayed = true;
          }).catch(() => {
            startupSpeechPending = false;
            if ('speechSynthesis' in window) {
              try {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(cleanText.substring(0, 200));
                u.lang = 'bn-IN';
                u.rate = 0.85;
                window.speechSynthesis.speak(u);
              } catch(err) {}
            }
          });
        }
        return true;
      } else {
        if(!('speechSynthesis' in window)) return false;
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(cleanText.substring(0, 220));
          u.lang = targetLang === 'hi' ? 'hi-IN' : 'en-IN';
          u.rate = targetLang === 'hi' ? 0.90 : 0.94;
          u.onstart = () => { startupSpeechPending = false; startupSpeechPlayed = true; };
          u.onerror = () => { startupSpeechPending = true; };
          window.speechSynthesis.speak(u);
          return true;
        } catch(e) { startupSpeechPending = true; return false; }
      }
    }

    function retryStartupSpeechOnUserGesture(){
      if(!startupSpeechPending || startupSpeechPlayed) return;
      startupSpeechPending = false;
      window.roxStartupWelcome('bn');
      ['pointerdown','touchstart','keydown'].forEach(ev => document.removeEventListener(ev, retryStartupSpeechOnUserGesture, true));
    }
    ['pointerdown','touchstart','keydown'].forEach(ev => document.addEventListener(ev, retryStartupSpeechOnUserGesture, true));

    window.roxStartupWelcome = function(forceLanguage){
      const lang = forceLanguage || normalizeLang();
      if(status) status.textContent = lang === 'bn' ? 'ROX AI ACTIVE • স্বাগতম' : (lang === 'hi' ? 'ROX AI ACTIVE • स्वागत है' : 'ROX AI ACTIVE • WELCOME');
      const text = welcome[lang];
      speakRox(text, lang);
    };

    function finishSplash(){
      if(!splash) {
        document.body.classList.add('home-loaded');
        return;
      }
      splash.classList.add('rox-splash-hide');
      document.body.classList.add('home-loaded');

      // Seamlessly fade in the cart button and floating actions on the home page
      const cartEl = document.getElementById('cart-icon-container');
      if (cartEl) {
        cartEl.style.opacity = '1';
        cartEl.style.visibility = 'visible';
        cartEl.style.pointerEvents = 'auto';
      }
      const adminBtn = document.getElementById('admin-floating-lock-btn');
      if (adminBtn) {
        adminBtn.style.opacity = '1';
        adminBtn.style.visibility = 'visible';
        adminBtn.style.pointerEvents = 'auto';
      }
      const widget = document.getElementById('roxx-ai-widget');
      if (widget) {
        widget.style.opacity = '1';
        widget.style.visibility = 'visible';
        widget.style.pointerEvents = 'auto';
      }

      setTimeout(function(){ if(splash && splash.parentNode) splash.remove(); }, 750);
      setTimeout(function(){ window.roxStartupWelcome(normalizeLang()); }, 280);
    }

    // Safety fallback: if no splash element exists, immediately mark home page as loaded
    if (!splash) {
      document.body.classList.add('home-loaded');
    } else {
      setTimeout(finishSplash, 1200);
    }

    /* ================= ROX AI CHATBOX & GROQ LLM INTEGRATION ================= */

    function getInitialGreeting(lang) {
      const l = lang || normalizeLang();
      return l === 'bn' 
        ? 'নমস্কার! আমি <strong>Rox Ai</strong> — E-ZONE ইলেকট্রিক শপের বুদ্ধিমান সহকারী।<br>পণ্য, তারের সাইজ পরামর্শ, দাম, অর্ডার বা ওয়েবসাইট সম্পর্কিত যেকোনো প্রশ্ন আপনি আমাকে করতে পারেন!'
        : (l === 'hi' 
          ? 'नमस्ते! मैं <strong>Rox Ai</strong> हूँ — E-ZONE इलेक्ट्रिक शॉप का स्मार्ट असिस्टेंट।<br>प्रोडक्ट, वायरिंग सलाह, कीमत, ऑर्डर या वेबसाइट से जुड़े किसी भी सवाल के लिए मुझसे पूछें!'
          : 'Hello! I am <strong>Rox Ai</strong> — your intelligent E-ZONE Electric Assistant.<br>Feel free to ask me anything about our products, electrical wiring advice, pricing, WhatsApp ordering, or how to use the website!');
    }

    function initRoxxChatMessages() {
      const container = document.getElementById('roxx-chat-msg-container');
      if (!container) return;
      if (container.children.length === 0) {
        const greetDiv = document.createElement('div');
        greetDiv.className = 'roxx-msg roxx-msg-ai';
        greetDiv.innerHTML = getInitialGreeting();
        container.appendChild(greetDiv);
      }
      updateLanguageUI();
    }

    /* Language Switcher Functions */
    window.setRoxxLanguage = function(lang, event) {
      if (event) event.stopPropagation();
      if (!['bn', 'en', 'hi'].includes(lang)) return;
      currentChatLanguage = lang;
      try { localStorage.setItem('ezone_roxx_lang', lang); } catch(e) {}
      updateLanguageUI();

      const langNames = { bn: 'বাংলা (Bengali)', en: 'English', hi: 'हिन्दी (Hindi)' };
      const noticeMsg = lang === 'bn' 
        ? `🌐 ভাষা পরিবর্তন করা হয়েছে: <strong>${langNames[lang]}</strong>` 
        : (lang === 'hi' ? `🌐 भाषा बदलकर <strong>${langNames[lang]}</strong> कर दी गई है` : `🌐 Language switched to <strong>${langNames[lang]}</strong>`);
      addRoxxMessage(noticeMsg, false, true);
      speakRox(lang === 'bn' ? 'ভাষা বাংলা করা হয়েছে' : (lang === 'hi' ? 'भाषा हिंदी कर दी गई है' : 'Language set to English'), lang);
    };

    window.cycleRoxxLanguage = function(event) {
      if (event) event.stopPropagation();
      const nextLang = currentChatLanguage === 'bn' ? 'en' : (currentChatLanguage === 'en' ? 'hi' : 'bn');
      window.setRoxxLanguage(nextLang, event);
    };

    function updateLanguageUI() {
      const l = normalizeLang();

      // Update Header Pill
      const pill = document.getElementById('roxx-current-lang-pill');
      if (pill) pill.textContent = l.toUpperCase();

      // Update Lang Chips
      ['bn', 'en', 'hi'].forEach(code => {
        const chip = document.getElementById(`roxx-chip-${code}`);
        if (chip) {
          if (code === l) {
            chip.classList.add('active');
          } else {
            chip.classList.remove('active');
          }
        }
      });

      // Update Input Placeholder
      const input = document.getElementById('roxx-chat-input-field');
      if (input) {
        input.placeholder = l === 'bn' ? 'Rox Ai-কে যেকোনো প্রশ্ন করুন...' : (l === 'hi' ? 'Rox Ai से कोई भी सवाल पूछें...' : 'Ask Rox Ai anything about products & wiring...');
      }

      // Update Suggestion Chips
      const suggestionsContainer = document.getElementById('roxx-chat-suggestions');
      if (suggestionsContainer && suggestionChipsByLang[l]) {
        suggestionsContainer.innerHTML = suggestionChipsByLang[l].map(c => 
          `<button type="button" class="roxx-chip" onclick="handleRoxxChipClick(this)" data-query="${c.query}">${c.label}</button>`
        ).join('');
      }
    }

    window.toggleRoxxChat = function(shouldOpen) {
      const widget = document.getElementById('roxx-ai-widget');
      if (!widget) return;

      const isCurrentlyExpanded = widget.classList.contains('roxx-expanded-mode');
      const open = typeof shouldOpen === 'boolean' ? shouldOpen : !isCurrentlyExpanded;

      if (open) {
        initRoxxChatMessages();
        widget.classList.remove('roxx-pill-mode');
        widget.classList.add('roxx-expanded-mode');
        
        const input = document.getElementById('roxx-chat-input-field');
        if (input) {
          setTimeout(() => input.focus(), 250);
        }

        const container = document.getElementById('roxx-chat-msg-container');
        if (container) {
          setTimeout(() => { container.scrollTop = container.scrollHeight; }, 100);
        }
      } else {
        widget.classList.remove('roxx-expanded-mode');
        widget.classList.add('roxx-pill-mode');
      }
    };

    window.openRoxCustomerChat = function() {
      window.toggleRoxxChat(true);
    };

    window.toggleRoxxSound = function(event) {
      if (event) event.stopPropagation();
      roxxSoundEnabled = !roxxSoundEnabled;
      const btn = document.getElementById('roxx-sound-toggle-btn');
      const icon = document.getElementById('roxx-sound-icon');
      if (btn && icon) {
        if (roxxSoundEnabled) {
          btn.classList.add('active-sound');
          icon.className = 'fas fa-volume-up';
          btn.title = 'Sound Enabled';
        } else {
          btn.classList.remove('active-sound');
          icon.className = 'fas fa-volume-mute';
          btn.title = 'Sound Muted';
          if (currentSplashAudio) { try { currentSplashAudio.pause(); } catch(e){} }
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }
      }
    };

    window.clearRoxxChat = function(event) {
      if (event) event.stopPropagation();
      roxChatHistory = [];
      const container = document.getElementById('roxx-chat-msg-container');
      if (container) {
        container.innerHTML = '';
        const greetDiv = document.createElement('div');
        greetDiv.className = 'roxx-msg roxx-msg-ai';
        greetDiv.innerHTML = getInitialGreeting();
        container.appendChild(greetDiv);
      }
    };

    function showTypingIndicator() {
      const container = document.getElementById('roxx-chat-msg-container');
      if (!container) return null;
      const ind = document.createElement('div');
      ind.className = 'roxx-typing-indicator';
      ind.id = 'roxx-active-typing-indicator';
      ind.innerHTML = '<span class="roxx-typing-dot"></span><span class="roxx-typing-dot"></span><span class="roxx-typing-dot"></span>';
      container.appendChild(ind);
      container.scrollTop = container.scrollHeight;
      return ind;
    }

    function removeTypingIndicator() {
      const ind = document.getElementById('roxx-active-typing-indicator');
      if (ind) ind.remove();
    }

    function addRoxxMessage(text, isUser = false, html = false) {
      removeTypingIndicator();
      const container = document.getElementById('roxx-chat-msg-container');
      if (!container) return;
      const div = document.createElement('div');
      div.className = 'roxx-msg ' + (isUser ? 'roxx-msg-user' : 'roxx-msg-ai');
      if (html) {
        div.innerHTML = text;
      } else {
        div.textContent = text;
      }
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    // Direct Add to Cart from Chat
    window.addRoxxProductToCartFromChat = function(productId, event) {
      if (event) event.stopPropagation();
      if (typeof window.addToCart === 'function') {
        window.addToCart(productId);
        const p = typeof products !== 'undefined' ? products.find(x => x.id === productId) : null;
        const pName = p ? p.name : 'Product';
        const lang = normalizeLang();
        const msg = lang === 'bn' 
          ? '✅ <strong>' + pName + '</strong> আপনার শপিং ব্যাগে যুক্ত হয়েছে!'
          : (lang === 'hi' ? '✅ <strong>' + pName + '</strong> आपके शॉपिंग बैग में जोड़ दिया गया है!' : '✅ <strong>' + pName + '</strong> has been added to your shopping bag!');
        addRoxxMessage(msg, false, true);
        speakRox(lang === 'bn' ? 'পণ্য কার্টে যোগ করা হয়েছে' : (lang === 'hi' ? 'प्रोडक्ट बैग में जोड़ दिया गया है' : 'Product added to bag'), lang);
      }
    };

    // Open Product specs / modal from chat
    window.openRoxProductFromChat = function(productId, event) {
      if (event) event.stopPropagation();
      if (typeof window.openRoxProduct === 'function') {
        window.openRoxProduct(productId);
      }
    };

    // Ask about a specific product directly in chat
    window.openRoxChatWithProduct = function(productId) {
      window.toggleRoxxChat(true);
      const p = typeof products !== 'undefined' ? products.find(x => x.id === productId) : null;
      if (!p) return;
      const query = p.name + ' - এর সুবিধা, দাম এবং বিবরণ বিস্তারিত বলুন';
      const input = document.getElementById('roxx-chat-input-field');
      if (input) input.value = query;
      processRoxxQuery(query);
    };

    // Voice Input Recognition
    let roxxSpeechRec = null;
    let roxxIsListening = false;

    window.startRoxVoiceInput = function(event) {
      if (event) event.stopPropagation();
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const micBtn = document.getElementById('roxx-chat-mic-btn');

      if (!SpeechRec) {
        alert('Voice recognition is not supported in this browser. Please type your message.');
        return;
      }

      if (roxxIsListening && roxxSpeechRec) {
        try { roxxSpeechRec.stop(); } catch(e) {}
        roxxIsListening = false;
        if (micBtn) micBtn.classList.remove('listening');
        return;
      }

      const lang = normalizeLang();
      roxxSpeechRec = new SpeechRec();
      roxxSpeechRec.lang = lang === 'bn' ? 'bn-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
      roxxSpeechRec.interimResults = false;
      roxxSpeechRec.maxAlternatives = 1;

      roxxSpeechRec.onstart = function() {
        roxxIsListening = true;
        if (micBtn) micBtn.classList.add('listening');
      };

      roxxSpeechRec.onresult = function(e) {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById('roxx-chat-input-field');
        if (input) input.value = transcript;
        processRoxxQuery(transcript);
      };

      roxxSpeechRec.onerror = function() {
        roxxIsListening = false;
        if (micBtn) micBtn.classList.remove('listening');
      };

      roxxSpeechRec.onend = function() {
        roxxIsListening = false;
        if (micBtn) micBtn.classList.remove('listening');
      };

      try {
        roxxSpeechRec.start();
      } catch (err) {
        roxxIsListening = false;
        if (micBtn) micBtn.classList.remove('listening');
      }
    };

    window.handleRoxxChipClick = function(buttonEl) {
      const query = buttonEl.getAttribute('data-query') || buttonEl.textContent.trim();
      const input = document.getElementById('roxx-chat-input-field');
      if (input) input.value = query;
      processRoxxQuery(query);
    };

    window.handleRoxxSubmit = function(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('roxx-chat-input-field');
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      processRoxxQuery(text);
    };

    /* Build Dynamic Catalog Summary for Groq LLM Context */
    function buildRoxCatalogSummary() {
      if (typeof products === 'undefined' || !Array.isArray(products) || products.length === 0) {
        return "No products currently loaded in catalog.";
      }
      return products.slice(0, 45).map(p => {
        const disc = p.discountPercent || 20;
        const spec = p.spec || p.details || '';
        return `- [ID:${p.id}] ${p.name} | Brand: ${p.brand || 'E-ZONE'} | Cat: ${p.category || 'General'} | Price: ₹${p.price} (Discount: ${disc}%) ${spec ? '| Specs: ' + spec.substring(0, 50) : ''}`;
      }).join('\n');
    }

    /* Render Product Card HTML from Product ID */
    function renderRoxProductCardHtml(productId) {
      const p = typeof products !== 'undefined' ? products.find(x => x.id === productId) : null;
      if (!p) return '';
      const mrp = (p.price * 1.25).toFixed(0);
      const discount = p.discountPercent || 20;
      const imgUrl = p.image || 'images/logo.webp';

      return `
        <div class="roxx-product-card-preview" style="margin-top:6px;margin-bottom:6px;">
          <div class="roxx-product-card-img">
            <img src="${imgUrl}" alt="${p.name}" onerror="this.onerror=null; this.src='images/logo.png';">
          </div>
          <div class="roxx-product-card-details">
            <div class="roxx-product-card-brand">${p.brand || 'E-ZONE'} • ${p.category || 'Electric'}</div>
            <div class="roxx-product-card-name" title="${p.name}">${p.name}</div>
            <div class="roxx-product-card-price">
              ₹${p.price} <span style="font-size:10px;text-decoration:line-through;color:#94a3b8;font-weight:normal;">₹${mrp}</span>
              <span style="font-size:9px;background:#fee2e2;color:#ef4444;padding:1px 4px;border-radius:4px;font-weight:bold;margin-left:4px;">${discount}% OFF</span>
            </div>
          </div>
          <div class="roxx-product-card-btns">
            <button type="button" class="roxx-product-card-add-btn" onclick="addRoxxProductToCartFromChat('${p.id}', event)" title="Add to Cart">
              <i class="fas fa-cart-plus"></i> Bag
            </button>
            <button type="button" class="roxx-product-card-action" onclick="openRoxProductFromChat('${p.id}', event)" title="View Specs">
              <i class="fas fa-eye"></i> Specs
            </button>
            <button type="button" class="roxx-product-card-action" style="background:#0284c7;color:#fff;" onclick="if(window.shareProduct) window.shareProduct('${p.id}', event)" title="Share Product">
              <i class="fas fa-share-alt"></i> Share
            </button>
          </div>
        </div>
      `;
    }

    /* Markdown to Rich HTML Formatter */
    function formatMarkdownToHtml(md) {
      if (!md) return '';
      let html = md;

      // Convert code blocks and inline code
      html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#0f172a;color:#38bdf8;padding:8px;border-radius:8px;font-size:11px;overflow-x:auto;"><code>$1</code></pre>');
      html = html.replace(/`([^`]+)`/g, '<code style="background:#e2e8f0;color:#0f766e;padding:1px 4px;border-radius:4px;font-size:11px;">$1</code>');

      // Convert headers
      html = html.replace(/^### (.*$)/gim, '<h4 style="font-weight:800;color:#0f766e;margin-top:8px;margin-bottom:4px;font-size:13px;">$1</h4>');
      html = html.replace(/^## (.*$)/gim, '<h3 style="font-weight:800;color:#042f2e;margin-top:10px;margin-bottom:5px;font-size:13.5px;">$1</h3>');
      html = html.replace(/^# (.*$)/gim, '<h2 style="font-weight:900;color:#042f2e;margin-top:12px;margin-bottom:6px;font-size:14px;">$1</h2>');

      // Convert bold and italic
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Convert Markdown Tables into clean styled HTML tables
      const tableRegex = /\|(.+)\|\r?\n\|[-:\| ]+\|\r?\n((?:\|.*\|\r?\n?)*)/g;
      html = html.replace(tableRegex, function(match, headerLine, bodyLines) {
        const headers = headerLine.split('|').map(h => h.trim()).filter(h => h.length > 0);
        const rows = bodyLines.trim().split('\n').map(r => r.split('|').map(c => c.trim()).filter(c => c.length > 0));
        
        let tHtml = '<div style="overflow-x:auto;margin:8px 0;"><table style="width:100%;border-collapse:collapse;font-size:11px;background:#ffffff;border:1px solid #ccfbf1;border-radius:8px;overflow:hidden;">';
        tHtml += '<thead style="background:#0f766e;color:#ffffff;"><tr>';
        headers.forEach(h => { tHtml += `<th style="padding:6px 8px;text-align:left;border-bottom:1px solid #0f766e;">${h}</th>`; });
        tHtml += '</tr></thead><tbody>';
        rows.forEach((row, i) => {
          tHtml += `<tr style="background:${i % 2 === 0 ? '#f0fdfa' : '#ffffff'};border-bottom:1px solid #e2e8f0;">`;
          row.forEach(cell => { tHtml += `<td style="padding:5px 8px;">${cell}</td>`; });
          tHtml += '</tr>';
        });
        tHtml += '</tbody></table></div>';
        return tHtml;
      });

      // Convert unordered lists
      html = html.replace(/^\s*[-•*]\s+(.*$)/gim, '<li style="margin-left:14px;list-style-type:disc;margin-bottom:3px;">$1</li>');
      html = html.replace(/(<li.*<\/li>)/s, '<ul style="margin:4px 0;padding-left:4px;">$1</ul>');

      // Replace product tags [[PRODUCT:id]] or [[PRODUCT:ID:id]] with rich product cards
      html = html.replace(/\[\[PRODUCT:(?:ID:)?([^\]]+)\]\]/gi, function(m, pId) {
        return renderRoxProductCardHtml(pId.trim());
      });

      // Convert newlines to breaks where appropriate
      html = html.replace(/\n\n+/g, '<div style="height:6px;"></div>');
      html = html.replace(/\n/g, '<br>');

      return html;
    }

    /* Core Query Processing Engine (Groq LLM + Fallback) */
    async function processRoxxQuery(queryText) {
      const currentL = normalizeLang();
      addRoxxMessage(queryText, true, false);
      showTypingIndicator();

      // Store in conversation history
      roxChatHistory.push({ role: 'user', content: queryText });
      if (roxChatHistory.length > 8) roxChatHistory.shift();

      const config = window.EZONE_CONFIG || {};
      const apiKey = localStorage.getItem('ezone_groq_api_key') || config.GROQ_API_KEY;
      const model = localStorage.getItem('ezone_groq_model') || config.GROQ_MODEL || 'openai/gpt-oss-120b';

      // If Groq API Key is available, invoke Groq LLM
      if (apiKey && apiKey.startsWith('gsk_')) {
        try {
          const catalogText = buildRoxCatalogSummary();
          const store = config.STORE_INFO || {};

          const langNames = { bn: 'Bengali (বাংলা)', en: 'English', hi: 'Hindi (हिन्दी)' };
          const forcedLanguage = langNames[currentL] || 'Bengali (বাংলা)';

          const systemPrompt = `You are Rox AI, the ultra-smart, professional, friendly electrical engineering & sales assistant for "E-ZONE ELECTRIC" shop.
Store Details:
- Name: ${store.name || 'E-ZONE ELECTRIC'} (${store.address || 'Kataganj, Kalyani, Nadia, PIN 741250'})
- Working Hours: ${store.hours || '9:00 AM - 9:30 PM everyday'}
- Phone / WhatsApp: ${store.phone1 || '8276969741'} / ${store.phone2 || '9330507738'}
- Payment: Dynamic UPI QR Code scanner (PhonePe, GPay, Paytm) & WhatsApp ordering.
- Trusted Brands: ${store.brands || 'Finolex, Philips, Havells, Polycab, Pritam, Anchor, Crompton, Atomberg'}

Live Product Inventory:
${catalogText}

Electrical Engineering Knowledge Rules:
1. Wire sizing guide:
   - 1.0 sq mm: Lighting & ceiling fan circuits (up to 6A).
   - 1.5 sq mm: Standard 6A sockets, TV, general household loads.
   - 2.5 sq mm: 16A power points, microwave, refrigerator, water geyser.
   - 4.0 sq mm: 1.5 Ton / 2 Ton Split AC, heavy kitchen appliances (up to 20-25A).
   - 6.0 sq mm / 10 sq mm: Main intake supply line from energy meter to DB box.
2. BLDC Fans consume only 28W compared to regular 75W fans (saves ~65% power, runs 3x longer on inverters).
3. MCB ratings: 6A/10A for lights, 16A/20A for geyser/power sockets, 25A/32A for AC, Double Pole (DP) 40A/63A for mains isolator.

Language Instruction:
- The customer selected current language: **${forcedLanguage}**. You MUST reply in **${forcedLanguage}** unless the user explicitly requests otherwise.
- If the customer asks about products, recommend matching items from the inventory and insert their tag as [[PRODUCT:id]] so the UI renders interactive action cards.
- Format responses cleanly with bold text, bullet points, or markdown tables for readability.
- Be polite, knowledgeable, concise, and helpful.`;

          const messages = [
            { role: 'system', content: systemPrompt },
            ...roxChatHistory
          ];

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 9000);

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model,
              messages: messages,
              temperature: 0.6,
              max_tokens: 550
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const rawReply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
            
            if (rawReply) {
              roxChatHistory.push({ role: 'assistant', content: rawReply });
              if (roxChatHistory.length > 8) roxChatHistory.shift();

              let finalHtml = formatMarkdownToHtml(rawReply);

              // If the LLM didn't insert a product tag but mentioned a product, check and append relevant cards
              const lowerQuery = queryText.toLowerCase();
              if (!finalHtml.includes('roxx-product-card-preview') && typeof products !== 'undefined' && Array.isArray(products)) {
                const autoMatched = products.filter(p => {
                  const n = (p.name || '').toLowerCase();
                  const b = (p.brand || '').toLowerCase();
                  const words = lowerQuery.split(/\s+/).filter(w => w.length > 2);
                  return words.some(w => n.includes(w) || b.includes(w));
                }).slice(0, 2);

                if (autoMatched.length > 0) {
                  finalHtml += '<div style="margin-top:8px;">';
                  autoMatched.forEach(p => { finalHtml += renderRoxProductCardHtml(p.id); });
                  finalHtml += '</div>';
                }
              }

              addRoxxMessage(finalHtml, false, true);
              speakRox(rawReply, currentL);
              return;
            }
          }
        } catch (err) {
          console.warn("Groq AI online inference fallback:", err.message);
        }
      }

      // -------------------------------------------------------------
      // High-Performance Built-in Local Knowledge Engine (Fallback)
      // -------------------------------------------------------------
      setTimeout(() => {
        const lower = queryText.toLowerCase().trim();

        // 1. Greetings & Hello
        if (/^(hi|hello|hey|namaste|nomoshkar|নমস্কার|হ্যালো|नमस्ते|হাই)/i.test(lower)) {
          const res = currentL === 'bn' 
            ? 'নমস্কার! আমি <strong>Rox Ai</strong>। আমি আপনাকে কীভাবে সাহায্য করতে পারি? আপনি পণ্য দেখতে পারেন, দাম বা তারের সাইজ সম্পর্কে জিজ্ঞাসা করতে পারেন।'
            : (currentL === 'hi' 
              ? 'नमस्ते! मैं <strong>Rox Ai</strong> हूँ। मैं आपकी क्या मदद कर सकता हूँ? आप प्रोडक्ट्स देख सकते हैं, कीमतें या वायरिंग के बारे में पूछ सकते हैं।'
              : 'Hello! I am <strong>Rox Ai</strong>. How can I assist you today? Feel free to ask about products, pricing, electrical wiring advice, or orders.');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 2. Who are you / Identity
        if (lower.includes('who are you') || lower.includes('tumi ke') || lower.includes('aap kaun') || lower.includes('তুমি কে') || lower.includes('आप कौन')) {
          const res = currentL === 'bn'
            ? 'আমি <strong>Rox Ai</strong> — E-ZONE ইলেকট্রিক শপের অফিসিয়াল এআই সহকারী। পণ্যের দাম, অর্ডার, তারের সাইজ হিসাব ও ওয়েবসাইট ব্যবহারের সঠিক পরামর্শ দেওয়া আমার কাজ।'
            : (currentL === 'hi'
              ? 'मैं <strong>Rox Ai</strong> हूँ — E-ZONE इलेक्ट्रिक शॉप का आधिकारिक AI सहायक। प्रोडक्ट्स की कीमत, ऑर्डर, वायरिंग सलाह और वेबसाइट के उपयोग में आपकी सहायता करना मेरा काम है।'
              : 'I am <strong>Rox Ai</strong> — the official AI assistant of E-ZONE Electric Shop. I help customers find products, compute electrical sizing, navigate the website, and place orders.');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 3. How to Order / Website Ordering Process
        if (lower.includes('how to order') || lower.includes('order') || lower.includes('buy') || lower.includes('কিভাবে অর্ডার') || lower.includes('অর্ডার') || lower.includes('ऑर्डर')) {
          const res = currentL === 'bn'
            ? '🛍️ <strong>E-ZONE-এ সহজে অর্ডার করার উপায়:</strong><br>১. যেকোনো পণ্যের নিচে <strong>"Add to Bag"</strong> বোতামে চাপুন।<br>২. স্ক্রিনের নিচে বা উপরে <strong>Shopping Bag / Cart</strong> খুলুন।<br>৩. আপনার নাম, মোবাইল নম্বর ও ঠিকানা লিখুন।<br>৪. <strong>"Order on WhatsApp"</strong> চাপুন অথবা <strong>UPI QR কোড স্ক্যান</strong> করে সরাসরি পেমেন্ট করুন!'
            : (currentL === 'hi'
              ? '🛍️ <strong>E-ZONE पर ऑर्डर कैसे करें:</strong><br>1. किसी भी प्रोडक्ट के नीचे <strong>"Add to Bag"</strong> बटन दबाएं।<br>2. नीचे या ऊपर दिए गए <strong>Shopping Bag / Cart</strong> को खोलें।<br>3. अपना नाम, मोबाइल नंबर और पता दर्ज करें।<br>4. <strong>"Order on WhatsApp"</strong> दबाएं या <strong>UPI QR कोड</strong> से तुरंत भुगतान करें!'
              : '🛍️ <strong>How to Place an Order:</strong><br>1. Click <strong>"Add to Bag"</strong> under any product.<br>2. Open your <strong>Shopping Bag / Cart</strong>.<br>3. Enter your Name, Mobile Number, and Delivery Address.<br>4. Click <strong>"Order on WhatsApp"</strong> or scan the <strong>Instant UPI QR Code</strong> for payment!');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 4. UPI & QR Payment Guidance
        if (lower.includes('qr') || lower.includes('upi') || lower.includes('pay') || lower.includes('phonepe') || lower.includes('gpay') || lower.includes('পেমেন্ট') || lower.includes('पेमेंट')) {
          const res = currentL === 'bn'
            ? '💳 <strong>সহজ ও সুরক্ষিত UPI QR পেমেন্ট:</strong><br>E-ZONE-এ রয়েছে ডায়নামিক QR পেমেন্ট ইঞ্জিন। কার্টে অর্ডার কনফার্ম করলে স্বয়ংক্রিয়ভাবে মোট টাকার সঠিক QR কোড তৈরি হয়। আপনি <strong>PhonePe, Google Pay, Paytm বা BHIM</strong> দিয়ে স্ক্যান করে পেমেন্ট করতে পারেন।'
            : (currentL === 'hi'
              ? '💳 <strong>सुरक्षित UPI QR पेमेंट:</strong><br>E-ZONE में स्मार्ट डायनामिक QR इंजन है। कार्ट में ऑर्डर फाइनल करते ही कुल राशि का QR कोड बन जाता है। आप <strong>PhonePe, Google Pay, Paytm या BHIM</strong> से आसानी से स्कैन करके भुगतान कर सकते हैं।'
              : '💳 <strong>Dynamic UPI QR Payment:</strong><br>E-ZONE features an instant UPI QR engine. When checking out, a customized QR code matching your exact cart total is generated. You can pay seamlessly using <strong>PhonePe, Google Pay, Paytm, or BHIM UPI</strong>.');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 5. Shop Timing, Location & Contact
        if (lower.includes('timing') || lower.includes('time') || lower.includes('open') || lower.includes('hours') || lower.includes('address') || lower.includes('location') || lower.includes('phone') || lower.includes('contact') || lower.includes('ঠিকানা') || lower.includes('সময়') || lower.includes('দোকান') || lower.includes('দোকানের সময়') || lower.includes('दुकान') || lower.includes('समय') || lower.includes('पता')) {
          const res = currentL === 'bn'
            ? '📍 <strong>E-ZONE ELECTRIC শপ বিবরণ:</strong><br>🕒 <strong>খোলা থাকার সময়:</strong><br>• সোম - শনি: সকাল ৯:০০ টা – রাত ১০:০০ টা<br>• রবিবার: সকাল ১০:০০ টা – দুপুর ২:০০ টা এবং বিকেল ৪:০০ টা – রাত ১০:০০ টা<br>📞 <strong>ফোন:</strong> 8276969741 / 9330507738<br>🏢 <strong>ঠিকানা:</strong> কাটাহাট, বেদীভবন, কল্যাণী, নদীয়া, পিন - ৭৪১২৫০<br>⚡ জেনুইন ব্র্যান্ডের সব ধরণের ইলেকট্রিক্যাল সামগ্রী পাইকারি ও খুচরো মূল্যে পাওয়া যায়।'
            : (currentL === 'hi'
              ? '📍 <strong>E-ZONE ELECTRIC शॉप विवरण:</strong><br>🕒 <strong>समय:</strong><br>• सोम - शनि: सुबह 9:00 बजे – रात 10:00 बजे<br>• रविवार: सुबह 10:00 बजे – दोपहर 2:00 बजे और शाम 4:00 बजे – रात 10:00 बजे<br>📞 <strong>फोन:</strong> 8276969741 / 9330507738<br>🏢 <strong>पता:</strong> कतागंज, बेदीभवन, कल्याणी, नदिया, पिन - 741250<br>⚡ सभी ओरिजिनल ब्रांडेड इलेक्ट्रिकल सामान थोक व खुदरा दामों पर उपलब्ध हैं।'
              : '📍 <strong>E-ZONE ELECTRIC Store Info:</strong><br>🕒 <strong>Operational Hours:</strong><br>• Mon - Sat: 09:00 AM – 10:00 PM<br>• Sunday: 10:00 AM – 02:00 PM &amp; 04:00 PM – 10:00 PM<br>📞 <strong>Phone:</strong> 8276969741 / 9330507738<br>🏢 <strong>Location:</strong> Kataganj, Bedibhawan, Kalyani, Nadia, PIN - 741250<br>⚡ Genuine wholesale and retail electrical solutions.');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 6. House Wiring & Sizing Calculations
        if (lower.includes('wire size') || lower.includes('ac wire') || lower.includes('wiring') || lower.includes('sq mm') || lower.includes('তারের সাইজ') || lower.includes('তার') || lower.includes('तार')) {
          const res = currentL === 'bn'
            ? '⚡ <strong>বাড়ি ও দোকানের সঠিক তারের সাইজ নির্বাচন:</strong><br>• <strong>1.0 sq mm:</strong> লাইট ও ফ্যান পয়েন্টের জন্য।<br>• <strong>1.5 sq mm:</strong> সাধারণ 6A প্লাগ পয়েন্ট ও টিভির জন্য।<br>• <strong>2.5 sq mm:</strong> 16A পাওয়ার পয়েন্ট, গিজার ও মাইক্রোওয়েভের জন্য।<br>• <strong>4.0 sq mm:</strong> 1.5 টন / 2 টন ইনভার্টার AC ও হাই লোডের জন্য।<br>• <strong>6.0 sq mm:</strong> মেইন মিটার থেকে ডিস্ট্রিবিউশন বক্সের জন্য।<br>🔥 আমরা <strong>Finolex ও Polycab</strong> ফ্লেম রিটার্ডেন্ট (FR) কপার তার ব্যবহারের পরামর্শ দিই।'
            : (currentL === 'hi'
              ? '⚡ <strong>हाउस वायरिंग के लिए सही वायर साइज:</strong><br>• <strong>1.0 sq mm:</strong> लाइट और पंखों के लिए।<br>• <strong>1.5 sq mm:</strong> सामान्य 6A सॉकेट और टीवी के लिए।<br>• <strong>2.5 sq mm:</strong> 16A पावर प्लग, गीज़र और ओवन के लिए।<br>• <strong>4.0 sq mm:</strong> 1.5 टन / 2 टन AC और भारी लोड के लिए।<br>• <strong>6.0 sq mm:</strong> मेन मीटर से DB बॉक्स की सप्लाई के लिए।'
              : '⚡ <strong>House Wiring Sizing Recommendations:</strong><br>• <strong>1.0 sq mm:</strong> Lighting & Ceiling Fan points.<br>• <strong>1.5 sq mm:</strong> 6A Standard Socket outlets & TV.<br>• <strong>2.5 sq mm:</strong> 16A Heavy Power points, Geysers & Ovens.<br>• <strong>4.0 sq mm:</strong> 1.5 Ton / 2 Ton Inverter AC & High loads.<br>• <strong>6.0 sq mm:</strong> Main incoming line to DB box.<br>🔥 We recommend Flame Retardant (FR) Pure Copper <strong>Finolex & Polycab</strong> wires.');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 7. BLDC Fan Advice
        if (lower.includes('bldc') || lower.includes('fan') || lower.includes('energy saving') || lower.includes('power saving') || lower.includes('ফ্যান') || lower.includes('पंखा')) {
          const res = currentL === 'bn'
            ? '🌀 <strong>BLDC ফ্যানের বিশেষত্ব:</strong><br>BLDC (Brushless DC) ফ্যান সাধারণ ফ্যানের (75W) তুলনায় মাত্র <strong>28W বিদ্যুৎ</strong> খরচ করে, যা আপনার <strong>৬৫% পর্যন্ত বিদ্যুৎ বিল সাশ্রয়</strong> করে! এছাড়া এর সাথে থাকে স্মার্ট রিমোট কন্ট্রোল, টাইমার ও স্লিপ মোড।'
            : (currentL === 'hi'
              ? '🌀 <strong>BLDC पंखों की खासियत:</strong><br>BLDC पंखे साधारण 75W पंखों के मुकाबले केवल <strong>28W बिजली</strong> लेते हैं, जिससे <strong>65% तक बिजली बिल की बचत</strong> होती है! साथ ही इसमें रिमोट कंट्रोल और टाइमर की सुविधा मिलती है।'
              : '🌀 <strong>Why Choose BLDC Fans?</strong><br>BLDC (Brushless DC) fans consume only <strong>28 Watts</strong> compared to standard 75W fans, saving up to <strong>65% on electricity bills</strong>! They also come with smart remote control, timer modes, and silent operation.');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 8. MCB & Electrical Safety
        if (lower.includes('mcb') || lower.includes('breaker') || lower.includes('safety') || lower.includes('ফিউজ') || lower.includes('ब्रेकर')) {
          const res = currentL === 'bn'
            ? '🔌 <strong>MCB (Miniature Circuit Breaker) নির্দেশিকা:</strong><br>• <strong>6A / 10A:</strong> লাইটিং সার্কিটের জন্য।<br>• <strong>16A / 20A:</strong> সাধারণ পাওয়ার প্লাগ ও গিজারের জন্য।<br>• <strong>25A / 32A:</strong> AC ও হাই লোড অ্যাপ্লায়েন্সের জন্য।<br>• <strong>Double Pole (DP):</strong> মেইন সাপ্লাই সম্পূর্ণ আইসোলেট করার জন্য।<br>শর্ট সার্কিট ও ওভারলোড থেকে ঘর ও দোকান সুরক্ষিত রাখতে সঠিক রেটিংয়ের MCB ব্যবহার অত্যন্ত জরুরি।'
            : (currentL === 'hi'
              ? '🔌 <strong>MCB (Miniature Circuit Breaker) गाइड:</strong><br>• <strong>6A / 10A:</strong> लाइटिंग सर्किट के लिए।<br>• <strong>16A / 20A:</strong> नॉर्मल पावर प्लग और गीज़र के लिए।<br>• <strong>25A / 32A:</strong> AC और हाई लोड अप्लायंसेज के लिए।<br>• <strong>Double Pole (DP):</strong> मेन सप्लाई आइसोलेशन के लिए।'
              : '🔌 <strong>MCB Safety Rating Guide:</strong><br>• <strong>6A / 10A:</strong> Lighting & Fan circuits.<br>• <strong>16A / 20A:</strong> 16A Power sockets, Refrigerators, Geysers.<br>• <strong>25A / 32A:</strong> Air Conditioners & Sub-mains.<br>• <strong>Double Pole (DP):</strong> Total main power isolation.<br>Properly rated MCBs safeguard your wiring against overcurrent and short circuits.');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 9. Brand queries
        if (lower.includes('brand') || lower.includes('philips') || lower.includes('finolex') || lower.includes('havells') || lower.includes('polycab') || lower.includes('pritam') || lower.includes('atomberg') || lower.includes('crompton') || lower.includes('ব্র্যান্ড') || lower.includes('ब्रांड')) {
          const res = currentL === 'bn'
            ? '🏢 <strong>E-ZONE-এর বিশ্বস্ত ব্র্যান্ডসমূহ:</strong><br>আমরা শুধুমাত্র শীর্ষস্থানীয় ও সার্টিফাইড ব্র্যান্ডের পণ্য সরবরাহ করি — <strong>Finolex, Philips, Havells, Polycab, Pritam, Anchor, Crompton, Atomberg</strong> ইত্যাদি। আপনি উপরে Brand Filter থেকে নির্দিষ্ট ব্র্যান্ড নির্বাচন করতে পারেন!'
            : (currentL === 'hi'
              ? '🏢 <strong>E-ZONE के भरोसेमंद ब्रांड्स:</strong><br>हम केवल टॉप और सर्टिफाइड ब्रांड्स के प्रोडक्ट रखते हैं — <strong>Finolex, Philips, Havells, Polycab, Pritam, Anchor, Crompton, Atomberg</strong> आदि। आप ऊपर दिए गए Brand Filter से अपनी पसंद का ब्रांड चुन सकते हैं।'
              : '🏢 <strong>Trusted Brands at E-ZONE:</strong><br>We stock original genuine products from top certified brands including <strong>Finolex, Philips, Havells, Polycab, Pritam, Anchor, Crompton, Atomberg</strong> and more. You can also filter by manufacturer in the top brand bar!');
          addRoxxMessage(res, false, true);
          speakRox(res, currentL);
          return;
        }

        // 10. Search Catalog for Relevant Products & Render Rich Action Cards
        if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
          const matched = products.filter(p => {
            const name = (p.name || '').toLowerCase();
            const brand = (p.brand || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            const spec = (p.spec || '').toLowerCase();
            const details = (p.details || '').toLowerCase();
            const words = lower.split(/\s+/).filter(w => w.length > 2);
            
            return name.includes(lower) || brand.includes(lower) || cat.includes(lower) ||
              words.some(w => name.includes(w) || brand.includes(w) || cat.includes(w) || spec.includes(w) || details.includes(w));
          }).slice(0, 4);

          if (matched.length > 0) {
            let resHtml = '<div style="font-weight:700;margin-bottom:6px;">' + (
              currentL === 'bn' ? ('🔍 আপনার জন্য ' + matched.length + 'টি সম্পর্কিত পণ্য পাওয়া গেছে:') :
              (currentL === 'hi' ? ('🔍 आपके लिए ' + matched.length + ' संबंधित प्रोडक्ट्स मिले:') :
              ('🔍 Found ' + matched.length + ' matching products for you:'))
            ) + '</div>';

            resHtml += '<div style="display:flex;flex-direction:column;gap:8px;">';
            matched.forEach(p => {
              resHtml += renderRoxProductCardHtml(p.id);
            });
            resHtml += '</div>';
            addRoxxMessage(resHtml, false, true);

            const speakText = currentL === 'bn' 
              ? ('আমি ' + matched.length + 'টি পণ্য পেয়েছি। আপনি সরাসরি কার্টে যোগ করতে পারেন বা স্পেসিফিকেশন দেখতে পারেন।')
              : (currentL === 'hi' ? ('मुझे ' + matched.length + ' प्रोडक्ट्स मिले हैं। आप सीधे कार्ट में जोड़ सकते हैं।') : ('Found ' + matched.length + ' matching products. You can add them to your cart directly.'));
            speakRox(speakText, currentL);
            return;
          }
        }

        // 11. Intelligent Conversational Fallback
        const fallback = currentL === 'bn' 
          ? 'আমি E-ZONE Electric-এর ক্যাটালগ ও ওয়্যারিং ডাটাবেসে এটি অনুসন্ধান করেছি। আপনি যেকোনো নির্দিষ্ট ক্যাটাগরি (যেমন <em>Wires, Lights, Fans, Switches, MCB</em>) দেখতে পারেন, অথবা কোনো পণ্যের কার্ডের নিচে <strong>Ask AI</strong> চাপুন।'
          : (currentL === 'hi'
            ? 'मैंने E-ZONE Electric कैटलॉग में खोज की है। आप किसी भी श्रेणी (जैसे <em>Wires, Lights, Fans, Switches, MCB</em>) को सर्च कर सकते हैं या किसी प्रोडक्ट के नीचे <strong>Ask AI</strong> दबा सकते हैं।'
            : 'I searched the E-ZONE Electric store catalog and wiring database. You can search by specific categories like <em>Wires, Lights, Fans, Switches, MCBs</em>, or click "Ask AI" under any product card for instant specifications.');
        addRoxxMessage(fallback, false, true);
        speakRox(fallback, currentL);
      }, 350);
    }

    // Auto-close on click outside
    document.addEventListener('click', function(e) {
      const widget = document.getElementById('roxx-ai-widget');
      if (!widget || !widget.classList.contains('roxx-expanded-mode')) return;
      if (!widget.contains(e.target) && !e.target.closest('#roxx-ai-widget')) {
        window.toggleRoxxChat(false);
      }
    });

    // Escape key listener to close chat
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const widget = document.getElementById('roxx-ai-widget');
        if (widget && widget.classList.contains('roxx-expanded-mode')) {
          window.toggleRoxxChat(false);
        }
      }
    });

    // Initialize messages on page load
    document.addEventListener('DOMContentLoaded', function() {
      initRoxxChatMessages();
    });

})();