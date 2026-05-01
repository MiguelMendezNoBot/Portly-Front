import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserProfile } from '../../application/useUserProfile';
import { getToken } from '../../../../infrastructure/storage/storage';
import {
  PORTLY_PENDING_OAUTH_PROVIDER_KEY,
  type PortlyOAuthLinkProvider,
} from '../constants/oauthLink.constants';
import { API_BASE } from '../constants/api.constants';
import { Toast } from '../../../../shared/components/Toast';

const LINKED_FLASH_MS = 4000;

function isPortlyOAuthProvider(p: string): p is PortlyOAuthLinkProvider {
  return p === 'github' || p === 'linkedin';
}

function GithubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IntegrationsPage() {
  const { profile } = useUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [linkedFlash, setLinkedFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevConnectedProvidersRef = useRef<string[]>([]);
  const providersBaselineReadyRef = useRef(false);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const triggerLinkedFlash = useCallback(() => {
    setLinkedFlash(true);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setLinkedFlash(false), LINKED_FLASH_MS);
  }, []);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'already_linked') {
      setOauthError('Esta cuenta ya está vinculada a otro usuario.');
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
      setTimeout(() => setOauthError(null), 6000);
    } else if (error === 'access_denied') {
      setOauthError('Se canceló la vinculación.');
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
      setTimeout(() => setOauthError(null), 6000);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!profile) return;
    const currentProviders = profile.connectedProviders;
    const prevProviders = prevConnectedProvidersRef.current;

    if (!providersBaselineReadyRef.current) {
      providersBaselineReadyRef.current = true;
      const raw = sessionStorage.getItem(PORTLY_PENDING_OAUTH_PROVIDER_KEY);
      if (raw && isPortlyOAuthProvider(raw)) {
        sessionStorage.removeItem(PORTLY_PENDING_OAUTH_PROVIDER_KEY);
        if (currentProviders.includes(raw)) triggerLinkedFlash();
      }
      prevConnectedProvidersRef.current = currentProviders;
      return;
    }

    const prevSet = new Set(prevProviders);
    const newlyLinked = currentProviders.filter((p) => !prevSet.has(p));
    if (newlyLinked.some((p) => isPortlyOAuthProvider(p))) triggerLinkedFlash();
    prevConnectedProvidersRef.current = currentProviders;
  }, [profile, triggerLinkedFlash]);

  function handleVincular(provider: PortlyOAuthLinkProvider) {
    const token = getToken();
    if (!token) {
      alert('Debes iniciar sesión para vincular una cuenta.');
      return;
    }
    sessionStorage.setItem(PORTLY_PENDING_OAUTH_PROVIDER_KEY, provider);
    window.location.href = `${API_BASE}/auth/link/${provider}?token=${token}`;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
      </div>
    );
  }

  const isGithubConnected = profile.connectedProviders.includes('github');
  const isLinkedinConnected = profile.connectedProviders.includes('linkedin');

  return (
    <div className="py-6 max-w-lg">
      {oauthError && <Toast toast={{ message: oauthError, type: 'error' }} />}

      <div className="mb-6">
        <h2 className="text-white text-xl font-bold">Integraciones</h2>
        <p className="text-src-6b7280 text-sm mt-1">
          Vincula tus cuentas externas para enriquecer tu perfil profesional.
        </p>
      </div>

      {linkedFlash && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 rounded-[12px] px-4 py-3 animate-fade-in">
          <CheckIcon />
          <span className="font-semibold text-sm">Vinculación correcta</span>
        </div>
      )}

      <div className="flex flex-col bg-[#171B28] border border-white/5 rounded-[16px] overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <p className="text-src-a7aab9 text-xs font-semibold tracking-[1.2px]">
            CUENTAS VINCULADAS
          </p>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#2D3449] border border-white/5 flex items-center justify-center text-white">
                <GithubIcon />
              </div>
              <div>
                <p className="text-src-e5e7f6 text-sm font-semibold">GitHub</p>
                <p className="text-src-6b7280 text-xs">
                  {isGithubConnected ? 'Cuenta vinculada' : 'Sin vincular'}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isGithubConnected}
              onClick={() => !isGithubConnected && handleVincular('github')}
              className={`
                flex items-center gap-2 py-2 px-4 rounded-[10px]
                text-xs font-semibold transition-all duration-200
                ${isGithubConnected
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 cursor-default'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer'}
              `}
            >
              {isGithubConnected ? <CheckIcon /> : null}
              {isGithubConnected ? 'Vinculado' : 'Vincular'}
            </button>
          </div>

          <div className="border-t border-white/5" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#2D3449] border border-white/5 flex items-center justify-center text-src-9093ff">
                <LinkedinIcon />
              </div>
              <div>
                <p className="text-src-e5e7f6 text-sm font-semibold">LinkedIn</p>
                <p className="text-src-6b7280 text-xs">
                  {isLinkedinConnected ? 'Cuenta vinculada' : 'Sin vincular'}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isLinkedinConnected}
              onClick={() => !isLinkedinConnected && handleVincular('linkedin')}
              className={`
                flex items-center gap-2 py-2 px-4 rounded-[10px]
                text-xs font-semibold transition-all duration-200
                ${isLinkedinConnected
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 cursor-default'
                  : 'bg-src-2f2ebe/20 border border-src-9093ff/20 text-src-9093ff hover:bg-src-2f2ebe/35 cursor-pointer'}
              `}
            >
              {isLinkedinConnected ? <CheckIcon /> : null}
              {isLinkedinConnected ? 'Vinculado' : 'Vincular'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
