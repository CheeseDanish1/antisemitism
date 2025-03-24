module.exports = {
    apps: [{
        name: "as-server",
        script: "server.js",
        instances: "max",
        exec_mode: "cluster",
        watch: false,
        max_memory_restart: "300M",
        env: {
            NODE_ENV: "production",
            PORT: 3001
        },
        error_file: "/var/log/pm2/express-app-error.log",
        out_file: "/var/log/pm2/express-app-out.log"
    }]
};