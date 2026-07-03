const springApiTarget =
  process.env['SPRING_API_TARGET'] ?? 'http://localhost:18080';
const nestApiTarget =
  process.env['NEST_API_TARGET'] ?? 'http://localhost:3000';

const proxyConfig = {
  '/api': {
    target: springApiTarget,
    secure: false,
    changeOrigin: false,
  },
  '/gateway': {
    target: nestApiTarget,
    secure: false,
    changeOrigin: false,
    ws: true,
  },
};

if (process.env['E2E_MOCKED_BACKENDS'] !== '1') {
  proxyConfig['/socket.io'] = {
    target: nestApiTarget,
    secure: false,
    changeOrigin: false,
    ws: true,
  };
}

module.exports = proxyConfig;
