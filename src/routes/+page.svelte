<script>
  import Menu from '../componentes/Menu.svelte';
  import InputCustom from '../componentes/InputCustom.svelte';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) goto('/Inicio');
  });

  async function login() {
    const form = document.getElementById('loginForm');

    try {
      const res = await axios.post('/api/login', Object.fromEntries(new FormData(form)));

      if (res.data.res === 'success') {
        localStorage.setItem('token', JSON.stringify(res.data.token));
        goto('/Inicio');
      } else {
        localStorage.removeItem('token');
        Swal.fire('Error', 'Acceso fallido', 'error');
      }
    } catch (err) {
      console.error('Error en login:', err);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  }
</script>

<Menu />

<div class="container">
  <h1>Login</h1>
  <form on:submit|preventDefault={login} id="loginForm" autocomplete="off">
    <InputCustom type="email" id="email" name="email" label="E-mail" icon="account_circle" />
    <InputCustom type="password" id="pass" name="pass" label="Password" icon="https" />

    <button type="submit" class="btn green">Entrar</button>
    <a href="/Registro" class="btn blue">Registro</a>
  </form>
</div>
