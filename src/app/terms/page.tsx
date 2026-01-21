export default function TermsPage() {
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
          Terms of Service
        </h1>
        
        <div style={{ color: '#475569', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ marginBottom: '16px' }}>
            By accessing or using Plannerum, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            2. User Accounts
          </h2>
          <p style={{ marginBottom: '16px' }}>
            When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            3. User Content
          </h2>
          <p style={{ marginBottom: '16px' }}>
            You retain ownership of any content you submit to Plannerum. By submitting content, you grant us a worldwide, non-exclusive license to use, reproduce, and display that content for the purpose of providing our services.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            4. Acceptable Use
          </h2>
          <p style={{ marginBottom: '16px' }}>
            You agree not to:
          </p>
          <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
            <li>Use the service for any illegal purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Infringe upon the rights of others</li>
            <li>Interfere with or disrupt the service</li>
            <li>Attempt to gain unauthorized access to any part of the service</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            5. Service Availability
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We strive to provide a reliable service but cannot guarantee uninterrupted access. We may modify, suspend, or discontinue any aspect of the service at any time.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            6. Limitation of Liability
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Plannerum shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            7. Changes to Terms
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            8. Governing Law
          </h2>
          <p style={{ marginBottom: '16px' }}>
            These terms shall be governed by the laws of the United States, without regard to its conflict of law provisions.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            9. Contact Information
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Questions about these Terms of Service should be sent to:
          </p>
          <p>
            <strong>Email:</strong> legal@plannerum.com
          </p>
        </div>
      </div>
    </div>
  )
}
