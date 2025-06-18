$(document).ready(function () {

    $('.checklogin').click(async function (e) {
        e.preventDefault();

        const nombre = $('#username').val().trim();
        const password = $('#password').val().trim();

        if (!nombre || !password) {
            alert("Por favor, ingresa nombre y contraseña");
            return;
        }

        try {
            const response = await $.ajax({
                type: 'POST',
                url: 'https://api-hospital-rosy.vercel.app/api/checkLogin',
                contentType: 'application/json',
                data: JSON.stringify({ nombre, password }),
            });

            if (response.rol === "admin") {
                localStorage.setItem('usuarioNombre', nombre);  // <-- Guarda el nombre
                window.location.href = "../html/admin.html";
            } else if (response.rol === "administrativo") {
                localStorage.setItem('usuarioNombre', nombre);  // <-- Guarda el nombre
                window.location.href = "../html/administrativo.html";
            } else {
                alert("Rol no reconocido o usuario no autorizado");
            }
        } catch (error) {
            alert("Error al iniciar sesión");
            console.error(error);
        }
    });

    /*Cargar especialistas */
    function cargarEspecialistas() {
        $.ajax({
            url: 'https://api-hospital-rosy.vercel.app/api/especialistas',
            method: 'GET',
            success: function (especialistas) {
                const contenedorEspe = $('.cargarEspe');
                contenedorEspe.empty();

                especialistas.forEach(especialista => {
                    const tarjeta = $(`
                    <section class="especialista">
                        <img src="../imagenes/medic.png" alt="imagen paciente" class="img-fluid">
                        <section class="datosEspe">
                        <p><strong>Nombre:</strong> ${especialista.username}</p>
                        <p><strong>Apellido:</strong> ${especialista.username}</p>
                        <p><strong>Dirección:</strong> ${especialista.username}</p>
                        <p><strong>Especialidad:</strong> ${especialista.especialidad}</p>
                        </section>
                    </section>
                    `);
                    contenedorEspe.append(tarjeta);
                });
            },
            error: function () {
                alert('Error al cargar los pacientes.');
            }
        });
    }
    cargarEspecialistas();
    /*Crear especialista */
    function crearEspe() {
        $('.crearEspe').click(async function (e) {
            e.preventDefault(); // Evita el envío tradicional del formulario

            const especialista = {
                username: $('#username').val(),
                apellido: $('#apellido').val(),
                direccion: $('#direccion').val(),
                especialidad: $('#especialidad').val()
            };

            await $.ajax({
                url: 'https://api-hospital-rosy.vercel.app/api/crearEspecialistas',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(especialista),
                success: function (response) {
                    //alert(response.message);
                    $('.formu')[0].reset();
                },
                error: function (xhr) {
                    alert('Error al crear especialista: ' + xhr.responseText);
                }
            });
        });
    }
    crearEspe();

    /*CREAR PACIENTE */

    function crearPaciente() {
        $('.crearPaciente').click(async function (e) {
            e.preventDefault(); // Evita el envío tradicional del formulario

            const paciente = {
            usernamePaciente: $('#usernamePaciente').val(),
            apellidoPaciente: $('#apellidoPaciente').val(),
            direccionPaciente: $('#direccion').val(),
            telefonoPaciente: $('#telefono').val()
            };

            await $.ajax({
            url: 'https://api-hospital-rosy.vercel.app/api/crearPaciente',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(paciente),
            success: function (response) {
                //alert(response.message);
                $('.formu')[0].reset();
            },
            error: function (xhr) {
                alert('Error al crear especialista: ' + xhr.responseText);
            }
            });
        });
    }
    crearPaciente();

    function verPaciente() {
        $.ajax({
            url: 'https://api-hospital-rosy.vercel.app/api/pacientes',
            method: 'GET',
            success: function (pacientes) {
                const contenedor = $('.verPaciente');
                contenedor.empty();

                pacientes.forEach(paciente => {
                const tarjeta = $(`
                <section class="paciente">
                    <img src="../imagenes/paciente.png" alt="imagen paciente" class="img-fluid">
                    <section class="datos">
                    <p><strong>Nombre:</strong> ${paciente.nombre}</p>
                    <p><strong>Apellido:</strong> ${paciente.apellido}</p>
                    <p><strong>Dirección:</strong> ${paciente.direccion}</p>
                    <p><strong>Teléfono:</strong> ${paciente.telefono}</p>
                    </section>
                </section>
                `);

                contenedor.append(tarjeta);
                });

                
            },
            error: function () {
                alert('Error al cargar los pacientes.');
            }
        });
    }

   verPaciente();




   /*ASIGNAR CITAS A LOS PACIENTES */
   function asignarCita() {
    $.ajax({
      url: 'https://api-hospital-rosy.vercel.app/api/pacientes',
      method: 'GET',
      success: function (pacientes) {
        const contenedor = $('.listaPacientes');
        contenedor.empty();
        let pacienteSeleccionado = null;

        pacientes.forEach(paciente => {
          const tarjeta = $(`
          <section class="paciente">
            <img src="../imagenes/paciente.png" alt="imagen paciente" class="img-fluid">
            <section class="datos">
              <p><strong>Nombre:</strong> ${paciente.nombre}</p>
              <p><strong>Apellido:</strong> ${paciente.apellido}</p>
              <p><strong>Dirección:</strong> ${paciente.direccion}</p>
              <p><strong>Teléfono:</strong> ${paciente.telefono}</p>
            </section>
          </section>
          `);

          tarjeta.click(function (e) {
            e.preventDefault();
            pacienteSeleccionado = paciente;
            $('.modalFecha').fadeIn();
            console.log('Paciente seleccionado:', pacienteSeleccionado);
          });

          contenedor.append(tarjeta);
        });

        $('.darCita').click(function () {
          e.preventDefault();
          const fecha = $('#fechaSeleccionada').val();

          if (!fecha || !pacienteSeleccionado) {
            alert('Selecciona una fecha válida y un paciente.');
            return;
          }

          const citaPaciente = {
            nombre: pacienteSeleccionado.nombre,
            apellido: pacienteSeleccionado.apellido,
            codigoPaciente: pacienteSeleccionado._id,
            fecha: fecha
          };

          console.log('Cita a enviar:', citaPaciente);
          //alert(JSON.stringify(citaPaciente)); // Congela y te deja ver los datos


          $.ajax({
            url: 'https://api-hospital-rosy.vercel.app/api/asignarCita',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(citaPaciente),
            success: function (respuesta) {

              alert('Cita registrada correctamente', respuesta);
              $('.modalFecha').fadeOut();
              $('#fechaSeleccionada').val('');
              console.log(respuesta);

            },
            error: function (e) {
              alert('Error al registrar la cita.', e);
            }
          });
        });
      },
      error: function () {
        alert('Error al cargar los pacientes.');
      }
    });
  }
  asignarCita();
});