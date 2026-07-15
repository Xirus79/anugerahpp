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

// ===== 2. PROJECT FILTER LOGIC =====
const filterTabs = document.querySelectorAll('.filter-row .tab');
if (filterTabs.length > 0) {
  filterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ===== 3. CLIENT CAROUSEL LOGIC (WITH AUTOPLAY) =====
(function(){
  const track = document.getElementById('clientTrack');
  const dots = document.querySelectorAll('#clientDots span');
  const prevBtn = document.getElementById('clientPrev');
  const nextBtn = document.getElementById('clientNext');
  const container = document.querySelector('.client-carousel');
  
  if(!track || !dots.length) return; 

  const totalPages = dots.length;
  let page = 0;
  let autoplayTimer = null;

  function render(){
    track.style.transform = 'translateX(-' + (page * (100/totalPages)) + '%)';
    dots.forEach((d,i)=> d.classList.toggle('active', i===page));
  }

  function nextPage() {
    page = (page + 1) % totalPages;
    render();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextPage, 3000); 
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', ()=>{ page = (page - 1 + totalPages) % totalPages; render(); });
  if (nextBtn) nextBtn.addEventListener('click', ()=>{ nextPage(); });
  
  dots.forEach((d,i)=> d.addEventListener('click', ()=>{ page = i; render(); }));

  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }

  render();
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
function updateMailtoLink() {
  const nameInput = document.getElementById('userName');
  const phoneInput = document.getElementById('userPhone');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (!nameInput || !emailInput || !messageInput || !submitBtn) return;

  const name = nameInput.value;
  const phone = phoneInput.value || '-';
  const email = emailInput.value;
  const message = messageInput.value;

  // Konfigurasi Email & Subjek
  const emailTujuan = "ignatius.kevinm@gmail.com";
  const subjectEmail = encodeURIComponent(`[OFFICIAL INQUIRY] Pesan Baru dari ${name || 'Pengunjung Website'}`);
  
  // Susun template draf email formal
  const bodyEmail = encodeURIComponent(
    `Yth. PT Anugerah Prima Printing,\n\n` +
    `Berikut adalah pesan resmi yang dikirimkan melalui formulir kontak website:\n` +
    `==================================================\n` +
    `Nama Pengirim   : ${name}\n` +
    `Nomor Telepon   : ${phone}\n` +
    `Alamat Email    : ${email}\n` +
    `==================================================\n\n` +
    `Isi Pesan:\n` +
    `"${message}"\n\n` +
    `Mohon untuk segera menindaklanjuti pesan ini. Terima kasih.`
  );

  // Update atribut href milik tombol <a> secara real-time saat user mengetik
  submitBtn.setAttribute('href', `mailto:${emailTujuan}?subject=${subjectEmail}&body=${bodyEmail}`);
}

// Tambahkan interaksi visual toast saat tombol diklik manusia
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toastNotification');
const contactForm = document.getElementById('contactForm');

if (submitBtn && toast) {
  submitBtn.addEventListener('click', function() {
    // Jalankan update sekali lagi untuk memastikan data paling akhir ter-copy
    updateMailtoLink();

    // Munculkan toast notifikasi estetik di pojok kanan bawah
    toast.textContent = 'Membuka draf email resmi... Silakan klik Send!';
    toast.className = 'toast-notification success';

    // Bersihkan form secara perlahan setelah 1.5 detik agar draf tidak langsung kosong saat aplikasi email terbuka
    setTimeout(() => {
      if (contactForm) contactForm.reset();
      // Kembalikan tombol ke setelan href kosong bawaan
      submitBtn.setAttribute('href', 'mailto:ignatius.kevinm@gmail.com');
      
      setTimeout(() => {
        toast.className = 'toast-notification';
      }, 3000);
    }, 1500);
  });
}

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