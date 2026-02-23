/**
 * modal.js
 * Gestiona el modal del chat de IA:
 *  - Apertura y cierre con transiciones CSS
 *  - Render de burbujas de conversación
 *  - Comunicación con ai-agent.js
 */

import { sendMessage } from './ai-agent.js';

// ─── Estado del módulo ────────────────────────────────────────────────────────
// Todos los elementos del DOM y el estado viven aquí, evitando pasar
// referencias repetidas entre funciones internas.
let _modal = null;
let _modalContent = null;
let _chatMessages = null;
let _chatInput = null;

let isOpen = false;
let isWaiting = false; // Evita envío duplicado mientras espera respuesta

// Referencia al handler de keydown para poder removerlo si es necesario
const _onKeydown = (e) => {
    if (e.key === 'Escape' && isOpen) _closeModal();
};

// ─── Init / Destroy ───────────────────────────────────────────────────────────

export function initModal() {
    _modal = document.getElementById('aiModal');
    _modalContent = document.getElementById('modalContent');
    _chatMessages = document.getElementById('chatMessages');
    _chatInput = document.getElementById('chatInput');

    const closeBtn = document.getElementById('closeModal');
    const chatSendBtn = document.getElementById('chatSendBtn');

    if (!_modal || !_modalContent || !closeBtn) {
        console.warn('[modal] Elementos del modal no encontrados en el DOM.');
        return;
    }

    _bindOpenTriggers();
    closeBtn.addEventListener('click', _closeModal);
    _bindChatInput(chatSendBtn);

    // Escape para cerrar — registrado una sola vez aquí
    document.addEventListener('keydown', _onKeydown);
}

/**
 * Limpia los event listeners globales del módulo.
 * Útil si el proyecto migra a una SPA con montaje/desmontaje de componentes.
 */
export function destroyModal() {
    document.removeEventListener('keydown', _onKeydown);
}

// ─── Apertura / Cierre ────────────────────────────────────────────────────────

function _bindOpenTriggers() {
    const openModal = () => _openModal();

    // Botón flotante principal
    const aiBtn = document.getElementById('aiButton');
    if (aiBtn) aiBtn.addEventListener('click', openModal);

    // Botón secundario en hero
    const heroBtn = document.getElementById('openAiFromHero');
    if (heroBtn) heroBtn.addEventListener('click', openModal);

    // Clic en el backdrop (fuera del contenido del modal)
    _modal.addEventListener('click', (e) => {
        if (e.target === _modal) _closeModal();
    });
}

function _openModal() {
    if (isOpen) return;
    isOpen = true;

    _modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        _modal.classList.remove('opacity-0');
        _modalContent.classList.remove('scale-95');
        _modalContent.classList.add('scale-100');
    });
}

function _closeModal() {
    if (!isOpen) return;
    isOpen = false;

    _modalContent.classList.remove('scale-100');
    _modalContent.classList.add('scale-95');
    _modal.classList.add('opacity-0');

    setTimeout(() => _modal.classList.add('hidden'), 300);
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

function _bindChatInput(chatSendBtn) {
    if (!_chatInput || !chatSendBtn || !_chatMessages) return;

    chatSendBtn.addEventListener('click', _handleSend);
    _chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            _handleSend();
        }
    });
}

async function _handleSend() {
    const text = _chatInput.value.trim();
    if (!text || isWaiting) return;

    isWaiting = true;
    _chatInput.value = '';

    // Burbuja del usuario
    _appendBubble(text, 'user');

    // Indicador "escribiendo..."
    const typingEl = _appendTypingIndicator();

    try {
        const response = await sendMessage(text);
        typingEl.remove();
        _appendBubble(response.text, response.isError ? 'error' : 'agent');
    } catch {
        typingEl.remove();
        _appendBubble('Error inesperado. Intenta de nuevo.', 'error');
    } finally {
        isWaiting = false;
        _chatInput.focus();
    }
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function _appendBubble(text, type) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-bubble-wrapper chat-bubble-wrapper--${type}`;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble--${type}`;
    bubble.textContent = text;

    wrapper.appendChild(bubble);
    _chatMessages.appendChild(wrapper);
    _chatMessages.scrollTop = _chatMessages.scrollHeight;
    return wrapper;
}

function _appendTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-bubble-wrapper chat-bubble-wrapper--agent';

    const indicator = document.createElement('div');
    indicator.className = 'chat-bubble chat-bubble--agent chat-typing';
    indicator.innerHTML = '<span></span><span></span><span></span>';

    wrapper.appendChild(indicator);
    _chatMessages.appendChild(wrapper);
    _chatMessages.scrollTop = _chatMessages.scrollHeight;
    return wrapper;
}
