import express from 'express';
import { updateCart } from '../controllers/cartController.js';
import authUser from '../middlewares/authUser.js';

const cartRouter = express.Router();

// POST /api/cart/update - update cart (protected route)
cartRouter.post('/update', authUser, updateCart);

export default cartRouter;
