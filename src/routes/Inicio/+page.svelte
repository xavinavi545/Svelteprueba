<script>
  import Menu from '../../componentes/Menu.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import sesion from '../../sesion';
  import { goto } from '$app/navigation';

  let usuario = '';
  let fotoUsuario = '';
  let posts = [];
  let cargando = true;

  let busqueda = '';
  let ordenarPor = 'fecha';
  let orden = 'desc';

  onMount(async () => {
    await sesion.session();
    await cargarUsuario();
    await cargarPosts();
  });

  async function cargarUsuario() {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) return goto('/Registro'); // Redirige si no hay sesión

    try {
      const res = await axios.post('/api/login/user', { token });
      usuario = res.data.user;
      fotoUsuario = res.data.foto;

      if (fotoUsuario) {
        fotoUsuario = `/foto_perfil/${fotoUsuario}`;
      }

      localStorage.setItem('user', JSON.stringify(usuario));
      localStorage.setItem('foto', JSON.stringify(fotoUsuario));
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
      goto('/Registro');
    }
  }
  async function cargarPosts() {
    cargando = true;
    try {
      const res = await axios.get('/api/posts/listar');
      posts = res.data.map(p => ({
        ...p,
        foto: p.foto ? `/foto_perfil/${p.foto}` : '/default-avatar.png'
      }));
    } catch (err) {
      console.error('Error al cargar posts:', err);
      posts = [];
    } finally {
      cargando = false;
    }
  }

  function filtrarPosts() {
    let resultado = posts;

    if (busqueda.trim() !== '') {
      resultado = resultado.filter(p =>
        p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.post.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    resultado.sort((a, b) => {
      let campoA, campoB;
      if (ordenarPor === 'fecha') {
        campoA = new Date(a.fecha);
        campoB = new Date(b.fecha);
      } else {
        campoA = a[ordenarPor].toLowerCase();
        campoB = b[ordenarPor].toLowerCase();
      }

      if (orden === 'asc') return campoA > campoB ? 1 : -1;
      if (orden === 'desc') return campoA < campoB ? 1 : -1;
    });

    return resultado;
  }

  function editarPost(id) {
    goto(`/Editar/${id}`);
  }

  async function eliminarPost(id) {
    const confirm = await Swal.fire({
      title: 'Eliminar post?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.post('/api/posts/eliminar', { id });
        Swal.fire('Eliminado', 'El post se eliminó correctamente', 'success');
        cargarPosts();
      } catch (err) {
        console.error('Error al eliminar post:', err);
        Swal.fire('Error', 'No se pudo eliminar el post', 'error');
      }
    }
  }

  function agregarPost() {
    goto('/Guardar');
  }
</script>

<Menu />

<div class="container">
  <div class="header">
    <h1>Bienvenido, {usuario}</h1>
    <img src={fotoUsuario || '/default-avatar.png'} alt="Foto Usuario" class="avatar"/>
  </div>

  <div class="controls">
    <input type="text" placeholder="Buscar..." bind:value={busqueda} />

    <div>
      <select bind:value={ordenarPor}>
        <option value="fecha">Fecha</option>
        <option value="titulo">Título</option>
        <option value="usuario">Usuario</option>
      </select>

      <select bind:value={orden}>
        <option value="desc">Descendente</option>
        <option value="asc">Ascendente</option>
      </select>

      <button class="btn green" on:click={agregarPost}>Nuevo Post</button>
    </div>
  </div>

  {#if cargando}
    <p>Cargando posts...</p>

  {:else if filtrarPosts().length === 0}
    <h3>No hay posts que coincidan</h3>

  {:else}
    {#each filtrarPosts() as post}
      <div class="post-card">
        <div class="post-header">
          <img src={post.foto} alt="Foto Usuario" class="post-avatar" />
          <div class="post-user">
            <b>{post.usuario}</b>
            <small>{post.fecha}</small>
          </div>
        </div>

        <div class="post-body">
          <h4>{post.titulo}</h4>
          <p>{post.post}</p>
        </div>

        {#if post.usuario === usuario}
          <div class="post-actions">
            <button class="btn blue" on:click={() => editarPost(post.id)}>Editar</button>
            <button class="btn red" on:click={() => eliminarPost(post.id)}>Eliminar</button>
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>

<style>
.container { max-width: 900px; margin: 20px auto; padding: 15px; }
.header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.avatar { width: 60px; height: 60px; border-radius: 50%; }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 20px; }
.controls input { flex: 1; padding: 5px 10px; }
.controls select { padding: 5px 10px; }
.post-card { border: 1px solid #ccc; border-radius: 5px; padding: 15px; margin-bottom: 15px; }
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.post-avatar { width: 50px; height: 50px; border-radius: 50%; }
.post-actions { margin-top: 10px; display: flex; gap: 10px; }
</style>
