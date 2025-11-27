/* 
 * APP.JSX - CHEWBOOKA
 * ============================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * - Es el componente raíz de la aplicación
 * - Renderiza los componentes principales
 * - Por aquí pasa todo el contenido
 */

import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from './app/store';
import AppLayout from './common/Layout/AppLayout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/posts/Dashboard';
import Search from './pages/Search';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas (sin layout) */}
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />
          
          {/* Rutas protegidas (con layout y sidebar) */}
          <Route path='/' element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='search' element={<Search />} />
            <Route path='profile' element={<Profile />} />
            <Route path='create-post' element={<CreatePost />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
