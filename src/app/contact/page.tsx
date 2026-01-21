'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Тут буде логіка відправки форми
    setSubmitted(true)
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '48px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '48px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#0f172a',
          marginBottom: '24px'
        }}>
          Contact Us
        </h1>
        
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#475569', marginBottom: '16px' }}>
            Have questions, feedback, or need support? We'd love to hear from you!
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '48px'
        }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
              Get in Touch
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>Email</div>
                <div style={{ color: '#475569' }}>support@plannerum.com</div>
              </div>
              <div>
                <div style={{ fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>Twitter</div>
                <div style={{ color: '#475569' }}>@plannerum</div>
              </div>
              <div>
                <div style={{ fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>GitHub</div>
                <div style={{ color: '#475569' }}>github.com/plannerum</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <details style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                <summary style={{ fontWeight: '500', color: '#0f172a', cursor: 'pointer' }}>
                  Is Plannerum free to use?
                </summary>
                <p style={{ color: '#475569', marginTop: '8px' }}>
                  Yes! Plannerum is completely free for basic event planning features.
                </p>
              </details>
              <details style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                <summary style={{ fontWeight: '500', color: '#0f172a', cursor: 'pointer' }}>
                  Can I use Plannerum without an account?
                </summary>
                <p style={{ color: '#475569', marginTop: '8px' }}>
                  You can vote on events without an account, but creating events requires registration.
                </p>
              </details>
              <details style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                <summary style={{ fontWeight: '500', color: '#0f172a', cursor: 'pointer' }}>
                  How do I delete my account?
                </summary>
                <p style={{ color: '#475569', marginTop: '8px' }}>
                  Go to your account settings and click "Delete Account". All your data will be permanently removed.
                </p>
              </details>
            </div>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
            Send us a Message
          </h3>
          
          {submitted ? (
            <div style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              Thank you for your message! We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>
              
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
