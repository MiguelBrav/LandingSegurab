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
const AI_MODE = 'mock'; // Cambiar a 'api' cuando el agente esté listo
const AI_API_URL = '/api/agent/chat'; // Endpoint del agente real

// ─── Respuestas mock ──────────────────────────────────────────────────────────
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
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        // Adaptar al campo que retorne el agente (text, reply, message, etc.)
        return { text: data.text ?? data.reply ?? data.message ?? 'Sin respuesta.' };
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
