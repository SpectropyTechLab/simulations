// frontend/src/UploadForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UploadForm() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState('');
  const [file, setFile] = useState(null);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingSimulations, setExistingSimulations] = useState([]);
  const [fetching, setFetching] = useState(true);

  const validSubjects = ['Physics', 'Maths', 'Chemistry', 'Biology'];

  // Validate subject
  useEffect(() => {
    if (!validSubjects.includes(subject)) {
      navigate('/');
    }
  }, [subject, navigate]);

  // Fetch existing simulations
  useEffect(() => {
    const fetchSimulations = async () => {
      setFetching(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/simulations?subject=${encodeURIComponent(subject)}`
        );
        console.log('subject simulation',res );
        if (res.ok) {
          const sims = await res.json();
          setExistingSimulations(sims);
        } else {
          setError('Failed to load existing simulations');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error while loading simulations');
      } finally {
        setFetching(false);
      }
    };

    if (subject) fetchSimulations();
  }, [subject]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'text/html') {
      setError('Only .html files allowed');
      setFile(null);
      setHtmlPreview('');
      return;
    }
    setFile(f);
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setHtmlPreview(reader.result);
      setUploadUrl('');
    };
    reader.readAsText(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chapter || !file || !htmlPreview) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          chapter,
          htmlContent: htmlPreview,
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setUploadUrl(data.url);
        // Refetch list to include new simulation
        const newRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/simulations?subject=${encodeURIComponent(subject)}`
        );
        if (newRes.ok) {
          const updated = await newRes.json();
          setExistingSimulations(updated);
        }
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadSimulation = (sim) => {
    setHtmlPreview(sim.html_content);
    setUploadUrl(sim.url);
    setChapter('');
    setFile(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 60px)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          flex: '0 0 400px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <button
      onClick={() => navigate('/')}
      style={{
        background: 'none',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '14px',
        color: '#3182ce',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      ← Back
    </button>
        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1e293b' }}>
          Upload Simulation: {subject}
        </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '6px',
                color: '#334155',
              }}
            >
              Chapter Name:
            </label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g., Newton's Laws"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '15px',
              }}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '6px',
                color: '#334155',
              }}
            >
              Upload HTML File:
            </label>
            <input
              type="file"
              accept=".html"
              onChange={handleFile}
              style={{ width: '100%' }}
              required
            />
          </div>

          {error && <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 16px',
              backgroundColor: loading ? '#cbd5e1' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Uploading...' : 'Upload Simulation'}
          </button>
        </form>

        {/* Existing Simulations */}
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
            📂 Existing Simulations ({fetching ? '...' : existingSimulations.length})
          </h3>
          {fetching ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>Loading...</p>
          ) : existingSimulations.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '250px', overflowY: 'auto' }}>
              {existingSimulations.map((sim) => (
                <li
                  key={sim.id}
                  onClick={() => loadSimulation(sim)}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: '1px solid #e2e8f0',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  <span>📄</span> {sim.chapter}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
              No simulations uploaded yet for {subject}.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
          🖥️ Preview & Share
        </h3>

        <div
          style={{
            flex: 1,
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
          }}
        >
          {htmlPreview ? (
            <iframe
              srcDoc={htmlPreview}
              title="Simulation Preview"
              style={{ width: '100%', height: '100%', minHeight: '300px', border: 'none' }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#94a3b8',
                fontSize: '16px',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              ⬅️ Upload a file or select an existing simulation
            </div>
          )}
        </div>

        {uploadUrl && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontWeight: 500, color: '#166534' }}>
              ✅ Successfully Uploaded!
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href={uploadUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  color: '#1d4ed8',
                  textDecoration: 'underline',
                  wordBreak: 'break-all',
                  fontSize: '14px',
                }}
              >
                {uploadUrl}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(uploadUrl)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}