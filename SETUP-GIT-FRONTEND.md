# 🚀 Guía: Subir Frontend a GitHub y Configurar Ramas

## 📍 IMPORTANTE
Esta guía es **SOLO para el frontend** (chewbookaAPPMiguel).
El backend (chewbookaAPI) se mantiene separado.

## 📋 PASO 1: Primer Commit (Rama main)

```bash
# 1. Ve a la carpeta del frontend
cd /Users/miguelrubiosanfeliu/Documents/Proyecto_RED_SOCIAL/Proyecto_RED_SOCIAL/chewbookaAPPMiguel/chewbookaAPPMiguel

# 2. Verifica que estás en la carpeta correcta
pwd
# Debería mostrar: .../chewbookaAPPMiguel/chewbookaAPPMiguel

# 3. Añade todos los archivos (excepto .env que está en .gitignore)
git add .

# 4. Haz el primer commit
git commit -m "feat: configuración inicial del frontend con sistema de diseño"

# 5. Verifica que el commit se hizo
git log
```

## 📋 PASO 2: Crear Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com)
2. Click en el botón **"+"** (arriba derecha) → **"New repository"**
3. Nombre del repositorio: `chewbooka-frontend` (o el que prefieras)
4. Descripción: "Frontend de Chewbooka - Red Social"
5. **NO marques** "Initialize with README" (ya tienes archivos)
6. Click en **"Create repository"**

## 📋 PASO 3: Conectar con GitHub

```bash
# Reemplaza TU-USUARIO y TU-REPOSITORIO con los tuyos
# Ejemplo: git remote add origin https://github.com/miguelrubio/chewbooka-frontend.git
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# Verifica que se añadió correctamente
git remote -v
```

## 📋 PASO 4: Subir a GitHub (Rama main)

```bash
# Sube el código a GitHub
git push -u origin main
```

## 📋 PASO 5: Crear Rama develop

```bash
# 1. Crea y cambia a la rama develop
git checkout -b develop

# 2. Sube develop a GitHub
git push -u origin develop
```

## 📋 PASO 6: Verificar que Todo Está Bien

```bash
# Ver todas las ramas
git branch -a

# Deberías ver:
# * develop
#   main
#   remotes/origin/develop
#   remotes/origin/main
```

## ✅ ¡Listo! Ahora Puedes Trabajar

### 🎯 Flujo de Trabajo Diario

#### 1. Crear una Nueva Feature desde develop:

```bash
# 1. Asegúrate de estar en develop
git checkout develop

# 2. Actualiza develop (por si hay cambios de otros)
git pull origin develop

# 3. Crea tu nueva rama (ejemplo: feature/login)
git checkout -b feature/login

# 4. Trabaja en tu feature...
# ... hacer cambios en los archivos ...

# 5. Añade y commitea
git add .
git commit -m "feat: añadir formulario de login"

# 6. Sube tu rama a GitHub
git push -u origin feature/login
```

#### 2. Fusionar Feature a develop:

```bash
# 1. Cambia a develop
git checkout develop

# 2. Actualiza develop con los últimos cambios
git pull origin develop

# 3. Fusiona tu feature
git merge feature/login

# 4. Sube develop actualizado
git push origin develop

# 5. (Opcional) Elimina la rama local si ya no la necesitas
git branch -d feature/login
```

#### 3. Cuando develop esté listo, fusionar a main:

```bash
# 1. Cambia a main
git checkout main

# 2. Actualiza main
git pull origin main

# 3. Fusiona develop
git merge develop

# 4. Sube main
git push origin main
```

## 📝 Ejemplo Completo: Añadir Sistema de Diseño

Como ya tienes el sistema de diseño hecho, vamos a commitearlo:

```bash
# 1. Estar en develop
git checkout develop

# 2. Crear rama para el sistema de diseño
git checkout -b feature/sistema-diseno

# 3. Añadir todos los cambios
git add .

# 4. Hacer commits descriptivos
git commit -m "feat: añadir variables CSS globales"
git commit -m "feat: añadir estilos globales (botones, cards, inputs)"
git commit -m "feat: añadir componente LoginForm de ejemplo"
git commit -m "docs: añadir documentación del sistema de diseño"

# 5. Subir rama
git push -u origin feature/sistema-diseno

# 6. Fusionar a develop
git checkout develop
git pull origin develop
git merge feature/sistema-diseno
git push origin develop
```

## 🏷️ Convención de Nombres de Ramas

- `feature/*` - Nuevas funcionalidades
  - `feature/login`
  - `feature/posts`
  - `feature/profile`
  - `feature/sistema-diseno`

- `fix/*` - Correcciones de bugs
  - `fix/bug-cards`
  - `fix/error-login`

- `refactor/*` - Refactorización
  - `refactor/componentes`

## 🏷️ Convención de Commits

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Cambios de formato
- `refactor:` - Refactorización
- `test:` - Tests

**Ejemplos:**
```bash
git commit -m "feat: añadir componente de posts"
git commit -m "fix: corregir error en formulario de login"
git commit -m "docs: actualizar README"
```

## 📊 Comandos Útiles

```bash
# Ver estado actual
git status

# Ver ramas
git branch

# Ver ramas remotas
git branch -r

# Ver historial de commits
git log --oneline --graph --all

# Ver diferencias
git diff

# Deshacer cambios no guardados
git checkout -- nombre-archivo.js
```

## ⚠️ Si Algo Sale Mal

### Si olvidaste algo en el commit:
```bash
git add archivo-olvidado.js
git commit --amend --no-edit
```

### Si quieres deshacer el último commit (pero mantener cambios):
```bash
git reset --soft HEAD~1
```

### Si quieres deshacer cambios no guardados:
```bash
git checkout -- .
```

## 🎯 Estructura de Ramas Final

```
main (producción)
  ↑
develop (desarrollo)
  ↑
feature/login
feature/posts
feature/profile
fix/bug-cards
```

## 📝 Resumen del Flujo

1. **main** → Código estable y listo para producción
2. **develop** → Rama principal de desarrollo (trabajas aquí)
3. **feature/*** → Cada funcionalidad tiene su rama
4. **fix/*** → Correcciones de bugs

**Regla de oro:** Nunca trabajes directamente en `main` o `develop`. Siempre crea una rama para tu trabajo.


