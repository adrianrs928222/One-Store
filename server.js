import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: 'https://one-store-95m5.onrender.com', // Tu frontend
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir HTML y CSS

// Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Mini Soldador USB',
            images: ['https://m.media-amazon.com/images/I/61Vbog5+DKL._AC_SL1001_.jpg'],
          },
          unit_amount: 2499, // 24,99 €
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://one-store-95m5.onrender.com/success.html',
      cancel_url: 'https://one-store-95m5.onrender.com/cancel.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Algo salió mal' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));