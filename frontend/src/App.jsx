// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SubjectSelector from './subject/SubjectSelector';
import UploadForm from './subject/UploadForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubjectSelector />} />
        <Route path="/upload/:subject" element={<UploadForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;