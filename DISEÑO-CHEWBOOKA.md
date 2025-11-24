# Sistema de Diseño Chewbooka - Guía Completa

## 📋 Estructura de Archivos

```
src/
├── styles/
│   ├── variables.css       ← Variables CSS globales (colores, espaciados, etc.)
│   └── globals.css         ← Estilos globales (reset, base, componentes base)
├── components/
│   ├── LoginForm.jsx       ← Componente de ejemplo
│   └── LoginForm.css       ← Estilos del componente
├── index.css               ← Importa variables y estilos globales
├── App.jsx                 ← Componente raíz
└── main.jsx                ← Importa index.css para aplicar estilos globalmente
```

## 🎨 Cómo Funciona Todo Junto

### 1. **Variables CSS** (`styles/variables.css`)
   - **¿Qué es?** Define todas las variables de diseño en un solo lugar
   - **¿Por qué?** Permite cambiar el diseño de toda la app desde un archivo
   - **Ejemplo:** `--color-primary: #1890ff;`
   - **Cómo usar:** `color: var(--color-primary);`

### 2. **Estilos Globales** (`styles/globals.css`)
   - **¿Qué es?** Estilos base aplicados a toda la app
   - **¿Por qué?** Mantiene consistencia visual
   - **Incluye:** Reset, tipografía, botones, inputs, cards
   - **Ejemplo:** Todos los botones usan `--border-radius-md`

### 3. **Index.css**
   - **¿Qué es?** Importa variables y estilos globales en orden
   - **¿Por qué?** Las variables deben estar disponibles antes de usarse
   - **Orden:** Variables → Globales → Específicos

### 4. **Main.jsx**
   - **¿Qué hace?** Importa `index.css` para aplicar estilos globalmente
   - **¿Por qué?** Todos los componentes heredan estos estilos

### 5. **Componentes**
   - **¿Qué hacen?** Usan las variables y estilos globales
   - **¿Cómo?** Referencian variables con `var(--nombre-variable)`
   - **Ejemplo:** `<div style={{ color: 'var(--color-primary)' }}>`

## 🎯 Cómo Usar el Sistema de Diseño

### En archivos CSS:
```css
.mi-componente {
  /* Usa variables directamente */
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  
  /* O combínalas */
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
}
```

### En componentes React (inline styles):
```jsx
function MiComponente() {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--spacing-lg)',
      borderRadius: 'var(--border-radius-xl)',
    }}>
      Contenido
    </div>
  );
}
```

### En componentes React (con CSS modules o archivo CSS):
```jsx
import './MiComponente.css';

function MiComponente() {
  return (
    <div className="mi-componente">
      Contenido
    </div>
  );
}
```

```css
/* MiComponente.css */
.mi-componente {
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-xl);
}
```

## 📐 Sistema de Variables Explicado

### Colores
- `--color-primary`: Azul principal (#1890ff)
- `--bg-primary`: Fondo oscuro principal (#0f1419)
- `--text-primary`: Texto principal (blanco con opacidad)

### Espaciados
- `--spacing-xs` a `--spacing-xxxl`: Sistema de espaciado consistente
- **Regla:** Siempre usa estas variables, no valores hardcodeados

### Tipografía
- `--font-family-primary`: Fuente principal
- `--font-size-xs` a `--font-size-huge`: Escala tipográfica
- `--font-weight-light` a `--font-weight-bold`: Pesos de fuente

### Bordes
- `--border-radius-sm` a `--border-radius-full`: Radios de borde
- `--border-color`: Color de borde consistente

### Sombras
- `--shadow-xs` a `--shadow-xl`: Sistema de sombras
- Crea profundidad y jerarquía visual

### Transiciones
- `--transition-fast`: 0.15s (hovers rápidos)
- `--transition-base`: 0.3s (estándar)
- `--transition-slow`: 0.5s (modales, cambios de página)

## 🔄 Cómo Personalizar el Diseño

### Cambiar colores:
1. Abre `src/styles/variables.css`
2. Modifica `--color-primary` por el color que quieras
3. ¡Todo el app cambia automáticamente!

### Cambiar espaciados:
1. Modifica `--spacing-md`, `--spacing-lg`, etc.
2. Todos los componentes que los usan se actualizan

### Añadir nuevos estilos:
1. Añade nuevas variables en `variables.css`
2. Úsalas en tus componentes con `var(--nueva-variable)`

## 💡 Mejores Prácticas

### ✅ HACER:
- Siempre usar variables en lugar de valores hardcodeados
- Seguir el sistema de espaciado existente
- Usar las clases base (`.card`, `.btn-primary`, etc.)
- Mantener consistencia con el sistema de diseño

### ❌ NO HACER:
- No usar colores hardcodeados (`color: #1890ff;` → usar `var(--color-primary)`)
- No usar espaciados arbitrarios (`padding: 23px;` → usar variables)
- No crear estilos que rompan la consistencia
- No ignorar el sistema de variables

## 📱 Responsive Design

El sistema incluye breakpoints definidos:
- `--breakpoint-xs`: 480px (móviles pequeños)
- `--breakpoint-sm`: 768px (móviles grandes)
- `--breakpoint-md`: 1024px (tablets)
- `--breakpoint-lg`: 1280px (desktop)
- `--breakpoint-xl`: 1920px (pantallas grandes)

Usar con media queries:
```css
@media (max-width: 768px) {
  .mi-componente {
    padding: var(--spacing-sm); /* Menos padding en móvil */
  }
}
```

## 🎓 Aprender Haciendo

1. **Crea un nuevo componente** usando las variables
2. **Cambia algunos colores** en `variables.css` y ve cómo cambia todo
3. **Modifica espaciados** y observa el impacto
4. **Experimenta** combinando variables

## 🔗 Flujo de Aplicación de Estilos

```
main.jsx
  ↓
importa index.css
  ↓
index.css
  ↓
importa variables.css → define --color-primary, --spacing-md, etc.
  ↓
importa globals.css → usa var(--color-primary), var(--spacing-md)
  ↓
Componentes
  ↓
usan var(--color-primary), clases .card, etc.
  ↓
Resultado: Diseño consistente en toda la app
```

## ❓ Preguntas Frecuentes

**¿Por qué usar variables CSS y no JavaScript?**
- Las variables CSS son más rápidas (nativas del navegador)
- Funcionan en cualquier archivo CSS
- Se pueden cambiar dinámicamente con JavaScript si es necesario

**¿Puedo añadir más variables?**
- ¡Sí! Añádelas en `variables.css` y úsalas donde necesites

**¿Qué pasa si quiero cambiar el diseño de toda la app?**
- Solo modifica las variables en `variables.css`
- Todo se actualiza automáticamente

**¿Cómo creo un tema oscuro/claro?**
- Usa `[data-theme="dark"]` o `[data-theme="light"]` en `variables.css`
- Cambia las variables dentro de esos selectores


