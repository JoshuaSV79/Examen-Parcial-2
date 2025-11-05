document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const userDisplay = document.getElementById('userDisplay');
  const form = document.getElementById('formLogin');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = () => (loginModal.style.display = 'block');
    closeModal.onclick = () => (loginModal.style.display = 'none');
    window.onclick = (event) => {
      if (event.target === loginModal) loginModal.style.display = 'none';
    };
  }

  const usuarioActivo = localStorage.getItem('usuarioActivo');
  if (usuarioActivo) {
    try {
      const usuario = JSON.parse(usuarioActivo);
      mostrarUsuario(usuario);
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      localStorage.removeItem('usuarioActivo');
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login").value.trim();
    const contrasena = document.getElementById("password").value.trim();

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuenta: login, contrasena })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        const usuario = data.usuario;
        if (usuario && usuario.cuenta) {
          localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
          localStorage.setItem("authToken", data.token);

          Swal.fire({
            icon: 'success',
            title: 'Acceso permitido',
            text: `Bienvenido, ${usuario.nombreCompleto || usuario.cuenta}! Puedes intentar el examen nuevamente.`,
            confirmButtonColor: '#1a73e8'
          }).then(() => {
            mostrarUsuario(usuario);
            loginModal.style.display = 'none';
            form.reset();
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Error inesperado',
            text: 'Respuesta incompleta del servidor.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
            text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
        });
        form.reset();
      }

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor.',
      });
    }
  });

  logoutBtn.addEventListener("click", async () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión será cerrada y podrás iniciar nuevamente para otro intento de examen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a73e8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            await fetch("http://localhost:3000/api/auth/logout", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            });
          }
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
        
        // Limpiar todo el localStorage relacionado con la sesión
        localStorage.clear();
        
        // También limpiar pagos específicos del usuario
        const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
        if (usuario.cuenta) {
          localStorage.removeItem(`pagos_${usuario.cuenta}`);
        }
        
        userDisplay.textContent = '';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente. Puedes iniciar sesión nuevamente para otro intento de examen.',
          confirmButtonColor: '#1a73e8'
        }).then(() => {
          window.location.reload();
        });
      }
    });
  });

  function mostrarUsuario(usuario) {
    const nombreMostrar = usuario.nombreCompleto || usuario.cuenta;
    userDisplay.textContent = nombreMostrar;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  }
});