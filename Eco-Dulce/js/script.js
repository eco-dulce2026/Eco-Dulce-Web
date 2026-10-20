/* =====================================================================
   ECO-DULCE — comportamiento de la página
   1 Header · 2 Navegación · 3 Menú móvil · 4 Carrusel · 5 Popup ODS · 6 Descarga
   ===================================================================== */

/* ---------- 1. HEADER: el contenido empieza justo debajo de él ---------- */
function ajustarAltoHeader() {
  const header = document.querySelector('header');
  if (header) document.documentElement.style.setProperty('--alto-header', header.offsetHeight + 'px');
}
ajustarAltoHeader();
window.addEventListener('resize', ajustarAltoHeader);
window.addEventListener('load', ajustarAltoHeader);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarAltoHeader);

/* ---------- 3. MENÚ MÓVIL (hamburguesa) ---------- */
const hamburguesa = document.getElementById('hamburguesa');
const navPrincipal = document.getElementById('nav-principal');
const navOverlay = document.getElementById('nav-overlay');

function abrirMenu() {
  hamburguesa.classList.add('abierto');
  navPrincipal.classList.add('abierto');
  navOverlay.classList.add('abierto');
  hamburguesa.setAttribute('aria-expanded', 'true');
}
function cerrarMenu() {
  hamburguesa.classList.remove('abierto');
  navPrincipal.classList.remove('abierto');
  navOverlay.classList.remove('abierto');
  hamburguesa.setAttribute('aria-expanded', 'false');
}
hamburguesa.addEventListener('click', () => {
  navPrincipal.classList.contains('abierto') ? cerrarMenu() : abrirMenu();
});
navOverlay.addEventListener('click', cerrarMenu);

/* ---------- 2. NAVEGACIÓN: cada botón muestra una página completa ---------- */
const paginas = document.querySelectorAll('.page');
const botonesNav = document.querySelectorAll('nav button');
let carruselInicio = null; // lo asigna la sección 4 si existe el carrusel

function irA(id) {
  paginas.forEach(p => p.classList.toggle('active', p.id === id));
  botonesNav.forEach(b => b.classList.toggle('active', b.dataset.page === id));
  window.scrollTo(0, 0);
  cerrarMenu();

  // Al volver a Inicio el carrusel arranca desde la primera diapositiva; en otras páginas se detiene
  if (carruselInicio) id === 'inicio' ? carruselInicio.reiniciar() : carruselInicio.detener();
}

// Cualquier elemento con data-page (menú o botón del recuadro) lleva a esa página
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', () => irA(el.dataset.page));
});

/* ---------- 4. CARRUSEL DE INICIO (muestra las misiones; avanza solo, con barras de progreso) ---------- */
// Para agregar o cambiar una diapositiva solo se edita esta lista.
// "imagen": fondo de pantalla completa (solo la diapositiva de portada).
// "mapa": captura del mapa de la misión; se muestra a la derecha y se usa difuminado de fondo.
// Si "imagen" y "mapa" están en null se usa el fondo degradado por defecto (css/style.css).
const SLIDES = [
  {
    numero: 'ECO-DULCE',
    titulo: 'Moniquirá también siente',
    ods: null,
    texto: 'Videojuego educativo RPG: recorre Moniquirá cumpliendo misiones ambientales clasificando cada residuo correctamente.',
    imagen: 'img/carrusel-fondo-inicio.jpg',
    mapa: null
  },
  {
    numero: 'MISIÓN 01',
    titulo: 'Parque Simón Bolívar',
    ods: 'ODS 11',
    texto: 'El parque está cubierto de basura entre sus árboles. La misión de Luz es recorrerlo, recoger cada residuo y clasificarlo para devolverle su color.',
    imagen: null,
    mapa: 'img/mapa-mision-01.jpg'
  },
  {
    numero: 'MISIÓN 02',
    titulo: 'Plaza de Mercado',
    ods: 'ODS 12',
    texto: 'La plaza principal del pueblo está llena de bolsas rotas y basura regada. Luz debe recorrerla, recoger cada residuo y clasificarlo bien.',
    imagen: null,
    mapa: 'img/mapa-mision-02.png'
  },
  {
    numero: 'MISIÓN 03',
    titulo: 'Puente Jaime Castro',
    ods: 'ODS 6',
    texto: 'El puente y el río que corre bajo él están regados de basura de un lado a otro. Luz debe recorrerlo, recoger cada residuo y clasificarlo bien.',
    imagen: null,
    mapa: 'img/mapa-mision-03.png'
  },
  {
    numero: 'MISIÓN 04',
    titulo: 'Pista de Patinaje',
    ods: 'ODS 11',
    texto: 'La pista de patinaje, de las más afectadas, está llena de envases y basura. Luz debe recorrerla, recoger cada residuo y clasificarlo bien.',
    imagen: null,
    mapa: 'img/mapa-mision-04.png'
  },
  {
    numero: 'MISIÓN 05',
    titulo: 'Moniquirá Renace',
    ods: 'ODS 4',
    texto: 'Con todo recuperado, la misión final es recorrer Moniquirá completo y disfrutar el resultado: calles limpias y un pueblo que cuida su entorno.',
    imagen: null,
    mapa: 'img/mapa-mision-05.jpg'
  }
];

const DURACION_MS = 6000; // tiempo que dura cada diapositiva antes de avanzar sola

function crearCarrusel() {
  const carrusel = document.getElementById('carrusel');
  const track = document.getElementById('track');
  const contenedorBarras = document.getElementById('barras');
  if (!carrusel || !track || !contenedorBarras) return null;

  carrusel.style.setProperty('--duracion-carrusel', (DURACION_MS / 1000) + 's');

  // Genera las diapositivas y sus barras de progreso a partir de SLIDES
  SLIDES.forEach(s => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (s.imagen) {
      slide.style.backgroundImage =
        `linear-gradient(135deg, rgba(10,30,25,.72), rgba(10,40,35,.55)), url('${s.imagen}')`;
    }

    // Misiones con mapa: fondo difuminado + mapa nítido a la derecha
    let fondo = '';
    let mapa = '';
    if (s.mapa) {
      slide.classList.add('con-mapa');
      fondo = `<div class="slide-fondo" style="background-image: linear-gradient(90deg, rgba(10,30,25,.6), rgba(10,30,25,.25)), url('${s.mapa}')"></div>`;
      mapa = `<img class="slide-mapa" src="${s.mapa}" alt="Mapa de ${s.titulo} en el juego">`;
    }

    slide.innerHTML = `
      ${fondo}
      <div class="slide-texto">
        <span class="num">${s.numero}</span>
        <h3>${s.titulo}</h3>
        ${s.ods ? `<span class="ods">${s.ods}</span>` : ''}
        <p>${s.texto}</p>
      </div>
      ${mapa}
    `;
    track.appendChild(slide);

    const barra = document.createElement('div');
    barra.className = 'barra';
    barra.innerHTML = '<span class="barra-fill"></span>';
    contenedorBarras.appendChild(barra);
  });

  const barras = contenedorBarras.querySelectorAll('.barra');
  let actual = 0;
  let temporizador = null;

  // Pinta las barras: anteriores llenas, la actual animándose, las demás vacías
  function marcarBarras() {
    barras.forEach((b, i) => {
      b.classList.toggle('completada', i < actual);
      b.classList.toggle('activa', i === actual);
    });
  }

  // (Re)inicia el conteo de la diapositiva actual: la barra y el temporizador arrancan juntos
  function iniciarConteo() {
    clearTimeout(temporizador);
    barras[actual].classList.remove('activa');
    void carrusel.offsetWidth; // fuerza el reflujo para que la barra vuelva a animarse desde cero
    barras[actual].classList.add('activa');
    temporizador = setTimeout(() => mostrar(actual + 1), DURACION_MS);
  }

  function mostrar(i) {
    actual = (i + SLIDES.length) % SLIDES.length;
    track.style.transform = `translateX(-${actual * 100}%)`;
    marcarBarras();
    iniciarConteo();
  }

  function pausar() { carrusel.classList.add('pausado'); clearTimeout(temporizador); }
  function reanudar() { carrusel.classList.remove('pausado'); iniciarConteo(); }

  // Controles: barras, flechas y deslizar con el dedo
  barras.forEach((b, i) => b.addEventListener('click', () => mostrar(i)));
  document.getElementById('flecha-izq')?.addEventListener('click', () => mostrar(actual - 1));
  document.getElementById('flecha-der')?.addEventListener('click', () => mostrar(actual + 1));

  let xInicio = null;
  track.addEventListener('touchstart', e => { xInicio = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (xInicio === null) return;
    const delta = e.changedTouches[0].clientX - xInicio;
    if (Math.abs(delta) > 40) mostrar(actual + (delta < 0 ? 1 : -1));
    xInicio = null;
  });

  // Pausa mientras el mouse está encima (solo en dispositivos con mouse) o el foco está dentro
  if (window.matchMedia('(hover: hover)').matches) {
    carrusel.addEventListener('mouseenter', pausar);
    carrusel.addEventListener('mouseleave', reanudar);
  }
  carrusel.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) pausar(); });
  carrusel.addEventListener('focusout', reanudar);

  // Vuelve a la diapositiva 1 sin animación y reinicia el avance automático
  function reiniciar() {
    clearTimeout(temporizador);
    actual = 0;
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    void track.offsetWidth; // aplica el cambio sin animar
    track.style.transition = '';
    marcarBarras();
    iniciarConteo();
  }
  function detener() { clearTimeout(temporizador); }

  // También al cargar o al volver con el botón "atrás" del navegador
  window.addEventListener('pageshow', () => {
    if (document.getElementById('inicio').classList.contains('active')) reiniciar();
  });

  reiniciar();
  return { reiniciar, detener };
}
carruselInicio = crearCarrusel();

/* ---------- 5. POPUP DE DESCRIPCIÓN DE CADA ODS ---------- */
const ODS_INFO = {
  '4': {
    titulo: 'ODS 4 — Educación de calidad',
    texto: 'Busca garantizar una educación inclusiva, equitativa y de calidad, y promover oportunidades de aprendizaje para todos a lo largo de la vida.'
  },
  '6': {
    titulo: 'ODS 6 — Agua limpia y saneamiento',
    texto: 'Busca garantizar la disponibilidad y la gestión sostenible del agua y el saneamiento para todas las personas.'
  },
  '11': {
    titulo: 'ODS 11 — Ciudades y comunidades sostenibles',
    texto: 'Busca lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles.'
  },
  '12': {
    titulo: 'ODS 12 — Producción y consumo responsables',
    texto: 'Busca garantizar modalidades de consumo y producción sostenibles, reduciendo el desperdicio y el mal manejo de los residuos.'
  }
};

const odsOverlay = document.getElementById('ods-modal-overlay');
const odsBadge = document.getElementById('ods-modal-badge');
const odsTitulo = document.getElementById('ods-modal-titulo');
const odsTexto = document.getElementById('ods-modal-texto');

function abrirOds(numero) {
  const info = ODS_INFO[numero];
  if (!info) return;
  odsBadge.textContent = 'ODS ' + numero;
  odsTitulo.textContent = info.titulo;
  odsTexto.textContent = info.texto;
  odsOverlay.classList.add('abierto');
}
function cerrarOds() {
  odsOverlay.classList.remove('abierto');
}

document.querySelectorAll('.ods-item[data-ods]').forEach(item => {
  item.addEventListener('click', () => abrirOds(item.dataset.ods));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirOds(item.dataset.ods);
    }
  });
});
document.getElementById('ods-modal-cerrar').addEventListener('click', cerrarOds);
odsOverlay.addEventListener('click', e => { if (e.target === odsOverlay) cerrarOds(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarOds(); });

/* ---------- 6. BOTÓN DE DESCARGA (aviso mientras no hay build lista) ---------- */
document.querySelector('.btn-descargar')?.addEventListener('click', () => {
  alert('La build del juego todavía no está lista para descargar. ¡Vuelve pronto!');
});
