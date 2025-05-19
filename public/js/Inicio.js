// Maneja el registro (Crear Cuenta) y el login en un solo archivo

const BASE_URL = 'http://localhost:3000';

// Registro de usuario
const createForm = document.getElementById('createForm');
if (createForm) {
  createForm.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      nombres:    document.getElementById('firstName').value.trim(),
      apellidos:  document.getElementById('lastName').value.trim(),
      correo:     document.getElementById('email').value.trim(),
      contrasena: document.getElementById('password').value.trim()
    };
    if (!payload.nombres || !payload.apellidos || !payload.correo || !payload.contrasena) {
      return alert('Por favor completa todos los campos.');
    }
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');
      sessionStorage.setItem('userId', data.id);
      window.location.href = 'Inicio.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

// Login de usuario
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const correo     = document.getElementById('username').value.trim();
    const contrasena = document.getElementById('password').value.trim();
    if (!correo || !contrasena) {
      return alert('Completa ambos campos para ingresar.');
    }

    try {
      const res  = await fetch(`${BASE_URL}/api/login`, {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify({ correo, contrasena })
      });
      const data = await res.json();

      // <-- Aquí logueamos la respuesta real
      console.log('Login response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Error al autenticar');
      }

      // Guardamos el primer nombre
      sessionStorage.setItem('firstName', data.firstName);
      window.location.href = 'Dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  });
}