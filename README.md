# PT Anugerah Prima Printing — Company Profile Website

Website profil perusahaan untuk **PT Anugerah Prima Printing (APP)**, perusahaan yang bergerak di bidang **Offset Printing, Flexo Printing, dan Security Printing** sejak 2013. Dibangun sebagai single-page website statis menggunakan HTML, CSS, dan JavaScript murni (tanpa framework).

## 🔗 Fitur Utama

- **Hero Section** dengan efek parallax dan background image
- **Why Choose Us** — 4 keunggulan perusahaan
- **About Us** — accordion (History, Vision & Mission, Work Ethic) yang hanya bisa membuka satu panel dalam satu waktu, dilengkapi slider foto fasilitas produksi
- **Services** — 3 kategori layanan (Offset / Flexo / Security Printing) dengan sistem tab, masing-masing punya sub-tahap Design, Press, dan Finishing
- **Our Clients** — carousel logo klien dengan infinite loop & autoplay
- **Portfolio/Project** — carousel galeri proyek dengan filter kategori dan dropdown detail per kartu
- **Application** — tabel jenis produk & aplikasi cetak yang dilayani
- **Contact** — form pengiriman pesan terintegrasi **EmailJS**, peta lokasi via Google Maps embed, dan tautan langsung WhatsApp
- **Smart Header** — navbar otomatis sembunyi saat scroll ke bawah, muncul kembali saat scroll ke atas
- **Scroll Reveal Animation** — elemen muncul dengan animasi fade + blur saat discroll ke area layar
- **Toast Notification** — notifikasi sukses/gagal saat pengiriman form
- Desain **fully responsive** (breakpoint di 960px dan 768px)

## 📁 Struktur Folder

```
anugerahpp/
├── index.html          # Struktur halaman utama (9 section)
├── style.css            # Seluruh styling & responsive design (~2.100 baris)
├── script.js             # Seluruh logic interaktif (~590 baris)
├── README.md
├── assets/                # Logo, foto About Us, foto fasilitas produksi
└── Images/                # Foto portofolio proyek & logo klien
```

## 🧩 Section pada Halaman

| Section | ID | Deskripsi |
|---|---|---|
| Hero | `#home` | Judul utama & CTA ke layanan |
| About Us | `#about` | History, Vision & Mission, Work Ethic (accordion) |
| Why Choose Us | `#why-choose` | 4 keunggulan perusahaan |
| Services | `#services` | Offset / Flexo / Security Printing |
| Our Clients | — | Carousel logo klien |
| Portfolio | `#project` | Galeri proyek dengan filter |
| Application | `#application` | Tabel jenis produk yang dilayani |
| Contact Us | `#contact` | Form kontak & peta lokasi |

## 🛠️ Teknologi yang Digunakan

- **HTML5** — struktur semantik
- **CSS3** — custom design system (CSS variables), Flexbox & Grid, animasi
- **Vanilla JavaScript** — DOM manipulation, IntersectionObserver, carousel logic
- **[EmailJS](https://www.emailjs.com/)** — pengiriman form contact tanpa backend
- **Google Maps Embed** — menampilkan lokasi perusahaan

## 🚀 Cara Menjalankan

Karena ini website statis, cukup buka `index.html` langsung di browser, atau jalankan local server sederhana:

```bash
# Opsi 1: buka langsung
open index.html

# Opsi 2: pakai local server (disarankan agar semua asset termuat sempurna)
npx serve .
# atau
python3 -m http.server 8000
```

## ⚙️ Konfigurasi

Form contact menggunakan EmailJS. Jika ingin mengganti akun EmailJS, ubah bagian berikut di `index.html` dan `script.js`:

```js
emailjs.init("PUBLIC_KEY_ANDA");
emailjs.sendForm('SERVICE_ID_ANDA', 'TEMPLATE_ID_ANDA', this);
```

## 📍 Informasi Perusahaan

**PT Anugerah Prima Printing**
Jl. Pembangunan 2 No.69, RT.001/RW.001, Karang Anyar, Kec. Neglasari, Kota Tangerang, Banten 15121

- Email: anugerahprimaprintingmarketing@gmail.com
- Instagram: [@anugerahprimaprintingofficial](https://www.instagram.com/anugerahprimaprintingofficial/)
- TikTok: [@anugerahprimaprintingoff](https://www.tiktok.com/@anugerahprimaprintingoff)

## 👥 Tim Pengembang

Proyek ini dikerjakan sebagai bagian dari program magang, dengan pembagian peran sebagai berikut:

| Role | Tanggung Jawab |
|---|---|
| Front-End Developer (Struktur & Styling) | HTML, CSS, responsive design |
| Front-End Developer (Interaktivitas & Integrasi) | JavaScript, carousel, form handling |
| Content, Asset & QA | Aset visual, copywriting, testing, dokumentasi |

---
© 2026 PT Anugerah Prima Printing
