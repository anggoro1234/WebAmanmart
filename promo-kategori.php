<?php
// Tangkap parameter kategori dari link halaman sebelumnya (contoh: ?kategori=fresh)
$kategori_param = isset($_GET['kategori']) ? strtolower(trim($_GET['kategori'])) : 'semua';

// Data dinamis per kategori (siap dihubungkan ke MySQL/Supabase di tahap berikutnya)
$promo_data = [
    'semua' => [
        'badge'       => 'PROMO BULAN BELANJA',
        'headline'    => 'BULAN BELANJA!',
        'subheadline' => 'Diskon hingga 50% untuk kebutuhan harian keluarga',
        'periode'     => 'Berlaku hingga 1-30',
        'cta_text'    => 'DAPATKAN DISKONYA!!',
        'target_link' => 'katalog-promo.php?kategori=semua',
        'flyer_img'   => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85',
        'banner_img'  => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=85',
        'items'       => [
            ['name' => 'Minyak Goreng 2L', 'price' => 'Rp 32.500', 'disc' => '-30%'],
            ['name' => 'Beras Premium 5kg', 'price' => 'Rp 64.900', 'disc' => '-25%'],
            ['name' => 'Mie Instan Paket 5', 'price' => 'Rp 13.500', 'disc' => '-20%'],
            ['name' => 'Buah & Sayur Segar', 'price' => 'Mulai Rp 8.000', 'disc' => 'UP TO 50%'],
        ]
    ],
    'food' => [
        'badge'       => 'PROMO KATEGORI FOOD',
        'headline'    => 'HEMAT SEMBAKO & FOOD!',
        'subheadline' => 'Stok bahan pokok & bumbu dapur lebih hemat sebulan penuh',
        'periode'     => 'Berlaku hingga 1-30',
        'cta_text'    => 'DAPATKAN DISKONYA!!',
        'target_link' => 'katalog-promo.php?kategori=food',
        'flyer_img'   => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85',
        'banner_img'  => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85',
        'items'       => [
            ['name' => 'Beras Pulen 5kg', 'price' => 'Rp 64.900', 'disc' => '-20%'],
            ['name' => 'Minyak Goreng Pouch', 'price' => 'Rp 32.500', 'disc' => '-30%'],
            ['name' => 'Gula Pasir 1kg', 'price' => 'Rp 16.500', 'disc' => '-15%'],
            ['name' => 'Sarden & Makanan Kaleng', 'price' => 'Rp 9.900', 'disc' => '-25%'],
        ]
    ],
    'fresh' => [
        'badge'       => 'PROMO KATEGORI FRESH',
        'headline'    => 'PANEN SEGAR SETIAP HARI!',
        'subheadline' => 'Sayuran hijau, buah segar & protein pilihan langsung dari supplier',
        'periode'     => 'Berlaku hingga 1-30',
        'cta_text'    => 'DAPATKAN DISKONYA!!',
        'target_link' => 'katalog-promo.php?kategori=fresh',
        'flyer_img'   => 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=85',
        'banner_img'  => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
        'items'       => [
            ['name' => 'Apel Fuji & Jeruk', 'price' => 'Rp 24.000/kg', 'disc' => '-30%'],
            ['name' => 'Paket Sayur Sop & Tumis', 'price' => 'Rp 11.500', 'disc' => '-25%'],
            ['name' => 'Telur Ayam Negeri 1kg', 'price' => 'Rp 26.800', 'disc' => '-15%'],
            ['name' => 'Dada Ayam Fillet 500g', 'price' => 'Rp 23.500', 'disc' => '-20%'],
        ]
    ],
    'snack' => [
        'badge'       => 'PROMO KATEGORI SNACK',
        'headline'    => 'PESTA CAMILAN SERU!',
        'subheadline' => 'Beli 2 lebih hemat untuk keripik, biskuit & minuman favorit',
        'periode'     => 'Berlaku hingga 1-30',
        'cta_text'    => 'DAPATKAN DISKONYA!!',
        'target_link' => 'katalog-promo.php?kategori=snack',
        'flyer_img'   => 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=900&q=85',
        'banner_img'  => 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=900&q=85',
        'items'       => [
            ['name' => 'Keripik Kentang Family', 'price' => 'Rp 14.900', 'disc' => '-35%'],
            ['name' => 'Biskuit Cokelat Kaleng', 'price' => 'Rp 28.000', 'disc' => '-25%'],
            ['name' => 'Wafer & Kue Kering', 'price' => 'Rp 10.500', 'disc' => '-20%'],
            ['name' => 'Minuman Teh & Jus 1L', 'price' => 'Rp 9.500', 'disc' => '-30%'],
        ]
    ],
    'household' => [
        'badge'       => 'PROMO HOUSEHOLD',
        'headline'    => 'RUMAH BERSIH HEMAT!',
        'subheadline' => 'Diskon perlengkapan cuci, pembersih lantai & kebutuhan harian',
        'periode'     => 'Berlaku hingga 1-30',
        'cta_text'    => 'DAPATKAN DISKONYA!!',
        'target_link' => 'katalog-promo.php?kategori=household',
        'flyer_img'   => 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85',
        'banner_img'  => 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=85',
        'items'       => [
            ['name' => 'Deterjen Cair 1.6L', 'price' => 'Rp 29.900', 'disc' => '-35%'],
            ['name' => 'Sabun Cuci Piring 750ml', 'price' => 'Rp 12.500', 'disc' => '-25%'],
            ['name' => 'Tisu Wajah Paket 3', 'price' => 'Rp 19.900', 'disc' => '-30%'],
            ['name' => 'Pembersih Lantai Karbol', 'price' => 'Rp 14.200', 'disc' => '-20%'],
        ]
    ]
];

$current_promo = $promo_data[$kategori_param] ?? $promo_data['semua'];
$wa_number     = "628122535888";
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amanmart - <?= htmlspecialchars($current_promo['badge']); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-wa="<?= htmlspecialchars($wa_number); ?>" data-kategori="<?= htmlspecialchars($kategori_param); ?>">

    <!-- Sticky/Fixed Navbar (Sama dengan halaman utama) -->
    <nav class="navbar navbar-light" id="mainNavbar">
        <a href="index.php#home" class="logo">
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
            <li><a href="index.php#home">Home</a></li>
            <li><a href="index.php#katalog">Katalog</a></li>
            <li><a href="index.php#about">About</a></li>
            <li><a href="index.php#article">Article</a></li>
            <li><a href="https://wa.me/628122535888" target="_blank" rel="noopener noreferrer" class="btn-contact">Contact Us!</a></li>
        </ul>
    </nav>

    <!-- Breadcrumb & Filter Quick Switcher antar Page -->
    <div class="sub-nav-bar">
        <div class="container sub-nav-inner">
            <a href="index.php#home" class="back-link">&larr; Kembali ke Promo</a>
            <div class="category-pills" role="navigation" aria-label="Pilih Promo Kategori">
                <a href="promo-kategori.php?kategori=semua" class="cat-pill <?= $kategori_param === 'semua' ? 'active' : ''; ?>">Semua Promo</a>
                <a href="promo-kategori.php?kategori=food" class="cat-pill <?= $kategori_param === 'food' ? 'active' : ''; ?>">Food</a>
                <a href="promo-kategori.php?kategori=fresh" class="cat-pill <?= $kategori_param === 'fresh' ? 'active' : ''; ?>">Fresh</a>
                <a href="promo-kategori.php?kategori=snack" class="cat-pill <?= $kategori_param === 'snack' ? 'active' : ''; ?>">Snack</a>
                <a href="promo-kategori.php?kategori=household" class="cat-pill <?= $kategori_param === 'household' ? 'active' : ''; ?>">Household</a>
            </div>
        </div>
    </div>

    <!-- Main Promo Section (Sesuai Wireframe & High-Fidelity) -->
    <main class="promo-page-main">
        <div class="container">
            <section class="promo-split-layout" aria-label="Detail Promo Kategori">

                <!-- KOLOM KIRI: Poster Flyer Promo Vertikal -->
                <div class="flyer-poster-card" id="flyerCard" role="button" tabindex="0" title="Klik untuk memperbesar flyer">
                    <div class="flyer-top-bar">
                        <span class="flyer-brand-mini">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Amanmart
                        </span>
                        <span class="flyer-period-tag"><?= htmlspecialchars($current_promo['periode']); ?></span>
                    </div>

                    <div class="flyer-hero-strip">
                        <div>
                            <span class="flyer-kicker"><?= htmlspecialchars($current_promo['badge']); ?></span>
                            <h2 class="flyer-big-title">PROMO HEBOH!</h2>
                        </div>
                        <div class="discount-burst">
                            <small>DISCOUNT UP TO</small>
                            <strong>50%</strong>
                        </div>
                    </div>

                    <!-- Preview Katalog Item di dalam Flyer -->
                    <div class="flyer-items-grid">
                        <?php foreach ($current_promo['items'] as $prod): ?>
                        <div class="flyer-mini-item">
                            <span class="mini-disc"><?= htmlspecialchars($prod['disc']); ?></span>
                            <div class="mini-item-name"><?= htmlspecialchars($prod['name']); ?></div>
                            <div class="mini-item-price"><?= htmlspecialchars($prod['price']); ?></div>
                        </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="flyer-photo-footer">
                        <img id="flyerPosterImg" src="<?= htmlspecialchars($current_promo['flyer_img']); ?>" alt="Poster Flyer Promo Amanmart">
                        <button type="button" class="btn-zoom-flyer" id="zoomFlyerBtn">
                            Perbesar Flyer &#128269;
                        </button>
                    </div>
                </div>

                <!-- KOLOM KANAN: Headline Banner + CTA + Countdown -->
                <div class="promo-right-column">

                    <!-- Gambar Flyer Headline Promo (Atas) -->
                    <div class="headline-banner-card">
                        <img id="headlineBannerImg" src="<?= htmlspecialchars($current_promo['banner_img']); ?>" alt="<?= htmlspecialchars($current_promo['headline']); ?>">
                        <div class="headline-banner-overlay">
                            <span class="banner-chip"><?= htmlspecialchars($current_promo['badge']); ?></span>
                            <h2 class="banner-headline-text"><?= htmlspecialchars($current_promo['headline']); ?></h2>
                            <p class="banner-sub-text"><?= htmlspecialchars($current_promo['subheadline']); ?></p>
                            <span class="banner-date-pill"><?= htmlspecialchars($current_promo['periode']); ?></span>
                        </div>
                    </div>

                    <!-- Area Ajakan & Countdown (Bawah) -->
                    <div class="promo-action-block">
                        <h1 class="ambil-promo-title">AMBIL PROMO NYA!!!</h1>
                        <p class="berlaku-text"><?= htmlspecialchars($current_promo['periode']); ?></p>

                        <!-- Link menuju halaman katalog produk promo -->
                        <a href="<?= htmlspecialchars($current_promo['target_link']); ?>" id="claimDiscountLink" class="btn-dapatkan-diskon">
                            <?= htmlspecialchars($current_promo['cta_text']); ?>
                        </a>

                        <!-- Countdown Timer: Hari : Jam : Menit -->
                        <div class="countdown-wrapper" aria-label="Sisa Waktu Promo">
                            <div class="time-group">
                                <div class="time-box" id="timerDays">09</div>
                                <span class="time-caption">Hari</span>
                            </div>
                            <span class="time-sep">:</span>
                            <div class="time-group">
                                <div class="time-box" id="timerHours">14</div>
                                <span class="time-caption">Jam</span>
                            </div>
                            <span class="time-sep">:</span>
                            <div class="time-group">
                                <div class="time-box" id="timerMinutes">45</div>
                                <span class="time-caption">Menit</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    </main>

    <!-- Lightbox Modal untuk Perbesar Flyer -->
    <div id="flyerLightbox" class="lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Tampilan Penuh Flyer Promo" hidden>
        <div class="lightbox-box">
            <button type="button" id="closeLightboxBtn" class="lightbox-close" aria-label="Tutup">&times;</button>
            <div class="lightbox-header">
                <h3><?= htmlspecialchars($current_promo['badge']); ?> — <?= htmlspecialchars($current_promo['periode']); ?></h3>
            </div>
            <div class="lightbox-content">
                <img id="lightboxImg" src="<?= htmlspecialchars($current_promo['flyer_img']); ?>" alt="Full Flyer Promo">
                <div class="lightbox-list">
                    <h4>Daftar Produk Promo Kategori Ini:</h4>
                    <ul>
                        <?php foreach ($current_promo['items'] as $prod): ?>
                        <li>
                            <span><?= htmlspecialchars($prod['name']); ?> (<strong><?= htmlspecialchars($prod['disc']); ?></strong>)</span>
                            <span class="lb-price"><?= htmlspecialchars($prod['price']); ?></span>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                    <a href="<?= htmlspecialchars($current_promo['target_link']); ?>" class="btn-dapatkan-diskon full">
                        Lihat Semua Produk Promo &rarr;
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script src="config/app.js"></script>
</body>
</html>