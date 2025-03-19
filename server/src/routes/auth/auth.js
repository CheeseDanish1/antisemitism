const router = require('express').Router();
const query = require('../../database/query.js');
const authMiddleware = require('../../middleware/auth.middleware.js');
const { comparePassword, signJWT } = require('../../utils/crypt.js');
const cookieExpiration = process.env.JWT_COOKIE_EXPIRATION || 3600000;


/*
POST   /auth/login         # Authenticate an admin and return a JWT token
POST   /auth/logout        # Invalidate the current JWT token
GET    /auth/me            # Get the currently authenticated admin user
POST   /auth/refresh       # Refresh the JWT token
*/

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Information missing' });

    const user = await query('SELECT * FROM admin_users WHERE email = ? LIMIT 1', [
      email,
    ]);

    if (!user || user.length == 0) res.status(400).json({ error: 'There is no account with that email' });
    const foundUser = user[0];

    const isMatch = await comparePassword(password, foundUser.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    const token = signJWT({ id: foundUser.id, role: foundUser.role });

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(Date.now() + cookieExpiration),
      })
      .send({
        message: 'Successfully logged in!',
        user: { id: foundUser.id, email: foundUser.email, role: foundUser.role },
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', authMiddleware, async (req, res) => {
  res
    .status(200)
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })
    .send({ message: 'Successfully logged out!' });
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
      .cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(Date.now() + cookieExpiration),
      })
      .json({ message: 'Token refreshed successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;
