const query = require('../database/query');

// Not sure if this is good in practice but it seems potentially useful and I can always remove it
const requestsMiddleware = async (req, res, next) => {
    try {
        const { method, url, headers, cookies, originalUrl } = req;
        const userAgent = headers['user-agent'] || '';
        const referer = headers['referer'] || '';
        const ipAddress = req.clientIp;
        const authorizationCookie = cookies['authorization'] || '';
        const page = originalUrl;

        const queryString = `
          INSERT INTO api_requests (method, url, ip_address, user_agent, referer, authorization_cookie, page)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [method, url, ipAddress, userAgent, referer, authorizationCookie, page];

        await query(queryString, values);
    } catch (err) {
        console.error('Error logging request:', err);
    } finally {
        next();
    }
}
module.exports = requestsMiddleware;