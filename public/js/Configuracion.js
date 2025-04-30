const BASE_URL = 'http://localhost:3000';

const configForm = document.getElementById('configForm');

if (configForm) {
  configForm.addEventListener('submit', async e => {
    e.preventDefault();

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      return alert('No se encontró el ID del usuario. Inicia sesión nuevamente.');
    }

    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (password && password !== confirmPassword) {
      return alert('Las contraseñas no coinciden.');
    }

    const payload = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName:  document.getElementById('lastName').value.trim(),
      email:     document.getElementById('email').value.trim(),
      telefono:  document.getElementById('telefono').value.trim(),
      ...(password && { password })
    };

    try {
      const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar el perfil');

      alert('Cambios guardados correctamente.');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
}
