import { useEffect, useRef, useCallback } from 'react';
import { BASE_URL } from '../../../infrastructure/http/httpClient';

/**
 * Genera un ID de visitante anónimo basado en huellas del navegador.
 * Se almacena en localStorage para persistir entre sesiones y así
 * contar correctamente los visitantes únicos.
 */
function getVisitorId(): string {
  const key = 'portly_visitor_id';
  let id = localStorage.getItem(key);
  if (id) return id;

  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|');

  // Simple deterministic hash — same browser always produces the same ID
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  id = 'v_' + Math.abs(hash).toString(36);
  localStorage.setItem(key, id);
  return id;
}

/** Fire-and-forget POST to the tracking API */
async function trackEvent(endpoint: string, body: Record<string, unknown>) {
  try {
    await fetch(`${BASE_URL}/api/metrics/ev/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // Tracking should never break the user experience
  }
}

/**
 * Hook that tracks a portfolio visit and sends duration pings.
 * Returns helpers to track project and section clicks.
 */
export function usePortfolioTracking(portfolioId: string | undefined) {
  const visitIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const trackedPortfolioIdRef = useRef<string | null>(null);

  // Track initial visit
  useEffect(() => {
    if (!portfolioId) return;
    if (trackedPortfolioIdRef.current === portfolioId) return;
    trackedPortfolioIdRef.current = portfolioId;

    const visitorId = getVisitorId();
    startTimeRef.current = Date.now();

    // Register visit and store visitId for duration updates
    fetch(`${BASE_URL}/api/metrics/ev/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolioId, visitorId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.visitId) visitIdRef.current = data.visitId;
      })
      .catch(() => {});

    // Duration ping every 30 seconds
    const interval = setInterval(() => {
      if (visitIdRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackEvent('visit-duration', {
          visitId: visitIdRef.current,
          durationSeconds: elapsed,
        });
      }
    }, 30_000);

    // Send final duration on unload
    const handleUnload = () => {
      if (visitIdRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        navigator.sendBeacon(
          `${BASE_URL}/api/metrics/ev/visit-duration`,
          JSON.stringify({
            visitId: visitIdRef.current,
            durationSeconds: elapsed,
          })
        );
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload();
    };
  }, [portfolioId]);

  const trackProjectClick = useCallback(
    (projectId: number) => {
      if (!portfolioId) return;
      trackEvent('project-click', { portfolioId, projectId });
    },
    [portfolioId]
  );

  const trackSectionClick = useCallback(
    (sectionType: 'EXPERIENCIA' | 'RED_SOCIAL', referenceId: string, referenceName: string) => {
      if (!portfolioId) return;
      trackEvent('section-click', {
        portfolioId,
        sectionType,
        referenceId,
        referenceName,
      });
    },
    [portfolioId]
  );

  return { trackProjectClick, trackSectionClick };
}
