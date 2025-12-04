<script>
	import axios from 'axios';
	import sesion from '../../../sesion';
	import InputCustom from '../../../componentes/InputCustom.svelte';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Menu from '../../../componentes/Menu.svelte';
	import { API_URL } from '../../../lib/config'; 

	export let params = {};
	let id = params.id;
	let post = {};

	onMount(() => {
		sesion.session();
		getPost();
	});


	function getPost() {
		axios.get(`${API_URL}posts/post.php?id=${id}`)
			.then((res) => {
				post = res.data;
			})
			.catch((err) => {
				console.error('Error al obtener el post:', err);
				Swal.fire('Error', 'No se pudo cargar el post', 'error');
			});
	}


	function validarFormulario() {
		const titulo = document.getElementsByName('titulo')[0].value.trim();
		const contenido = document.getElementsByName('post')[0].value.trim();

		if (titulo === '') {
			Swal.fire('Error', 'El título no puede estar vacío', 'error');
			return false;
		}

		if (contenido === '') {
			Swal.fire('Error', 'El post no puede estar vacío', 'error');
			return false;
		}

		if (contenido.length > 300) {
			Swal.fire('Error', 'El post supera los 300 caracteres', 'error');
			return false;
		}

		return true;
	}


	function editar() {
		if (!validarFormulario()) return;

		const form = document.getElementById('formEditar');
		axios.post(`${API_URL}posts/editarPost.php`, new FormData(form))
			.then((res) => {
				if (res.data === 'success') {
					Swal.fire('Muy bien', 'Tu post fue editado', 'success');
					goto('/');
				} else {
					Swal.fire('Error', 'Tu post no fue editado', 'error');
				}
			})
			.catch((err) => {
				console.error('Error al editar:', err);
				Swal.fire('Error', 'No se pudo editar el post', 'error');
			});
	}


	function eliminar() {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'No podrás deshacer esta acción.',
			icon: 'warning',
			showCancelButton: true
		}).then((result) => {
			if (result.isConfirmed) {
				axios.post(`${API_URL}posts/eliminar.php?id=${id}`)
					.then(() => {
						Swal.fire('Borrado', 'Tu post ha sido eliminado', 'success');
						goto('/');
					})
					.catch((err) => {
						console.error('Error al eliminar:', err);
						Swal.fire('Error', 'No se pudo eliminar el post', 'error');
					});
			}
		});
	}
</script>

<Menu />

<div class="container">
	<h1>Editar</h1>
	<form on:submit|preventDefault={editar} id="formEditar" autocomplete="off">
		<input type="hidden" name="id" bind:value={id} />

		<InputCustom tipo="editar" name="titulo" icon="title" value={post.titulo} />
		<InputCustom tipo="editar" name="post" icon="comment" value={post.post} />

		<button class="btn blue" type="submit">Editar post</button>
	</form>

	<hr />
	<button class="btn red" on:click={eliminar}>Eliminar Post</button>
</div>
