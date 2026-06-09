# Monte Cerca 📍

Portal local de negocios para San Miguel del Monte, Buenos Aires.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abrí http://localhost:3000 en tu navegador.

## Cómo agregar o editar negocios

**Todo el contenido está en un solo archivo:** `lib/data.ts`

- Negocios → array `BUSINESSES`
- Promociones → array `PROMOTIONS`
- Urgencias → array `USEFUL_INFO`
- Categorías → array `CATEGORIES`

## Cómo publicar en GitHub Pages

1. Subí la carpeta a un repositorio de GitHub
2. Conectá el repo con Vercel (gratis) en vercel.com
3. Vercel lo publica automáticamente cada vez que hacés un cambio

## Estructura del proyecto

```
app/
  page.tsx          → Página principal
  negocios/
    page.tsx        → Listado y búsqueda
    [id]/page.tsx   → Detalle de cada negocio
  urgencias/
    page.tsx        → Emergencias
components/
  SearchBar.tsx     → Buscador
lib/
  data.ts           → TODOS LOS DATOS (editá acá)
  utils.ts          → Funciones (abierto/cerrado, búsqueda)
```
