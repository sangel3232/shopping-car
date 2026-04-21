/**
 * Funciones utilitarias del Frontend
 */

/**
 * Escapa caracteres HTML para prevenir XSS
 */
export const esc = (str) => {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.toString().replace(/[&<>"']/g, m => map[m]);
};

/**
 * Formatea números como moneda
 */
export const fmt = (num) => {
  return (num || 0).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formatea fecha a formato legible
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Muestra notificación tipo toast
 */
export const showToast = (message, type = 'info', duration = 3000) => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${esc(message)}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

/**
 * Abre modal
 */
export const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

/**
 * Cierra modal
 */
export const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
};

/**
 * Confirma una acción antes de ejecutarla
 */
export const confirm_action = (message, callback) => {
  if (window.confirm(message)) {
    callback();
  }
};

/**
 * Valida un email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valida un número
 */
export const isValidNumber = (num, min = 0, max = Infinity) => {
  const n = parseFloat(num);
  return !isNaN(n) && n >= min && n <= max;
};

/**
 * Debounce para funciones
 */
export const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Genera ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calcula totales con IVA y descuentos
 */
export const calculateTotals = (cantidad, valorUnitario, descuento = 0, iva = 19) => {
  const totalBruto = cantidad * valorUnitario;
  const totalDescuentoValor = (totalBruto * descuento) / 100;
  const subtotal = totalBruto - totalDescuentoValor;
  const ivaValor = (subtotal * iva) / 100;
  const totalNeto = subtotal + ivaValor;

  return {
    totalBruto: parseFloat(totalBruto.toFixed(2)),
    totalDescuento: parseFloat(totalDescuentoValor.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    iva: parseFloat(ivaValor.toFixed(2)),
    totalNeto: parseFloat(totalNeto.toFixed(2))
  };
};

/**
 * Valida un formulario
 */
export const validateForm = (formId) => {
  const form = document.getElementById(formId);
  if (!form) return false;

  const inputs = form.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
  });

  return isValid;
};

/**
 * Export en formato CSV
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
