import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import CreationsPage from './pages/CreationsPage';
import SharedPage from './pages/SharedPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/creations" element={<CreationsPage />} />
      <Route path="/s/:id" element={<SharedPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
