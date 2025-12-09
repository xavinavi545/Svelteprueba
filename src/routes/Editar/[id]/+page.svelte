<script>
  import Menu from '../../../componentes/Menu.svelte';
  import InputCustom from '../../../componentes/InputCustom.svelte';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import sesion from '../../../sesion';

  export let params = {};
  let id = params.id;
  let post = {};

  onMount(() => {
    sesion.session();
    getPost();
  });

  async function getPost() {
    try {
      const res = await axios.post('/api/posts/post', { id });
      post = res.data;
    } catch (err) {
      console.error('Error al obtener el post:', err);
      Swal.fire('Error', 'No se pudo cargar el post', 'error');
    }
  }

  function validarFormulario() {
    if (!post.titulo?.trim()) {
      Swal.fire('Error', 'El título no puede estar vacío', 'error');
      return false;
    }
    if (!post.post?.trim()) {
      Swal.fire('Error', 'El post no puede estar vacío', 'error');
      return false;
    }
    if (post.post.length > 300) {
      Swal.fire('Error', 'El post supera los 300 caracteres', 'error');
      return false;
    }
    return true;
  }

  async function editar() {
    if (!validarFormulario()) return;

    try {
      const res = await axios.post('/api/posts/editar', {
        id,
        titulo: post.titulo,
        post: post.post
      });
      if (res.data === 'success') {
        Swal.fire('Muy bien', 'Tu post fue editado', 'success');
        goto('/Inicio');
      } else {
        Swal.fire('Error', 'Tu post no fue editado', 'error');
      }
    } catch (err) {
      console.error('Error al editar:', err);
      Swal.fire('Error', 'No se pudo editar el post', 'error');
    }
  }

  async function eliminar() {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true
    });

    if (result.isConfirmed) {
      try {
        await axios.post('/api/posts/eliminar', { id });
        Swal.fire('Borrado', 'Tu post ha sido eliminado', 'success');
        goto('/Inicio');
      } catch (err) {
        console.error('Error al eliminar:', err);
        Swal.fire('Error', 'No se pudo eliminar el post', 'error');
      }
    }
  }
</script>

<Menu />

<div class="container">
  <h1>Editar</h1>
  <form on:submit|preventDefault={editar} id="formEditar" autocomplete="off">
    <InputCustom tipo="editar" name="titulo" icon="title" bind:value={post.titulo} />
    <InputCustom tipo="editar" name="post" icon="comment" bind:value={post.post} />

    <button class="btn blue" type="submit">Editar post</button>
  </form>

  <hr/>
  <button class="btn red" on:click={eliminar}>Eliminar Post</button>
</div>
