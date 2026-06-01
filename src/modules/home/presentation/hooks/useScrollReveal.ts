import { useEffect } from 'react';

/**
 * Observa todos los elementos con clase .reveal, .reveal-left, .reveal-right
 * dentro del documento y agrega la clase .is-visible cuando entran al viewport.
 * Se aplica con un pequeño delay para garantizar que el DOM esté montado.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    // Timeout de 100ms para asegurar que el DOM está completamente renderizado
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target); // animar solo una vez
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);
};
