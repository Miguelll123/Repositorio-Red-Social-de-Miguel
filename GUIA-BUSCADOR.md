# 🔍 GUÍA COMPLETA: IMPLEMENTAR BUSCADOR CON useParams, slice y service

## 📋 RESUMEN DEL FLUJO

```
Usuario escribe en input → Presiona Enter → navigate() actualiza URL → 
useParams lee URL → useEffect detecta cambio → dispatch(searchByTitle) → 
Service llama backend → Slice actualiza Redux → Componente muestra resultados
```

---

## 📁 ARCHIVO 1: `postService.js`

### 📍 Ubicación:
`src/features/posts/postService.js`

### 🎯 ¿De qué se encarga?
- **Función**: Hacer llamadas HTTP al backend
- **Responsabilidad**: Comunicarse con la API, NO maneja estado

### 📝 ¿Qué información va aquí?

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/posts';

// Función existente (NO tocar)
const getALl = async()=>{
    const res = await axios.get(API_URL);
    return res.data
};

// ✅ NUEVA FUNCIÓN A AGREGAR:
const searchByTitle = async(title)=>{
    const res = await axios.get(`${API_URL}/title/${title}`);
    return res.data
};

// Exportar ambas funciones
const postService = {
    getALl,
    searchByTitle  // ← Agregar esta línea
};

export default postService
```

### ❓ ¿Por qué aquí?
- **Separación de responsabilidades**: El service solo se encarga de HTTP
- **Reutilizable**: Puedes usar `searchByTitle` desde cualquier componente
- **Fácil de testear**: Puedes probar las llamadas HTTP independientemente

### 🔍 Detalles importantes:
- `title` es el parámetro que recibe (ej: "perro")
- El endpoint del backend es: `GET /posts/title/:title`
- Devuelve directamente un **array de posts** (no un objeto con `{posts: [...]}`)

---

## 📁 ARCHIVO 2: `postSlice.js`

### 📍 Ubicación:
`src/features/posts/postSlice.js`

### 🎯 ¿De qué se encarga?
- **Función**: Manejar el estado de Redux (posts, loading, etc.)
- **Responsabilidad**: Crear acciones/thunks y actualizar el estado global

### 📝 ¿Qué información va aquí?

#### PARTE 1: Crear el thunk (después de `getALl`)

```javascript
// ✅ NUEVO THUNK A AGREGAR (después de getALl):
export const searchByTitle = createAsyncThunk("posts/searchByTitle",async(title)=>{
    try {
     return await postService.searchByTitle(title);
    } catch(error) {
        console.error(error)
    }
})
```

**Explicación:**
- `createAsyncThunk`: Crea una acción asíncrona
- `"posts/searchByTitle"`: Nombre único de la acción
- `async(title)`: Recibe el título a buscar
- Llama a `postService.searchByTitle(title)` que hace la petición HTTP

#### PARTE 2: Agregar casos en extraReducers

```javascript
extraReducers:(builder)=>{
    builder
    // Casos existentes de getALl (NO tocar)
    .addCase(getALl.fulfilled,(state,action)=>{
        state.posts=action.payload.posts;
        state.isLoading=false;
    })
    .addCase(getALl.pending,(state)=>{
        state.isLoading=true;
    })
    
    // ✅ NUEVOS CASOS A AGREGAR:
    .addCase(searchByTitle.fulfilled,(state,action)=>{
        state.posts=action.payload;  // ← Importante: es action.payload directamente (array)
        state.isLoading=false;
    })
    .addCase(searchByTitle.pending,(state)=>{
        state.isLoading=true;
    })
}
```

**Explicación:**
- `searchByTitle.pending`: Se ejecuta cuando empieza la búsqueda → `isLoading = true`
- `searchByTitle.fulfilled`: Se ejecuta cuando termina exitosamente → guarda posts y `isLoading = false`
- **IMPORTANTE**: `action.payload` es directamente un array (no `action.payload.posts` como en `getALl`)

### ❓ ¿Por qué aquí?
- **Estado global**: Los posts quedan disponibles en toda la app
- **Manejo de loading**: Puedes mostrar "Cargando..." mientras busca
- **Redux Toolkit**: Maneja automáticamente pending/fulfilled/rejected

### 🔍 Diferencias importantes:

| Acción | Backend devuelve | Cómo guardar en Redux |
|--------|------------------|----------------------|
| `getALl` | `{posts: [...]}` | `state.posts = action.payload.posts` |
| `searchByTitle` | `[...]` (array directo) | `state.posts = action.payload` |

---

## 📁 ARCHIVO 3: `App.jsx`

### 📍 Ubicación:
`src/App.jsx`

### 🎯 ¿De qué se encarga?
- **Función**: Definir las rutas de la aplicación
- **Responsabilidad**: Configurar React Router

### 📝 ¿Qué información va aquí?

**CAMBIAR ESTA LÍNEA:**

```javascript
// ❌ ANTES:
<Route path='search' element={<Search />} />

// ✅ DESPUÉS:
<Route path='search/:searchTerm?' element={<Search />} />
```

**Explicación:**
- `:searchTerm` = parámetro dinámico (ej: `/search/perro` → `searchTerm = "perro"`)
- `?` = hace el parámetro **opcional** (permite `/search` sin parámetro)
- Sin `?`: la ruta `/search` sin parámetro daría error

### ❓ ¿Por qué aquí?
- **React Router**: Necesita saber qué rutas aceptan parámetros
- **useParams**: Solo funciona si la ruta tiene `:nombreParametro`

### 🔍 Rutas posibles:
- `/search` → `searchTerm = undefined`
- `/search/perro` → `searchTerm = "perro"`
- `/search/mi%20post` → `searchTerm = "mi post"` (URL encoding automático)

---

## 📁 ARCHIVO 4: `Search.jsx`

### 📍 Ubicación:
`src/pages/Search.jsx`

### 🎯 ¿De qué se encarga?
- **Función**: Componente de la página de búsqueda
- **Responsabilidad**: UI, manejar input, mostrar resultados

### 📝 ¿Qué información va aquí?

#### IMPORTS (al inicio del archivo):

```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from 'antd';
import { getALl, searchByTitle } from '../../features/posts/postSlice';
import Post from './posts/Post';
```

**Explicación de cada import:**
- `useState`: Para el estado local del input
- `useEffect`: Para ejecutar código cuando cambia algo
- `useParams`: Para leer parámetros de la URL
- `useNavigate`: Para actualizar la URL programáticamente
- `useSelector`: Para leer datos de Redux
- `useDispatch`: Para ejecutar acciones de Redux
- `Input`: Componente de Ant Design para el input
- `getALl, searchByTitle`: Acciones de Redux
- `Post`: Componente para mostrar posts (reutilizar)

#### ESTADO Y HOOKS (dentro del componente):

```javascript
export default function Search() {
  // 1. useParams: Leer parámetro de la URL
  const { searchTerm } = useParams();
  // Si URL = /search/perro → searchTerm = "perro"
  // Si URL = /search → searchTerm = undefined
  
  // 2. useNavigate: Para actualizar la URL
  const navigate = useNavigate();
  
  // 3. Redux: Obtener posts y estado
  const { posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  
  // 4. Estado local: Para el input (lo que el usuario está escribiendo)
  const [inputValue, setInputValue] = useState(searchTerm || '');
  // Si hay searchTerm en la URL, lo pone en el input
  // Si no, input vacío
}
```

#### useEffect 1: Cargar posts al abrir (si no hay búsqueda)

```javascript
// Se ejecuta UNA VEZ cuando el componente se monta
useEffect(() => {
  if (!searchTerm) {
    // Si no hay término de búsqueda, cargar todos los posts
    dispatch(getALl());
  }
}, []); // Array vacío = solo se ejecuta al montar
```

**¿Cuándo se ejecuta?**
- Cuando abres `/search` por primera vez
- Solo si NO hay `searchTerm` en la URL

#### useEffect 2: Buscar cuando cambia searchTerm

```javascript
// Se ejecuta cada vez que searchTerm cambia
useEffect(() => {
  if (searchTerm) {
    // Si hay término de búsqueda, buscar
    dispatch(searchByTitle(searchTerm));
  } else {
    // Si no hay término, cargar todos
    dispatch(getALl());
  }
}, [searchTerm, dispatch]); // Se ejecuta cuando searchTerm o dispatch cambian
```

**¿Cuándo se ejecuta?**
- Cuando cambias de `/search` a `/search/perro`
- Cuando cambias de `/search/perro` a `/search/gato`
- Cuando cambias de `/search/perro` a `/search` (sin parámetro)

**Flujo:**
1. Usuario presiona Enter → `navigate('/search/perro')`
2. URL cambia → `useParams` actualiza `searchTerm = "perro"`
3. `useEffect` detecta cambio → ejecuta `dispatch(searchByTitle("perro"))`
4. Redux busca en backend → actualiza `state.posts`
5. Componente re-renderiza → muestra resultados

#### Función handleSearch: Conectar input con URL

```javascript
const handleSearch = (value) => {
  // value = lo que el usuario escribió en el input
  if (value.trim()) {
    // Si hay texto, actualizar URL con el término
    navigate(`/search/${value.trim()}`);
    // Esto actualiza la URL → useParams lee el cambio → useEffect busca
  } else {
    // Si está vacío, ir a /search sin parámetro
    navigate('/search');
  }
};
```

**¿Cuándo se ejecuta?**
- Cuando presionas Enter en el input
- Cuando haces clic en el botón "Buscar" (si usas `Input.Search`)

#### JSX (return):

```javascript
return (
  <div>
    <h1>Buscador</h1>
    
    {/* Input de búsqueda */}
    <Input.Search
      placeholder="Buscar posts por título..."
      value={inputValue}  // Lo que está escrito
      onChange={(e) => setInputValue(e.target.value)}  // Actualizar mientras escribes
      onSearch={handleSearch}  // Ejecutar cuando presionas Enter
      enterButton="Buscar"
      size="large"
      style={{ marginBottom: '20px', maxWidth: '500px' }}
    />

    {/* Mostrar loading */}
    {isLoading && <p>Cargando...</p>}

    {/* Mostrar resultados */}
    {!isLoading && (
      <>
        {/* Mostrar término de búsqueda si existe */}
        {searchTerm && (
          <p>Resultados para: <strong>{searchTerm}</strong></p>
        )}
        
        {/* Mostrar posts o mensaje de "no encontrados" */}
        {posts && posts.length > 0 ? (
          <Post />  // Reutiliza el componente Post que ya tienes
        ) : (
          <p>No se encontraron posts</p>
        )}
      </>
    )}
  </div>
);
```

### ❓ ¿Por qué esta estructura?

1. **Dos useEffects separados:**
   - Primero: Carga inicial (solo una vez)
   - Segundo: Reacciona a cambios en la URL

2. **Estado local (`inputValue`) vs URL (`searchTerm`):**
   - `inputValue`: Lo que escribes (no busca todavía)
   - `searchTerm`: Lo que está en la URL (sí busca)

3. **`navigate()` como puente:**
   - Conecta el input con la URL
   - Sin esto, el input no actualizaría la URL

---

## 🔄 FLUJO COMPLETO PASO A PASO

### Escenario 1: Usuario abre `/search`

```
1. Componente se monta
   ↓
2. useParams() → searchTerm = undefined
   ↓
3. useEffect 1 ejecuta → dispatch(getALl())
   ↓
4. Redux carga todos los posts
   ↓
5. Componente muestra todos los posts
```

### Escenario 2: Usuario busca "perro"

```
1. Usuario escribe "perro" en input
   → inputValue = "perro" (estado local)
   → NO se busca todavía
   ↓
2. Usuario presiona Enter
   → handleSearch("perro") ejecuta
   → navigate('/search/perro')
   → URL cambia
   ↓
3. useParams() detecta cambio
   → searchTerm = "perro" (de la URL)
   ↓
4. useEffect 2 detecta cambio en searchTerm
   → dispatch(searchByTitle("perro"))
   ↓
5. Redux ejecuta thunk
   → postService.searchByTitle("perro")
   → GET /posts/title/perro
   → Backend devuelve posts filtrados
   ↓
6. Slice actualiza Redux
   → state.posts = [posts filtrados]
   → state.isLoading = false
   ↓
7. Componente re-renderiza
   → useSelector obtiene posts actualizados
   → Muestra resultados
```

### Escenario 3: Usuario cambia búsqueda a "gato"

```
1. Usuario escribe "gato" en input
   → inputValue = "gato"
   ↓
2. Usuario presiona Enter
   → navigate('/search/gato')
   → URL cambia de /search/perro a /search/gato
   ↓
3. useParams() detecta cambio
   → searchTerm = "gato"
   ↓
4. useEffect 2 detecta cambio
   → dispatch(searchByTitle("gato"))
   ↓
5. (Mismo proceso que escenario 2)
```

---

## ⚠️ PUNTOS IMPORTANTES A RECORDAR

### 1. Diferencia en el payload del backend:

```javascript
// getALl devuelve:
{ posts: [...] }

// searchByTitle devuelve:
[...]  // Array directo
```

Por eso en el slice:
- `getALl.fulfilled`: `state.posts = action.payload.posts`
- `searchByTitle.fulfilled`: `state.posts = action.payload`

### 2. El parámetro en la ruta debe ser opcional:

```javascript
// ✅ Correcto:
path='search/:searchTerm?'

// ❌ Incorrecto:
path='search/:searchTerm'  // Daría error si vas a /search sin parámetro
```

### 3. El "puente" entre input y URL es `navigate()`:

Sin `navigate()`, el input no actualizaría la URL, y por tanto no se buscaría.

### 4. `useEffect` con dependencias:

```javascript
// Se ejecuta cuando searchTerm cambia
useEffect(() => {
  // ...
}, [searchTerm, dispatch]);
```

Si no pones `searchTerm` en las dependencias, no se ejecutará cuando cambie.

---

## 🐛 POSIBLES ERRORES Y SOLUCIONES

### Error 1: "Cannot read property 'posts' of undefined"
**Causa**: El backend de `searchByTitle` devuelve array directo, no objeto.
**Solución**: Usar `action.payload` directamente, no `action.payload.posts`.

### Error 2: "Route not found" al ir a `/search`
**Causa**: Falta el `?` en la ruta (parámetro no opcional).
**Solución**: Usar `path='search/:searchTerm?'`.

### Error 3: No se busca cuando escribes
**Causa**: Falta `navigate()` o `useEffect` no tiene `searchTerm` en dependencias.
**Solución**: Verificar que `handleSearch` use `navigate()` y que `useEffect` tenga `[searchTerm]`.

### Error 4: Se busca en cada letra (demasiadas peticiones)
**Causa**: Estás buscando en `onChange` en lugar de `onSearch`.
**Solución**: Usar `onSearch` (se ejecuta solo al presionar Enter).

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Agregar `searchByTitle` en `postService.js`
- [ ] Exportar `searchByTitle` en el objeto `postService`
- [ ] Crear thunk `searchByTitle` en `postSlice.js`
- [ ] Agregar casos `searchByTitle.pending` y `searchByTitle.fulfilled` en `extraReducers`
- [ ] Modificar ruta en `App.jsx` a `search/:searchTerm?`
- [ ] Importar todos los hooks necesarios en `Search.jsx`
- [ ] Usar `useParams` para leer `searchTerm`
- [ ] Usar `useNavigate` para actualizar URL
- [ ] Crear `useEffect` para cargar posts iniciales
- [ ] Crear `useEffect` para buscar cuando cambia `searchTerm`
- [ ] Crear función `handleSearch` que use `navigate()`
- [ ] Agregar `Input.Search` con `onSearch={handleSearch}`
- [ ] Mostrar loading cuando `isLoading === true`
- [ ] Mostrar posts usando componente `Post`

---

## 📚 CONCEPTOS CLAVE PARA ENTENDER

### useParams
- Lee parámetros de la URL
- Ejemplo: `/search/perro` → `{ searchTerm: "perro" }`
- Se actualiza automáticamente cuando la URL cambia

### useNavigate
- Actualiza la URL programáticamente
- Ejemplo: `navigate('/search/perro')` → cambia la URL
- NO recarga la página (SPA - Single Page Application)

### useEffect con dependencias
- Se ejecuta cuando las dependencias cambian
- `[]` = solo al montar
- `[searchTerm]` = cada vez que `searchTerm` cambia

### createAsyncThunk
- Crea una acción asíncrona en Redux
- Maneja automáticamente: pending, fulfilled, rejected
- Permite usar async/await

---

¡Listo! Con esta guía deberías poder implementar el buscador paso a paso. Si tienes dudas, consulta esta guía o pregunta. 🚀

