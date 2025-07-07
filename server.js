import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors()); // o configura `origin` si tienes frontend en dominio aparte
app.use(express.json());

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
          unit_amount: 2499 * 100, // en céntimos (2499 = 24,99 €)
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://tu-dominio.com/success',
      cancel_url: 'https://tu-dominio.com/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Algo salió mal' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));