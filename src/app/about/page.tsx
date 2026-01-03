export default function AboutPage() {
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
          About Plannerum
        </h1>
        
        <div style={{ color: '#475569', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '24px', fontSize: '18px' }}>
            Plannerum is a collaborative event planning platform designed to make scheduling meetings, 
            parties, and gatherings effortless for everyone involved.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            Our Mission
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We believe that planning events should be simple, collaborative, and stress-free. 
            Our mission is to eliminate the back-and-forth emails and confusion that often 
            accompany event planning.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            How It Started
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Plannerum was born out of frustration with existing scheduling tools. As a team of 
            remote workers, we constantly struggled to find meeting times that worked for everyone 
            across different time zones. We built Plannerum to solve our own problem, and now 
            we're excited to share it with the world.
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            Our Team
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We're a small, passionate team of developers, designers, and product managers 
            who believe in building tools that make people's lives easier. We're distributed 
            across multiple time zones, so we use Plannerum every day to coordinate our own work!
          </p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            Features
          </h2>
          <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
            <li>Easy event creation with multiple date options</li>
            <li>Simple voting system for participants</li>
            <li>Real-time results and analytics</li>
            <li>Public and private event options</li>
            <li>No account required for voting</li>
            <li>Mobile-friendly design</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            Values
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0369a1', marginBottom: '8px' }}>Simplicity</h3>
              <p style={{ fontSize: '14px', color: '#475569' }}>We keep things simple and intuitive</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>Collaboration</h3>
              <p style={{ fontSize: '14px', color: '#475569' }}>Everything is designed for teamwork</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>Accessibility</h3>
              <p style={{ fontSize: '14px', color: '#475569' }}>Free and accessible to everyone</p>
            </div>
          </div>
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', margin: '32px 0 16px' }}>
            Join Our Community
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We're always looking for feedback and new ideas. Join our growing community 
            of users who are making event planning simpler every day.
          </p>
          
          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
              Made with ❤️ by the Plannerum team
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
