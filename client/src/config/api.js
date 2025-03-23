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

console.log(configs, process.env.NODE_ENV, configs[process.env.NODE_ENV])

const config = configs[process.env.NODE_ENV || 'development'];

console.log(config)

export default config;