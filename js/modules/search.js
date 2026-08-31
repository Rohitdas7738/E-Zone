// ================================================================
// E-ZONE SEARCH ENGINE (VOICE SEARCH + FUZZY MATCHING)
// ================================================================
        /* ================= VOICE PRODUCT SEARCH — FAST + MOBILE OPTIMIZED ================= */
        (function initVoiceProductSearch(){
            const mic = document.getElementById('search-mic-btn');
            const input = document.getElementById('search-input');
            const status = document.getElementById('search-voice-status');
            if(!mic || !input) return;

            const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if(!Recognition){
                mic.title = 'Voice search is not supported in this browser';
                mic.setAttribute('aria-disabled','true');
                return;
            }

            const rec = new Recognition();
            let isListening = false;
            let finalHandled = false;
            let lastTranscript = '';
            let interimTimer = null;
            let restartTimer = null;

            /*
             * Mobile browsers can be more sensitive to repeated start() calls,
             * so keep one recognition instance and carefully manage its state.
             */
            rec.continuous = false;
            rec.interimResults = true;       // shows speech immediately instead of waiting for final text
            rec.maxAlternatives = 1;          // faster result selection

            function recognitionLang(){
                try{
                    if(typeof currentLang !== 'undefined'){
                        if(currentLang === 'bn') return 'bn-IN';
                        if(currentLang === 'hi') return 'hi-IN';
                        return 'en-IN';
                    }
                }catch(e){}
                return 'bn-IN';
            }

            function setMicState(listening){
                isListening = listening;
                mic.classList.toggle('listening', listening);
                mic.setAttribute('aria-pressed', listening ? 'true' : 'false');
                mic.innerHTML = listening
                    ? '<i class="fas fa-microphone-lines"></i>'
                    : '<i class="fas fa-microphone"></i>';
            }

            function setVoiceStatus(message){
                if(status) status.textContent = message || '';
            }

            function getPrompt(lang){
                if(lang === 'bn-IN') return 'বলুন, কোন product খুঁজছেন…';
                if(lang === 'hi-IN') return 'बोलिए, कौन सा product खोजना है…';
                return 'Speak the product you want to find…';
            }

            function getErrorText(lang){
                if(lang === 'bn-IN') return 'মাইক আবার চাপুন এবং পরিষ্কার করে বলুন।';
                if(lang === 'hi-IN') return 'माइक फिर दबाएँ और साफ़ बोलें।';
                return 'Tap the mic again and speak clearly.';
            }

            function clearTimers(){
                if(interimTimer){ clearTimeout(interimTimer); interimTimer = null; }
                if(restartTimer){ clearTimeout(restartTimer); restartTimer = null; }
            }

            function applyTranscript(text, isFinal){
                text = String(text || '').replace(/\s+/g, ' ').trim();
                if(!text) return;

                lastTranscript = text;
                input.value = text;
                input.dispatchEvent(new Event('input', {bubbles:true}));

                /*
                 * Render interim speech immediately so mobile feels responsive.
                 * Do not scroll repeatedly while the customer is still speaking.
                 */
                if(!isFinal){
                    clearTimeout(interimTimer);
                    interimTimer = setTimeout(function(){
                        try{ renderProducts(); }catch(e){}
                    }, 70);
                    setVoiceStatus(text);
                    return;
                }

                if(finalHandled) return;
                finalHandled = true;
                clearTimeout(interimTimer);
                setVoiceStatus('Voice search: ' + text);
                try{ triggerSearch(); }catch(e){
                    try{ renderProducts(); }catch(ignore){}
                }
            }

            mic.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                clearTimers();

                /* If already listening, a second tap cleanly stops recognition. */
                if(isListening){
                    try{ rec.stop(); }catch(err){ try{ rec.abort(); }catch(ignore){} }
                    return;
                }

                finalHandled = false;
                lastTranscript = '';
                const lang = recognitionLang();

                try{
                    rec.lang = lang;
                    rec.continuous = false;
                    rec.interimResults = true;
                    rec.maxAlternatives = 1;
                    setMicState(true);
                    setVoiceStatus(getPrompt(lang));
                    rec.start();
                }catch(err){
                    setMicState(false);
                    setVoiceStatus(getErrorText(lang));
                    /* Some mobile engines need a tiny gap after a previous session. */
                    restartTimer = setTimeout(function(){
                        if(!isListening){
                            try{
                                rec.lang = lang;
                                setMicState(true);
                                setVoiceStatus(getPrompt(lang));
                                rec.start();
                            }catch(ignore){
                                setMicState(false);
                            }
                        }
                    }, 120);
                }
            }, {passive:false});

            rec.onstart = function(){
                setMicState(true);
                setVoiceStatus(getPrompt(rec.lang || recognitionLang()));
            };

            rec.onresult = function(event){
                let best = '';
                let gotFinal = false;

                /* Prefer the newest result; this prevents old interim fragments
                   from being unnecessarily concatenated on mobile. */
                for(let i = event.resultIndex || 0; i < event.results.length; i++){
                    const result = event.results[i];
                    const transcript = result && result[0] ? result[0].transcript : '';
                    if(transcript) best += (best ? ' ' : '') + transcript;
                    if(result && result.isFinal) gotFinal = true;
                }

                best = best.trim();
                if(best) applyTranscript(best, gotFinal);
            };

            rec.onspeechstart = function(){
                setVoiceStatus('Listening…');
            };

            rec.onspeechend = function(){
                /* Let the engine deliver its final result; do not force a delay. */
                setVoiceStatus(lastTranscript || 'Processing…');
            };

            rec.onerror = function(event){
                const code = event && event.error ? event.error : '';
                if(code === 'aborted') return;

                setMicState(false);
                clearTimers();

                if(code === 'not-allowed' || code === 'service-not-allowed'){
                    setVoiceStatus('মাইক্রোফোন permission দিন, তারপর আবার চেষ্টা করুন।');
                }else if(code === 'no-speech'){
                    setVoiceStatus(getErrorText(rec.lang || recognitionLang()));
                }else if(code === 'audio-capture'){
                    setVoiceStatus('মাইক্রোফোন পাওয়া যাচ্ছে না।');
                }else{
                    setVoiceStatus(getErrorText(rec.lang || recognitionLang()));
                }
            };

            rec.onnomatch = function(){
                setMicState(false);
                setVoiceStatus(getErrorText(rec.lang || recognitionLang()));
            };

            rec.onend = function(){
                clearTimeout(interimTimer);
                interimTimer = null;
                setMicState(false);

                /* If a final transcript was received, the search has already fired. */
                if(finalHandled && lastTranscript){
                    return;
                }
            };

            /* Mobile browsers may suspend speech recognition when the page changes
               visibility. Never auto-start on visibility change because browsers
               require microphone activation from a user gesture. */
            document.addEventListener('visibilitychange', function(){
                if(document.hidden && isListening){
                    try{ rec.abort(); }catch(e){}
                    setMicState(false);
                }
            }, {passive:true});
        })();

        function triggerSearch() {
            renderProducts();
            const prodSec = document.getElementById('products-section');
            if(prodSec) {
                prodSec.scrollIntoView({ behavior: 'smooth' });
            }
        }

        /* ================================================================
         * SMART SEARCH ENGINE
         * Keeps every existing product/filter option intact, but ranks
         * direct results first and places weaker matches under Similar Products.
         * ================================================================ */
        function normalizeSearchText(value) {
            return String(value ?? '')
                .toLowerCase()
                .normalize('NFKC')
                .replace(/[₹,;:!?()[\]{}"'`~@#$%^&*_+=|<>\\/\-]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function searchTokens(value) {
            return normalizeSearchText(value).split(' ').filter(Boolean);
        }

        function levenshteinDistance(a, b) {
            a = normalizeSearchText(a);
            b = normalizeSearchText(b);
            if (!a) return b.length;
            if (!b) return a.length;
            if (a === b) return 0;
            if (a.length > b.length) [a, b] = [b, a];
            let prev = Array.from({length: a.length + 1}, (_, i) => i);
            for (let j = 1; j <= b.length; j++) {
                const cur = [j];
                for (let i = 1; i <= a.length; i++) {
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                    cur[i] = Math.min(
                        cur[i - 1] + 1,
                        prev[i] + 1,
                        prev[i - 1] + cost
                    );
                }
                prev = cur;
            }
            return prev[a.length];
        }

        function fuzzyTokenMatch(queryToken, fieldTokens) {
            if (!queryToken || !fieldTokens.length) return 0;
            let best = 0;
            for (const token of fieldTokens) {
                if (!token) continue;
                if (token === queryToken) return 1;
                if (token.startsWith(queryToken) || queryToken.startsWith(token)) {
                    best = Math.max(best, 0.82);
                    continue;
                }
                if (queryToken.length >= 4 && token.length >= 4) {
                    const distance = levenshteinDistance(queryToken, token);
                    const maxLen = Math.max(queryToken.length, token.length);
                    const similarity = 1 - (distance / maxLen);
                    if (similarity >= 0.72) best = Math.max(best, similarity * 0.78);
                }
            }
            return best;
        }

        function getSearchMeta(product, query) {
            const name = normalizeSearchText(product.name);
            const localizedName = normalizeSearchText(getLocalizedProductName(product.name));
            const brand = normalizeSearchText(product.brand);
            const spec = normalizeSearchText(product.spec);
            const category = normalizeSearchText(product.category);
            const id = normalizeSearchText(product.id);
            const details = normalizeSearchText(product.details || '');
            const queryText = normalizeSearchText(query);
            const qTokens = searchTokens(queryText);

            const nameTokens = searchTokens(name);
            const localizedTokens = searchTokens(localizedName);
            const brandTokens = searchTokens(brand);
            const specTokens = searchTokens(spec);
            const categoryTokens = searchTokens(category);
            const idTokens = searchTokens(id);
            const detailsTokens = searchTokens(details);

            const nameExact = name === queryText || localizedName === queryText;
            const namePhrase = name.includes(queryText) || localizedName.includes(queryText);
            const brandExact = brand === queryText;
            const brandPhrase = brand.includes(queryText);
            const specPhrase = spec.includes(queryText);
            const categoryPhrase = category.includes(queryText);
            const idExact = id === queryText;

            let matchedTokens = 0;
            let tokenQuality = 0;
            qTokens.forEach(q => {
                const best = Math.max(
                    fuzzyTokenMatch(q, nameTokens),
                    fuzzyTokenMatch(q, localizedTokens),
                    fuzzyTokenMatch(q, brandTokens),
                    fuzzyTokenMatch(q, specTokens),
                    fuzzyTokenMatch(q, categoryTokens),
                    fuzzyTokenMatch(q, idTokens),
                    fuzzyTokenMatch(q, detailsTokens)
                );
                if (best >= 0.55) matchedTokens++;
                tokenQuality += best;
            });

            const allTokensMatched = qTokens.length > 0 && matchedTokens === qTokens.length;
            const nameTokenHits = qTokens.filter(q =>
                fuzzyTokenMatch(q, nameTokens) >= 0.72 || fuzzyTokenMatch(q, localizedTokens) >= 0.72
            ).length;
            const brandTokenHits = qTokens.filter(q => fuzzyTokenMatch(q, brandTokens) >= 0.72).length;
            const specTokenHits = qTokens.filter(q => fuzzyTokenMatch(q, specTokens) >= 0.72).length;
            const categoryTokenHits = qTokens.filter(q => fuzzyTokenMatch(q, categoryTokens) >= 0.72).length;

            // Direct = the customer clearly searched for this product/brand/category.
            // Similar = only a weaker/related match was found.
            let direct = false;
            let score = 0;

            if (idExact) { direct = true; score += 15000; }
            if (nameExact) { direct = true; score += 14000; }
            if (namePhrase) { direct = true; score += 10500; }
            if (brandExact) { direct = true; score += 9000; }
            if (brandPhrase && queryText.length >= 3) { direct = true; score += 7800; }
            if (categoryPhrase && queryText.length >= 3) { direct = true; score += 6200; }
            if (specPhrase && queryText.length >= 3) { direct = true; score += 5600; }
            if (allTokensMatched) { direct = true; score += 5200 + Math.round(tokenQuality * 500); }
            if (nameTokenHits > 0) score += nameTokenHits * 1500;
            if (brandTokenHits > 0) score += brandTokenHits * 1100;
            if (specTokenHits > 0) score += specTokenHits * 650;
            if (categoryTokenHits > 0) score += categoryTokenHits * 500;
            if (matchedTokens > 0) score += matchedTokens * 180;

            // A single weak fuzzy hit should not outrank a true direct result.
            const similarity = qTokens.length ? tokenQuality / qTokens.length : 0;
            if (!direct && similarity >= 0.55) score += Math.round(similarity * 1800);

            return {
                direct,
                score,
                matchedTokens,
                nameTokenHits,
                similarity,
                nameExact,
                namePhrase,
                brandExact,
                categoryPhrase,
                specPhrase
            };
        }

        function createSearchGroupHeading(text, count, type = 'main') {
            const wrapper = document.createElement('div');
            wrapper.className = 'col-span-full search-result-group-heading';
            wrapper.innerHTML = `
                <div class="flex items-center gap-3 py-2.5 px-3 rounded-xl border ${type === 'similar' ? 'border-amber-200 bg-amber-50/80' : 'border-teal-100 bg-white'} shadow-sm">
                    <span class="w-2 h-7 rounded-full ${type === 'similar' ? 'bg-amber-400' : 'bg-teal-600'}"></span>
                    <div class="min-w-0">
                        <div class="text-[11px] md:text-xs font-black uppercase tracking-[0.12em] ${type === 'similar' ? 'text-amber-800' : 'text-teal-900'}">${text}</div>
                        <div class="text-[9px] font-semibold ${type === 'similar' ? 'text-amber-700' : 'text-gray-500'}">${count} ${count === 1 ? 'result' : 'results'}</div>
                    </div>
                </div>`;
            return wrapper;
        }
