import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import SmoothScroll from './components/layout/SmoothScroll';
import PopupTestPage from './pages/PopupTestPage';

// Root application — wraps everything with SmoothScroll (Lenis) for butter-smooth inertia scrolling
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/popup-test" element={<PopupTestPage />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
