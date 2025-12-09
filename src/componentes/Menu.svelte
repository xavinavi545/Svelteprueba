<script>
  import axios from 'axios';
  import { token } from '../store';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let usuario = '';
  let fotoUsuario = '';
  onMount(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const foto = JSON.parse(localStorage.getItem('foto'));
    if (user) usuario = user;
    if (foto) fotoUsuario = foto;
  });

  async function salir() {
    const tokenphp = JSON.parse(localStorage.getItem('token'));

    try {
      const res = await axios.post('/api/login/salir', { token: tokenphp });
      if (res.data === 'success') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('foto');
        goto('/');
      }
    } catch (err) {
      console.error('Error al salir:', err);
      alert('No se pudo cerrar sesión');
    }
  }
</script>

<nav class="red">
  <div class="nav-wrapper container">
    <a href="/" class="brand-logo">Crud Svelte - PHP</a>

    {#if $token === 1}
      <ul class="right hide-on-med-and-down">
        <li><a href="/Inicio">Inicio</a></li>
        <li><a href="/Guardar">Guardar</a></li>
        <li class="user-info">
          {#if fotoUsuario}
            <img src={fotoUsuario} alt="Foto Usuario" class="avatar-nav"/>
          {/if}
          <span>{usuario}</span>
        </li>
        <li><a href="/" on:click|preventDefault={salir}>Salir</a></li>
      </ul>
    {/if}
  </div>
</nav>

<style>
.brand-logo { padding-left: 10px; }
.user-info { display: flex; align-items: center; gap: 5px; }
.avatar-nav { width: 30px; height: 30px; border-radius: 50%; }
</style>
