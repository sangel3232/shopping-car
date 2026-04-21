/**
 * Configuración centralizada del Frontend
 */
export const Config = {
  api: {
    baseUrl: 'http://127.0.0.1:9000/shopping-car/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  },
  ui: {
    toastDuration: 3000,
  },
  paymentMethods: [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta Crédito', label: 'Tarjeta Crédito' },
    { value: 'Tarjeta Débito', label: 'Tarjeta Débito' },
    { value: 'Transferencia', label: 'Transferencia Bancaria' },
    { value: 'PSE', label: 'PSE' },
  ],
  taxRates: { iva: 19 }
};

export const buildApiUrl = (endpoint) =>
  `${Config.api.baseUrl}/${endpoint}`.replace(/([^:])\/\//g, '$1/');

export const fetchWithConfig = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), Config.api.timeout);
  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...Config.api.headers, ...options.headers },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
