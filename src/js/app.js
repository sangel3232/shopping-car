/**
 * Shopping Car - Frontend App
 * Módulo principal con toda la lógica CRUD
 */

import { fetchWithConfig } from '../config.js';
import { esc, fmt, formatDate, showToast, openModal, closeModal, calculateTotals } from '../utils.js';

// ===== ESTADO GLOBAL =====
const STATE = { clientes: [], productos: [], facturas: [], detalles: [] };

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupMenuToggle();
  setupModalClosers();
  checkApiStatus();
  loadDashboard();
});

// ===== NAVEGACIÓN =====
function setupNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.section);
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function navigateTo(section) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');
  const titles = { dashboard: 'Dashboard', clientes: 'Clientes', productos: 'Productos', facturas: 'Facturas', detalles: 'Detalle Factura' };
  document.getElementById('topbarTitle').textContent = titles[section] || section;
  if (section === 'clientes') loadClientes();
  if (section === 'productos') loadProductos();
  if (section === 'facturas') loadFacturas();
  if (section === 'detalles') loadDetalles();
}

function setupMenuToggle() {
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

// ===== API STATUS =====
async function checkApiStatus() {
  const el = document.getElementById('apiStatus');
  try {
    const r = await fetchWithConfig('cliente', { signal: AbortSignal.timeout(3000) });
    el.classList.toggle('offline', !r.ok);
  } catch { el.classList.add('offline'); }
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const [c, p, f, d] = await Promise.all([
      fetchWithConfig('cliente').then(r => r.json()),
      fetchWithConfig('producto').then(r => r.json()),
      fetchWithConfig('factura').then(r => r.json()),
      fetchWithConfig('detalleFactura').then(r => r.json()),
    ]);
    STATE.clientes = c; STATE.productos = p; STATE.facturas = f; STATE.detalles = d;
    document.getElementById('stat-clientes').textContent = c.length;
    document.getElementById('stat-productos').textContent = p.length;
    document.getElementById('stat-facturas').textContent = f.length;
    document.getElementById('stat-detalles').textContent = d.length;
  } catch (e) { console.warn('Dashboard error:', e); }
}

// ===== CLIENTES =====
async function loadClientes() {
  const tbody = document.getElementById('tbody-clientes');
  tbody.innerHTML = `<tr><td colspan="6" class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</td></tr>`;
  try {
    STATE.clientes = await fetchWithConfig('cliente').then(r => r.json());
    if (!STATE.clientes.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="loading">No hay clientes registrados</td></tr>`;
      return;
    }
    tbody.innerHTML = STATE.clientes.map(c => `
      <tr>
        <td><span class="badge badge-green">#${c.id}</span></td>
        <td><strong>${esc(c.nombre)}</strong></td>
        <td>${esc(c.documento)}</td>
        <td><span class="badge badge-yellow">${esc(c.metodoPago)}</span></td>
        <td>${esc(c.direccion || '—')}</td>
        <td><div class="actions-cell">
          <button class="btn-icon btn-edit" onclick="editCliente(${c.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-del" onclick="deleteCliente(${c.id})"><i class="fa-solid fa-trash"></i></button>
        </div></td>
      </tr>`).join('');
  } catch { tbody.innerHTML = `<tr><td colspan="6" class="loading" style="color:var(--danger)">Error al cargar clientes</td></tr>`; }
}

async function editCliente(id) {
  const c = STATE.clientes.find(x => x.id === id);
  if (!c) return;
  document.getElementById('modal-cliente-title').innerHTML = '<i class="fa-solid fa-pen"></i> Editar Cliente';
  document.getElementById('cliente-id').value = c.id;
  document.getElementById('cliente-nombre').value = c.nombre;
  document.getElementById('cliente-documento').value = c.documento;
  document.getElementById('cliente-metodoPago').value = c.metodoPago;
  document.getElementById('cliente-direccion').value = c.direccion || '';
  openModal('modal-cliente');
}

async function submitCliente(event) {
  event.preventDefault();
  const id = document.getElementById('cliente-id').value;
  const body = {
    nombre: document.getElementById('cliente-nombre').value,
    documento: document.getElementById('cliente-documento').value,
    metodoPago: document.getElementById('cliente-metodoPago').value,
    direccion: document.getElementById('cliente-direccion').value,
  };
  try {
    const r = await fetchWithConfig(id ? `cliente/${id}` : 'cliente', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (!r.ok) throw new Error();
    closeModal('modal-cliente');
    showToast(id ? 'Cliente actualizado' : 'Cliente creado', 'success');
    loadClientes(); loadDashboard();
  } catch { showToast('Error al guardar cliente', 'error'); }
}

function deleteCliente(id) {
  confirm_action(`¿Eliminar cliente #${id}?`, async () => {
    try {
      await fetchWithConfig(`cliente/${id}`, { method: 'DELETE' });
      showToast('Cliente eliminado', 'success');
      loadClientes(); loadDashboard();
    } catch { showToast('Error al eliminar', 'error'); }
  });
}

// ===== PRODUCTOS =====
async function loadProductos() {
  const tbody = document.getElementById('tbody-productos');
  tbody.innerHTML = `<tr><td colspan="7" class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</td></tr>`;
  try {
    STATE.productos = await fetchWithConfig('producto').then(r => r.json());
    if (!STATE.productos.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="loading">No hay productos registrados</td></tr>`;
      return;
    }
    tbody.innerHTML = STATE.productos.map(p => `
      <tr>
        <td><span class="badge badge-green">#${p.id}</span></td>
        <td><code style="background:var(--bg3);padding:2px 6px;border-radius:4px;font-size:0.8rem">${esc(p.codigo)}</code></td>
        <td><strong>${esc(p.nombre)}</strong></td>
        <td><strong style="color:var(--success)">$${fmt(p.precio)}</strong></td>
        <td><span class="badge ${p.stock > 0 ? 'badge-green' : 'badge-yellow'}">${p.stock}</span></td>
        <td>${esc(p.marca || '—')}</td>
        <td><div class="actions-cell">
          <button class="btn-icon btn-edit" onclick="editProducto(${p.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-del" onclick="deleteProducto(${p.id})"><i class="fa-solid fa-trash"></i></button>
        </div></td>
      </tr>`).join('');
  } catch { tbody.innerHTML = `<tr><td colspan="7" class="loading" style="color:var(--danger)">Error al cargar productos</td></tr>`; }
}

async function editProducto(id) {
  const p = STATE.productos.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modal-producto-title').innerHTML = '<i class="fa-solid fa-pen"></i> Editar Producto';
  document.getElementById('producto-id').value = p.id;
  document.getElementById('producto-codigo').value = p.codigo;
  document.getElementById('producto-nombre').value = p.nombre;
  document.getElementById('producto-precio').value = p.precio;
  document.getElementById('producto-stock').value = p.stock;
  document.getElementById('producto-marca').value = p.marca || '';
  openModal('modal-producto');
}

async function submitProducto(event) {
  event.preventDefault();
  const id = document.getElementById('producto-id').value;
  const body = {
    codigo: document.getElementById('producto-codigo').value,
    nombre: document.getElementById('producto-nombre').value,
    precio: parseFloat(document.getElementById('producto-precio').value),
    stock: parseInt(document.getElementById('producto-stock').value),
    marca: document.getElementById('producto-marca').value,
  };
  try {
    const r = await fetchWithConfig(id ? `producto/${id}` : 'producto', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (!r.ok) throw new Error();
    closeModal('modal-producto');
    showToast(id ? 'Producto actualizado' : 'Producto creado', 'success');
    loadProductos(); loadDashboard();
  } catch { showToast('Error al guardar producto', 'error'); }
}

function deleteProducto(id) {
  confirm_action(`¿Eliminar producto #${id}?`, async () => {
    try {
      await fetchWithConfig(`producto/${id}`, { method: 'DELETE' });
      showToast('Producto eliminado', 'success');
      loadProductos(); loadDashboard();
    } catch { showToast('Error al eliminar', 'error'); }
  });
}

// ===== FACTURAS =====
async function loadFacturas() {
  const tbody = document.getElementById('tbody-facturas');
  tbody.innerHTML = `<tr><td colspan="8" class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</td></tr>`;
  try {
    STATE.facturas = await fetchWithConfig('factura').then(r => r.json());
    if (!STATE.facturas.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="loading">No hay facturas registradas</td></tr>`;
      return;
    }
    tbody.innerHTML = STATE.facturas.map(f => `
      <tr>
        <td><span class="badge badge-green">#${f.id}</span></td>
        <td>${formatDate(f.fecha)}</td>
        <td><strong>${esc(f.cliente?.nombre || '—')}</strong></td>
        <td>$${fmt(f.totalBruto)}</td>
        <td style="color:var(--danger)">-$${fmt(f.totalDescuento)}</td>
        <td style="color:var(--warning)">+$${fmt(f.totalIva)}</td>
        <td><strong style="color:var(--success)">$${fmt(f.totalNeto)}</strong></td>
        <td><div class="actions-cell">
          <button class="btn-icon btn-edit" onclick="editFactura(${f.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-del" onclick="deleteFactura(${f.id})"><i class="fa-solid fa-trash"></i></button>
        </div></td>
      </tr>`).join('');
  } catch { tbody.innerHTML = `<tr><td colspan="8" class="loading" style="color:var(--danger)">Error al cargar facturas</td></tr>`; }
}

async function editFactura(id) {
  const f = STATE.facturas.find(x => x.id === id);
  if (!f) return;
  document.getElementById('modal-factura-title').innerHTML = '<i class="fa-solid fa-pen"></i> Editar Factura';
  document.getElementById('factura-id').value = f.id;
  document.getElementById('factura-totalBruto').value = f.totalBruto;
  document.getElementById('factura-totalDescuento').value = f.totalDescuento;
  document.getElementById('factura-totalIva').value = f.totalIva;
  document.getElementById('factura-totalNeto').value = f.totalNeto;
  const fechaLocal = new Date(f.fecha);
  fechaLocal.setMinutes(fechaLocal.getMinutes() - fechaLocal.getTimezoneOffset());
  document.getElementById('factura-fecha').value = fechaLocal.toISOString().slice(0, 16);
  await populateClientesSelect('factura-cliente', f.cliente?.id);
  openModal('modal-factura');
}

async function submitFactura(event) {
  event.preventDefault();
  const id = document.getElementById('factura-id').value;
  const body = {
    fecha: document.getElementById('factura-fecha').value + ':00',
    totalBruto: parseFloat(document.getElementById('factura-totalBruto').value),
    totalDescuento: parseFloat(document.getElementById('factura-totalDescuento').value),
    totalIva: parseFloat(document.getElementById('factura-totalIva').value),
    totalNeto: parseFloat(document.getElementById('factura-totalNeto').value),
    cliente: { id: parseInt(document.getElementById('factura-cliente').value) },
  };
  try {
    const r = await fetchWithConfig(id ? `factura/${id}` : 'factura', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (!r.ok) throw new Error();
    closeModal('modal-factura');
    showToast(id ? 'Factura actualizada' : 'Factura creada', 'success');
    loadFacturas(); loadDashboard();
  } catch { showToast('Error al guardar factura', 'error'); }
}

function deleteFactura(id) {
  confirm_action(`¿Eliminar factura #${id}?`, async () => {
    try {
      await fetchWithConfig(`factura/${id}`, { method: 'DELETE' });
      showToast('Factura eliminada', 'success');
      loadFacturas(); loadDashboard();
    } catch { showToast('Error al eliminar', 'error'); }
  });
}

// ===== DETALLES =====
async function loadDetalles() {
  const tbody = document.getElementById('tbody-detalles');
  tbody.innerHTML = `<tr><td colspan="9" class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</td></tr>`;
  try {
    STATE.detalles = await fetchWithConfig('detalleFactura').then(r => r.json());
    if (!STATE.detalles.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="loading">No hay detalles registrados</td></tr>`;
      return;
    }
    tbody.innerHTML = STATE.detalles.map(d => `
      <tr>
        <td><span class="badge badge-green">#${d.id}</span></td>
        <td>#${d.facturaId?.id || '—'}</td>
        <td><strong>${esc(d.productoId?.nombre || '—')}</strong></td>
        <td>${d.cantidad}</td>
        <td>$${fmt(d.valorUnitario)}</td>
        <td>${d.porcentajeDescuento}%</td>
        <td>${d.porcentajeIva}%</td>
        <td><strong style="color:var(--success)">$${fmt(d.totalNeto)}</strong></td>
        <td><div class="actions-cell">
          <button class="btn-icon btn-edit" onclick="editDetalle(${d.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-del" onclick="deleteDetalle(${d.id})"><i class="fa-solid fa-trash"></i></button>
        </div></td>
      </tr>`).join('');
  } catch { tbody.innerHTML = `<tr><td colspan="9" class="loading" style="color:var(--danger)">Error al cargar detalles</td></tr>`; }
}

async function editDetalle(id) {
  const d = STATE.detalles.find(x => x.id === id);
  if (!d) return;
  document.getElementById('modal-detalle-title').innerHTML = '<i class="fa-solid fa-pen"></i> Editar Detalle';
  document.getElementById('detalle-id').value = d.id;
  document.getElementById('detalle-cantidad').value = d.cantidad;
  document.getElementById('detalle-valorUnitario').value = d.valorUnitario;
  document.getElementById('detalle-porcentajeDescuento').value = d.porcentajeDescuento;
  document.getElementById('detalle-porcentajeIva').value = d.porcentajeIva;
  document.getElementById('detalle-totalBruto').value = d.totalBruto;
  document.getElementById('detalle-totalNeto').value = d.totalNeto;
  await Promise.all([
    populateFacturasSelect('detalle-factura', d.facturaId?.id),
    populateProductosSelect('detalle-producto', d.productoId?.id),
  ]);
  openModal('modal-detalle');
}

async function submitDetalle(event) {
  event.preventDefault();
  const id = document.getElementById('detalle-id').value;
  const body = {
    cantidad: parseInt(document.getElementById('detalle-cantidad').value),
    valorUnitario: parseFloat(document.getElementById('detalle-valorUnitario').value),
    porcentajeDescuento: parseFloat(document.getElementById('detalle-porcentajeDescuento').value),
    porcentajeIva: parseFloat(document.getElementById('detalle-porcentajeIva').value),
    totalBruto: parseFloat(document.getElementById('detalle-totalBruto').value),
    totalNeto: parseFloat(document.getElementById('detalle-totalNeto').value),
    productoId: { id: parseInt(document.getElementById('detalle-producto').value) },
    facturaId: { id: parseInt(document.getElementById('detalle-factura').value) },
  };
  try {
    const r = await fetchWithConfig(id ? `detalleFactura/${id}` : 'detalleFactura', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (!r.ok) throw new Error();
    closeModal('modal-detalle');
    showToast(id ? 'Detalle actualizado' : 'Detalle creado', 'success');
    loadDetalles(); loadDashboard();
  } catch { showToast('Error al guardar detalle', 'error'); }
}

function deleteDetalle(id) {
  confirm_action(`¿Eliminar detalle #${id}?`, async () => {
    try {
      await fetchWithConfig(`detalleFactura/${id}`, { method: 'DELETE' });
      showToast('Detalle eliminado', 'success');
      loadDetalles(); loadDashboard();
    } catch { showToast('Error al eliminar', 'error'); }
  });
}

// ===== SELECTS =====
async function populateClientesSelect(selectId, selectedId = null) {
  if (!STATE.clientes.length) STATE.clientes = await fetchWithConfig('cliente').then(r => r.json()).catch(() => []);
  const sel = document.getElementById(selectId);
  sel.innerHTML = '<option value="">Seleccionar cliente...</option>' +
    STATE.clientes.map(c => `<option value="${c.id}" ${c.id == selectedId ? 'selected' : ''}>${c.nombre} - ${c.documento}</option>`).join('');
}

async function populateFacturasSelect(selectId, selectedId = null) {
  if (!STATE.facturas.length) STATE.facturas = await fetchWithConfig('factura').then(r => r.json()).catch(() => []);
  const sel = document.getElementById(selectId);
  sel.innerHTML = '<option value="">Seleccionar factura...</option>' +
    STATE.facturas.map(f => `<option value="${f.id}" ${f.id == selectedId ? 'selected' : ''}>Factura #${f.id} - ${f.cliente?.nombre || ''}</option>`).join('');
}

async function populateProductosSelect(selectId, selectedId = null) {
  if (!STATE.productos.length) STATE.productos = await fetchWithConfig('producto').then(r => r.json()).catch(() => []);
  const sel = document.getElementById(selectId);
  sel.innerHTML = '<option value="">Seleccionar producto...</option>' +
    STATE.productos.map(p => `<option value="${p.id}" ${p.id == selectedId ? 'selected' : ''}>${p.nombre} - $${fmt(p.precio)}</option>`).join('');
}

// ===== AUTO-CÁLCULO =====
function autoFillPrecio() {
  const id = parseInt(document.getElementById('detalle-producto').value);
  const prod = STATE.productos.find(p => p.id === id);
  if (prod) { document.getElementById('detalle-valorUnitario').value = prod.precio; calcularTotales(); }
}

function calcularTotales() {
  const cant = parseFloat(document.getElementById('detalle-cantidad').value) || 0;
  const vu = parseFloat(document.getElementById('detalle-valorUnitario').value) || 0;
  const desc = parseFloat(document.getElementById('detalle-porcentajeDescuento').value) || 0;
  const iva = parseFloat(document.getElementById('detalle-porcentajeIva').value) || 0;
  const totales = calculateTotals(cant, vu, desc, iva);
  document.getElementById('detalle-totalBruto').value = totales.totalBruto;
  document.getElementById('detalle-totalNeto').value = totales.totalNeto;
}

// ===== MODALES =====
function setupModalClosers() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  });
}

// ===== CONFIRM DIALOG (modal personalizado) =====
function confirm_action(msg, cb) {
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('modal-confirm').classList.add('open');
  const btn = document.getElementById('confirm-ok');
  const handler = () => {
    document.getElementById('modal-confirm').classList.remove('open');
    cb();
    btn.removeEventListener('click', handler);
  };
  btn.addEventListener('click', handler);
}

// ===== EXPONER AL HTML =====
window.openModal = async (id) => {
  if (id === 'modal-cliente') {
    document.getElementById('cliente-id').value = '';
    document.getElementById('modal-cliente-title').innerHTML = '<i class="fa-solid fa-user-plus"></i> Nuevo Cliente';
    document.getElementById('form-cliente').reset();
  }
  if (id === 'modal-producto') {
    document.getElementById('producto-id').value = '';
    document.getElementById('modal-producto-title').innerHTML = '<i class="fa-solid fa-box"></i> Nuevo Producto';
    document.getElementById('form-producto').reset();
  }
  if (id === 'modal-factura') {
    document.getElementById('factura-id').value = '';
    document.getElementById('modal-factura-title').innerHTML = '<i class="fa-solid fa-file-invoice"></i> Nueva Factura';
    document.getElementById('form-factura').reset();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('factura-fecha').value = now.toISOString().slice(0, 16);
    await populateClientesSelect('factura-cliente');
  }
  if (id === 'modal-detalle') {
    document.getElementById('detalle-id').value = '';
    document.getElementById('modal-detalle-title').innerHTML = '<i class="fa-solid fa-list-check"></i> Nuevo Detalle';
    document.getElementById('form-detalle').reset();
    document.getElementById('detalle-porcentajeIva').value = '19';
    document.getElementById('detalle-porcentajeDescuento').value = '0';
    await Promise.all([populateFacturasSelect('detalle-factura'), populateProductosSelect('detalle-producto')]);
  }
  openModal(id);
};
window.closeModal = closeModal;
window.editCliente = editCliente;
window.submitCliente = submitCliente;
window.deleteCliente = deleteCliente;
window.editProducto = editProducto;
window.submitProducto = submitProducto;
window.deleteProducto = deleteProducto;
window.editFactura = editFactura;
window.submitFactura = submitFactura;
window.deleteFactura = deleteFactura;
window.editDetalle = editDetalle;
window.submitDetalle = submitDetalle;
window.deleteDetalle = deleteDetalle;
window.autoFillPrecio = autoFillPrecio;
window.calcularTotales = calcularTotales;
