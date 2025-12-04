<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import Menu from "../../componentes/Menu.svelte";
    import sesion from "../../sesion";

    let usuario = "";
    let fotoUsuario = "";
    let posts = [];
    let cargando = true;

    let busqueda = "";
    let ordenarPor = "fecha";
    let orden = "desc";

    onMount(() => {
        sesion.session();
        cargarUsuario();
        cargarPosts();
    });

    function cargarUsuario() {
        const token = JSON.parse(localStorage.getItem("token"));

        axios.post("http://localhost/sveltephp/posts/user.php?token=" + token)
        .then(res => {
            usuario = res.data.user;
            fotoUsuario = res.data.foto;

            localStorage.setItem("user", JSON.stringify(usuario));
            localStorage.setItem("foto", JSON.stringify(fotoUsuario));
        });
    }

    async function cargarPosts() {
        cargando = true;
        const res = await fetch("http://localhost/sveltephp/posts/posts.php");
        posts = await res.json();
        cargando = false;
    }

    function filtrarPosts() {
        let resultado = posts;

        if (busqueda.trim() !== "") {
            resultado = resultado.filter(p =>
                p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                p.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                p.post.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        resultado.sort((a, b) => {
            let campoA, campoB;

            if (ordenarPor === "fecha") {
                campoA = new Date(a.fecha);
                campoB = new Date(b.fecha);
            } else {
                campoA = a[ordenarPor].toLowerCase();
                campoB = b[ordenarPor].toLowerCase();
            }

            if (orden === "asc") return campoA > campoB ? 1 : -1;
            if (orden === "desc") return campoA < campoB ? 1 : -1;
        });

        return resultado;
    }
</script>

<Menu />

<div class="container">
    <h1>Bienvenido {usuario}</h1>

    <div class="row">
        <div class="col s12 m6">
            <input 
                type="text" 
                placeholder="Buscar..." 
                bind:value={busqueda}
            />
        </div>

        <div class="col s6 m3">
            <select bind:value={ordenarPor}>
                <option value="fecha">Fecha</option>
                <option value="titulo">Título</option>
                <option value="usuario">Usuario</option>
            </select>
        </div>

        <div class="col s6 m3">
            <select bind:value={orden}>
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
            </select>
        </div>
    </div>

    {#if cargando}
        <p>Cargando posts...</p>

    {:else if filtrarPosts().length === 0}
        <h3>No hay posts que coincidan</h3>

    {:else}
        {#each filtrarPosts() as item}
            <div class="row">
                <div class="col s1">
                    <img 
                        src={item.foto} 
                        alt="Foto del usuario"
                        width="50" 
                        height="50"
                    />
                </div>

                <div class="col s11">
                    <b>{item.usuario}</b>
                    <h5>
                        {item.titulo}

                        {#if item.usuario === usuario}
                            <a href="/Editar/{item.id}">
                                <i class="material-icons">edit</i>
                            </a>
                        {/if}
                    </h5>

                    <p>{item.post}</p>
                    <small>{item.fecha}</small>
                    <hr />
                </div>
            </div>
        {/each}
    {/if}
</div>

<style>
select {
    display: block;
    width: 100%;
    margin-top: 15px;
}
</style>
