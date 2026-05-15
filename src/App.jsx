import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import EraPage from './pages/EraPage';
import MuseumPage from "./pages/MuseumPage";
import GlobePage from './pages/GlobePage'; 
import DinoArchive from './pages/DinoArchive';
import SmoothScroll from './components/layout/SmoothScroll';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<DinoArchive />} />
            <Route path="/explore" element={<GlobePage />} />
            <Route path="/museum" element={<MuseumPage />} />
            <Route path="/era/:slug" element={<EraPage />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;