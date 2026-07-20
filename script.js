// ===== 1. SERVICE TABS LOGIC =====
const serviceTabs = document.querySelectorAll('.service-tabs .tab');
if (serviceTabs.length > 0) {
  serviceTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.service-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.service === btn.textContent.toLowerCase().split(' ')[0]);
      });
    });
  });
}

// ===== 2. PROJECT CAROUSEL (mengikuti pola client-carousel) =====
(function(){
  const source = document.getElementById('projectSource');
  const track = document.getElementById('projectTrack');
  const dotsWrap = document.getElementById('projectDots');
  const prevBtn = document.getElementById('projectPrev');
  const nextBtn = document.getElementById('projectNext');
  const carouselWrap = document.querySelector('.project-carousel');
  const filterTabs = document.querySelectorAll('.filter-row .tab');

  if (!source || !track || !dotsWrap) return;

  const allCards = Array.from(source.querySelectorAll('.project-card'));
  let currentFilter = 'all';
  let page = 0;
  let totalPages = 0;
  let isTransitioning = false;
  let autoplayTimer = null;

  function groupSize(){
    const w = window.innerWidth;
    if (w <= 576) return 1;
    if (w <= 960) return 2;
    return 4;
  }

  function getFiltered(){
    return currentFilter === 'all'
      ? allCards
      : allCards.filter(card => card.dataset.category === currentFilter);
  }

  function buildPages(){
    stopAutoplay();
    const size = groupSize();
    const cards = getFiltered();
    track.innerHTML = '';
    dotsWrap.innerHTML = '';

    if (cards.length === 0){
      totalPages = 0;
      render(false);
      return;
    }

    const groups = [];
    for (let i = 0; i < cards.length; i += size){
      groups.push(cards.slice(i, i + size));
    }
    totalPages = groups.length;

    groups.forEach(group => {
      const pageEl = document.createElement('div');
      pageEl.className = 'project-page';
      pageEl.style.setProperty('--project-cols', size);
      group.forEach(card => pageEl.appendChild(card.cloneNode(true)));
      track.appendChild(pageEl);
    });

    for (let i = 0; i < totalPages; i++){
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (isTransitioning || page === i) return;
        page = i;
        render(true);
      });
      dotsWrap.appendChild(dot);
    }

    page = 0;
    render(false);
    if (totalPages > 1) startAutoplay();
  }
  
    track.addEventListener('transitionend', () => {
    isTransitioning = false;
  });

  function render(withTransition){
    if (totalPages <= 0) return;
    track.style.transition = withTransition ? 'transform .6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
    isTransitioning = withTransition;
    track.style.transform = `translateX(-${page * 100}%)`;

    dotsWrap.querySelectorAll('span').forEach((dot, index) => {
      dot.classList.toggle('active', index === (page % totalPages));
    });
  }

  function nextPage(){
    if (isTransitioning || totalPages <= 1) return;
    page = (page + 1) % totalPages;
    render(true);
  }

  function prevPage(){
    if (isTransitioning || totalPages <= 1) return;
    page = (page - 1 + totalPages) % totalPages;
    render(true);
  }

  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(nextPage, 3500);
  }
  function stopAutoplay(){
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  if (prevBtn) prevBtn.addEventListener('click', prevPage);
  if (nextBtn) nextBtn.addEventListener('click', nextPage);
  if (carouselWrap){
    carouselWrap.addEventListener('mouseenter', stopAutoplay);
    carouselWrap.addEventListener('mouseleave', () => { if (totalPages > 1) startAutoplay(); });
  }

  if (filterTabs.length){
    filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';
        buildPages();
      });
    });
  }

  track.addEventListener('click', (event) => {
    const trigger = event.target.closest('.project-trigger');
    if (!trigger) return;
    const card = trigger.closest('.project-card');
    if (!card) return;

    const isOpen = card.classList.contains('is-open');
    track.querySelectorAll('.project-card').forEach(item => {
      item.classList.remove('is-open');
      const itemTrigger = item.querySelector('.project-trigger');
      if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      card.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildPages, 250);
  });

  buildPages();
})();

// ===== 3. CLIENT CAROUSEL LOGIC (WITH AUTOPLAY) - PERFECT LOOP =====
(function(){
  const track = document.getElementById('clientTrack');
  const dotsWrap = document.getElementById('clientDots');
  const prevBtn = document.getElementById('clientPrev');
  const nextBtn = document.getElementById('clientNext');
  const container = document.querySelector('.client-carousel');
  
  if (!track) return; 

  // Ambil semua card logo asli dari HTML sebelum dikloning
  const allCards = Array.from(track.querySelectorAll('.client-logo-card'));
  if (allCards.length === 0) return;

  let page = 0;
  let totalPages = 0;
  let isTransitioning = false; 
  let autoplayTimer = null;

  // Tentukan jumlah logo per halaman berdasarkan lebar layar perangkat
  function getItemsPerPage() {
    return window.innerWidth <= 768 ? 1 : 2; 
  }

  // Bangun ulang struktur halaman (slide) secara dinamis
  function buildClientPages() {
    stopAutoplay();
    const itemsPerPage = getItemsPerPage();
    
    // Bersihkan track dan dots lama
    track.innerHTML = '';
    if (dotsWrap) dotsWrap.innerHTML = '';

    // Kelompokkan kartu logo ke dalam halaman-halaman baru
    const groups = [];
    for (let i = 0; i < allCards.length; i += itemsPerPage) {
      groups.push(allCards.slice(i, i + itemsPerPage));
    }
    totalPages = groups.length;

    if (totalPages === 0) return;

    // Masukkan halaman asli ke dalam track
    groups.forEach(group => {
      const pageEl = document.createElement('div');
      pageEl.className = 'client-page';
      group.forEach(card => pageEl.appendChild(card.cloneNode(true)));
      track.appendChild(pageEl);
    });

    // Kloning halaman untuk efek Perfect Loop (Infinite Scroll)
    const originalPages = Array.from(track.querySelectorAll('.client-page'));
    originalPages.forEach(p => track.appendChild(p.cloneNode(true)));

    const totalSlides = totalPages * 2;
    track.style.width = (totalSlides * 100) + '%';
    
    track.querySelectorAll('.client-page').forEach(p => {
      p.style.flex = `0 0 ${100 / totalSlides}%`;
      p.style.width = `${100 / totalSlides}%`;
    });

    // Bangun indicator dots jika elemennya ada di HTML
    if (dotsWrap) {
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          if (isTransitioning || page === i) return;
          page = i;
          render(true);
        });
        dotsWrap.appendChild(dot);
      }
    }

    page = 0;
    render(false);
    if (totalPages > 1) startAutoplay();
  }

  function render(withTransition = true) {
    const totalSlides = totalPages * 2;
    if (totalSlides <= 0) return;

    if (withTransition) {
      track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      isTransitioning = true;
    } else {
      track.style.transition = 'none';
      isTransitioning = false;
    }

    track.style.transform = `translateX(-${page * (100 / totalSlides)}%)`;
    
    if (dotsWrap) {
      const dots = dotsWrap.querySelectorAll('span');
      const activeDot = page % totalPages;
      dots.forEach((d, i) => d.classList.toggle('active', i === activeDot));
    }
  }

  function nextPage() {
    if (isTransitioning || totalPages <= 1) return;
    page++;
    render(true);
  }

  function prevPage() {
    if (isTransitioning || totalPages <= 1) return;
    if (page === 0) {
      page = totalPages;
      render(false);
      track.getBoundingClientRect(); // Force reflow browser
    }
    page--;
    render(true);
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (page >= totalPages) {
      page = 0;
      render(false);
    }
  });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextPage, 3000); 
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevPage(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextPage(); });

  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', () => { if (totalPages > 1) startAutoplay(); });
  }

  // Jalankan ulang kalkulasi jika layar diputar/di-resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildClientPages, 250);
  });

  // Init pertama kali
  buildClientPages();
})();

// ===== 4. SMART HEADER LOGIC =====
let lastScrollTop = 0;
const headerMain = document.querySelector('.header-main');

if (headerMain) {
  window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= 0) {
          headerMain.classList.remove('scroll-down', 'scroll-up');
          return;
      }

      if (currentScroll > lastScrollTop) {
          headerMain.classList.remove('scroll-up');
          headerMain.classList.add('scroll-down');
      } else {
          headerMain.classList.remove('scroll-down');
          headerMain.classList.add('scroll-up');
      }
      lastScrollTop = currentScroll;
  });
}

// ===== 5. EFEK PARALLAX HERO & SERVICES =====
const hero = document.querySelector('.hero');
const services = document.querySelector('.services');

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    if (hero && scrollPos < windowHeight) {
        const heroSpeed = scrollPos * 0.3;
        hero.style.setProperty('--hero-parallax', `${heroSpeed}px`);
    }
    
    if (services) {
        const servicesRect = services.getBoundingClientRect();
        if (servicesRect.top < windowHeight && servicesRect.bottom > 0) {
            const servicesSpeed = (windowHeight - servicesRect.top) * 0.15; 
            services.style.setProperty('--services-parallax', `${servicesSpeed}px`);
        }
    }
});

// ===== 6. REAL-TIME MAILTO GENERATOR (WITH SNACKBAR NOTIFICATION) =====

// Fungsi global untuk membuat dan memunculkan Snackbar / Toast
function showToast(type, message) {
  const container = document.getElementById('toastContainer');
  if (!container) return; // Mencegah error jika kontainer belum dirender di HTML
  
  // Buat elemen toast baru
  const toast = document.createElement('div');
  toast.className = `custom-toast ${type}`;
  
  // Berikan ikon simbol sederhana di depan teks
  const icon = type === 'success' ? '✓' : '×';
  toast.innerHTML = `<span style="font-weight: bold; color: ${type === 'success' ? '#2ecc71' : '#e74c3c'}">${icon}</span> <span>${message}</span>`;
  
  // Masukkan ke dalam container
  container.appendChild(toast);
  
  // Trigger animasi masuk
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Hapus toast otomatis setelah 4 detik
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm'); 

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Mencegah browser reload halaman

      // Mengambil waktu sekarang format Indonesia untuk input tersembunyi
      const opsiWaktu = { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZoneName: 'short' 
      };
      const waktuSekarang = new Date().toLocaleString('id-ID', opsiWaktu);
      
      const hiddenWaktuInput = document.getElementById('waktuKirim');
      if (hiddenWaktuInput) {
        hiddenWaktuInput.value = waktuSekarang;
      }

      // Mengubah teks tombol secara dinamis saat proses mengirim
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Message →";
      if (submitBtn) {
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true; // Kunci tombol agar user tidak klik berkali-kali
      }

      // Eksekusi pengiriman formulir via EmailJS
      // Sesuai template, ganti 'YOUR_SERVICE_ID' dan 'YOUR_TEMPLATE_ID' dengan ID aslimu
      emailjs.sendForm('service_mjulr7l', 'template_8qhk1uf', this)
        .then(function() {
          // Panggil Snackbar Sukses
          showToast('success', "Pesan berhasil dikirim! Terima kasih, kami akan segera menghubungi Anda.");
          contactForm.reset();
          
          // Kembalikan tombol ke kondisi semula
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          }
        }, function(error) {
          // Panggil Snackbar Gagal
          showToast('error', "Gagal mengirim pesan. Silakan coba beberapa saat lagi.");
          
          // Kembalikan tombol ke kondisi semula
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          }
        });
    });
  }
});

// ===== 7. INTERSECTION OBSERVER FOR SCROLL REVEAL =====
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // Jika elemen sudah masuk ke area sorot layar
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Unobserve digunakan jika kamu ingin animasi hanya berjalan 1 kali saja 
            // saat di-scroll down (tidak menghilang lagi saat di-scroll up)
            scrollObserver.unobserve(entry.target); 
        }
    });
}, {
    // threshold 0.15 berarti elemen akan memicu animasi 
    // ketika 15% dari bagian tubuhnya sudah mulai mengintip masuk ke layar
    threshold: 0.15 
});

// Cari semua elemen di HTML yang memiliki class hidden-scroll untuk diawasi
const hiddenElements = document.querySelectorAll('.hidden-scroll');
hiddenElements.forEach((el) => scrollObserver.observe(el));

// ===== 8. DROPDOWN TO ACCORDION SYNC LOGIC =====
const dropdownLinks = document.querySelectorAll('.dropdown-link');

if (dropdownLinks.length > 0) {
  dropdownLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Ambil ID target dari atribut href (misal: "#about-history")
      const targetId = this.getAttribute('href');
      const targetAccordion = document.querySelector(targetId);

      if (targetAccordion) {
        // 1. Tutup semua akordeon lain terlebih dahulu agar rapi
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.removeAttribute('open'); // Untuk tag <details> bawaan HTML
          // Jika kamu menggunakan class JS kustom, sesuaikan menjadi: item.classList.remove('active');
        });

        // 2. Buka akordeon yang dituju secara spesifik
        targetAccordion.setAttribute('open', ''); // Untuk tag <details> bawaan HTML
        // Jika menggunakan class JS kustom, sesuaikan menjadi: targetAccordion.classList.add('active');

        // 3. Gulir halaman secara mulus (smooth scroll) ke elemen akordeon tersebut
        // Jeda sedikit agar proses scroll berjalan mulus setelah rendering buka-tutup selesai
        setTimeout(() => {
          targetAccordion.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // Memposisikan akordeon tepat di tengah layar monitor/HP
          });
        }, 100);
      }
    });
  });
}

// ===== 9. ABOUT US AUTO IMAGE SLIDER (CROSS-FADE) =====
(function(){
  const slides = document.querySelectorAll('.about-slide');
  const dotsWrap = document.getElementById('aboutSliderDots');
  const frame = document.querySelector('.about-photo-frame');

  if (slides.length <= 1 || !frame) return; // Tidak perlu slider kalau cuma 1 gambar

  let current = 0;
  let timer = null;

  // Buat titik indikator sejumlah gambar
  slides.forEach((slide, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    if (dotsWrap) dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap ? dotsWrap.querySelectorAll('span') : [];

  function goTo(index){
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next(){
    goTo((current + 1) % slides.length);
  }

  function startAutoplay(){
    stopAutoplay();
    timer = setInterval(next, 2500); // Ganti gambar setiap 2.5 detik
  }
  function stopAutoplay(){
    if (timer) clearInterval(timer);
  }

  // Jeda autoplay saat mouse di atas foto, lanjut lagi saat mouse pergi
  frame.addEventListener('mouseenter', stopAutoplay);
  frame.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
})();