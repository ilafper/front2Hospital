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
    





});