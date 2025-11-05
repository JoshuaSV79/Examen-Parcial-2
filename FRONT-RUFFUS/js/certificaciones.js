document.addEventListener('DOMContentLoaded', function() {
  // Botones de pago e inicio de examen
  const payJSBtn = document.getElementById('payJS');
  const startJSBtn = document.getElementById('startJS');

  // Verificar si el usuario está logeado
  function estaLogeado() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    return usuarioActivo !== null;
  }

  // Obtener el usuario actual
  function getUsuarioActual() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    return usuarioActivo ? JSON.parse(usuarioActivo) : null;
  }

  // Verificar si el usuario ha pagado un examen específico
  function haPagadoExamen(examenId) {
    const usuario = getUsuarioActual();
    if (!usuario) return false;

    // Obtener los pagos del usuario desde localStorage
    const pagosKey = `pagos_${usuario.cuenta}`;
    const pagos = localStorage.getItem(pagosKey);
    
    if (!pagos) return false;
    
    const pagosArray = JSON.parse(pagos);
    return pagosArray.includes(examenId);
  }

  // Registrar pago de examen
  function registrarPago(examenId) {
    const usuario = getUsuarioActual();
    if (!usuario) return false;
    const pagosKey = `pagos_${usuario.cuenta}`;
    let pagos = localStorage.getItem(pagosKey);
    let pagosArray = pagos ? JSON.parse(pagos) : [];
    
    if (!pagosArray.includes(examenId)) {
      pagosArray.push(examenId);
      localStorage.setItem(pagosKey, JSON.stringify(pagosArray));
    }
    
    return true;
  }

  // Manejar clic en botón de pago
  payJSBtn.addEventListener('click', function() {
    if (!estaLogeado()) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión',
        text: 'Para pagar el examen necesitas estar logeado',
        confirmButtonColor: '#1a73e8'
      });
      return;
    }

    // Verificar si ya pagó
    if (haPagadoExamen('js_fundamentals')) {
      Swal.fire({
        icon: 'info',
        title: 'Ya has pagado',
        text: 'Ya has pagado este examen. Puedes iniciarlo cuando quieras.',
        confirmButtonColor: '#1a73e8'
      });
      return;
    }

    // Simular proceso de pago
    Swal.fire({
      title: 'Procesar pago',
      text: '¿Deseas pagar $500 MXN por el examen de Fundamentos de Desarrollo Web?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1a73e8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, pagar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simular procesamiento
        Swal.fire({
          title: 'Procesando pago...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Simular delay de procesamiento
          setTimeout(() => {
          registrarPago('js_fundamentals');

          Swal.fire({
            icon: 'success',
            title: 'Pago exitoso',
            text: 'El examen ha sido desbloqueado. Ya puedes iniciarlo.',
            confirmButtonColor: '#1a73e8'
          }).then(() => {
            window.location.reload();
          });

          payJSBtn.textContent = 'Pagado';
          payJSBtn.style.backgroundColor = '#28a745';
          payJSBtn.disabled = true;
        }, 1500);
      }
    });
  });

  startJSBtn.addEventListener('click', function() {
    // Verificar si esta logeado
    if (!estaLogeado()) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión',
        text: 'Para iniciar el examen necesitas estar logeado',
        confirmButtonColor: '#1a73e8'
      });
      return;
    }

    // Verificar si ha pagado
    if (!haPagadoExamen('js_fundamentals')) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes pagar el examen',
        text: 'Para iniciar el examen primero debes realizar el pago',
        confirmButtonColor: '#1a73e8',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Ir a pagar'
      }).then((result) => {
        if (result.isConfirmed) {
          payJSBtn.click();
        }
      });
      return;
    }

    // Todo validado, iniciar examen
    Swal.fire({
      title: '¿Iniciar examen?',
      html: `
        <p>Estás a punto de iniciar el examen de:</p>
        <p><strong>Fundamentos de Desarrollo Web y Programación</strong></p>
        <br>
        <p>Tiempo límite: 90 minutos</p>
        <p>Puntuación mínima: 80/100</p>
        <br>
        <p style="color: #d33;">Una vez iniciado, el tiempo comenzará a correr.</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#1a73e8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, iniciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Examen iniciado',
          text: 'Redirigiendo al examen...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Redirigir a la pagina del examen
          window.location.href = 'examen-js.html';
        });
      }
    });
  });

  // Verificar estado inicial al cargar la página
  function actualizarEstadoBotones() {
    if (estaLogeado() && haPagadoExamen('js_fundamentals')) {
      payJSBtn.textContent = 'Usted ya a pagado';
      payJSBtn.style.backgroundColor = '#28a745';
      payJSBtn.disabled = true;
    }
  }

  // Actualizar estado inicial
  actualizarEstadoBotones();
});