// frontend/src/SubjectSelector.jsx
import { useNavigate } from 'react-router-dom';

const subjects = ['Physics', 'Maths', 'Chemistry', 'Biology'];

export default function SubjectSelector() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Select Subject</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => navigate(`/upload/${sub}`)}
            style={{
              padding: '15px 25px',
              fontSize: '18px',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}