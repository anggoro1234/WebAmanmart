<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Konfigurasi Kredensial Super User (Dapat diubah sesuai kebutuhan)
define('SUPERUSER_USERNAME', 'admin');
define('SUPERUSER_PASS_PLAIN', 'amanmart123');

// Endpoint AJAX untuk Login & Logout Super User
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action'])) {
    header('Content-Type: application/json; charset=utf-8');
    $action = (string)$_GET['action'];

    if ($action === 'admin_login') {
        $rawInput = file_get_contents('php://input');
        $data = is_string($rawInput) ? json_decode($rawInput, true) : null;
        $username = isset($data['username']) ? trim((string)$data['username']) : '';
        $password = isset($data['password']) ? (string)$data['password'] : '';

        if ($username === SUPERUSER_USERNAME && hash_equals(SUPERUSER_PASS_PLAIN, $password)) {
            $_SESSION['amanmart_is_superuser'] = true;
            echo json_encode([
                'success' => true,
                'message' => 'Selamat datang, Super User! Mode Admin Katalog aktif.'
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Username atau password Super User tidak valid.'
            ]);
        }
        exit;
    }

    if ($action === 'admin_logout') {
        unset($_SESSION['amanmart_is_superuser']);
        echo json_encode([
            'success' => true,
            'message' => 'Berhasil keluar dari Mode Super User.'
        ]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Aksi tidak dikenali.']);
    exit;
}

$isSuperUser = !empty($_SESSION['amanmart_is_superuser']);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amanmart - Halal Terjangkau</title>

    <!-- Import Font Nunito Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800;6..12,900&display=swap" rel="stylesheet">

    <!-- Import CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-superuser="<?= $isSuperUser ? 'true' : 'false' ?>">

    <!-- Sticky/Fixed Navbar (Mengikuti Saat Scroll) -->
    <nav class="navbar" id="mainNavbar">
        <a href="#" class="logo">
            <img src="assets/images/bg-toko.png" alt="Amanmart Logo">
        </a>

        <!-- Tombol Hamburger untuk versi HP -->
        <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <!-- Link Menu -->
        <ul class="nav-links" id="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#katalog">Katalog</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Article</a></li>
            <li><a href="https://wa.me/628122535888" target="_blank" rel="noopener noreferrer" class="btn-contact">Contact Us!</a></li>
        </ul>
    </nav>

    <!-- Area Hero Image (Section 1) -->
    <section class="hero" id="home">
        <div class="overlay"></div>
        <div class="content">
            <!-- Teks Tengah -->
            <div class="hero-text">
                <h1>AMANMART</h1>
                <p>Loremimsuo</p>
                <a href="#katalog" class="btn-cta">SELANJUTNYA</a>
            </div>
        </div>
    </section>

    <!-- ==================================================== -->
    <!-- SECTION 2: EXPLORE KATALOG KAMI (Reference Design)   -->
    <!-- ==================================================== -->
    <section id="katalog" class="catalog-section" aria-label="Explore Katalog Kami">
        <div class="catalog-container">
            <!-- Section Header -->
            <div class="catalog-header">
                <span class="catalog-kicker" id="catalogSecretTrigger">Katalog kami</span>
                <h2 class="catalog-title">EXPLORE KATALOG KAMI</h2>
                <p class="catalog-subtitle">
                    Temukan produk-produk segar berkualitas, kebutuhan harian terlengkap, dan penawaran spesial langsung dari toko kami.
                </p>
            </div>

            <!-- Carousel Area (Infinite Loop & Dead-Centered) -->
            <div class="catalog-carousel-wrapper">
                <!-- Tombol Panah Kiri -->
                <button type="button" class="catalog-nav-arrow prev" id="catalogPrevBtn" aria-label="Geser ke kiri">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <!-- Viewport untuk kliping horizontal simetris -->
                <div class="catalog-viewport" id="catalogViewport">
                    <!-- Cards Track (Transform-based Infinite Carousel) -->
                    <div class="catalog-track" id="catalogTrack" role="region" aria-label="Daftar Kartu Produk">
                        <!-- Kartu produk di-generate dinamis dari localStorage -->
                    </div>
                </div>

                <!-- Tombol Panah Kanan -->
                <button type="button" class="catalog-nav-arrow next" id="catalogNextBtn" aria-label="Geser ke kanan">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            <!-- Pagination Dots Indicator -->
            <div class="catalog-dots" id="catalogDots" aria-label="Indikator slide katalog"></div>

            <!-- Bottom Main CTA Button -->
            <div class="catalog-cta-wrap">
                <button type="button" class="catalog-btn-cta" id="catalogMainCtaBtn">
                    Selengkapnya!
                </button>
            </div>
        </div>
    </section>

    <!-- Floating Admin Toolbar (TERSEMBUNYI dari publik, hanya tampil jika Super User login) -->
    <div id="superUserFloatingBar" class="superuser-floating-bar" <?= $isSuperUser ? '' : 'hidden' ?>>
        <button type="button" id="openAdminPanelBtn" class="floating-admin-btn" title="Buka Admin Panel Katalog (Super User)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Admin Katalog</span>
        </button>
        <button type="button" id="logoutSuperUserBtn" class="floating-logout-btn" title="Keluar dari Mode Super User">
            Keluar
        </button>
    </div>

    <!-- Modal Login Super User (Tersembunyi dari publik, diakses via ?admin=1 atau Ctrl+Shift+A) -->
    <div id="catalogLoginModal" class="catalog-modal-backdrop" hidden>
        <div class="catalog-modal-card login-size">
            <div class="admin-modal-head">
                <div>
                    <h3 class="admin-modal-title">Login Super User</h3>
                    <p class="admin-modal-sub">Khusus pengelola resmi Amanmart untuk mengubah katalog.</p>
                </div>
                <button type="button" class="catalog-modal-close" id="closeLoginModalBtn" aria-label="Tutup Login">&times;</button>
            </div>
            <div class="admin-modal-body">
                <form id="superUserLoginForm" class="admin-form" novalidate>
                    <div class="admin-form-group">
                        <label for="suUsername">Username Super User</label>
                        <input type="text" id="suUsername" placeholder="Masukkan username" autocomplete="username" required>
                    </div>
                    <div class="admin-form-group">
                        <label for="suPassword">Password</label>
                        <input type="password" id="suPassword" placeholder="Masukkan password" autocomplete="current-password" required>
                    </div>
                    <div class="admin-form-buttons">
                        <button type="submit" class="admin-btn-save" id="suLoginSubmitBtn">Masuk Mode Admin</button>
                        <button type="button" class="admin-btn-cancel" id="suLoginCancelBtn">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Detail Modal (Interactive Card Viewer - Untuk Publik) -->
    <div id="catalogDetailModal" class="catalog-modal-backdrop" hidden>
        <div class="catalog-modal-card">
            <button type="button" class="catalog-modal-close" id="closeDetailModalBtn" aria-label="Tutup Detail">&times;</button>
            <div class="modal-card-media">
                <img id="detailModalImage" src="" alt="Detail Produk">
                <span class="modal-badge-avail">Tersedia di Toko</span>
            </div>
            <div class="modal-card-content">
                <span class="modal-category-label">KATALOG AMANMART</span>
                <h3 class="modal-product-title" id="detailModalTitle">Judul Produk</h3>
                <p class="modal-product-desc" id="detailModalDesc">Deskripsi detail produk...</p>
                <div class="modal-chips-container" id="detailModalChips"></div>
                <div class="modal-actions-row">
                    <a id="detailModalWaLink" href="https://wa.me/628122535888" target="_blank" rel="noopener noreferrer" class="btn-modal-wa">
                        Pesan / Tanya Stok via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Local Admin Modal (Hanya dapat dibuka oleh Super User) -->
    <div id="catalogAdminModal" class="catalog-modal-backdrop" hidden>
        <div class="catalog-modal-card admin-size">
            <div class="admin-modal-head">
                <div>
                    <h3 class="admin-modal-title">Admin Panel Katalog (Super User)</h3>
                    <p class="admin-modal-sub">Kelola kartu &amp; gambar katalog Amanmart.</p>
                </div>
                <button type="button" class="catalog-modal-close" id="closeAdminModalBtn" aria-label="Tutup Panel Admin">&times;</button>
            </div>
            <div class="admin-modal-body">
                <form id="catalogAdminForm" class="admin-form" novalidate>
                    <input type="hidden" id="adminFormItemId">
                    <div class="admin-form-row">
                        <div class="admin-form-group">
                            <label for="adminFormTitle">Judul Kategori / Produk *</label>
                            <input type="text" id="adminFormTitle" placeholder="Contoh: Bahan Makanan & Produk Segar" required>
                        </div>
                        <div class="admin-form-group">
                            <label for="adminFormFeatured">Posisi Awal (Default Center)</label>
                            <select id="adminFormFeatured">
                                <option value="false">Normal</option>
                                <option value="true">Kartu Utama Awal</option>
                            </select>
                        </div>
                    </div>

                    <div class="admin-form-row">
                        <div class="admin-form-group">
                            <label for="adminFormImageUrl">URL / Path Gambar</label>
                            <input type="text" id="adminFormImageUrl" placeholder="https://... atau assets/images/foto.png">
                        </div>
                        <div class="admin-form-group">
                            <label for="adminFormImageFile">Atau Upload Foto dari Perangkat</label>
                            <input type="file" id="adminFormImageFile" accept="image/*">
                        </div>
                    </div>

                    <div class="form-img-preview-container">
                        <div class="form-img-preview-thumb">
                            <img id="formLivePreviewImg" src="" alt="Pratinjau Gambar">
                        </div>
                        <div class="form-img-preview-meta">
                            <strong>Pratinjau Gambar Kartu</strong>
                            <small>Pilih file foto atau ketik URL/path gambar untuk melihat perubahan langsung.</small>
                        </div>
                    </div>

                    <div class="admin-form-group">
                        <label for="adminFormDesc">Deskripsi Produk *</label>
                        <textarea id="adminFormDesc" rows="3" placeholder="Tuliskan deskripsi lengkap produk..." required></textarea>
                    </div>

                    <div class="admin-form-group">
                        <label for="adminFormTags">Daftar Item / Contoh Produk (Pisahkan dengan koma)</label>
                        <input type="text" id="adminFormTags" placeholder="Sayur Segar, Buah Pilihan, Beras Premium, Minyak Goreng">
                    </div>

                    <div class="admin-form-buttons">
                        <button type="submit" class="admin-btn-save" id="adminSubmitBtn">Simpan Kartu</button>
                        <button type="button" class="admin-btn-cancel" id="adminResetBtn">Reset Form</button>
                        <button type="button" class="admin-btn-reset-default" id="adminRestoreDefaultBtn">Kembalikan Data Default</button>
                    </div>
                </form>

                <hr class="admin-hr">

                <div class="admin-list-section">
                    <h4>Daftar Kartu Aktif (Klik "Ganti Gambar" untuk ubah foto)</h4>
                    <div class="admin-items-list" id="adminActiveItemsList"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Ganti Gambar Cepat (Quick Image Updater - Khusus Super User) -->
    <div id="catalogQuickImageModal" class="catalog-modal-backdrop" hidden>
        <div class="catalog-modal-card quick-img-size">
            <div class="admin-modal-head">
                <div>
                    <h3 class="admin-modal-title" id="quickImgModalTitle">Ganti Gambar Kartu</h3>
                    <p class="admin-modal-sub">Pilih foto dari laptop/HP atau masukkan URL/path gambar baru.</p>
                </div>
                <button type="button" class="catalog-modal-close" id="closeQuickImgModalBtn" aria-label="Tutup">&times;</button>
            </div>
            <div class="admin-modal-body">
                <input type="hidden" id="quickImgCardId">

                <!-- Pratinjau Gambar Interaktif -->
                <div class="quick-img-preview-box">
                    <img id="quickImgPreview" src="" alt="Pratinjau Gambar">
                    <span id="quickImgPreviewBadge" class="preview-badge">Pratinjau Gambar</span>
                </div>

                <!-- Input Pilihan Upload atau URL -->
                <div class="quick-img-inputs">
                    <div class="admin-form-group">
                        <label for="quickImgFileInput">Upload Berkas Foto dari Laptop/HP</label>
                        <input type="file" id="quickImgFileInput" accept="image/*">
                        <small class="admin-help-text">Format JPG, PNG, WebP (Otomatis dikompresi agar aman &amp; cepat)</small>
                    </div>

                    <div class="quick-img-divider"><span>ATAU</span></div>

                    <div class="admin-form-group">
                        <label for="quickImgUrlInput">Gunakan URL Online / Path Lokal</label>
                        <input type="text" id="quickImgUrlInput" placeholder="https://... atau assets/images/foto.png">
                    </div>
                </div>

                <div class="admin-form-buttons">
                    <button type="button" class="admin-btn-save" id="quickImgSaveBtn">Terapkan Gambar Baru</button>
                    <button type="button" class="admin-btn-cancel" id="quickImgCancelBtn">Batal</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification Container -->
    <div id="catalogToastContainer" class="catalog-toast-container" aria-live="polite"></div>

    <main class="main-wrapper">
        <div class="container">

            <!-- Section 1: Asymmetric Hero Banner + Flash Promo Countdown -->
            <section class="hero-promo-grid" aria-label="Promo Utama">
                <!-- Left Banner Slider -->
                <div class="promo-banner-card" id="promoBanner">
                    <div class="promo-slide-content">
                        <h1 class="promo-headline" id="promoTitle">BELANJA HEMAT<br>DI AMANMART!</h1>
                        <p class="promo-subtext" id="promoSubtitle">Diskon harian untuk kebutuhan pokok & produk segar pilihan.</p>
                        <a href="promo-kategori.php" class="btn-white-pill" id="heroPromoBtn">Lihat Promo!</a>
                    </div>

                    <div class="promo-visual">
                        <img id="promoImg" src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=750&q=80" alt="Belanja Hemat Amanmart">
                    </div>

                    <!-- Slider Dots -->
                    <div class="banner-dots" id="bannerDots" role="tablist" aria-label="Slide Promo">
                        <button type="button" class="b-dot active" data-slide="0" aria-label="Slide 1"></button>
                        <button type="button" class="b-dot" data-slide="1" aria-label="Slide 2"></button>
                        <button type="button" class="b-dot" data-slide="2" aria-label="Slide 3"></button>
                        <button type="button" class="b-dot" data-slide="3" aria-label="Slide 4"></button>
                    </div>
                </div>

                <!-- Right Dark Countdown Card -->
                <aside class="countdown-card" aria-label="Hitung Mundur Promo">
                    <h2 class="cd-title">AMBIL PROMO NYA!!!</h2>

                    <div class="cd-timer-row" id="countdownTimer">
                        <div class="cd-unit">
                            <div class="cd-box" id="cdDays">1</div>
                            <span class="cd-label">Hari</span>
                        </div>
                        <span class="cd-colon">:</span>
                        <div class="cd-unit">
                            <div class="cd-box" id="cdHours">15</div>
                            <span class="cd-label">Jam</span>
                        </div>
                        <span class="cd-colon">:</span>
                        <div class="cd-unit">
                            <div class="cd-box" id="cdMinutes">30</div>
                            <span class="cd-label">Menit</span>
                        </div>
                    </div>

                    <p class="cd-subtitle">DAPATKAN DISKONYA!!</p>

                    <a href="promo-kategori.php" class="btn-orange-pill" id="claimPromoBtn">COBA SEKARANG</a>
                </aside>
            </section>

            <!-- Section 2: Kategori Unggulan -->
            <section id="katalog" class="categories-section">
                <div class="categories-header">
                    <h2>KATEGORI UNGGULAN</h2>
                    <p>Belanja harian lebih mudah, segar, dan hemat!</p>
                </div>

                <div class="categories-grid" id="categoriesGrid">
                    <!-- Food -->
                    <article class="cat-card" data-category="food" tabindex="0" role="button">
                        <div class="cat-top theme-green">
                            <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80" alt="Food - Makanan & Bahan Pokok">
                        </div>
                        <div class="cat-bottom">
                            <h3>Food</h3>
                            <p>Makanan &amp; Bahan Pokok</p>
                            <span class="btn-lihat">Lihat &rarr;</span>
                        </div>
                    </article>

                    <!-- Fresh -->
                    <article class="cat-card" data-category="fresh" tabindex="0" role="button">
                        <div class="cat-top theme-emerald">
                            <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80" alt="Fresh - Bahan Segar Pilihan">
                        </div>
                        <div class="cat-bottom">
                            <h3>Fresh</h3>
                            <p>Bahan Segar Pilihan</p>
                            <span class="btn-lihat">Lihat &rarr;</span>
                        </div>
                    </article>

                    <!-- Snack -->
                    <article class="cat-card" data-category="snack" tabindex="0" role="button">
                        <div class="cat-top theme-orange">
                            <img src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80" alt="Snack - Camilan & Makanan Ringan">
                        </div>
                        <div class="cat-bottom">
                            <h3>Snack</h3>
                            <p>Camilan &amp; Makanan Ringan</p>
                            <span class="btn-lihat">Lihat &rarr;</span>
                        </div>
                    </article>

                    <!-- Household -->
                    <article class="cat-card" data-category="household" tabindex="0" role="button">
                        <div class="cat-top theme-teal">
                            <img src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80" alt="Household - Kebutuhan Rumah Tangga">
                        </div>
                        <div class="cat-bottom">
                            <h3>Household</h3>
                            <p>Kebutuhan Rumah Tangga</p>
                            <span class="btn-lihat">Lihat &rarr;</span>
                        </div>
                    </article>
                </div>
            </section>

        </div>
    </main>

    <!-- Modal Detail Kategori / Promo -->
    <div id="infoModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
        <div class="modal-box">
            <button type="button" class="modal-close" id="closeModalBtn" aria-label="Tutup">&times;</button>
            <div class="modal-banner">
                <img id="modalImg" src="" alt="Preview Kategori">
                <span class="modal-pill-badge" id="modalBadge">Promo Aktif</span>
            </div>
            <div class="modal-content">
                <h3 id="modalTitle">Judul Kategori</h3>
                <p id="modalDesc">Deskripsi lengkap kategori.</p>
                <div class="modal-products" id="modalProducts"></div>
                <a id="modalWaLink" href="#" target="_blank" rel="noopener" class="btn-modal-wa">
                    Tanya Stok &amp; Pesan via WhatsApp
                </a>
            </div>
        </div>
    </div>

    <script src="config/app.js"></script>

    <!-- Script Navbar Section 1 (Fixed Sticky Scroll + Mobile Drawer) -->
    <script>
        (() => {
            const navbar = document.getElementById('mainNavbar');
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('nav-links');

            if (hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                    hamburger.classList.toggle('active');
                });

                navLinks.querySelectorAll('a').forEach((link) => {
                    link.addEventListener('click', () => {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                    });
                });
            }

            if (navbar) {
                const handleNavbarScroll = () => {
                    if (window.scrollY > 40) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                };
                window.addEventListener('scroll', handleNavbarScroll, { passive: true });
                handleNavbarScroll();
            }
        })();
    </script>

    <!-- Script Section 2: Catalog Engine & Super User Admin Panel -->
    <script src="config/app.js"></script>
</body>
</html>
