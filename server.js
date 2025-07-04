import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// ✅ CORS configurado para GitHub Pages y local
const allowedOrigins = [
  'https://adrianrs928222.github.io',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  }
}));

app.use(express.json());

// (Opcional) Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Endpoint para crear sesión de pago
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name
          },
          unit_amount: item.price, // Precio en céntimos
        },
        quantity: 1
      })),
      success_url: 'https://adrianrs928222.github.io/success.html',
      cancel_url: 'https://adrianrs928222.github.io/cancel.html',
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error('❌ Error al crear la sesión:', error.message);
    res.status(500).json({ error: 'Error al crear la sesión de Stripe' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
