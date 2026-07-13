// ===== 1. SERVICE TABS LOGIC =====
document.querySelectorAll('.service-tabs .tab').forEach(btn => {
    btn.addEventListener('click',()=>{
        btn.parentElement.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.service-panel').forEach(panel=>{
            panel.classList.toggle('active', panel.dataset.service === btn.textContent.toLowerCase().split(' ')[0]);
        });
    });
});

// ====== LOGIKA SMART HEADER (REVEAL ON SCROLL UP) ======
let lastScrollTop = 0;
const headerMain = document.querySelector('.header-main');

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // 1. Kondisi jika halaman baru dibuka / di paling atas (Scroll = 0)
    if (currentScroll <= 0) {
        headerMain.classList.remove('scroll-down', 'scroll-up');
        return;
    }

    // 2. Deteksi arah scroll
    if (currentScroll > lastScrollTop) {
        // Jika scroll ke bawah, tambahkan class sembunyi
        headerMain.classList.remove('scroll-up');
        headerMain.classList.add('scroll-down');
    } else {
        // Jika scroll ke atas, tambahkan class muncul
        headerMain.classList.remove('scroll-down');
        headerMain.classList.add('scroll-up');
    }

    // Rekam posisi scroll saat ini untuk perbandingan berikutnya
    lastScrollTop = currentScroll;
});

// ===== 2. PROJECT FILTER LOGIC =====
document.querySelectorAll('.filter-row .tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
        btn.parentElement.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ===== 3. CLIENT CAROUSEL LOGIC (WITH AUTOMATIC SCROLL / AUTOPLAY) =====
(function(){
  const track = document.getElementById('clientTrack');
  const dots = document.querySelectorAll('#clientDots span');
  const prevBtn = document.getElementById('clientPrev');
  const nextBtn = document.getElementById('clientNext');
  const container = document.querySelector('.client-carousel'); // Ambil kontainer luar untuk deteksi mouse
  
  if(!track || !dots.length) return; 

  const totalPages = dots.length;
  let page = 0;
  let autoplayTimer = null; // Tempat menyimpan interval pencacah waktu

  function render(){
    track.style.transform = 'translateX(-' + (page * (100/totalPages)) + '%)';
    dots.forEach((d,i)=> d.classList.toggle('active', i===page));
  }

  // Fungsi untuk berpindah ke halaman berikutnya
  function nextPage() {
    page = (page + 1) % totalPages;
    render();
  }

  // Fungsi untuk memulai autoplay
  function startAutoplay() {
    // 3000 artinya carousel akan bergeser otomatis setiap 3 detik (3000ms)
    autoplayTimer = setInterval(nextPage, 1500); 
  }

  // Fungsi untuk menghentikan autoplay sementara
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
  }

  // Navigasi Manual (Tombol Panah & Dots)
  prevBtn.addEventListener('click', ()=>{ 
    page = (page - 1 + totalPages) % totalPages; 
    render(); 
  });
  
  nextBtn.addEventListener('click', ()=>{ 
    nextPage(); 
  });
  
  dots.forEach((d,i)=> d.addEventListener('click', ()=>{ 
    page = i; 
    render(); 
  }));

  // === FITUR UX PINTAR ===
  // Hentikan gerak otomatis saat mouse masuk ke area logo, dan jalankan lagi saat mouse keluar
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  // Jalankan render awal dan mulai jalankan autoplay pertama kali
  render();
  startAutoplay();
})();

// ===== 4. EFEK PARALLAX HERO SECTION (YANG BARU & MULUS) ======
const hero = document.querySelector('.hero');
const services = document.querySelector('.services');

window.addEventListener('scroll', () => {
    // Ambil posisi scroll aktual dan tinggi layar monitor
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // 1. Parallax untuk Hero Section (Hanya jalan saat halaman di bagian paling atas)
    if (hero && scrollPos < windowHeight) {
        const heroSpeed = scrollPos * 0.5; // Atur kecepatan gerak (0.3)
        hero.style.setProperty('--hero-parallax', `${heroSpeed}px`);
    }
    
    // 2. Parallax untuk Services Section (Akurat mendeteksi kemunculan elemen)
    if (services) {
        const servicesRect = services.getBoundingClientRect();
        
        // Efek hanya aktif saat kotak Services sudah mulai mengintip masuk ke dalam layar
        if (servicesRect.top < windowHeight && servicesRect.bottom > 0) {
            
            // Hitung jarak pergeseran berdasarkan posisi relatif kotak dari atas viewport
            const servicesSpeed = (windowHeight - servicesRect.top) * 0.5; 
            
            // Kirim nilai posisi dinamis ke variabel CSS milik .services
            services.style.setProperty('--services-parallax', `${servicesSpeed}px`);
        }
    }
    
});

// ===== 5. EMAILJS CONTACT FORM LOGIC =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah halaman reload saat disubmit
        
        // Ubah teks tombol saat loading mengirim pesan
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Kirim data ke EmailJS
        // Ganti 'YOUR_SERVICE_ID' dan 'YOUR_TEMPLATE_ID' sesuai akun EmailJS-mu
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            .then(() => {
                alert('Pesan Anda berhasil dikirim langsung ke email perusahaan!');
                contactForm.reset(); // Kosongkan form kembali
            }, (error) => {
                alert('Gagal mengirim pesan, silakan coba lagi nanti: ' + JSON.stringify(error));
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

