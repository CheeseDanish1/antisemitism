// TODO: Implement rate limiting in nginx
require('dotenv').config();
require("./src/database/connection.js");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const requestIp = require('request-ip');
const app = express();
const http = require("http").Server(app);
const PORT = process.env.PORT || 3001;
const routes = require("./src/routes");

app.set('trust proxy', true);
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// TODO: Once buy domain configure cors origin
app.use(
  cors({
    origin: true,
    credentials: true,
    maxAge: 86400
  })
);
app.use(requestIp.mw());

app.use((req, res, next) => {
  req.setTimeout(20000, () => {
    res.status(408).send('Request Timeout');
  });
  next();
});


const uploadsPath = path.join(process.cwd(), 'uploads');
app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res) => {
    // Prevent images being blocked
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

app.use("/", routes);

const buildPath = path.join(__dirname, 'public');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const server = http.listen(PORT, () => console.log(`Running on ${PORT}`));

const logMemoryUsage = () => {
  const used = process.memoryUsage();
  console.log('Memory usage:', {
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`
  });
};

setInterval(logMemoryUsage, 30 * 60 * 1000);

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });

  setTimeout(() => {
    process.exit(1);
  }, 5000);
});