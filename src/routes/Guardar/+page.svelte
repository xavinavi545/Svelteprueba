<script>
    import axios from "axios";
    import sesion from "../../sesion";
    import InputCustom from "../../componentes/InputCustom.svelte";
    import Menu from "../../componentes/Menu.svelte";
    import Swal from "sweetalert2";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { API_URL } from '../../lib/config'; 

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
        if (titulo.trim() === "") {
            Swal.fire("Error", "El título no puede estar vacío", "error");
            return;
        }

        if (titulo.length > 100) {
            Swal.fire("Límite excedido", "El título debe tener máximo 100 caracteres", "warning");
            return;
        }

        if (contenido.trim() === "") {
            Swal.fire("Error", "El contenido no puede estar vacío", "error");
            return;
        }

        if (contenido.length > 80) {
            Swal.fire("Límite excedido", "El contenido puede tener máximo 80 caracteres", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("usuario", user);
        formData.append("fotoUser", fotoUsuario);
        formData.append("titulo", titulo);
        formData.append("post", contenido);
        if (foto) {
            formData.append("foto", foto);
        }

        try {
            const res = await axios.post(`${API_URL}posts/altaPost.php`, formData);
            if (res.data === 'success') {
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

        <InputCustom 
            id="titulo"
            name="titulo"
            label="Título del post"
            icon="title"
            bind:value={titulo}
        />

        <div class="input-field">
            <i class="material-icons prefix">notes</i>
            <textarea 
                id="contenido"
                name="post"
                class="materialize-textarea"
                bind:value={contenido}
            ></textarea>
            <label for="contenido">Escribe el post</label>
        </div>

        <div class="file-field input-field">
            <div class="btn">
                <span>Subir Foto</span>
                <input type="file" on:change={onFileChange} />
            </div>
            <div class="file-path-wrapper">
                <input class="file-path validate" type="text" placeholder="Selecciona una foto opcional" />
            </div>
        </div>

        <button class="btn blue" type="submit">Guardar post</button>
    </form>
</div>

<style>
textarea {
    min-height: 120px;
}
</style>
