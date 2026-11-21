/**
 * Amanmart - Section 2: Explore Katalog Kami
 * - Infinite Loop Centered Carousel (Pointer Swipe + Mouse Drag + Touch + Arrows + Dots)
 * - Exact Mathematical Centering + Active Card Scale Up
 * - Client-Side Local Admin Panel with Auto-Compressed Image Upload & Quick Image Updater
 */
(() => {
    'use strict';

    const STORAGE_KEY = 'amanmart_catalog_items_v2';
    const WA_NUMBER = '628122535888';

    // SVG Fallback jika gambar gagal dimuat atau offline
    const FALLBACK_SVG =
        'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
            <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#E8F4EC"/>
                    <stop offset="100%" stop-color="#D7EADF"/>
                </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#g)"/>
            <circle cx="300" cy="170" r="54" fill="#268941" opacity="0.16"/>
            <path d="M282 170c0-10 8-18 18-18s18 8 18 18-8 18-18 18-18-8-18-18zm-16 32h68a8 8 0 0 1 8 8v12H258v-12a8 8 0 0 1 8-8z" fill="#268941" opacity="0.6"/>
            <text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle"
                  font-family="'Nunito Sans', sans-serif" font-size="20" font-weight="700" fill="#0C3839">
                Amanmart Produk
            </text>
            <text x="50%" y="77%" dominant-baseline="middle" text-anchor="middle"
                  font-family="'Nunito Sans', sans-serif" font-size="13" font-weight="500" fill="#52636D">
                Gambar Tidak Tersedia
            </text>
        </svg>`);

    // Data Default Mock Sesuai Reference Image
    const DEFAULT_CATALOG_ITEMS = [
        {
            id: 'item-1',
            featured: false,
            title: 'Kategori Makanan Ringan & Instan',
            image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80',
            description:
                'Pilihan aneka camilan renyah favorit keluarga, keripik kentang & singkong, biskuit manis, wafer lezat, dan aneka mie instan komplit untuk melengkapi momen santai Anda.',
            tags: ['Keripik Kentang', 'Mie Instan', 'Biskuit & Wafer', 'Camilan Tradisional']
        },
        {
            id: 'item-2',
            featured: true,
            title: 'Bahan Makanan & Produk Segar',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
            description:
                'Sayuran hijau panen harian, buah-buahan segar lokal & impor, daging ayam segar higienis, telur ayam pilihan, serta beras dan bumbu dapur lengkap dengan mutu terjaga setiap hari.',
            tags: ['Sayur Segar Harian', 'Buah Segar Pilihan', 'Beras Premium', 'Minyak & Bumbu Dapur', 'Telur Ayam Segar']
        },
        {
            id: 'item-3',
            featured: false,
            title: 'Kebutuhan Rumah Tangga & Harian',
            image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
            description:
                'Peralatan kebersihan rumah tangga, deterjen pakaian harum, cairan pencuci piring, pembersih lantai, sabun mandi, sampo, dan tisu dapur berkualitas dengan harga hemat.',
            tags: ['Deterjen & Pewangi', 'Sabun & Perawatan Tubuh', 'Pembersih Lantai', 'Tisu Wajah & Dapur']
        },
        {
            id: 'item-4',
            featured: false,
            title: 'Susu, Kopi & Minuman Keluarga',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
            description:
                'Susu UHT full cream dan aneka rasa bergizi, kopi bubuk pilihan, teh celup wangi, madu murni, serta sereal sarapan sehat untuk keluarga tercinta.',
            tags: ['Susu UHT Keluarga', 'Kopi Pilihan', 'Teh Celup Aromatik', 'Air Mineral Galon']
        }
    ];

    // State Aplikasi & Carousel
    let catalogItems = loadCatalogItems();
    let currentUploadBase64 = '';
    let quickUploadBase64 = '';
    let activeQuickCardId = null;

    // State Infinite Carousel
    let copiesCount = 1;
    let midStartIndex = 0;
    let virtualIndex = 0;
    let currentTranslateX = 0;
    let isTransitioning = false;
    let wrapTimer = null;

    // ==========================================
    // 1. DATA STORAGE & ERROR HANDLING
    // ==========================================
    function loadCatalogItems() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                saveCatalogItems(DEFAULT_CATALOG_ITEMS);
                return JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));
            }
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                return JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));
            }
            return parsed.filter((it) => it && typeof it === 'object' && it.id);
        } catch (err) {
            console.warn('[Amanmart] Gagal membaca localStorage, menggunakan data default:', err);
            return JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));
        }
    }

    function saveCatalogItems(items) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            return true;
        } catch (err) {
            console.error('[Amanmart] Penyimpanan penuh:', err);
            showToast('Penyimpanan browser penuh. Coba hapus item lama atau gunakan URL gambar.', true);
            return false;
        }
    }

    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function applySafeImageFallback(imgEl) {
        if (!imgEl) return;
        imgEl.dataset.fallbackApplied = '';
        imgEl.addEventListener('error', () => {
            if (imgEl.dataset.fallbackApplied === '1') return;
            imgEl.dataset.fallbackApplied = '1';
            imgEl.src = FALLBACK_SVG;
        });
    }

    function showToast(message, isError = false) {
        const container = document.getElementById('catalogToastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `catalog-toast-msg${isError ? ' error' : ''}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 320);
        }, 2800);
    }

    /**
     * Kompres otomatis gambar unggahan lokal via Canvas agar ukuran aman untuk localStorage
     */
    function processImageFile(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Berkas bukan format gambar yang valid.'));
                return;
            }

            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
            reader.onload = (evt) => {
                const rawDataUrl = evt.target.result;

                // Untuk SVG langsung gunakan dataUrl jika < 500KB
                if (file.type === 'image/svg+xml') {
                    if (file.size <= 500 * 1024) {
                        resolve(rawDataUrl);
                    } else {
                        reject(new Error('Ukuran SVG terlalu besar (maks. 500KB).'));
                    }
                    return;
                }

                const img = new Image();
                img.onerror = () => {
                    // Fallback jika browser gagal decode via Image
                    if (file.size <= 1.2 * 1024 * 1024) {
                        resolve(rawDataUrl);
                    } else {
                        reject(new Error('Gambar tidak didukung atau ukuran terlalu besar.'));
                    }
                };
                img.onload = () => {
                    try {
                        const maxDim = 800;
                        let width = img.naturalWidth || img.width;
                        let height = img.naturalHeight || img.height;

                        if (width > maxDim || height > maxDim) {
                            if (width >= height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }

                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            resolve(rawDataUrl);
                            return;
                        }

                        // Latar putih untuk PNG transparan saat diubah ke JPEG
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, width, height);
                        ctx.drawImage(img, 0, 0, width, height);

                        const compressed = canvas.toDataURL('image/jpeg', 0.82);
                        resolve(compressed);
                    } catch (err) {
                        if (file.size <= 1.2 * 1024 * 1024) {
                            resolve(rawDataUrl);
                        } else {
                            reject(new Error('Gagal memproses ukuran gambar.'));
                        }
                    }
                };
                img.src = rawDataUrl;
            };
            reader.readAsDataURL(file);
        });
    }

    // ==========================================
    // 2. RENDER INFINITE CAROUSEL & CENTERING
    // ==========================================
    function renderCatalog(preserveRealIndex = null) {
        const track = document.getElementById('catalogTrack');
        const dotsWrap = document.getElementById('catalogDots');
        const prevBtn = document.getElementById('catalogPrevBtn');
        const nextBtn = document.getElementById('catalogNextBtn');
        if (!track) return;

        clearTimeout(wrapTimer);
        isTransitioning = false;
        track.innerHTML = '';

        const total = catalogItems.length;

        if (total === 0) {
            track.style.transform = 'translate3d(0, 0, 0)';
            track.innerHTML = `
                <div class="catalog-empty-state">
                    <p>Belum ada produk di katalog. Buka <strong>Admin Katalog</strong> untuk menambahkan item baru.</p>
                </div>`;
            if (dotsWrap) dotsWrap.innerHTML = '';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            renderAdminList();
            return;
        }

        // Tentukan jumlah duplikasi untuk infinite loop mulus
        copiesCount = total === 1 ? 1 : (total === 2 ? 5 : 3);
        midStartIndex = Math.floor(copiesCount / 2) * total;

        const renderList = [];
        for (let c = 0; c < copiesCount; c++) {
            catalogItems.forEach((item, realIdx) => {
                renderList.push({ item, realIdx });
            });
        }

        renderList.forEach(({ item, realIdx }, vIdx) => {
            const card = document.createElement('article');
            card.className = 'catalog-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Lihat detail ${item.title || 'Produk'}`);
            card.dataset.id = item.id;
            card.dataset.realIndex = String(realIdx);
            card.dataset.virtualIndex = String(vIdx);

            const safeImage = item.image && item.image.trim() !== '' ? item.image.trim() : FALLBACK_SVG;
            const safeTitle = escapeHtml(item.title || 'Produk Amanmart');

            card.innerHTML = `
                <div class="card-img-box">
                    <img src="${escapeHtml(safeImage)}" alt="${safeTitle}" draggable="false" loading="eager">
                </div>
                <div class="card-desc-box">
                    <h3 class="card-item-title">${safeTitle}</h3>
                    <div class="card-pill-action">
                        <button type="button" class="catalog-pill-btn" aria-label="Lihat detail ${safeTitle}">
                            Selengkapnya <span aria-hidden="true">&rsaquo;</span>
                        </button>
                    </div>
                </div>
            `;

            // Cegah browser native ghost-image drag agar swipe mulus
            card.addEventListener('dragstart', (e) => e.preventDefault());

            const imgEl = card.querySelector('img');
            applySafeImageFallback(imgEl);

            // Klik kartu: jika kartu samping -> geser ke tengah; jika aktif -> buka detail
            card.addEventListener('click', (e) => {
                if (track.dataset.justDragged === 'true') return;

                if (e.target.closest('.catalog-pill-btn')) {
                    openDetailModal(item);
                    return;
                }

                const clickedVIdx = Number(card.dataset.virtualIndex);
                if (clickedVIdx !== virtualIndex) {
                    goToVirtualIndex(clickedVIdx, true);
                } else {
                    openDetailModal(item);
                }
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetailModal(item);
                }
            });

            track.appendChild(card);
        });

        // Aktifkan tombol panah jika item >= 2
        if (prevBtn) prevBtn.disabled = total < 2;
        if (nextBtn) nextBtn.disabled = total < 2;

        // Render dots
        renderPaginationDots();

        // Tentukan kartu awal yang berada tepat di tengah
        let targetRealIdx = 0;
        if (preserveRealIndex !== null && preserveRealIndex >= 0 && preserveRealIndex < total) {
            targetRealIdx = preserveRealIndex;
        } else {
            const featuredIdx = catalogItems.findIndex((it) => it.featured);
            targetRealIdx = featuredIdx !== -1 ? featuredIdx : (total > 1 ? 1 : 0);
        }

        virtualIndex = midStartIndex + targetRealIdx;

        // Tunggu 1 frame agar layout flex terukur sempurna lalu posisikan tepat di tengah tanpa transisi awal
        requestAnimationFrame(() => {
            track.classList.add('no-card-transition');
            updateCarouselPosition(false);
            void track.offsetWidth;
            requestAnimationFrame(() => {
                track.classList.remove('no-card-transition');
            });
        });

        renderAdminList();
    }

    function renderPaginationDots() {
        const dotsWrap = document.getElementById('catalogDots');
        if (!dotsWrap) return;

        dotsWrap.innerHTML = '';
        if (catalogItems.length <= 1) return;

        catalogItems.forEach((item, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'catalog-dot-item';
            dot.setAttribute('aria-label', `Slide ${idx + 1}: ${item.title}`);

            dot.addEventListener('click', () => {
                goToVirtualIndex(midStartIndex + idx, true);
            });

            dotsWrap.appendChild(dot);
        });
    }

    function getRealIndex(vIdx) {
        const total = catalogItems.length;
        if (total === 0) return 0;
        return ((vIdx % total) + total) % total;
    }

    function calculateTranslateForIndex(vIdx) {
        const viewport = document.getElementById('catalogViewport');
        const track = document.getElementById('catalogTrack');
        if (!viewport || !track) return 0;

        const cards = track.children;
        const targetCard = cards[vIdx];
        if (!targetCard) return 0;

        const vpCenter = viewport.clientWidth / 2;
        const vpPadLeft = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
        const cardCenterInVp = vpPadLeft + targetCard.offsetLeft + targetCard.offsetWidth / 2;

        return Math.round(vpCenter - cardCenterInVp);
    }

    function updateCarouselPosition(animate = true) {
        const track = document.getElementById('catalogTrack');
        const dotsWrap = document.getElementById('catalogDots');
        if (!track || catalogItems.length === 0) return;

        const cards = Array.from(track.children);
        if (virtualIndex < 0 || virtualIndex >= cards.length) {
            virtualIndex = midStartIndex;
        }

        // Terapkan kelas aktif pada kartu tengah
        cards.forEach((card, idx) => {
            card.classList.toggle('is-active', idx === virtualIndex);
        });

        // Sinkronisasi dot indikator
        const realIdx = getRealIndex(virtualIndex);
        if (dotsWrap && dotsWrap.children.length > 0) {
            Array.from(dotsWrap.children).forEach((dot, idx) => {
                dot.classList.toggle('active', idx === realIdx);
            });
        }

        currentTranslateX = calculateTranslateForIndex(virtualIndex);

        if (animate) {
            track.style.transition = 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)';
        } else {
            track.style.transition = 'none';
        }

        track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
    }

    function goToVirtualIndex(nextVIdx, animate = true) {
        const total = catalogItems.length;
        if (total < 2) {
            updateCarouselPosition(false);
            return;
        }

        const track = document.getElementById('catalogTrack');
        if (!track) return;

        clearTimeout(wrapTimer);

        // Batasi agar tidak melampaui batas array klon jika di-klik sangat cepat
        const maxVIdx = track.children.length - 1;
        if (nextVIdx < 0 || nextVIdx > maxVIdx) {
            const real = getRealIndex(virtualIndex);
            track.classList.add('no-card-transition');
            virtualIndex = midStartIndex + real;
            updateCarouselPosition(false);
            void track.offsetWidth;
            track.classList.remove('no-card-transition');
            virtualIndex = midStartIndex + real + (nextVIdx < 0 ? -1 : 1);
        } else {
            virtualIndex = nextVIdx;
        }

        isTransitioning = animate;
        updateCarouselPosition(animate);

        if (animate) {
            wrapTimer = setTimeout(() => {
                handleSeamlessWrap();
            }, 450);
        } else {
            handleSeamlessWrap();
        }
    }

    function handleSeamlessWrap() {
        clearTimeout(wrapTimer);
        isTransitioning = false;

        const total = catalogItems.length;
        if (total < 2) return;

        const track = document.getElementById('catalogTrack');
        if (!track) return;

        const minMid = midStartIndex;
        const maxMid = midStartIndex + total - 1;

        if (virtualIndex < minMid || virtualIndex > maxMid) {
            const realIdx = getRealIndex(virtualIndex);
            // Matikan transisi kartu sementara agar snap-back tidak memicu animasi ulang (anti-getar)
            track.classList.add('no-card-transition');
            virtualIndex = midStartIndex + realIdx;
            updateCarouselPosition(false);
            void track.offsetWidth;
            requestAnimationFrame(() => {
                track.classList.remove('no-card-transition');
            });
        }
    }

    // ==========================================
    // 3. POINTER SWIPE / DRAG & ARROW CONTROLS
    // ==========================================
    function setupCarouselControls() {
        const viewport = document.getElementById('catalogViewport');
        const track = document.getElementById('catalogTrack');
        const prevBtn = document.getElementById('catalogPrevBtn');
        const nextBtn = document.getElementById('catalogNextBtn');
        const mainCtaBtn = document.getElementById('catalogMainCtaBtn');

        if (!viewport || !track) return;

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (catalogItems.length < 2) return;
                goToVirtualIndex(virtualIndex - 1, true);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (catalogItems.length < 2) return;
                goToVirtualIndex(virtualIndex + 1, true);
            });
        }

        if (mainCtaBtn) {
            mainCtaBtn.addEventListener('click', () => {
                const realIdx = getRealIndex(virtualIndex);
                const activeItem = catalogItems[realIdx] || catalogItems[0];
                if (activeItem) {
                    openDetailModal(activeItem);
                } else {
                    showToast('Belum ada item di katalog.', true);
                }
            });
        }

        // Transition end untuk wrap-around instan
        track.addEventListener('transitionend', (e) => {
            if (e.target === track && e.propertyName === 'transform') {
                handleSeamlessWrap();
            }
        });

        // Unified Pointer Events (Mouse Drag + Touch Swipe + Pen)
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let deltaX = 0;
        let startTime = 0;
        let isHorizontalSwipe = null;
        let dragRafId = null;

        viewport.addEventListener('pointerdown', (e) => {
            if (catalogItems.length < 2) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            handleSeamlessWrap();
            cancelAnimationFrame(dragRafId);

            isDragging = true;
            isHorizontalSwipe = null;
            startX = e.clientX;
            startY = e.clientY;
            deltaX = 0;
            startTime = Date.now();
            track.dataset.justDragged = 'false';
            track.classList.add('is-dragging');
            track.style.transition = 'none';
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (isHorizontalSwipe === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
                isHorizontalSwipe = Math.abs(dx) >= Math.abs(dy);
            }

            if (isHorizontalSwipe === false) {
                isDragging = false;
                cancelAnimationFrame(dragRafId);
                track.classList.remove('is-dragging');
                updateCarouselPosition(true);
                return;
            }

            deltaX = dx;
            if (Math.abs(deltaX) > 6) {
                track.dataset.justDragged = 'true';
            }

            cancelAnimationFrame(dragRafId);
            dragRafId = requestAnimationFrame(() => {
                if (!isDragging) return;
                const nextX = Math.round(currentTranslateX + deltaX);
                track.style.transform = `translate3d(${nextX}px, 0, 0)`;
            });
        });

        const finishDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(dragRafId);
            track.classList.remove('is-dragging');

            const elapsed = Date.now() - startTime;
            const velocity = Math.abs(deltaX) / Math.max(1, elapsed);
            const threshold = 42;

            if (Math.abs(deltaX) >= threshold || (velocity > 0.35 && Math.abs(deltaX) > 18)) {
                const direction = deltaX < 0 ? 1 : -1;
                goToVirtualIndex(virtualIndex + direction, true);
            } else {
                updateCarouselPosition(true);
            }

            setTimeout(() => {
                track.dataset.justDragged = 'false';
            }, 80);
        };

        window.addEventListener('pointerup', finishDrag);
        window.addEventListener('pointercancel', finishDrag);

        // Re-center saat ukuran jendela berubah
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateCarouselPosition(false);
            }, 80);
        });
    }

    // ==========================================
    // 4. DETAIL MODAL (CARD VIEWER)
    // ==========================================
    function openDetailModal(item) {
        const modal = document.getElementById('catalogDetailModal');
        if (!modal || !item) return;

        const img = document.getElementById('detailModalImage');
        const title = document.getElementById('detailModalTitle');
        const desc = document.getElementById('detailModalDesc');
        const chips = document.getElementById('detailModalChips');
        const waLink = document.getElementById('detailModalWaLink');

        const safeImg = item.image && item.image.trim() !== '' ? item.image.trim() : FALLBACK_SVG;
        if (img) {
            img.dataset.fallbackApplied = '';
            img.src = safeImg;
            img.onerror = () => {
                if (img.dataset.fallbackApplied === '1') return;
                img.dataset.fallbackApplied = '1';
                img.src = FALLBACK_SVG;
            };
        }

        if (title) title.textContent = item.title || 'Detail Produk';
        if (desc) desc.textContent = item.description || 'Pilihan produk segar dan kebutuhan harian terbaik dari Amanmart.';

        if (chips) {
            chips.innerHTML = '';
            const tagList = Array.isArray(item.tags) && item.tags.length > 0
                ? item.tags
                : ['Produk Amanmart Pilihan'];

            tagList.forEach((tag) => {
                const span = document.createElement('span');
                span.className = 'modal-chip';
                span.textContent = tag;
                chips.appendChild(span);
            });
        }

        if (waLink) {
            const waMsg = encodeURIComponent(`Halo Amanmart, saya tertarik dengan informasi kategori: "${item.title}". Apakah stok produk terkait tersedia hari ini?`);
            waLink.href = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
        }

        modal.hidden = false;
        document.body.classList.add('catalog-modal-open');
    }

    function closeAllModals() {
        const detailModal = document.getElementById('catalogDetailModal');
        const adminModal = document.getElementById('catalogAdminModal');
        const quickImgModal = document.getElementById('catalogQuickImageModal');
        const loginModal = document.getElementById('catalogLoginModal');

        if (detailModal) detailModal.hidden = true;
        if (adminModal) adminModal.hidden = true;
        if (quickImgModal) quickImgModal.hidden = true;
        if (loginModal) loginModal.hidden = true;

        document.body.classList.remove('catalog-modal-open');
    }

    // ==========================================
    // 5. SUPER USER AUTH & HIDDEN ADMIN ACCESS
    // ==========================================
    function isSuperUser() {
        return document.body && document.body.dataset.superuser === 'true';
    }

    function setSuperUserState(active) {
        if (document.body) {
            document.body.dataset.superuser = active ? 'true' : 'false';
        }
        const floatingBar = document.getElementById('superUserFloatingBar');
        if (floatingBar) {
            floatingBar.hidden = !active;
        }
    }

    function openLoginModal() {
        closeAllModals();
        const loginModal = document.getElementById('catalogLoginModal');
        if (!loginModal) return;

        loginModal.hidden = false;
        document.body.classList.add('catalog-modal-open');

        const userInput = document.getElementById('suUsername');
        if (userInput) {
            setTimeout(() => userInput.focus(), 60);
        }
    }

    function openAdminModal() {
        if (!isSuperUser()) {
            openLoginModal();
            return;
        }
        closeAllModals();
        const adminModal = document.getElementById('catalogAdminModal');
        if (!adminModal) return;

        adminModal.hidden = false;
        document.body.classList.add('catalog-modal-open');
        renderAdminList();
    }

    function setupSuperUserAccess() {
        const loginForm = document.getElementById('superUserLoginForm');
        const closeLoginBtn = document.getElementById('closeLoginModalBtn');
        const cancelLoginBtn = document.getElementById('suLoginCancelBtn');
        const logoutBtn = document.getElementById('logoutSuperUserBtn');
        const secretTrigger = document.getElementById('catalogSecretTrigger');

        // Sinkronisasi visibilitas awal toolbar
        setSuperUserState(isSuperUser());

        if (closeLoginBtn) closeLoginBtn.addEventListener('click', closeAllModals);
        if (cancelLoginBtn) cancelLoginBtn.addEventListener('click', closeAllModals);

        // 1. Trigger via URL Parameter (?admin=1 atau ?superuser=1)
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('admin') === '1' || params.get('superuser') === '1') {
                if (isSuperUser()) {
                    openAdminModal();
                } else {
                    openLoginModal();
                }
                // Bersihkan query string di address bar tanpa reload
                if (window.history && window.history.replaceState) {
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            }
        } catch (err) {
            // Abaikan jika URLSearchParams gagal
        }

        // 2. Trigger via Shortcut Keyboard Rahasia: Ctrl + Shift + A atau Alt + Shift + A
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.altKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                if (isSuperUser()) {
                    openAdminModal();
                } else {
                    openLoginModal();
                }
            }
        });

        // 3. Trigger Rahasia Mobile: Klik 3x cepat pada teks "Katalog kami"
        if (secretTrigger) {
            let clickCount = 0;
            let clickTimer = null;
            secretTrigger.addEventListener('click', () => {
                clickCount++;
                clearTimeout(clickTimer);
                if (clickCount >= 3) {
                    clickCount = 0;
                    if (isSuperUser()) {
                        openAdminModal();
                    } else {
                        openLoginModal();
                    }
                } else {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 700);
                }
            });
        }

        // Handle Submit Login Super User
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userEl = document.getElementById('suUsername');
                const passEl = document.getElementById('suPassword');
                const submitBtn = document.getElementById('suLoginSubmitBtn');

                const username = userEl ? userEl.value.trim() : '';
                const password = passEl ? passEl.value : '';

                if (!username || !password) {
                    showToast('Masukkan username dan password Super User.', true);
                    return;
                }

                if (submitBtn) submitBtn.disabled = true;

                try {
                    const res = await fetch('index.php?action=admin_login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();

                    if (res.ok && data && data.success) {
                        setSuperUserState(true);
                        loginForm.reset();
                        openAdminModal();
                        showToast(data.message || 'Login Super User berhasil.');
                    } else {
                        showToast((data && data.message) || 'Username atau password salah.', true);
                    }
                } catch (err) {
                    showToast('Gagal menghubungi server autentikasi.', true);
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        }

        // Handle Logout Super User
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await fetch('index.php?action=admin_logout', { method: 'POST' });
                } catch (err) {
                    // Tetap nonaktifkan state lokal jika request gagal
                }
                setSuperUserState(false);
                closeAllModals();
                showToast('Mode Super User dinonaktifkan. Tampilan kembali ke mode publik.');
            });
        }
    }

    // ==========================================
    // 6. LOCAL ADMIN PANEL & DYNAMIC IMAGE UPDATER
    // ==========================================
    function setupAdminPanel() {
        const adminModal = document.getElementById('catalogAdminModal');
        const openAdminBtn = document.getElementById('openAdminPanelBtn');
        const closeAdminBtn = document.getElementById('closeAdminModalBtn');
        const closeDetailBtn = document.getElementById('closeDetailModalBtn');
        const form = document.getElementById('catalogAdminForm');
        const resetBtn = document.getElementById('adminResetBtn');
        const restoreDefaultBtn = document.getElementById('adminRestoreDefaultBtn');

        // Form Image Inputs & Live Preview
        const formUrlInput = document.getElementById('adminFormImageUrl');
        const formFileInput = document.getElementById('adminFormImageFile');
        const formPreviewImg = document.getElementById('formLivePreviewImg');

        // Quick Image Updater Modal Elements
        const closeQuickBtn = document.getElementById('closeQuickImgModalBtn');
        const cancelQuickBtn = document.getElementById('quickImgCancelBtn');
        const saveQuickBtn = document.getElementById('quickImgSaveBtn');
        const quickFileInput = document.getElementById('quickImgFileInput');
        const quickUrlInput = document.getElementById('quickImgUrlInput');
        const quickPreview = document.getElementById('quickImgPreview');

        if (formPreviewImg) {
            formPreviewImg.src = FALLBACK_SVG;
            applySafeImageFallback(formPreviewImg);
        }

        if (openAdminBtn && adminModal) {
            openAdminBtn.addEventListener('click', () => {
                openAdminModal();
            });
        }

        if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAllModals);
        if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeAllModals);
        if (closeQuickBtn) closeQuickBtn.addEventListener('click', closeAllModals);
        if (cancelQuickBtn) cancelQuickBtn.addEventListener('click', closeAllModals);

        document.querySelectorAll('.catalog-modal-backdrop').forEach((backdrop) => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) closeAllModals();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllModals();
        });

        // Live Preview pada Form Utama saat mengetik URL/path
        if (formUrlInput && formPreviewImg) {
            formUrlInput.addEventListener('input', () => {
                const url = formUrlInput.value.trim();
                if (url) {
                    formPreviewImg.dataset.fallbackApplied = '';
                    formPreviewImg.src = url;
                    currentUploadBase64 = '';
                } else if (!currentUploadBase64) {
                    formPreviewImg.src = FALLBACK_SVG;
                }
            });
        }

        // File upload pada Form Utama (dengan auto-compress)
        if (formFileInput) {
            formFileInput.addEventListener('change', async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                try {
                    const compressed = await processImageFile(file);
                    currentUploadBase64 = compressed;
                    if (formPreviewImg) {
                        formPreviewImg.dataset.fallbackApplied = '';
                        formPreviewImg.src = compressed;
                    }
                    if (formUrlInput) {
                        formUrlInput.value = '';
                        formUrlInput.placeholder = '(Menggunakan foto lokal terunggah)';
                    }
                    showToast('Foto berhasil dimuat dan siap disimpan.');
                } catch (err) {
                    formFileInput.value = '';
                    showToast(err.message || 'Gagal memproses gambar.', true);
                }
            });
        }

        // Live Preview pada Quick Image Updater Modal
        if (quickUrlInput && quickPreview) {
            quickUrlInput.addEventListener('input', () => {
                const url = quickUrlInput.value.trim();
                if (url) {
                    quickPreview.dataset.fallbackApplied = '';
                    quickPreview.src = url;
                    quickUploadBase64 = '';
                }
            });
        }

        if (quickFileInput && quickPreview) {
            quickFileInput.addEventListener('change', async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                try {
                    const compressed = await processImageFile(file);
                    quickUploadBase64 = compressed;
                    quickPreview.dataset.fallbackApplied = '';
                    quickPreview.src = compressed;
                    if (quickUrlInput) quickUrlInput.value = '';
                    showToast('Foto siap diterapkan.');
                } catch (err) {
                    quickFileInput.value = '';
                    showToast(err.message || 'Gagal memproses gambar.', true);
                }
            });
        }

        // Simpan Perubahan Gambar Cepat (Quick Image Modal)
        if (saveQuickBtn) {
            saveQuickBtn.addEventListener('click', () => {
                if (!isSuperUser()) {
                    openLoginModal();
                    return;
                }
                if (!activeQuickCardId) return;

                const targetIdx = catalogItems.findIndex((it) => it.id === activeQuickCardId);
                if (targetIdx === -1) {
                    showToast('Kartu tidak ditemukan.', true);
                    return;
                }

                const newImg = quickUploadBase64 || (quickUrlInput ? quickUrlInput.value.trim() : '');

                if (!newImg) {
                    showToast('Silakan pilih berkas foto atau masukkan URL/path gambar.', true);
                    return;
                }

                catalogItems[targetIdx].image = newImg;
                if (saveCatalogItems(catalogItems)) {
                    renderCatalog(targetIdx);
                    closeAllModals();
                    showToast(`Gambar untuk "${catalogItems[targetIdx].title}" berhasil diperbarui!`);
                }
            });
        }

        // Submit Form Utama (Tambah atau Edit)
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!isSuperUser()) {
                    openLoginModal();
                    return;
                }

                const id = document.getElementById('adminFormItemId').value.trim();
                const title = document.getElementById('adminFormTitle').value.trim();
                const featured = document.getElementById('adminFormFeatured').value === 'true';
                const urlImage = formUrlInput ? formUrlInput.value.trim() : '';
                const description = document.getElementById('adminFormDesc').value.trim();
                const tagsRaw = document.getElementById('adminFormTags').value.trim();

                if (!title || !description) {
                    showToast('Judul dan deskripsi wajib diisi.', true);
                    return;
                }

                let finalImage = currentUploadBase64 || urlImage;
                const tags = tagsRaw
                    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
                    : [];

                let focusRealIdx = getRealIndex(virtualIndex);

                if (id) {
                    const index = catalogItems.findIndex((it) => it.id === id);
                    if (index !== -1) {
                        if (!finalImage) {
                            finalImage = catalogItems[index].image || FALLBACK_SVG;
                        }
                        catalogItems[index] = {
                            ...catalogItems[index],
                            title,
                            featured,
                            image: finalImage,
                            description,
                            tags
                        };
                        focusRealIdx = index;
                        showToast('Kartu dan gambar berhasil diperbarui.');
                    }
                } else {
                    const newItem = {
                        id: 'item-' + Date.now(),
                        title,
                        featured,
                        image: finalImage || FALLBACK_SVG,
                        description,
                        tags
                    };
                    catalogItems.push(newItem);
                    focusRealIdx = catalogItems.length - 1;
                    showToast('Kartu baru berhasil ditambahkan.');
                }

                if (saveCatalogItems(catalogItems)) {
                    resetAdminForm();
                    renderCatalog(focusRealIdx);
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', resetAdminForm);
        }

        if (restoreDefaultBtn) {
            restoreDefaultBtn.addEventListener('click', () => {
                if (!isSuperUser()) {
                    openLoginModal();
                    return;
                }
                if (confirm('Kembalikan semua kartu katalog dan gambar ke konfigurasi awal?')) {
                    catalogItems = JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));
                    saveCatalogItems(catalogItems);
                    resetAdminForm();
                    renderCatalog();
                    showToast('Data katalog telah dipulihkan ke default.');
                }
            });
        }
    }

    function resetAdminForm() {
        const form = document.getElementById('catalogAdminForm');
        if (form) form.reset();

        const idField = document.getElementById('adminFormItemId');
        if (idField) idField.value = '';

        const urlInput = document.getElementById('adminFormImageUrl');
        if (urlInput) urlInput.placeholder = 'https://... atau assets/images/foto.png';

        const submitBtn = document.getElementById('adminSubmitBtn');
        if (submitBtn) submitBtn.textContent = 'Simpan Kartu';

        const formPreviewImg = document.getElementById('formLivePreviewImg');
        if (formPreviewImg) {
            formPreviewImg.dataset.fallbackApplied = '';
            formPreviewImg.src = FALLBACK_SVG;
        }

        currentUploadBase64 = '';
    }

    // ==========================================
    // 7. RENDER DAFTAR KARTU PADA ADMIN PANEL
    // ==========================================
    function renderAdminList() {
        const listWrap = document.getElementById('adminActiveItemsList');
        if (!listWrap) return;

        listWrap.innerHTML = '';
        if (catalogItems.length === 0) {
            listWrap.innerHTML = '<p class="admin-empty-text">Tidak ada item aktif.</p>';
            return;
        }

        catalogItems.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'admin-card-row';

            const safeThumb = item.image && item.image.trim() !== '' ? item.image.trim() : FALLBACK_SVG;

            row.innerHTML = `
                <div class="admin-card-thumb">
                    <img src="${escapeHtml(safeThumb)}" alt="Thumb">
                </div>
                <div class="admin-card-row-info">
                    <strong>${escapeHtml(item.title)}</strong>
                    <span class="admin-card-row-meta">
                        ${item.featured ? '<span class="badge-featured">Kartu Utama</span> • ' : ''}
                        ${(item.tags || []).length} item contoh
                    </span>
                </div>
                <div class="admin-card-row-actions">
                    <button type="button" class="btn-action change-img" title="Ganti Gambar Kartu Ini">🖼️ Ganti Gambar</button>
                    <button type="button" class="btn-action edit" title="Edit Lengkap">Edit</button>
                    <button type="button" class="btn-action delete" title="Hapus">Hapus</button>
                </div>
            `;

            const thumbImg = row.querySelector('.admin-card-thumb img');
            applySafeImageFallback(thumbImg);

            // Tombol Ganti Gambar Cepat
            row.querySelector('.change-img').addEventListener('click', () => {
                openQuickImageModal(item);
            });

            // Tombol Edit Lengkap
            row.querySelector('.edit').addEventListener('click', () => {
                if (!isSuperUser()) {
                    openLoginModal();
                    return;
                }
                document.getElementById('adminFormItemId').value = item.id;
                document.getElementById('adminFormTitle').value = item.title;
                document.getElementById('adminFormFeatured').value = String(Boolean(item.featured));
                document.getElementById('adminFormImageUrl').value = item.image && !item.image.startsWith('data:') ? item.image : '';
                document.getElementById('adminFormDesc').value = item.description || '';
                document.getElementById('adminFormTags').value = (item.tags || []).join(', ');
                document.getElementById('adminSubmitBtn').textContent = 'Perbarui Kartu';

                const formPreviewImg = document.getElementById('formLivePreviewImg');
                if (formPreviewImg) {
                    formPreviewImg.dataset.fallbackApplied = '';
                    formPreviewImg.src = item.image || FALLBACK_SVG;
                }

                currentUploadBase64 = '';
                const form = document.getElementById('catalogAdminForm');
                if (form) form.scrollIntoView({ behavior: 'smooth' });
            });

            // Tombol Hapus
            row.querySelector('.delete').addEventListener('click', () => {
                if (!isSuperUser()) {
                    openLoginModal();
                    return;
                }
                if (confirm(`Hapus kartu "${item.title}" dari katalog?`)) {
                    catalogItems = catalogItems.filter((it) => it.id !== item.id);
                    saveCatalogItems(catalogItems);
                    renderCatalog();
                    showToast('Kartu berhasil dihapus.');
                }
            });

            listWrap.appendChild(row);
        });
    }

    function openQuickImageModal(item) {
        if (!isSuperUser()) {
            openLoginModal();
            return;
        }
        const modal = document.getElementById('catalogQuickImageModal');
        if (!modal || !item) return;

        activeQuickCardId = item.id;
        quickUploadBase64 = '';

        const titleEl = document.getElementById('quickImgModalTitle');
        const previewEl = document.getElementById('quickImgPreview');
        const urlInput = document.getElementById('quickImgUrlInput');
        const fileInput = document.getElementById('quickImgFileInput');

        if (titleEl) titleEl.textContent = `Ganti Gambar: ${item.title}`;
        if (urlInput) urlInput.value = item.image && !item.image.startsWith('data:') ? item.image : '';
        if (fileInput) fileInput.value = '';

        const safeImg = item.image && item.image.trim() !== '' ? item.image.trim() : FALLBACK_SVG;
        if (previewEl) {
            previewEl.dataset.fallbackApplied = '';
            previewEl.src = safeImg;
            previewEl.onerror = () => {
                if (previewEl.dataset.fallbackApplied === '1') return;
                previewEl.dataset.fallbackApplied = '1';
                previewEl.src = FALLBACK_SVG;
            };
        }

        modal.hidden = false;
        document.body.classList.add('catalog-modal-open');
    }

    // ==========================================
    // 8. INISIALISASI SAAT DOM READY
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        renderCatalog();
        setupCarouselControls();
        setupAdminPanel();
        setupSuperUserAccess();
    });
})();

(() => {
    'use strict';

    const FALLBACK_IMG =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
            <rect width="600" height="400" fill="#E8F5E9"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                  font-family="sans-serif" font-size="22" font-weight="700" fill="#24933F">
                Amanmart
            </text>
        </svg>`);

    // Data Slide Banner Utama
    const HERO_SLIDES = [
        {
            title: 'BELANJA HEMAT<br>DI AMANMART!',
            subtitle: 'Diskon harian untuk kebutuhan pokok & produk segar pilihan.',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=750&q=80',
            badge: 'Promo Utama',
            products: ['Beras Premium 5kg', 'Minyak Goreng 2L', 'Sayur Segar', 'Paket Sembako']
        },
        {
            title: 'FRESH MARKET<br>PANEN SETIAP PAGI!',
            subtitle: 'Sayuran hijau, buah lokal & impor langsung segar setiap hari.',
            image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=750&q=80',
            badge: 'Fresh Promo',
            products: ['Apel Fuji', 'Jeruk Sunkist', 'Brokoli Segar', 'Wortel Organik']
        },
        {
            title: 'PESTA SNACK &<br>MINUMAN SERU!',
            subtitle: 'Beli 2 lebih hemat untuk berbagai keripik & camilan favorit.',
            image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=750&q=80',
            badge: 'Snack Fair',
            products: ['Keripik Kentang', 'Biskuit Cokelat', 'Mie Instan', 'Minuman Dingin']
        },
        {
            title: 'BERSIH HEMAT<br>KEBUTUHAN RUMAH!',
            subtitle: 'Potongan spesial deterjen, sabun cair & perlengkapan rumah tangga.',
            image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=750&q=80',
            badge: 'Household Deal',
            products: ['Deterjen Cair', 'Sabun Mandi', 'Tisu Dapur', 'Pembersih Lantai']
        }
    ];

    // Data Detail Kategori Unggulan
    const CATEGORY_DATA = {
        food: {
            title: 'Food — Makanan & Bahan Pokok',
            badge: 'Kategori Food',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=750&q=80',
            description: 'Ketersediaan lengkap beras pilihan, minyak goreng, gula pasir, tepung, mie instan, bumbu dapur, hingga makanan siap masak untuk stok harian keluarga Anda.',
            products: ['Beras Pulen 5kg', 'Minyak Goreng', 'Mie Instan Aneka Rasa', 'Bumbu Dapur & Saus', 'Sarden & Makanan Kaleng']
        },
        fresh: {
            title: 'Fresh — Bahan Segar Pilihan',
            badge: 'Kategori Fresh',
            image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=750&q=80',
            description: 'Produk segar yang dikurasi setiap pagi: sayuran hijau, buah-buahan segar, telur ayam omega, daging ayam segar, serta produk olahan dingin.',
            products: ['Sayur Mayur Segar', 'Buah Potong & Utuh', 'Telur Ayam Negeri', 'Daging Ayam Segar', 'Susu & Yogurt']
        },
        snack: {
            title: 'Snack — Camilan & Makanan Ringan',
            badge: 'Kategori Snack',
            image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=750&q=80',
            description: 'Beragam pilihan keripik kentang, biskuit renyah, wafer, cokelat, kacang-kacangan, dan minuman ringan penyegar suasana.',
            products: ['Keripik Kentang & Singkong', 'Biskuit & Wafer', 'Cokelat & Permen', 'Kacang Panggang', 'Minuman Kemasan']
        },
        household: {
            title: 'Household — Kebutuhan Rumah Tangga',
            badge: 'Kategori Household',
            image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=750&q=80',
            description: 'Solusi lengkap kebersihan rumah dan perawatan diri mulai dari deterjen pakaian, pewangi, sabun cuci piring, tisu, hingga perlengkapan mandi.',
            products: ['Deterjen & Softener', 'Sabun Cuci Piring', 'Pembersih Lantai & Kaca', 'Tisu Wajah & Toilet', 'Sabun & Sampo']
        }
    };

    let currentSlide = 0;
    let slideInterval = null;

    // 1. Hero Banner Slider
    function initHeroSlider() {
        const titleEl = document.getElementById('promoTitle');
        const subEl = document.getElementById('promoSubtitle');
        const imgEl = document.getElementById('promoImg');
        const dots = document.querySelectorAll('.b-dot');
        const heroBtn = document.getElementById('heroPromoBtn');

        if (!titleEl || !imgEl) return;

        imgEl.addEventListener('error', () => {
            imgEl.src = FALLBACK_IMG;
        });

        function goToSlide(idx) {
            const slide = HERO_SLIDES[idx];
            if (!slide) return;
            currentSlide = idx;

            titleEl.innerHTML = slide.title;
            if (subEl) subEl.textContent = slide.subtitle;
            imgEl.src = slide.image;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === idx);
            });
        }

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const idx = Number(dot.dataset.slide || 0);
                goToSlide(idx);
                restartAutoSlide();
            });
        });

        function restartAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                const next = (currentSlide + 1) % HERO_SLIDES.length;
                goToSlide(next);
            }, 5000);
        }

        restartAutoSlide();
    }

    // 2. Real-Time Countdown Timer (Default: 1 Hari 15 Jam 30 Menit)
    function initCountdown() {
        const daysEl = document.getElementById('cdDays');
        const hoursEl = document.getElementById('cdHours');
        const minsEl = document.getElementById('cdMinutes');
        const claimBtn = document.getElementById('claimPromoBtn');

        if (!daysEl || !hoursEl || !minsEl) return;

        let totalSeconds = (1 * 86400) + (15 * 3600) + (30 * 60);

        function renderClock() {
            const d = Math.floor(totalSeconds / 86400);
            const h = Math.floor((totalSeconds % 86400) / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);

            daysEl.textContent = String(d);
            hoursEl.textContent = String(h).padStart(2, '0');
            minsEl.textContent = String(m).padStart(2, '0');
        }

        renderClock();
        setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds -= 1;
                renderClock();
            }
        }, 1000);

    }

    // 3. Interaksi Kartu Kategori & Modal
    function initCategoryCards() {
        document.querySelectorAll('.cat-card').forEach((card) => {
            const img = card.querySelector('img');
            if (img) {
                img.addEventListener('error', () => {
                    img.src = FALLBACK_IMG;
                });
            }

            const openHandler = () => {
                const key = card.dataset.category;
                const data = CATEGORY_DATA[key];
                if (data) openModal(data);
            };

            card.addEventListener('click', openHandler);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openHandler();
                }
            });
        });
    }

    function openModal(item) {
        const modal = document.getElementById('infoModal');
        if (!modal || !item) return;

        const modalImg = document.getElementById('modalImg');
        const modalBadge = document.getElementById('modalBadge');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalProducts = document.getElementById('modalProducts');
        const modalWaLink = document.getElementById('modalWaLink');

        modalImg.src = item.image || FALLBACK_IMG;
        modalImg.onerror = () => {
            modalImg.src = FALLBACK_IMG;
        };

        modalBadge.textContent = item.badge || 'Amanmart';
        modalTitle.textContent = item.title || '';
        modalDesc.textContent = item.description || '';

        modalProducts.innerHTML = '';
        (item.products || []).forEach((prod) => {
            const tag = document.createElement('span');
            tag.textContent = prod;
            modalProducts.appendChild(tag);
        });

        const waNumber = document.body.dataset.wa || '628122535888';
        const message = encodeURIComponent(`Halo Amanmart, saya ingin info lebih lanjut mengenai "${item.title}".`);
        modalWaLink.href = `https://wa.me/${waNumber}?text=${message}`;

        modal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('infoModal');
        if (modal) modal.hidden = true;
        document.body.style.overflow = '';
    }

    function initModalEvents() {
        const modal = document.getElementById('infoModal');
        const closeBtn = document.getElementById('closeModalBtn');

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initHeroSlider();
        initCountdown();
        initCategoryCards();
        initModalEvents();
    });
})();

(() => {
    'use strict';

    const FALLBACK_SVG =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
            <rect width="600" height="400" fill="#E6F4EA"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                  font-family="sans-serif" font-size="22" font-weight="700" fill="#24933F">
                Promo Amanmart
            </text>
        </svg>`);

    // 1. Real-time Countdown Timer (09 Hari : 14 Jam : 45 Menit)
    function initPromoCountdown() {
        const daysEl = document.getElementById('timerDays');
        const hoursEl = document.getElementById('timerHours');
        const minsEl = document.getElementById('timerMinutes');

        if (!daysEl || !hoursEl || !minsEl) return;

        let remainingSeconds = (9 * 86400) + (14 * 3600) + (45 * 60);

        function updateDisplay() {
            const d = Math.floor(remainingSeconds / 86400);
            const h = Math.floor((remainingSeconds % 86400) / 3600);
            const m = Math.floor((remainingSeconds % 3600) / 60);

            daysEl.textContent = String(d).padStart(2, '0');
            hoursEl.textContent = String(h).padStart(2, '0');
            minsEl.textContent = String(m).padStart(2, '0');
        }

        updateDisplay();
        setInterval(() => {
            if (remainingSeconds > 0) {
                remainingSeconds -= 1;
                updateDisplay();
            }
        }, 1000);
    }

    // 2. Lightbox Zoom Poster Flyer
    function initFlyerLightbox() {
        const flyerCard = document.getElementById('flyerCard');
        const lightbox = document.getElementById('flyerLightbox');
        const closeBtn = document.getElementById('closeLightboxBtn');

        if (!flyerCard || !lightbox) return;

        const openLightbox = () => {
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        flyerCard.addEventListener('click', openLightbox);
        flyerCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox();
            }
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // 3. Fallback Error Handling untuk Semua Gambar
    function initImageSafety() {
        document.querySelectorAll('img').forEach((img) => {
            img.addEventListener('error', () => {
                if (img.src !== FALLBACK_SVG) {
                    img.src = FALLBACK_SVG;
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initPromoCountdown();
        initFlyerLightbox();
        initImageSafety();
    });
})();