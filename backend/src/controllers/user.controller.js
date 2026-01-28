const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db/initTables');

const SALT_ROUNDS = 10;
const emailRegex = /\S+@\S+\.\S+/;
const handleControllerError = require('../utils/handleError')

module.exports = {

  
  
  
  async register(req, res) {
    try {
      
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      const {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        shipping_address,
        billing_address
      } = req.body;

      
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          error: 'Missing required fields: first_name, last_name, email, password'
        });
      }

      
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await User.create({
        first_name,
        last_name,
        email,
        password_hash,
        role: 'customer',
        phone_number: phone_number || null,
        shipping_address: shipping_address || null,
        billing_address: billing_address || null
      });

      return res.status(201).json({
        message: 'User registered successfully',
        user_id: user.user_id
      });

    } catch (err) {
      return handleControllerError(req, res, err, 'REGISTER');
    }
  },

  
  
  
  async login(req, res) {
    try {
      if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      
      const token = jwt.sign(
        { sub: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '24h' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          phone_number: user.phone_number
        }
      });

    } catch (err) {
      return handleControllerError(req, res, err, 'LOGIN');
    }
  },

  
  
  
  async getMe(req, res) {
    try {
      const userId = req.user.sub; 

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);

    } catch (err) {
      return handleControllerError(req, res, err, 'GET_ME');
    }
  },

  
  
  
  async updateMe(req, res) {
    try {
      const userId = req.user.sub;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No data provided for update' });
      }

      
      const allowedUpdates = [
        'first_name', 
        'last_name', 
        'phone_number', 
        'shipping_address', 
        'billing_address'
      ];
      
      const updateData = {};
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
      }

      const [updatedRows] = await User.update(updateData, {
        where: { user_id: userId }
      });

      if (updatedRows === 0) {
        return res.status(404).json({ error: 'User not found or no changes made' });
      }

      return res.json({ message: 'Profile updated successfully' });

    } catch (err) {
      return handleControllerError(req, res, err, 'UPDATE_ME');
    }
  }
};