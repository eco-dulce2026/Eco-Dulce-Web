# Eco-Dulce

**Moniquirá también siente.** Página web del videojuego educativo Eco-Dulce (RPG Maker XP), sobre la contaminación en Moniquirá, Boyacá.

## Estructura

```
index.html      Todas las secciones: Inicio, Historia, Personajes, Misiones, Equipo, Ayuda, Descargar
css/style.css   Estilos (variables de color arriba, secciones numeradas)
js/script.js    Menú, navegación entre secciones, carrusel, popup de ODS y botón de descarga
img/            Logos, personajes, íconos y fondos
```

## Cómo se edita

- **Misiones del carrusel:** lista `SLIDES` en `js/script.js`.
- **Descripción de cada ODS:** objeto `ODS_INFO` en `js/script.js`.
- **Colores:** variables al inicio de `css/style.css`.
- **Botón de descarga:** hoy muestra un aviso; cuando exista la build, cámbialo por un enlace al `.exe`.

## Ver la página

Abre `index.html` en el navegador (no necesita servidor).
