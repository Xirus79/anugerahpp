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
  const dots = document.querySelectorAll('#clientDots span');
  const prevBtn = document.getElementById('clientPrev');
  const nextBtn = document.getElementById('clientNext');
  const container = document.querySelector('.client-carousel');
  
  if(!track || !dots.length) return; 

  const totalPages = dots.length; // Jumlah halaman asli (misal: 4)

  // 1. GANDAKAN KONTEN UNTUK ILUSI LOOP
  track.innerHTML += track.innerHTML;
  
  const totalSlides = totalPages * 2; // Jumlah total setelah digandakan (misal: 8)
  
  // 2. KALKULASI LEBAR OTOMATIS (Mencegah pergerakan kecil / jeda besar)
  // Ini akan menimpa CSS bawaan agar lebarnya selalu akurat
  track.style.width = (totalSlides * 100) + '%';
  const pages = track.querySelectorAll('.client-page');
  pages.forEach(p => {
    // Membagi rata ruang untuk setiap halaman
    const pagePercentage = 100 / totalSlides;
    p.style.flex = `0 0 ${pagePercentage}%`;
    p.style.width = `${pagePercentage}%`; 
  });

  let page = 0;
  let autoplayTimer = null;
  let isTransitioning = false; // Pengunci agar tidak bisa digeser sampai kosong

  function render(withTransition = true){
    if (withTransition) {
      track.style.transition = ''; // Gunakan efek transisi CSS aslimu
      isTransitioning = true;      // Kunci pergerakan selama animasi berjalan
    } else {
      track.style.transition = 'none'; // Matikan transisi untuk teleport
      isTransitioning = false;
    }

    track.style.transform = `translateX(-${page * (100 / totalSlides)}%)`;
    
    // Sinkronisasi indikator titik (dot)
    const activeDot = page % totalPages;
    dots.forEach((d, i) => d.classList.toggle('active', i === activeDot));
  }

  function nextPage() {
    if (isTransitioning) return; // Abaikan perintah jika sedang bergeser
    page++;
    render(true);
  }

  function prevPage() {
    if (isTransitioning) return; // Abaikan perintah jika sedang bergeser
    if (page === 0) {
      // Teleport instan ke salinan terakhir sebelum mundur
      page = totalPages;
      render(false);
      track.getBoundingClientRect(); // Paksa browser menerapkan teleport seketika
    }
    page--;
    render(true);
  }

  // 3. TELEPORTASI SETELAH ANIMASI SELESAI
  track.addEventListener('transitionend', () => {
    isTransitioning = false; // Buka kunci pergerakan
    // Jika pergeseran sudah sampai di batas awal salinan konten
    if (page >= totalPages) {
      page = 0; // Kembalikan indeks ke 0 secara rahasia
      render(false);
    }
  });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextPage, 3000); 
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevPage);
  if (nextBtn) nextBtn.addEventListener('click', nextPage);
  
  dots.forEach((d, i) => d.addEventListener('click', () => { 
    // Cegah error jika mengklik titik yang sama atau sedang bergeser
    if (isTransitioning || page % totalPages === i) return;
    page = i; 
    render(true); 
  }));

  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  // Inisialisasi posisi web saat baru dimuat
  render(false);
  startAutoplay();
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

// ===== 6. REAL-TIME MAILTO GENERATOR (NATIVE HUMAN INTERACTION METHOD) =====

document.addEventListener('DOMContentLoaded', function() {
  // 1. Cari elemen form berdasarkan ID di HTML kamu (misal id="contactForm")
  const contactForm = document.getElementById('contactForm'); 

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Mencegah browser reload halaman saat klik kirim

      // Mengubah teks tombol secara dinamis saat proses mengirim agar user tahu sistem sedang bekerja
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerText : "Send Message";
      if (submitBtn) submitBtn.innerText = "Sending...";

      // 2. Eksekusi pengiriman formulir langsung ke Gmail via EmailJS
      // Ganti parameter dengan ID asli dari dasbor EmailJS kamu
      emailjs.sendForm('service_mjulr7l', 'template_8qhk1uf', this)
        .then(function() {
          // JIKA BERHASIL:
          if (submitBtn) submitBtn.innerText = originalBtnText;
          
          // Panggil fungsi notifikasi toast sukses yang sudah kamu miliki[cite: 1]
          if (typeof showToast === "function") {
            showToast("Pesan Anda sukses dikirim langsung ke Gmail kami!");
          } else {
            alert("Pesan sukses dikirim!");
          }

          contactForm.reset(); // Bersihkan isi kotak form agar kosong kembali
        }, function(error) {
          // JIKA GAGAL:
          if (submitBtn) submitBtn.innerText = originalBtnText;
          console.error("EmailJS Error:", error);

          // Panggil fungsi notifikasi toast error kamu[cite: 1]
          if (typeof showToast === "function") {
            showToast("Gagal mengirim pesan, silakan coba lagi nanti.", "error");
          } else {
            alert("Gagal mengirim pesan.");
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