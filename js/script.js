// script de eco-dulce

// altura del header
function ajustarAltoHeader() {
  const header = document.querySelector('header');
  if (header) document.documentElement.style.setProperty('--alto-header', header.offsetHeight + 'px');
}
ajustarAltoHeader();
window.addEventListener('resize', ajustarAltoHeader);
window.addEventListener('load', ajustarAltoHeader);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarAltoHeader);

// menu hamburguesa
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

// cambiar de pagina
const paginas = document.querySelectorAll('.page');
const botonesNav = document.querySelectorAll('nav button');
let carruselInicio = null; // se llena mas abajo con el carrusel

function irA(id) {
  paginas.forEach(p => p.classList.toggle('active', p.id === id));
  botonesNav.forEach(b => b.classList.toggle('active', b.dataset.page === id));
  window.scrollTo(0, 0);
  cerrarMenu();

  // si vuelve a inicio el carrusel empieza de nuevo, en las otras paginas se para
  if (carruselInicio) id === 'inicio' ? carruselInicio.reiniciar() : carruselInicio.detener();
}

// todo lo que tenga data-page lleva a esa pagina
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', () => irA(el.dataset.page));
});

// carrusel de inicio
// aqui se cambian las diapositivas
// imagen = fondo de la portada
// mapa = captura del mapa de la mision
// si los dos estan en null queda el fondo de color
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

const DURACION_MS = 6000; // cuanto dura cada diapositiva (ms)

function crearCarrusel() {
  const carrusel = document.getElementById('carrusel');
  const track = document.getElementById('track');
  const contenedorBarras = document.getElementById('barras');
  if (!carrusel || !track || !contenedorBarras) return null;

  carrusel.style.setProperty('--duracion-carrusel', (DURACION_MS / 1000) + 's');

  // crea las diapositivas y las barras
  SLIDES.forEach(s => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (s.imagen) {
      slide.style.backgroundImage =
        `linear-gradient(90deg, rgba(10,30,25,.7), rgba(10,30,25,.3) 55%, rgba(10,30,25,0)), url('${s.imagen}')`;
    }

    // si tiene mapa se pone de fondo y al lado
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

  // pinta las barras segun la diapositiva
  function marcarBarras() {
    barras.forEach((b, i) => {
      b.classList.toggle('completada', i < actual);
      b.classList.toggle('activa', i === actual);
    });
  }

  // reinicia el tiempo de la diapositiva
  function iniciarConteo() {
    clearTimeout(temporizador);
    barras[actual].classList.remove('activa');
    void carrusel.offsetWidth; // truco para que la barra empiece de nuevo
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

  // barras, flechas y deslizar con el dedo
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

  // se pausa con el mouse encima o con el teclado
  if (window.matchMedia('(hover: hover)').matches) {
    carrusel.addEventListener('mouseenter', pausar);
    carrusel.addEventListener('mouseleave', reanudar);
  }
  carrusel.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) pausar(); });
  carrusel.addEventListener('focusout', reanudar);

  // vuelve a la primera diapositiva
  function reiniciar() {
    clearTimeout(temporizador);
    actual = 0;
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    void track.offsetWidth; // para que no se anime
    track.style.transition = '';
    marcarBarras();
    iniciarConteo();
  }
  function detener() { clearTimeout(temporizador); }

  // tambien cuando vuelven con el boton atras
  window.addEventListener('pageshow', () => {
    if (document.getElementById('inicio').classList.contains('active')) reiniciar();
  });

  reiniciar();
  return { reiniciar, detener };
}
carruselInicio = crearCarrusel();

// ventana de los ODS
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

// boton de descargar
// Cuando tengas el archivo del juego, ponlo en la carpeta "descargas" y escribe aqui su nombre.
// Para cambiar el juego, reemplaza el archivo de la carpeta descargas (o cambia el nombre aqui).
const ARCHIVO_DESCARGA = 'descargas/Eco-Dulce.zip';

document.querySelector('.btn-descargar')?.addEventListener('click', () => {
  if (!ARCHIVO_DESCARGA) {
    alert('La build del juego todavía no está lista para descargar. ¡Vuelve pronto!');
    return;
  }
  const a = document.createElement('a');
  a.href = ARCHIVO_DESCARGA;
  a.download = ARCHIVO_DESCARGA.split('/').pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
});
