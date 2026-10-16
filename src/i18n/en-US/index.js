export default {
  // Navigation / Layout
  nav: {
    home: 'Home',
    features: 'Features',
    quickStart: 'Quick Start',
    documentation: 'Documentation',
    fullDocumentation: 'Full Documentation',
    github: 'GitHub',
    githubRepo: 'GitHub Repository',
    builtWith: 'Built with Love & Passion',
    navigation: 'Navigation'
  },
  // Hero Section
  hero: {
    title: 'Padi Rust Api Framework',
    subtitle: 'The Industrial-Grade, Zero-Bloat Rust REST API Framework for the Modern Web',
    getStarted: 'Get Started',
    documentation: 'Documentation'
  },
  // Philosophy Section
  philosophy: {
    title1: 'Built for',
    titleSpeed: 'Speed',
    title2: 'Scaled for',
    titleIndustrial: 'Industrial',
    desc: "Padi Rust Api Framework isn't just another framework; it's a meticulously crafted REST API Generation Engine designed to transform your database schemas into production-ready Rust services instantly.",
    readBtn: 'Read the philosophy →',
    items: {
      p: {
        t: 'Performant',
        d: 'Hyper-optimized execution core that extracts every ounce of speed, memory safety, and concurrency from native Rust.'
      },
      a: {
        t: 'Agile',
        d: 'Generate complete CRUD endpoints, validations, models, resources, and routes in seconds using our CLI generator.'
      },
      d: {
        t: 'Dependable',
        d: 'Robust, memory-safe architecture that thrives under massive high concurrency workloads.'
      },
      i: {
        t: 'Intuitive',
        d: 'Clean, fluent ActiveRecord API design that feels instantly familiar, elegant, and productive.'
      }
    }
  },
  // Features Section
  features: {
    title: 'Advanced Core Systems',
    subtitle: 'Core Features',
    performanceTag: 'High Performance',
    items: {
      routing: {
        t: 'Axum Fast Routing',
        d: 'Built on top of Axum with modular routes, group middleware, and type-safe extractors.'
      },
      orm: {
        t: 'ActiveRecord Multi-DB ORM',
        d: 'Compile-time constant models, eager loading, schema introspection, and lifecycle hooks with SQLx.'
      },
      middleware: {
        t: 'Middleware Pipeline',
        d: 'Intercept requests easily with built-in Tower layers for Auth, CORS, Panic Recovery, and Compression.'
      },
      queue: {
        t: 'Integrated Queue System',
        d: 'Offload long-running background tasks asynchronously using database-backed job workers.'
      },
      cache: {
        t: 'Two-Tier Caching System',
        d: 'Accelerate query performance with L1 in-memory cache and L2 SHA-256 hashed file storage.'
      },
      auth: {
        t: 'Built-in JWT Auth & RBAC',
        d: 'Stateless token security out of the box with AuthUser extractor and Bcrypt password hashing.'
      },
      cli: {
        t: 'Powerful CLI Generator',
        d: 'Generate Models, Controllers, Resources, and Routes in a single command (padi g / padi ga).'
      },
      validation: {
        t: 'Strict Input Validation',
        d: 'Robust validation engine supporting rules, email, min/max, unique database checks, and custom rules.'
      },
      response: {
        t: 'Deterministic Response Payload',
        d: 'Consistent REST JSON outputs with items for collections and item for single entities.'
      }
    }
  },
  // Stats Section
  stats: {
    title: 'PERFORMANCE METRICS',
    subtitle: 'Precision Engineering.',
    desc: 'Optimized for modern cloud clusters and native binaries. Delivers high throughput without memory bloat.',
    securityScore: 'Security Score',
    performance: 'Performance'
  },
  // Monitor Placeholder
  monitor: {
    title: 'Real-time Performance Monitoring',
    desc: 'SSE Stream & Pub/Sub Ready'
  },
  // Quick Start Section
  quickStart: {
    title1: 'Get Running',
    title2: 'Instantly',
    desc: 'No complex installation steps. Just clone the starter template, migrate, and start building.',
    steps: [
      'Clone Starter Template',
      'Interactive Setup Wizard (padi init)',
      'Generate Instant CRUD from Table (padi g <table_name>)',
      'Launch Rust Server (padi serve)'
    ]
  },
  // Learning Paths Section
  learning: {
    title: 'Guided Mastery',
    subtitle: 'Framework-specific paths designed to accelerate your delivery',
    beginBtn: 'Begin this Path',
    paths: {
      basics: {
        t: 'Core Basics',
        d: 'Master Padi Rust Api Framework fundamentals and build your first RESTful endpoints.',
        steps: [
          'Introduction & Installation',
          'Routing & Axum Request Handling',
          'Database & Query Builder',
          'Basic Input Validation'
        ]
      },
      advanced: {
        t: 'Advanced Systems',
        d: 'Dive into industrial-grade features for handling real-world production workloads.',
        steps: [
          'JWT Authentication & RBAC',
          'Background Job Queues',
          'High-Performance Caching',
          'File Storage & Uploads'
        ]
      },
      production: {
        t: 'Production Deployment',
        d: 'Configure and optimize your server environment for maximum real-world throughput.',
        steps: [
          'Release Binary Compilation (cargo build --release)',
          'PostgreSQL / MySQL / SQLite Configurations',
          'Multi-stage Docker setups',
          'Production Security & Nginx Reverse Proxy'
        ]
      }
    }
  },
  // CTA Section
  cta: {
    title1: 'Ready to Experience',
    title2: 'Raw Power?',
    desc: 'Join the ecosystem of engineers building industrial REST services with Rust. Stop wrestling, start shipping.',
    installBtn: 'Install Framework'
  }
}
