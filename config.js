// Configuración de conexión de Supabase y Modo de Almacenamiento
window.modoSupabase = false; // Cambiar a true cuando las tablas existan en Supabase

window.SUPABASE_URL = "https://hgghnalxypgunppnrqgg.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_KanGD_oOzUo9YdRxTw5BhA_5rMzakRm";

window.supabaseClient = null;

try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        window.supabaseClient = window.supabase.createClient(
            window.SUPABASE_URL,
            window.SUPABASE_ANON_KEY
        );
        console.log("Cliente de Supabase inicializado correctamente.");
    } else {
        console.warn("La librería de Supabase no está cargada en el objeto global.");
    }
} catch (error) {
    console.error("Error al inicializar el cliente de Supabase:", error);
}