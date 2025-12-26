'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// Стилі як об'єкт для TypeScript
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '16px 32px'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#1e293b',
    fontWeight: 'bold',
    fontSize: '20px'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  navButtons: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  buttonPrimary: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  buttonSecondary: {
    padding: '8px 16px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#475569',
    fontSize: '16px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  hero: {
    background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
    padding: '96px 32px',
    textAlign: 'center' as const
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '24px'
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#475569',
    maxWidth: '800px',
    margin: '0 auto 40px',
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap' as const
  },
  stats: {
    backgroundColor: 'white',
    padding: '64px 32px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  statItem: {
    textAlign: 'center' as const
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: '8px'
  },
  statLabel: {
    color: '#64748b',
    fontSize: '18px'
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 32px'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '16px',
    textAlign: 'center' as const
  },
  cta: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '80px 32px',
    textAlign: 'center' as const
  },
  ctaTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '24px'
  },
  ctaSubtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.9
  }
}

export default function HomePage() {
  const { data: session, status } = useSession()

  return (
    <div style={styles.container}>
      {/* Навігація */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logo}>
            <div style={styles.logoIcon}>P</div>
            Plannerum
          </Link>
          
          <div style={styles.navButtons}>
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" style={styles.buttonPrimary}>
                  Dashboard
                </Link>
                <Link href="/create-event" style={styles.buttonSecondary}>
                  Create Event
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin" style={styles.buttonSecondary}>
                  Sign In
                </Link>
                <Link href="/auth/signup" style={styles.buttonPrimary}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Герой секція */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Plan Events
          <br />
          <span style={{ color: '#3b82f6' }}>Together, Effortlessly</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Create events, propose dates, and vote together. Find the perfect time that works for everyone with our collaborative planning platform.
        </p>
        <div style={styles.heroButtons}>
          {status === 'authenticated' ? (
            <>
              <Link href="/create-event" style={styles.buttonPrimary}>
                Create Free Event
              </Link>
              <Link href="/dashboard" style={styles.buttonSecondary}>
                My Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signup" style={styles.buttonPrimary}>
                Get Started Free
              </Link>
              <Link href="/auth/signin" style={styles.buttonSecondary}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Статистика */}
      <div style={styles.stats}>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>10,000+</div>
            <div style={styles.statLabel}>Events Created</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>50,000+</div>
            <div style={styles.statLabel}>Happy Users</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>98%</div>
            <div style={styles.statLabel}>Satisfaction</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Support</div>
          </div>
        </div>
      </div>

      {/* Як це працює */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How Plannerum Works</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginTop: '48px'
        }}>
          {[
            { number: '1', title: 'Create Event', desc: 'Easily create events and propose multiple dates' },
            { number: '2', title: 'Invite Friends', desc: 'Share links with friends and colleagues' },
            { number: '3', title: 'Vote on Dates', desc: 'Participants vote on dates that work best' },
            { number: '4', title: 'See Results', desc: 'Real-time results show popular dates' },
          ].map((step) => (
            <div key={step.number} style={{
              textAlign: 'center',
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1d4ed8',
                margin: '0 auto 16px'
              }}>
                {step.number}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                {step.title}
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.5' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Simplify Planning?</h2>
        <p style={styles.ctaSubtitle}>
          Join thousands who plan events without the back-and-forth emails
        </p>
        <Link
          href={status === 'authenticated' ? '/create-event' : '/auth/signup'}
          style={{
            ...styles.buttonPrimary,
            backgroundColor: 'white',
            color: '#3b82f6',
            padding: '12px 32px',
            fontSize: '18px'
          }}
        >
          Start Planning Free
        </Link>
        <p style={{ marginTop: '24px', fontSize: '14px', opacity: 0.8 }}>
          No credit card required • Free forever for basic features
        </p>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '48px 32px',
        textAlign: 'center' as const
      }}>
        <p>© {new Date().getFullYear()} Plannerum. All rights reserved.</p>
        <div style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap' as const
        }}>
          <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms</Link>
          <Link href="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</Link>
          <Link href="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About</Link>
        </div>
      </footer>
    </div>
  )
}
