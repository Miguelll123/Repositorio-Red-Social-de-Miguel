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
import Register from './components/Register';
import Login from './components/Login';
import {store} from './app/store';
import {Provider} from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to="/login" replace />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
