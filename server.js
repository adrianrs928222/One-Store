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

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// Configuración segura de CORS
const allowedOrigins = [
  'https://one-store-95m5.onrender.com',  // Cambia esto por el dominio real
  'http://localhost:3000'            // Para desarrollo local
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Servir archivos estáticos si los tienes
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de Stripe
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
          unit_amount: item.price,
        },
        quantity: 1
      })),
      success_url: 'https://one-store-95m5.onrender.com/success.html',
      cancel_url: 'https://one-store-95m5.onrender.com/cancel.html',
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
