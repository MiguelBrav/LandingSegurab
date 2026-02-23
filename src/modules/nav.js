/**
 * nav.js
 * Gestiona el menú de navegación:
 *  - Toggle del menú móvil (via clase CSS .nav-mobile-open)
 *  - Scroll suave hacia secciones ancla
 */

const HEADER_OFFSET = 80; // px — altura del header fijo

export function initNav() {
    // El elemento <nav> se obtiene una sola vez y se pasa a las funciones
    // que lo necesitan, evitando múltiples queries al DOM.
    const nav = document.querySelector('nav');

    _initMobileMenu(nav);
    _initSmoothScroll(nav);
}

// ─── Menú móvil ───────────────────────────────────────────────────────────────

function _initMobileMenu(nav) {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    if (!mobileMenuBtn || !nav) return;

    mobileMenuBtn.addEventListener('click', () => _toggleMobileMenu(nav));
}

function _toggleMobileMenu(nav) {
    if (nav.classList.contains('nav-mobile-open')) {
        _closeMobileMenu(nav);
    } else {
        _openMobileMenu(nav);
    }
}

function _openMobileMenu(nav) {
    nav.classList.remove('hidden');
    nav.classList.add('nav-mobile-open');
}

function _closeMobileMenu(nav) {
    nav.classList.remove('nav-mobile-open');
    nav.classList.add('hidden');
}

// ─── Scroll suave ─────────────────────────────────────────────────────────────

function _initSmoothScroll(nav) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            // Cerrar menú móvil si está abierto
            if (nav && nav.classList.contains('nav-mobile-open')) {
                _closeMobileMenu(nav);
            }

            const offsetPosition =
                target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
    });
}
