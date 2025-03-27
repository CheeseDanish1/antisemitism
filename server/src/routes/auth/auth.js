const router = require('express').Router();
const query = require('../../database/query.js');
const authMiddleware = require('../../middleware/auth.middleware.js');
const { comparePassword, signJWT, hashPassword } = require('../../utils/crypt.js');
const { v4: uuidv4 } = require('uuid');
const cookieExpiration = parseInt(process.env.JWT_COOKIE_EXPIRATION) || 3600000;
const cookieName = process.env.AUTH_COOKIE_NAME || "Authorization";

/*
POST   /auth/register      # Register new user
POST   /auth/login         # Authenticate an admin and return a JWT token
POST   /auth/logout        # Invalidate the current JWT token
GET    /auth/me            # Get the currently authenticated admin user
POST   /auth/refresh       # Refresh the JWT token
*/

router.post('/register', authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== 'superadmin')
      return res.status(403).json({
        error: 'Unauthorized. Only admins can register new users'
      });

    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const validRoles = ['superadmin', 'editor', 'moderator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const existingUser = await query(
      'SELECT * FROM admin_users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    await query(
      'INSERT INTO admin_users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, hashedPassword, role]
    );

    return res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: userId,
        username,
        email,
        role: role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Information missing' });

    const user = await query('SELECT * FROM admin_users WHERE email = ? LIMIT 1', [
      email,
    ]);

    if (!user || user.length == 0) return res.status(400).json({ error: 'There is no account with that email' });
    const foundUser = user[0];

    const isMatch = await comparePassword(password, foundUser.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    const token = signJWT({ id: foundUser.id, role: foundUser.role });

    return res
      .status(200)
      .cookie(cookieName, token, {
        httpOnly: true,
        // TODO: Once get ssl cert have secure: process.env.NODE_ENV === 'production'
        secure: false,
        sameSite: 'Strict',
        expires: new Date(Date.now() + cookieExpiration),
      })
      .send({
        message: 'Successfully logged in!',
        user: { id: foundUser.id, email: foundUser.email, role: foundUser.role },
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/logout', authMiddleware, async (req, res) => {
  res
    .status(200)
    .clearCookie(cookieName, {
      httpOnly: true,
      // TODO: Once get ssl cert have secure: process.env.NODE_ENV === 'production'
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'Strict',
    })
    .send({ success: true, message: 'Successfully logged out!' });
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { id, email, role } = req.user;

    return res.status(200).json({
      message: 'User details retrieved successfully',
      user: { id, email, role }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const user = await query('SELECT * FROM admin_users WHERE id = ?', [decoded.id]);

    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    const foundUser = user[0];

    const newToken = signJWT({ id: foundUser.id, role: foundUser.role });

    res
      .status(200)
      .cookie(cookieName, newToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        expires: new Date(Date.now() + cookieExpiration),
      })
      .json({ message: 'Token refreshed successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;
