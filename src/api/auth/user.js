import express from 'express';
import { authenticateToken } from '../auth.js';
import { UserModel } from '../models/user.model.js';

const router = express.Router();

// Get all users (protected route)
router.get('/all-users', authenticateToken, async (req, res) => {
  try {
    // Query all users from the database
    const sql = `
      SELECT 
        id,
        username,
        email,
        company,
        phone,
        created_at,
        updated_at,
        (
          SELECT COUNT(*) 
          FROM login_history 
          WHERE user_id = users.id
        ) as login_count
      FROM users
      ORDER BY created_at DESC
    `;
    
    const users = await query(sql);

    // Format each user's data
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      company: user.company || null,
      phone: user.phone || null,
      signupDate: user.created_at,
      lastUpdated: user.updated_at,
      loginCount: user.login_count,
      signupUrl: `${req.protocol}://${req.get('host')}/signup/${user.id}`
    }));

    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

export default router;