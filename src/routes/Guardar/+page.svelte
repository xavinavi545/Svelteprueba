<script>
	import axios from "axios";
	import sesion from "../../sesion";
	import InputCustom from "../../componentes/InputCustom.svelte";
	import Menu from "../../componentes/Menu.svelte";
	import Swal from "sweetalert2";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	let user = "";
	let fotoUsuario = "";
	let titulo = "";
	let contenido = "";
	let foto = null;

	onMount(() => {
		sesion.session();
		user = JSON.parse(localStorage.getItem("user"));
		fotoUsuario = JSON.parse(localStorage.getItem("foto"));
	});

	function onFileChange(e) {
		foto = e.target.files[0];
	}

	async function guardar() {
	if (titulo.trim() === "" || contenido.trim() === "") {
		Swal.fire("Error", "El título y contenido no pueden estar vacíos", "error");
		return;
	}

	
	const formData = new FormData();
	formData.append("usuario", user);
	formData.append("fotoUser", fotoUsuario);
	formData.append("titulo", titulo);
	formData.append("post", contenido);
	if (foto) formData.append("foto", foto);

	
	const formDataProxy = new FormData();
	formDataProxy.append("url", "posts/altaPost.php");
	formDataProxy.append("method", "POST");

	
	for (let [key, value] of formData.entries()) {
		formDataProxy.append(key, value);
	}

	try {
		const res = await axios.post("/api/proxy", formDataProxy, {
			headers: { "Content-Type": "multipart/form-data" }
		});

		if (res.data === "success") {
			Swal.fire("Muy bien", "Tu post fue guardado", "success");
			goto("/");
		} else {
			Swal.fire("Error", "No se pudo guardar el post", "error");
		}

	} catch (err) {
		console.error("Error al guardar:", err);
		Swal.fire("Error", "No se pudo conectar con el servidor", "error");
	}
}
</script>

<Menu />

<div class="container">
	<h1>Guardar</h1>

	<form on:submit|preventDefault={guardar} id="formGuardar" autocomplete="off">
		<input type="hidden" name="usuario" bind:value={user} />
		<input type="hidden" name="fotoUser" bind:value={fotoUsuario} />

		<InputCustom id="titulo" name="titulo" label="Título del post" icon="title" bind:value={titulo} />

		<div class="input-field">
			<i class="material-icons prefix">notes</i>
			<textarea id="contenido" name="post" class="materialize-textarea" bind:value={contenido}></textarea>
			<label for="contenido">Escribe el post</label>
		</div>

		<div class="file-field input-field">
			<div class="btn">
				<span>Subir Foto</span>
				<input type="file" on:change={onFileChange}/>
			</div>
			<div class="file-path-wrapper">
				<input class="file-path validate" type="text" placeholder="Selecciona una foto opcional"/>
			</div>
		</div>

		<button class="btn blue" type="submit">Guardar post</button>
	</form>
</div>

<style>
textarea { min-height: 120px; }
</style>
