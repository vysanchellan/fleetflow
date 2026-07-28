'use client'

import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Truck, MapPin, Wrench, Fuel, Shield, BarChart3, FileText,
  ChevronRight, Star, Check, Menu, X, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
]

const FEATURES = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'GPS tracking with live updates, geofencing, and route optimization for complete visibility.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Wrench,
    title: 'Predictive Maintenance',
    description: 'AI-driven maintenance alerts that reduce downtime and extend vehicle life by up to 40%.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Fuel,
    title: 'Fuel Management',
    description: 'Monitor fuel consumption, detect anomalies, and optimize routes to cut fuel costs.',
    color: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: Shield,
    title: 'Driver Safety',
    description: 'Real-time behavior scoring, coaching alerts, and incident detection to improve safety.',
    color: 'bg-purple-500/10 text-purple-400',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Custom dashboards with KPIs, trends, and exportable reports for data-driven decisions.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: FileText,
    title: 'Compliance & Docs',
    description: 'Automate IFTA, ELD, inspection reports, and digital document management in one place.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
]

const TESTIMONIALS = [
  {
    quote: 'FleetFlow transformed our logistics operations. We reduced fuel costs by 35% in the first quarter alone. The real-time tracking and predictive maintenance are game-changers.',
    name: 'Marcus Rivera',
    title: 'VP of Operations',
    company: 'TransCorp Logistics',
    initials: 'MR',
  },
  {
    quote: 'Managing a fleet of 200+ mining vehicles was chaotic until FleetFlow. Now we have complete visibility, automated compliance, and our downtime has dropped 60%.',
    name: 'Sarah Chen',
    title: 'Fleet Director',
    company: 'MineWorks Corp',
    initials: 'SC',
  },
  {
    quote: 'The driver safety module alone paid for itself in three months. Our incident rate dropped by 72% and insurance premiums went down significantly.',
    name: 'James Okafor',
    title: 'CEO',
    company: 'CityTransit Authority',
    initials: 'JO',
  },
]

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$29',
    unit: '/veh/mo',
    description: 'For small fleets (1-10 vehicles)',
    popular: false,
    features: [
      'Real-time GPS tracking',
      'Basic maintenance alerts',
      'Fuel consumption monitoring',
      'Driver behavior scoring',
      'Email support',
      'Mobile app access',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: '$49',
    unit: '/veh/mo',
    description: 'For growing fleets (11-50 vehicles)',
    popular: true,
    features: [
      'Everything in Starter',
      'Predictive maintenance AI',
      'Advanced analytics dashboard',
      'Geofencing & route optimization',
      'ELD/IFTA compliance tools',
      'Priority support',
      'API access',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    description: 'For large fleets (50+ vehicles)',
    popular: false,
    features: [
      'Everything in Professional',
      'White-labeling options',
      'Custom integrations',
      'Dedicated account manager',
      'On-premise deployment',
      'SLA guarantees',
      '24/7 phone support',
    ],
    cta: 'Contact Sales',
  },
]

function useScrollSpy() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80)
  })

  return scrolled
}

function AnimatedSection({ children, className, delay = 0, ...props }: { children: React.ReactNode; className?: string; delay?: number; id?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}

function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/3]">
      <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="400" height="300" rx="16" fill="url(#glow)" />

        <motion.rect
          x="20" y="20" width="170" height="120" rx="8"
          fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.circle
          cx="36" cy="36" r="4" fill="#3b82f6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        />
        <motion.rect
          x="48" y="33" width="80" height="3" rx="1.5" fill="#3b82f6" opacity="0.6"
          initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.7, duration: 0.5 }}
        />
        <motion.rect
          x="20" y="50" width="100" height="2" rx="1" fill="#52525b" opacity="0.5"
          initial={{ width: 0 }} animate={{ width: 100 }} transition={{ delay: 0.8, duration: 0.4 }}
        />
        <motion.rect
          x="20" y="60" width="130" height="2" rx="1" fill="#52525b" opacity="0.5"
          initial={{ width: 0 }} animate={{ width: 130 }} transition={{ delay: 0.85, duration: 0.4 }}
        />
        <motion.rect
          x="20" y="70" width="80" height="2" rx="1" fill="#52525b" opacity="0.5"
          initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.9, duration: 0.4 }}
        />

        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <rect x="20" y="90" width="40" height="3" rx="1.5" fill="#10b981" opacity="0.8" />
          <rect x="65" y="90" width="40" height="3" rx="1.5" fill="#3b82f6" opacity="0.6" />
          <rect x="110" y="90" width="30" height="3" rx="1.5" fill="#f59e0b" opacity="0.6" />
        </motion.g>

        <motion.rect
          x="20" y="105" width="80" height="20" rx="4"
          fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.4 }}
        />
        <motion.text
          x="36" y="118" fill="#10b981" fontSize="8" fontWeight="600"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        >
          ▲ 12.4% efficiency
        </motion.text>

        <motion.rect
          x="210" y="20" width="170" height="120" rx="8"
          fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.25)" strokeWidth="1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.circle
          cx="226" cy="36" r="4" fill="#8b5cf6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        />
        <motion.rect
          x="238" y="33" width="60" height="3" rx="1.5" fill="#8b5cf6" opacity="0.6"
          initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.8, duration: 0.5 }}
        />

        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        >
          <motion.rect x="210" y="55" width="160" height="4" rx="2" fill="#27272a" />
          <motion.rect x="210" y="55" width="110" height="4" rx="2" fill="url(#barGlow)" initial={{ width: 0 }} animate={{ width: 110 }} transition={{ delay: 1.1, duration: 0.6 }} />
          <circle cx="326" cy="57" r="3" fill="#3b82f6" opacity="0.8" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        >
          <motion.rect x="210" y="68" width="160" height="4" rx="2" fill="#27272a" />
          <motion.rect x="210" y="68" width="80" height="4" rx="2" fill="url(#barGlow)" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 1.3, duration: 0.5 }} />
          <circle cx="296" cy="70" r="3" fill="#f59e0b" opacity="0.8" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        >
          <motion.rect x="210" y="81" width="160" height="4" rx="2" fill="#27272a" />
          <motion.rect x="210" y="81" width="140" height="4" rx="2" fill="url(#barGlow)" initial={{ width: 0 }} animate={{ width: 140 }} transition={{ delay: 1.5, duration: 0.6 }} />
          <circle cx="356" cy="83" r="3" fill="#10b981" opacity="0.8" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.4 }}
        >
          <rect x="210" y="100" width="40" height="20" rx="4" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          <text x="220" y="112" fill="#f59e0b" fontSize="7" fontWeight="600">98.4%</text>
          <rect x="258" y="100" width="40" height="20" rx="4" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
          <text x="264" y="112" fill="#3b82f6" fontSize="7" fontWeight="600">2.3K</text>
          <rect x="306" y="100" width="40" height="20" rx="4" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
          <text x="312" y="112" fill="#10b981" fontSize="7" fontWeight="600">12.4%</text>
        </motion.g>

        <motion.rect
          x="20" y="160" width="360" height="45" rx="8"
          fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="1"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.5 }}
        />
        <motion.circle cx="40" cy="182" r="6" fill="#3b82f6" opacity="0.4" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }} />
        <motion.circle cx="40" cy="182" r="3" fill="#3b82f6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} />
        <motion.rect x="56" y="178" width="80" height="3" rx="1.5" fill="#3b82f6" opacity="0.7" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 1.5, duration: 0.4 }} />
        <text x="56" y="195" fill="#71717a" fontSize="8">Fleet A · En route · 3 stops</text>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
          <rect x="230" y="172" width="60" height="18" rx="4" fill="rgba(16,185,129,0.15)" />
          <text x="240" y="184" fill="#10b981" fontSize="8" fontWeight="600">On Time</text>
          <rect x="300" y="172" width="50" height="18" rx="4" fill="rgba(59,130,246,0.15)" />
          <text x="307" y="184" fill="#3b82f6" fontSize="8" fontWeight="600">4.2 mi</text>
        </motion.g>

        <motion.rect
          x="20" y="220" width="170" height="60" rx="8"
          fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)" strokeWidth="1"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.5 }}
        />
        <text x="32" y="242" fill="#a1a1aa" fontSize="8">Maintenance Due</text>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
          <text x="32" y="258" fill="#fafafa" fontSize="11" fontWeight="600">12</text>
          <text x="46" y="258" fill="#71717a" fontSize="8">vehicles</text>
          <text x="100" y="258" fill="#f59e0b" fontSize="8">3 overdue</text>
        </motion.g>

        <motion.rect
          x="210" y="220" width="170" height="60" rx="8"
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.2)" strokeWidth="1"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.5 }}
        />
        <text x="222" y="242" fill="#a1a1aa" fontSize="8">Driver Performance</text>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
          <text x="222" y="258" fill="#fafafa" fontSize="11" fontWeight="600">94</text>
          <text x="240" y="258" fill="#71717a" fontSize="8">avg score</text>
          <text x="305" y="258" fill="#10b981" fontSize="8">▲ 6 pts</text>
        </motion.g>
      </svg>

      <motion.div
        className="absolute -top-2 -right-2 w-20 h-20 bg-blue-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function Nav() {
  const scrolled = useScrollSpy()
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass py-3' : 'py-5',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-neutral-100">FleetFlow</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-neutral-400 hover:text-neutral-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden glass mt-2 mx-4 rounded-xl"
      >
        <div className="p-4 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
          <hr className="border-neutral-800" />
          <Button variant="ghost" fullWidth onClick={() => router.push('/login')}>
            Sign In
          </Button>
          <Button fullWidth onClick={() => router.push('/dashboard')}>
            Get Started
          </Button>
        </div>
      </motion.div>
    </motion.header>
  )
}

function Hero() {
  const router = useRouter()

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.05)_0%,_transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-subtle" />
                Now available — FleetFlow 3.0
              </div>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-100 leading-[1.1]"
            >
              Intelligent{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Fleet Management
              </span>
              {' '}for Modern Operations
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              className="mt-6 text-lg md:text-xl text-neutral-400 max-w-lg leading-relaxed"
            >
              AI-powered platform that helps transport, logistics, and industrial companies
              reduce costs, improve safety, and maximize fleet efficiency.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                See Features
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 } },
              }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {[
                { value: '50K+', label: 'Vehicles' },
                { value: '99.9%', label: 'Uptime' },
                { value: '45%', label: 'Cost Reduction' },
                { value: '4.9', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-neutral-100">{stat.value}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden lg:block"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <AnimatedSection id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-100">
            Everything you need to manage your fleet
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto text-lg">
            From real-time tracking to predictive maintenance, FleetFlow gives you complete
            control over every aspect of your fleet operations.
          </p>
        </motion.div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group relative p-6 rounded-xl bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 h-full"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-4', feature.color)}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

function TestimonialsSection() {
  return (
    <AnimatedSection id="solutions" className="py-24 md:py-32 bg-neutral-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-100">
            Trusted by industry leaders
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto text-lg">
            Thousands of fleet operators rely on FleetFlow to power their daily operations.
          </p>
        </motion.div>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 h-full flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-sm text-neutral-300 leading-relaxed flex-1 mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-semibold text-blue-400">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-100">{testimonial.name}</div>
                    <div className="text-xs text-neutral-500">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

function PricingSection() {
  const router = useRouter()

  return (
    <AnimatedSection id="pricing" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-100">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto text-lg">
            Choose the plan that fits your fleet size. No hidden fees, no surprises.
          </p>
        </motion.div>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <motion.div
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className={cn(
                  'relative p-6 rounded-xl border transition-all duration-300 h-full flex flex-col',
                  plan.popular
                    ? 'bg-blue-500/5 border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-neutral-900/50 border-neutral-800/50 hover:border-neutral-700/50',
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                    Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-100">{plan.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-neutral-100">{plan.price}</span>
                  {plan.unit && (
                    <span className="text-sm text-neutral-500 ml-1">{plan.unit}</span>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-400">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      router.push('/login')
                    } else {
                      router.push('/dashboard')
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

function CTASection() {
  const router = useRouter()

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_60%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-100 max-w-3xl mx-auto leading-[1.15]">
            Ready to transform your fleet operations?
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-xl mx-auto">
            Join thousands of companies already using FleetFlow to streamline their fleet management.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8"
          >
            <Button
              size="lg"
              onClick={() => router.push('/dashboard')}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  const router = useRouter()

  const footerColumns = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Help Center', 'Community'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
    },
  ]

  return (
    <footer className="border-t border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 group mb-4"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-semibold text-neutral-100">FleetFlow</span>
            </button>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              AI-powered fleet management platform for transport, logistics, mining, and construction companies.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-neutral-100 mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} FleetFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">Twitter</a>
            <a href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">LinkedIn</a>
            <a href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingContent() {
  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      <Nav />
      <Hero />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
