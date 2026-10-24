import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // ngrok's free tier intercepts requests that look like they came from a
    // browser and serves an HTML warning page instead of proxying to the API.
    // That page carries no CORS headers, so the browser reports a CORS error
    // and the real cause - ERR_NGROK_6024 - never surfaces. The backend is
    // fine: its preflight answers correctly.
    //
    // ngrok only checks the header is present, not its value. Harmless against
    // the DigitalOcean backends, so it stays in for every environment rather
    // than being conditional on the base URL.
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    const userRole = (localStorage.getItem('userRole') || '').toLowerCase();
    const isPortalSession = userRole === 'aggregator' || userRole === 'aggregator_manager' || userRole === 'manager';

    if (
      isPortalSession &&
      typeof config.url === 'string' &&
      config.url.startsWith('/admin/') &&
      !config.url.startsWith('/admin/auth/')
    ) {
      config.url = config.url.replace('/admin/', '/portal/');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.params) {
      if (typeof config.params.range === 'object' && config.params.range !== null) {
        const { range, from, to } = config.params.range;
        config.params.range = range;
        if (from) config.params.from = from;
        if (to) config.params.to = to;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling & HTML fallback detection
apiClient.interceptors.response.use(
  (response) => {
    const contentType = response.headers?.['content-type'] || '';
    const isHtmlResponse =
      contentType.includes('text/html') ||
      (typeof response.data === 'string' && response.data.trim().toLowerCase().startsWith('<!doctype'));

    if (isHtmlResponse) {
      const error = new Error('API server returned HTML instead of JSON. Please verify backend API URL configuration.');
      error.response = {
        data: { message: 'Backend API endpoint unreachable. Received HTML fallback from web server instead of API JSON response.' },
        status: 502,
      };
      return Promise.reject(error);
    }

    // Much of the admin API reports failure in the body while answering HTTP
    // 200 or 201 - { statusCode: 503, message: '...' } on a 201 response.
    // Without this every such failure reads as success: onboarding a partner
    // showed "created" while the body said the encryption key was unset.
    const bodyStatus = Number(response.data?.statusCode);
    if (Number.isFinite(bodyStatus) && bodyStatus >= 400) {
      const error = new Error(response.data?.message || 'Request failed');
      error.response = { data: response.data, status: bodyStatus };
      return Promise.reject(error);
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('mustChangePassword');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
