import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import CreationsPage from './pages/CreationsPage';
import SharedPage from './pages/SharedPage';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/creations" element={<CreationsPage />} />
        <Route path="/s/:id" element={<SharedPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}
