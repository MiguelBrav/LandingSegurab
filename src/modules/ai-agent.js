/**
 * ai-agent.js
 * Cliente del agente de IA. Soporta dos modos:
 *  - 'mock': respuestas estáticas simuladas (modo actual)
 *  - 'api' : conversación real vía HTTP con el agente
 *
 * Para migrar al agente real:
 *   1. Cambiar AI_MODE a 'api'
 *   2. Ajustar AI_API_URL al endpoint del agente
 */

// ─── Configuración ───────────────────────────────────────────────────────────
const AI_MODE = 'api';
const AI_API_URL = 'https://ragcc.segurab.com/api/chat/segurab';

// ─── Estado del Agente ────────────────────────────────────────────────────────
let chatHistory = []; // Almacena los últimos msgs para contexto

// ─── Respuestas mock (Backup) ─────────────────────────────────────────────────
const MOCK_RESPONSES = [
    'Hola 👋 Soy el asistente de Segurab. Estoy en fase de entrenamiento con nuestra documentación corporativa.',
    'Pronto podré responder sobre nuestros servicios, tecnologías y procesos internos.',
    'Si tienes dudas urgentes, puedes escribirnos a contacto@Segurab.com.',
    '¡Estamos construyendo algo genial! Muy pronto estaré listo para ayudarte 🚀',
];

// ─── API Pública ──────────────────────────────────────────────────────────────

/**
 * Envía un mensaje al agente y devuelve la respuesta.
 * @param {string} userMessage - El mensaje del usuario.
 * @returns {Promise<{ text: string, isError?: boolean }>}
 */
export async function sendMessage(userMessage) {
    if (AI_MODE === 'mock') {
        return _mockResponse(userMessage);
    }
    return _apiResponse(userMessage);
}

// ─── Implementaciones internas ────────────────────────────────────────────────

async function _mockResponse(_userMessage) {
    // Simula latencia de red
    await _sleep(900 + Math.random() * 600);

    // Seleccionamos una respuesta al azar (stateless)
    const text = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

    return { text };
}

async function _apiResponse(userMessage) {
    try {
        // Obtenemos los últimos 4 mensajes del historial ANTES de este envío
        const historyToSend = chatHistory.slice(-4);

        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                history: historyToSend
            }),
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        const assistantText = data.answer || data.text || data.reply || data.message || 'Sin respuesta.';

        // Actualizamos el historial local con la interacción actual
        chatHistory.push({ role: 'user', content: userMessage });
        chatHistory.push({ role: 'assistant', content: assistantText });

        // Mantenemos el historial local manejable (ej. últimos 10 para rotar)
        if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

        return { text: assistantText };
    } catch (err) {
        console.error('[ai-agent] Error al contactar el agente:', err);
        return {
            text: 'Hubo un problema al conectar con el agente. Intenta de nuevo.',
            isError: true,
        };
    }
}

function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
