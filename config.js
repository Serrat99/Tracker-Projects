// Configuración de conexión de Supabase
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

let supabaseClient = null;

try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Cliente de Supabase inicializado correctamente.");
    } else {
        console.warn("La librería de Supabase no está cargada en el objeto global.");
    }
} catch (error) {
    console.error("Error al inicializar el cliente de Supabase:", error);
}
