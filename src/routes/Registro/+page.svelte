<script>
	import { goto } from '$app/navigation';
	import InputCustom from '../../componentes/InputCustom.svelte';
	import File from '../../componentes/File.svelte';
	import Swal from 'sweetalert2';
	import axios from 'axios';
	import Menu from '../../componentes/Menu.svelte';
	import { API_URL } from '../../lib/config'; 

	let pass = '';
	let pass2 = '';
	let email = '';
	let show = false;

	function registrarse() {
		if (pass === pass2) {
			const form = document.getElementById('registroForm');
			axios
				.post(`${API_URL}login/registro.php`, new FormData(form))
				.then((res) => {
					if (res.data === 'success') {
						Swal.fire('Correcto', 'Registrado correctamente', 'success');
						goto('/');
					} else {
						Swal.fire('Error', 'Falló el registro', 'error');
					}
				})
				.catch(err => {
					console.error('Error al registrar:', err);
					Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
				});
		} else {
			Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
		}
	}

	function validarEmail() {
		if (email.trim() !== '') {
			const datosEmail = new FormData();
			datosEmail.append('email', email);
			axios.post(`${API_URL}login/validarEmail.php`, datosEmail)
				.then((res) => {
					if (res.data === 'success') {
						show = true;
					} else {
						show = false;
						Swal.fire('Error', 'El correo ya existe', 'error');
					}
				})
				.catch(err => {
					console.error('Error al validar email:', err);
				});
		}
	}
</script>

<Menu />

<div class="container">
	<h1>Registro</h1>
	<form
		on:submit|preventDefault={registrarse}
		id="registroForm"
		autocomplete="off"
		enctype="multipart/form-data"
	>
		<div class="input-field">
			<i class="material-icons prefix">email</i>
			<input
				type="email"
				name="email"
				id="email"
				required
				bind:value={email}
				on:blur={validarEmail}
			/>
			<label for="email">Email</label>
		</div>

		<InputCustom
			type="password"
			id="pass"
			name="pass"
			label="Password"
			icon="https"
			value={pass}
			on:input={(event) => (pass = event.target.value)}
		/>

		<InputCustom
			type="password"
			id="pass2"
			name="pass2"
			label="Verificación de Password"
			icon="https"
			value={pass2}
			on:input={(event) => (pass2 = event.target.value)}
		/>

		<InputCustom id="usuario" name="usuario" label="Nombre de usuario" icon="account_circle" />

		<File />

		{#if show}
			<button type="submit" class="btn green">Registrarse</button>
		{/if}

		<a href="/" class="btn blue">Login</a>
	</form>
</div>
