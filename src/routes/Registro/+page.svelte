<script>
  import { goto } from '$app/navigation';
  import InputCustom from '../../componentes/InputCustom.svelte';
  import File from '../../componentes/File.svelte';
  import Swal from 'sweetalert2';
  import axios from 'axios';
  import Menu from '../../componentes/Menu.svelte';

  let pass = '';
  let pass2 = '';
  let email = '';
  let show = false;

  // Función para registrarse
  async function registrarse() {
    if (pass !== pass2) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    const form = document.getElementById('registroForm');

    try {
      const res = await axios.post('/api/registro', Object.fromEntries(new FormData(form)));

      if (res.data === 'success') {
        Swal.fire('Correcto', 'Registrado correctamente', 'success');
        goto('/');
      } else {
        Swal.fire('Error', 'Falló el registro', 'error');
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  }

  
  async function validarEmail() {
    if (email.trim() === '') return;

    try {
      const res = await axios.post('/api/validarEmail', { email });
      if (res.data === 'success') {
        show = true;
      } else {
        show = false;
        Swal.fire('Error', 'El correo ya existe', 'error');
      }
    } catch (err) {
      console.error('Error al validar email:', err);
    }
  }
</script>

<Menu />

<div class="container">
  <h1>Registro</h1>
  <form on:submit|preventDefault={registrarse} id="registroForm" autocomplete="off" enctype="multipart/form-data">
    <div class="input-field">
      <i class="material-icons prefix">email</i>
      <input type="email" name="email" id="email" required bind:value={email} on:blur={validarEmail}/>
      <label for="email">Email</label>
    </div>

    <InputCustom type="password" id="pass" name="pass" label="Password" icon="https" bind:value={pass}/>
    <InputCustom type="password" id="pass2" name="pass2" label="Verificación de Password" icon="https" bind:value={pass2}/>
    <InputCustom id="usuario" name="usuario" label="Nombre de usuario" icon="account_circle"/>
    <File />

    {#if show}
      <button type="submit" class="btn green">Registrarse</button>
    {/if}

    <a href="/" class="btn blue">Login</a>
  </form>
</div>

<style>
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .input-field { margin-bottom: 20px; }
</style>
