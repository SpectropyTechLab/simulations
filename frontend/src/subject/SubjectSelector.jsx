// frontend/src/SubjectSelector.jsx
import { useNavigate } from 'react-router-dom';

const subjects = [
  { name: 'Physics', emoji: '⚛️' },
  { name: 'Maths', emoji: '➗' },
  { name: 'Chemistry', emoji: '🧪' },
  { name: 'Biology', emoji: '🧬' },
];

export default function SubjectSelector() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px',
        backgroundColor: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          fontSize: '36px',
          fontWeight: 600,
          color: '#1e293b',
          marginBottom: '24px',
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}
      >
        Select Subject
      </h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {subjects.map((sub) => (
          <button
            key={sub.name}
            onClick={() => navigate(`/upload/${sub.name}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '140px',
              height: '120px',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#2d3748',
              fontSize: '16px',
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
          >
            <span style={{ fontSize: '32px', marginBottom: '8px' }}>
              {sub.emoji}
            </span>
            <span>{sub.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}