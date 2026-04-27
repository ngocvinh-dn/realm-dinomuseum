<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import SmoothScroll from './components/layout/SmoothScroll';

// Root application — wraps everything with SmoothScroll (Lenis) for butter-smooth inertia scrolling
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
=======
import PopupTestPage from "./pages/PopupTestPage";

<Route path="/popup-test" element={<PopupTestPage />} />
>>>>>>> 6acb2ed8cd15b4fe3ddc722df657d78b2ce1ec3b
