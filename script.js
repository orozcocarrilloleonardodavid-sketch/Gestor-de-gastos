const formulario = document.getElementById('formulario');
const inputDescripcion = document.getElementById('descripcion');
const inputMonto = document.getElementById('monto');
const selectCategoria = document.getElementById('categoria');
const selectFiltro = document.getElementById('filtro');
const lista = document.getElementById('lista');
const vacio = document.getElementById('vacio');
const totalEl = document.getElementById('total');
const porCategoria = document.getElementById('porCategoria');

let gastos = cargar();

function cargar() {
  try {
    const datos = JSON.parse(localStorage.getItem('gastos'));
    return Array.isArray(datos) ? datos : [];
  } catch (e) {
    return [];
  }
}

function guardar() {
  try { localStorage.setItem('gastos', JSON.stringify(gastos)); } catch (e) {}
}

function dinero(numero) {
  return 'U$D' + numero.toLocaleString('es', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}

function pintarResumen() {
  const total = gastos.reduce(function (suma, g) { return suma + g.monto; }, 0);
  totalEl.textContent = dinero(total);

  const sumas = {};
  gastos.forEach(function (g) {
    sumas[g.categoria] = (sumas[g.categoria] || 0) + g.monto;
  });

  porCategoria.textContent = '';
  Object.keys(sumas).forEach(function (cat) {
    const li = document.createElement('li');
    const nombre = document.createElement('span');
    nombre.textContent = cat;
    const valor = document.createElement('strong');
    valor.textContent = dinero(sumas[cat]);
    li.append(nombre, valor);
    porCategoria.appendChild(li);
  });
}

function pintarLista() {
  const filtro = selectFiltro.value;
  const visibles = gastos.filter(function (g) {
    return filtro === 'todas' || g.categoria === filtro;
  });

  lista.textContent = '';
  vacio.hidden = visibles.length > 0;

  visibles.forEach(function (g) {
    const li = document.createElement('li');

    const info = document.createElement('div');
    info.className = 'info';
    const desc = document.createElement('span');
    desc.className = 'desc';
    desc.textContent = g.descripcion;
    const cat = document.createElement('span');
    cat.className = 'cat';
    cat.textContent = g.categoria;
    info.append(desc, cat);

    const derecha = document.createElement('div');
    derecha.className = 'derecha';
    const monto = document.createElement('strong');
    monto.textContent = dinero(g.monto);
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'borrar';
    boton.textContent = 'Borrar';
    boton.setAttribute('aria-label', 'Borrar ' + g.descripcion);
    boton.addEventListener('click', function () { borrar(g.id); });
    derecha.append(monto, boton);

    li.append(info, derecha);
    lista.appendChild(li);
  });
}

function pintar() {
  pintarResumen();
  pintarLista();
}

function borrar(id) {
  gastos = gastos.filter(function (g) { return g.id !== id; });
  guardar();
  pintar();
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const descripcion = inputDescripcion.value.trim();
  const monto = parseFloat(inputMonto.value);
  if (!descripcion || !(monto > 0)) return;

  gastos.unshift({
    id: Date.now(),
    descripcion: descripcion,
    monto: monto,
    categoria: selectCategoria.value
  });
  guardar();
  pintar();
  formulario.reset();
  inputDescripcion.focus();
});

selectFiltro.addEventListener('change', pintarLista);

pintar();