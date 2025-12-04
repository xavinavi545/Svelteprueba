<script>
    import axios from "axios";
    import { token } from "../store";
    import { goto } from "$app/navigation";

    async function salir() {
        const tokenphp = JSON.parse(localStorage.getItem("token"));

        try {
            const res = await axios.post('/api/proxy', {
                url: 'login/salir.php',
                method: 'POST',
                data: { token: tokenphp }
            });

            if (res.data === "success") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("foto");
                goto("/");
            }
        } catch (err) {
            console.error("Error al salir:", err);
        }
    }
</script>

<nav class="red">
    <div class="nav-wrapper">
        <a href="/" class="brand-logo">Crud Svelte - PHP</a>

        {#if $token === 1}
            <ul class="right hide-on-med-and-down">
                <li><a href="/Inicio">Inicio</a></li>
                <li><a href="/Guardar">Guardar</a></li>
                <li><a href="/" on:click={salir}>Salir</a></li>
            </ul>
        {/if}
    </div>
</nav>
