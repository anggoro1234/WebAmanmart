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
<body>

    <!-- Area Hero Image -->
    <section class="hero">
    
        <div class="overlay"></div>
        <div class="content">
            
            <!-- Navbar -->
            <nav class="navbar">
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
                    <li><a href="#">Katalog</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Article</a></li>
                    <li><a href="#" class="btn-contact">Contact Us!</a></li>
                </ul>
            </nav>

            <!-- Teks Tengah -->
            <div class="hero-text">
                <h1>AMANMART</h1>
                <p>Loremimsuo</p>
                <a href="#" class="btn-cta">SELANJUTNYA</a>
            </div>

        </div>
    </section>
    <script>
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    </script>
</body>
</html>