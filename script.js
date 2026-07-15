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

// ===== 6. FORM CONTACT SUBMIT & TOAST NOTIFICATION =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toastNotification');

if (contactForm && submitBtn && toast) {
  contactForm.addEventListener('submit', function(event) {
    // 1. Cegah halaman bawaan melakukan reload/pindah halaman
    event.preventDefault();
    
    // 2. Ubah tampilan tombol menjadi loading "Sending..."
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true; // Kunci tombol biar tidak diklik dua kali
    
    // 3. Ambil seluruh data dari inputan form
    const formData = new FormData(contactForm);
    
    // 4. Kirim data ke Formspree menggunakan Fetch API (di latar belakang)
    fetch(contactForm.action, {
      method: contactForm.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // JIKA BERHASIL:
        toast.textContent = 'Pesan Anda berhasil dikirim langsung ke email perusahaan!';
        toast.className = 'toast-notification success';
        contactForm.reset(); // Bersihkan isi form kembali
      } else {
        // JIKA SERVER MERESPONS ERROR:
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => {
      // JIKA GAGAL (Koneksi putus/masalah jaringan):
      toast.textContent = 'Gagal mengirim pesan, silakan coba lagi nanti';
      toast.className = 'toast-notification error';
    })
    .finally(() => {
      // 5. Kembalikan teks tombol ke kondisi semula setelah proses selesai
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      
      // 6. Sembunyikan notifikasi toast secara otomatis setelah 4 detik
      setTimeout(() => {
        toast.className = 'toast-notification';
      }, 4000);
    });
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