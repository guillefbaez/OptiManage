// Maneja la recuperación de contraseña

const resetForm = document.getElementById('resetForm');
if (resetForm) {
  resetForm.addEventListener('submit', async e => {
    e.preventDefault();
    const correo = document.getElementById('email').value.trim();
    const pass1  = document.getElementById('newPassword').value.trim();
    const pass2  = document.getElementById('confirmPassword').value.trim();

    if (!correo || !pass1 || !pass2) {
      return alert('Por favor completa todos los campos.');
    }
    if (pass1 !== pass2) {
      return alert('Las contraseñas no coinciden.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/reset_password', {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify({ correo, contrasena: pass1 })
      });
      const text = await res.text();
      if (!text) throw new Error('No hubo respuesta del servidor.');
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.error || 'Error al actualizar contraseña');
      alert(data.message || 'Contraseña actualizada correctamente');
      window.location.href = 'Inicio.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

