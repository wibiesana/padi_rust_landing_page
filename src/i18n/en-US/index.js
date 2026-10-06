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
    title: 'PADI REST API GO',
    subtitle: 'The Industrial-Grade, Zero-Bloat Go REST API Framework for the Modern Web',
    getStarted: 'Get Started',
    documentation: 'Documentation'
  },
  // Philosophy Section
  philosophy: {
    title1: 'Built for',
    titleSpeed: 'Speed',
    title2: 'Scaled for',
    titleIndustrial: 'Industrial',
    desc: "PADI REST API GO isn't just another Go framework; it's a meticulously crafted REST API Generation Engine designed to transform your database schemas into production-ready Go services instantly.",
    readBtn: 'Read the philosophy →',
    items: {
      p: {
        t: 'Performant',
        d: 'Hyper-optimized execution core that extracts every ounce of speed and concurrency from native Go.'
      },
      a: {
        t: 'Agile',
        d: 'Generate complete CRUD endpoints, validations, models, and collections in seconds using our CLI generator.'
      },
      d: {
        t: 'Dependable',
        d: 'Robust, type-safe architecture that thrives under massive high concurrency workloads.'
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
        t: 'Method-Indexed Routing',
        d: 'Built on top of Chi with direct routes, group middleware, and dynamic URL parameters.'
      },
      orm: {
        t: 'ActiveRecord Generic ORM',
        d: 'Type-safe generics for Go 1.22+, eager loading, schema introspection, and lifecycle hooks.'
      },
      middleware: {
        t: 'Middleware Pipeline',
        d: 'Intercept requests easily with built-in middleware for Auth, CORS, Panic Recovery, and Rate Limiting.'
      },
      queue: {
        t: 'Integrated Queue System',
        d: 'Offload long-running background tasks asynchronously using database job drivers.'
      },
      cache: {
        t: 'In-Memory Cache & Storage',
        d: 'Accelerate query and compute performance with memory-optimized cache mechanisms.'
      },
      auth: {
        t: 'Built-in JWT Auth',
        d: 'Stateless token security out of the box with claims injection and password hashing.'
      },
      cli: {
        t: 'Powerful CLI Generator',
        d: 'Generate Base/Custom Models, Controllers, and Postman Collections in a single command.'
      },
      validation: {
        t: 'Strict Input Validation',
        d: 'Robust validation engine supporting struct tags, email, min/max, and custom rules.'
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
    desc: 'Optimized for modern cloud clusters and serverless containers. Delivers high throughput without memory bloat.',
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
      'Interactive Setup Wizard (Choose Database & JWT)',
      'Generate Instant CRUD from Table (Scaffolding)',
      'Launch Go Server'
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
        d: 'Master PADI REST API GO fundamentals and build your first RESTful endpoints.',
        steps: [
          'Introduction & Installation',
          'Routing & Request Handling',
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
          'Lightweight Binary Compilation',
          'PostgreSQL / MySQL Configurations',
          'Multi-stage Docker setups (< 25MB)',
          'Production Security & Nginx Reverse Proxy'
        ]
      }
    }
  },
  // CTA Section
  cta: {
    title1: 'Ready to Experience',
    title2: 'Raw Power?',
    desc: 'Join the ecosystem of engineers building industrial REST services with Go. Stop wrestle, start shipping.',
    installBtn: 'Install Framework'
  }
}
