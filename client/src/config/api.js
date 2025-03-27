const configs = {
    development: {
        API_URI: 'http://localhost:3001',
        debug: true
    },
    production: {
        API_URI: 'http://jecfacemash.ddns.net',
        debug: false
    }
};

const config = configs[process.env.NODE_ENV || 'development'];

export default config;