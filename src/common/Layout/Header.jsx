import './Header.css';
import { useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';

export default function Header() {
  const [imageError, setImageError] = useState(false);
  
  // URL directa de Imgur - Si no funciona, necesitas obtenerla desde:
  // 1. Abre https://imgur.com/a/ajkBqFm en el navegador
  // 2. Haz clic en la imagen para abrirla
  // 3. Clic derecho → "Copiar dirección de imagen"
  // 4. Pega esa URL aquí
  const logoUrl = "https://imgur.com/a/x2DOJyl";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          Chewbooka
          <span className="header-icon">
            {!imageError && logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Chewbooka Logo"
                onError={handleImageError}
              />
            ) : (
              <SmileOutlined style={{ fontSize: '40px', color: 'var(--color-primary)' }} />
            )}
          </span>
        </h1>  
      </div>
    </header>
  );
}
