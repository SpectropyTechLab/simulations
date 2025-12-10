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

  const validSubjects = ['Physics', 'Maths', 'Chemistry', 'Biology'];
  useEffect(() => {
    if (!validSubjects.includes(subject)) {
      navigate('/');
    }
  }, [subject, navigate]);

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
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Upload Simulation: {subject}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Chapter Name:</label>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="e.g., Newton's Laws"
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            required
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Upload HTML File:</label>
          <input type="file" accept=".html" onChange={handleFile} required />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '15px', padding: '10px 20px' }}
        >
          {loading ? 'Uploading...' : 'Upload Simulation'}
        </button>
      </form>

      {htmlPreview && (
        <div style={{ marginTop: '30px' }}>
          <h3>Preview:</h3>
          <iframe
            srcDoc={htmlPreview}
            title="Simulation Preview"
            style={{
              width: '100%',
              height: '400px',
              border: '1px solid #ddd',
              marginTop: '10px',
            }}
          />
        </div>
      )}

      {uploadUrl && (
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e6f4ea' }}>
          <h3>✅ Successfully Uploaded!</h3>
          <p>Share this link (works in any browser):</p>
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: 'break-all', color: '#1a73e8' }}
          >
            {uploadUrl}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(uploadUrl)}
            style={{ marginLeft: '10px' }}
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
}