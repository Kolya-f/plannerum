export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        
        <div style={{ color: '#475569', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: '16px' }}>
            When you use Plannerum, we collect information you provide directly to us, such as:
          </p>
          <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
            <li>Account information (name, email address)</li>
            <li>Event details you create</li>
            <li>Votes and preferences for event dates</li>
            <li>Communications with other users</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            2. How We Use Your Information
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We use the information we collect to:
          </p>
          <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            3. Information Sharing
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We do not sell, trade, or rent your personal information to third parties. We may share information:
          </p>
          <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
            <li>With other users as part of the event planning process</li>
            <li>With service providers who assist in our operations</li>
            <li>When required by law or to protect rights</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            4. Data Security
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            5. Your Rights
          </h2>
          <p style={{ marginBottom: '16px' }}>
            You have the right to:
          </p>
          <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Object to processing of your data</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            6. Contact Us
          </h2>
          <p style={{ marginBottom: '16px' }}>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@plannerum.com
          </p>
        </div>
      </div>
    </div>
  )
}
