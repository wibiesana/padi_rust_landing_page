export default {
  // Navigation / Layout
  nav: {
    home: 'Beranda',
    features: 'Fitur',
    quickStart: 'Mulai Cepat',
    documentation: 'Dokumentasi',
    fullDocumentation: 'Dokumentasi Lengkap',
    github: 'GitHub',
    githubRepo: 'Repositori GitHub',
    builtWith: 'Dibuat dengan Cinta & Hasrat',
    navigation: 'Navigasi'
  },
  // Hero Section
  hero: {
    title: 'Padi Rust Api Framework',
    subtitle: 'Framework REST API Rust Kelas Industri yang Ringan Tanpa Bloat untuk Web Modern',
    getStarted: 'Mulai Sekarang',
    documentation: 'Dokumentasi'
  },
  // Philosophy Section
  philosophy: {
    title1: 'Dibuat untuk',
    titleSpeed: 'Kecepatan',
    title2: 'Diskalakan untuk Pertumbuhan',
    titleIndustrial: 'Industri',
    desc: 'Padi Rust Api Framework bukan sekadar framework biasa; ini adalah mesin generator REST API yang dirancang dengan cermat untuk mengubah skema database Anda menjadi layanan RESTful siap produksi secara instan dengan Rust.',
    readBtn: 'Baca filosofi →',
    items: {
      p: {
        t: 'Performa Tinggi (Performant)',
        d: 'Inti eksekusi yang sangat teroptimasi untuk memeras setiap tetes kecepatan, memory safety, dan konkurensi dari arsitektur Rust modern.'
      },
      a: {
        t: 'Lincah (Agile)',
        d: 'Hasilkan endpoint CRUD lengkap, validasi, model, resource, dan route dalam hitungan detik menggunakan generator CLI kami.'
      },
      d: {
        t: 'Dapat Diandalkan (Dependable)',
        d: 'Arsitektur memory-safe yang tangguh yang berkembang di bawah beban kerja konkurensi tinggi.'
      },
      i: {
        t: 'Intuitif (Intuitive)',
        d: 'Desain API yang bersih, type-safe, dan fasih yang terasa familier sekaligus menyegarkan.'
      }
    }
  },
  // Features Section
  features: {
    title: 'Sistem Inti Canggih',
    subtitle: 'Fitur Unggulan',
    performanceTag: 'Performa Tinggi',
    items: {
      routing: {
        t: 'Routing Cepat Axum',
        d: 'Dibangun di atas Axum dengan rute modular, middleware kelompok, dan extractor type-safe.'
      },
      orm: {
        t: 'ActiveRecord Multi-DB ORM',
        d: 'Model konstan saat kompilasi, eager loading, introspeksi skema database, dan lifecycle hooks dengan SQLx.'
      },
      middleware: {
        t: 'Pipeline Middleware',
        d: 'Intercept request dengan mudah. Dilengkapi dengan layer Tower bawaan untuk Auth, CORS, Recoverer, dan Kompresi.'
      },
      queue: {
        t: 'Sistem Antrean Terintegrasi',
        d: 'Jalankan pekerjaan latar belakang yang memakan waktu lama secara asinkron menggunakan worker queue berbasis database.'
      },
      cache: {
        t: 'Sistem Caching Dua Tingkat',
        d: 'Tingkatkan performa kueri dengan L1 in-memory cache dan L2 penyimpanan file ber-hash SHA-256.'
      },
      auth: {
        t: 'Autentikasi JWT & RBAC',
        d: 'Keamanan token stateless Bearer JWT dengan extractor AuthUser dan hashing kata sandi Bcrypt terintegrasi.'
      },
      cli: {
        t: 'CLI Generator Kuat',
        d: 'Generator kode interaktif untuk menghasilkan CRUD lengkap (Model, Controller, Resource, Route) dalam satu perintah (padi g / padi ga).'
      },
      validation: {
        t: 'Validasi Input Ketat',
        d: 'Mesin validasi tangguh dengan aturan lengkap, pengecekan database unik, dan error handling terstruktur.'
      },
      response: {
        t: 'Resource & Respon Otomatis',
        d: 'Transformasikan data database Anda menjadi format JSON REST standar industri secara instan dan bersih.'
      }
    }
  },
  // Stats Section
  stats: {
    title: 'METRIK PERFORMA',
    subtitle: 'Teknik Presisi.',
    desc: 'Dioptimalkan untuk container cloud-native dan binary kompilasi native. Framework kami menghasilkan throughput tinggi tanpa pemborosan memori.',
    securityScore: 'Skor Keamanan',
    performance: 'Performa'
  },
  // Monitor Placeholder
  monitor: {
    title: 'Pemantauan Performa Real-time',
    desc: 'Menunggu Penyebaran Produksi...'
  },
  // Quick Start Section
  quickStart: {
    title1: 'Mulai Jalankan',
    title2: 'Secara Instan',
    desc: 'Tanpa setup yang rumit. Cukup clone starter template, migrate, dan mulai membangun arsitektur Anda.',
    steps: [
      'Clone Template Rust Starter',
      'Setup Wizard Interaktif (padi init)',
      'Generate CRUD Instan dari Tabel (padi g <table_name>)',
      'Jalankan Server Rust (padi serve)'
    ]
  },
  // Learning Paths Section
  learning: {
    title: 'Panduan Pembelajaran',
    subtitle: 'Jalur khusus yang dirancang untuk mempercepat perilisan produk Anda',
    beginBtn: 'Mulai Jalur Ini',
    paths: {
      basics: {
        t: 'Konsep Dasar',
        d: 'Kuasai dasar-dasar Padi Rust Api Framework dan bangun endpoint RESTful pertama Anda.',
        steps: [
          'Pengenalan & Instalasi',
          'Routing & Penanganan Request Axum',
          'Database & Query Builder',
          'Validasi Input Dasar'
        ]
      },
      advanced: {
        t: 'Sistem Lanjutan',
        d: 'Gali fitur-fitur kelas industri untuk menangani beban kerja nyata.',
        steps: [
          'Autentikasi JWT & Otorisasi RBAC',
          'Sistem Antrean Latar Belakang (Queue)',
          'Caching Performa Tinggi',
          'Penyimpanan File & Upload'
        ]
      },
      production: {
        t: 'Penyebaran Produksi',
        d: 'Konfigurasikan dan optimalkan server Anda untuk kinerja maksimal di dunia nyata.',
        steps: [
          'Kompilasi Binary Release (cargo build --release)',
          'Konfigurasi PostgreSQL / MySQL / SQLite',
          'Setup Docker Multi-stage',
          'Penyetelan Keamanan & Nginx Reverse Proxy'
        ]
      }
    }
  },
  // CTA Section
  cta: {
    title1: 'Siap Merasakan',
    title2: 'Kekuatan Murni?',
    desc: 'Bergabunglah dengan ekosistem engineer yang membangun layanan REST industri dengan Rust. Berhenti bergelut, mulai rilis produk Anda.',
    installBtn: 'Instal Framework'
  }
}
