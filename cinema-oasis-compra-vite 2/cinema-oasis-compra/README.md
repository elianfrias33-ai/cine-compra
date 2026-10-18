# Cinema Oasis Bonao — Web con compra de boletos (DEMO)

Versión de la landing de Cinema Oasis con **compra de boletos en línea**: función → cantidad →
selección de asientos → pago con tarjeta → boleto con código QR.

> ⚠️ **Es una demostración visual.** No cobra, no guarda datos y el QR no es válido.
> Los asientos ocupados y los precios son de muestra. Para que funcione de verdad hace falta
> un servidor con base de datos, la cuenta de comercio del cine en una pasarela de pago
> (AZUL, CardNet…) y un lector de QR en la entrada.

La lógica de la compra está en `src/main.js` (sección "Compra de boletos") y el mapa de
la sala se configura con `ROWS`, `COLS` y `AISLES`.

## Estructura

```
cinema-oasis/
├── index.html        → estructura de la página
├── src/
│   ├── data.js       → CARTELERA y PRÓXIMAMENTE (lo que se edita cada semana)
│   ├── main.js       → funciones: tráiler, detalle, menú móvil, animaciones
│   └── style.css     → diseño y versión para celular
├── public/           → archivos que se copian tal cual (imágenes propias, etc.)
├── vite.config.js
└── package.json
```

## Trabajar en tu computadora

Necesitas tener instalado [Node.js](https://nodejs.org/) 18 o superior.

```bash
npm install       # solo la primera vez
npm run dev       # abre la web en http://localhost:5173 y se actualiza sola
npm run build     # genera la versión final en la carpeta dist/
npm run preview   # revisa la versión final antes de publicar
```

## Publicar

### Netlify (recomendado)
1. Sube este proyecto a un repositorio de GitHub.
2. En Netlify: **Add new site → Import an existing project** y elige el repositorio.
3. Configuración:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Cada vez que hagas *push* a GitHub, la web se actualiza sola.

Opción rápida sin GitHub: corre `npm run build` y arrastra la carpeta `dist` a
[app.netlify.com/drop](https://app.netlify.com/drop).

### Vercel
Importa el repositorio. Vercel detecta Vite automáticamente
(build `npm run build`, output `dist`).

### Hosting tradicional (cPanel)
Corre `npm run build` y sube **el contenido** de la carpeta `dist` a `public_html`.

## Actualizar la cartelera

Todo está en `src/data.js`. Cada película es un bloque así:

```js
{t:"Nombre de la película", img:T("codigo-del-poster"), yt:"ID-del-trailer",
 days:"Martes a Domingo", h:"7:30 PM", tag:"Estreno",
 meta:"PG-13 · 1 h 59 min · Acción", syn:"Resumen corto de la película."}
```

- `img`: póster. Con `T("...")` se usa el código de TheMovieDB; también puede ser una URL completa.
- `yt`: el ID del video de YouTube (lo que va después de `youtu.be/`).
- `tag`: `"Estreno"`, `"Matiné"` o se deja sin poner. Para matiné añade `g:1` (etiqueta verde).
- La **primera película** de la lista es la que sale grande en la portada.
  Para la portada también puedes añadir `big:"URL de imagen grande"`.

Guarda, corre `npm run build` (o haz push si está conectado a Netlify) y listo.

## Pendiente antes de publicar

- Confirmar precios reales de boletos (sección **Boletos** en `index.html`; los actuales son de muestra).
- Confirmar horarios y número de WhatsApp (`18095016277`, en `src/main.js` y `index.html`).
