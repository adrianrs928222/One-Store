document.getElementById('buy-button').addEventListener('click', async () => {
  try {
    const response = await fetch('https://one-store-95m5.onrender.com/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: 'Mini Soldador USB', price: 1499 }] // 💶 en céntimos
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear la sesión de pago');
    }

    const data = await response.json();

    // 🔁 Redirige a Stripe Checkout
    window.location.href = data.url;

  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al procesar tu pago. Intenta de nuevo.');
  }
});
