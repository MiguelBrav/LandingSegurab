import './style.css';
import { initModal } from './src/modules/modal.js';
import { initNav } from './src/modules/nav.js';

document.addEventListener('DOMContentLoaded', () => {
    // Año dinámico en footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Módulos
    initNav();
    initModal();
});
