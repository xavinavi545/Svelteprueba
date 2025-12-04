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

        const res = await axios.post(
            "http://localhost/sveltephp/posts/altaPost.php",
            formData
        );

        Swal.fire("Muy bien", "Tu post fue guardado", "success");
		goto("/");

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

        <button class="btn blue" type="submit">Guardar post</button>

    </form>
</div>

<style>
textarea {
    min-height: 120px;
}
</style>
