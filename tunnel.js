const localtunnel = require('localtunnel');

(async () => {
  try {
    console.log('Starting localtunnel for port 5173...');
    const tunnel = await localtunnel({ 
      port: 5173,
      subdomain: 'antigravity-translator-' + Math.floor(Math.random() * 1000) // Unique static-like subdomain
    });

    console.log('Tunnel is open at:', tunnel.url);

    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit(1);
    });
  } catch (err) {
    console.error('Error starting tunnel:', err);
    process.exit(1);
  }
})();
