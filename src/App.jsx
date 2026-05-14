import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EraPage from './pages/EraPage';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import SmoothScroll from './components/layout/SmoothScroll';
import MuseumPage from "./pages/MuseumPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/museum" element={<MuseumPage />} />
            <Route path="/era/:slug" element={<EraPage />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
