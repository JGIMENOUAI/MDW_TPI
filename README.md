# 🏠 Sistema de Gestión de Contratos - Frontend

Frontend minimalista desarrollado con **React + TypeScript + Vite** para la gestión de contratos, personas e inmuebles.

## 🔗 Links Relacionados

- **Backend:** [backend-contratos](https://github.com/maos1111/backend-contratos)

## 🚀 Tecnologías

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Axios** - Cliente HTTP
- **React Router** - Navegación

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

## ⚙️ Configuración

Edita el archivo `.env` con la URL de tu backend:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🏃‍♂️ Ejecutar en Desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🏗️ Build para Producción

```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables (Layout, Navbar)
├── pages/          # Páginas de la aplicación (Home, CRUD)
├── services/       # Servicios API (axios config, CRUD services)
├── types/          # Definiciones de TypeScript
├── App.tsx         # Componente principal
└── main.tsx        # Punto de entrada
```

## 🎯 Funcionalidades

- ✅ CRUD de Personas (físicas y jurídicas)
- ✅ CRUD de Inmuebles (casas y campos)
- ✅ CRUD de Contratos
- ✅ Navegación con React Router
- ✅ Validación de formularios
- ✅ Interfaz minimalista y responsive

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter
```

---

**Desarrollado con ❤️ para MDW - UAI**
