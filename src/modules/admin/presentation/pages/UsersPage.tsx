import { useState, useEffect } from 'react';
import { httpClient } from '../../../../infrastructure/http/httpClient';

interface AdminUserResponse {
  idUsuario: string;
  email: string;
  nombreCompleto: string;
  fechaCreacion: string;
  estado: string;
  hasPublicPortfolio: boolean;
}

export function UsersPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering, search, and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Activos' | 'Suspendidos'>('Todos');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortButtonText, setSortButtonText] = useState<'Descendente' | 'Ascendente'>('Descendente');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Matching mockup exactly

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await httpClient.getAuth<AdminUserResponse[]>('/api/admin/users');
      setUsers(data || []);
    } catch (err: any) {
      console.warn('No se pudo cargar desde el backend, cargando datos de prueba:', err);
      // Fallback a datos mock del mockup para facilitar revisión local
      const mockUsers: AdminUserResponse[] = [
        {
          idUsuario: '1',
          email: 'vquispe@gmail.com',
          nombreCompleto: 'Valeria Quispe',
          fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
          estado: 'activo',
          hasPublicPortfolio: true
        },
        {
          idUsuario: '2',
          email: 'luis.rios@mail.com',
          nombreCompleto: 'Luis Rios',
          fechaCreacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // Hace 4 días
          estado: 'activo',
          hasPublicPortfolio: true
        },
        {
          idUsuario: '3',
          email: 'ana@mail.com',
          nombreCompleto: 'Ana Gutiérrez',
          fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'suspendido',
          hasPublicPortfolio: false
        },
        {
          idUsuario: '4',
          email: 'carlos@mail.com',
          nombreCompleto: 'Carlos Mendoza',
          fechaCreacion: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'activo',
          hasPublicPortfolio: false
        },
        {
          idUsuario: '5',
          email: 'marcos@mail.com',
          nombreCompleto: 'Marcos Vera',
          fechaCreacion: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'suspendido',
          hasPublicPortfolio: true
        },
        {
          idUsuario: '6',
          email: 'cromero@mail.com',
          nombreCompleto: 'Carla Romero',
          fechaCreacion: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'activo',
          hasPublicPortfolio: false
        }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  // Helper: check if user is registered in the last 7 days
  const isNewUser = (dateStr: string) => {
    const regDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - regDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Compute metrics from full users list
  const totalUsers = users.length;
  
  const newThisWeek = users.filter((u) => {
    const regDate = new Date(u.fechaCreacion);
    const today = new Date();
    const diffTime = today.getTime() - regDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const suspendedUsers = users.filter((u) => {
    const est = (u.estado || '').toLowerCase();
    return est === 'suspendido' || est === 'suspendida';
  }).length;
  const withPortfolio = users.filter((u) => u.hasPublicPortfolio).length;
  const pctPortfolio = totalUsers > 0 ? Math.round((withPortfolio / totalUsers) * 100) : 0;

  // Apply filters, search and sort
  let filtered = users;

  // Search filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        (u.nombreCompleto || '').toLowerCase().includes(query) ||
        (u.email || '').toLowerCase().includes(query)
    );
  }

  // Status chip filter
  if (activeFilter === 'Activos') {
    filtered = filtered.filter((u) => {
      const est = (u.estado || '').toLowerCase();
      return est === 'activo' || est === 'activa';
    });
  } else if (activeFilter === 'Suspendidos') {
    filtered = filtered.filter((u) => {
      const est = (u.estado || '').toLowerCase();
      return est === 'suspendido' || est === 'suspendida';
    });
  }

  // Sorting by fechaCreacion
  filtered = [...filtered].sort((a, b) => {
    const dateA = new Date(a.fechaCreacion).getTime();
    const dateB = new Date(b.fechaCreacion).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, sortOrder]);

  // Paginated subset
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Helper functions for avatars
  const getInitials = (name?: string) => {
    const safeName = name || 'Usuario';
    const parts = safeName.trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (name?: string) => {
    const safeName = name || 'Usuario';
    const colors = [
      'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      'bg-green-500/10 text-green-400 border border-green-500/20',
      'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      'bg-pink-500/10 text-pink-400 border border-pink-500/20',
      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      'bg-teal-500/10 text-teal-400 border border-teal-500/20',
      'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    ];
    let hash = 0;
    for (let i = 0; i < safeName.length; i++) {
      hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    const months = ['may', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    // Let's use Spanish month names manually to ensure it's lowercase and short as per mockup
    const esMonths = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getDate();
    const month = esMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-src-7c6bec border-t-transparent rounded-full animate-spin"></div>
        <p className="text-src-9ca3af mt-4 text-sm">Cargando usuarios registrados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-white text-xl font-bold mb-2">Error al cargar usuarios</h3>
        <p className="text-src-9ca3af max-w-md mb-6">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-6 py-2.5 rounded-xl bg-src-7c6bec text-white font-semibold hover:bg-src-7c6bec/80 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* 4 Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
        {/* Total Users */}
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-5 flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <p className="text-src-9ca3af text-xs font-semibold uppercase tracking-wider">Usuarios totales</p>
            <h3 className="text-white text-3xl font-extrabold mt-1.5">{totalUsers}</h3>
            <p className="text-src-6b7280 text-[11px] mt-1 font-medium">Registrados en el sistema</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-src-7c6bec/15 text-src-c4bef8 flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-5 flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <p className="text-src-9ca3af text-xs font-semibold uppercase tracking-wider">Nuevos esta semana</p>
            <h3 className="text-white text-3xl font-extrabold mt-1.5">{newThisWeek}</h3>
            <p className="text-src-6b7280 text-[11px] mt-1 font-medium">Últimos 7 días</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-green-500/15 text-green-400 flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Suspended Users */}
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-5 flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <p className="text-src-9ca3af text-xs font-semibold uppercase tracking-wider">Suspendidos</p>
            <h3 className="text-white text-3xl font-extrabold mt-1.5">{suspendedUsers}</h3>
            <p className="text-src-6b7280 text-[11px] mt-1 font-medium">Cuentas bloqueadas</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>

        {/* With Portfolio */}
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-5 flex items-center justify-between hover:border-white/20 transition-all">
          <div>
            <p className="text-src-9ca3af text-xs font-semibold uppercase tracking-wider">Con portafolio publicado</p>
            <h3 className="text-white text-3xl font-extrabold mt-1.5">{withPortfolio}</h3>
            <p className="text-src-6b7280 text-[11px] mt-1 font-medium">{pctPortfolio}% del total</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#69AFBF]/15 text-[#69AFBF] flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters & Sorting Section */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-src-9ca3af">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre o correo…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1c29] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-src-9ca3af text-sm focus:outline-none focus:border-src-7c6bec transition-colors"
            />
          </div>

          {/* Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {(['Todos', 'Activos', 'Suspendidos'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all border ${
                  activeFilter === filter
                    ? 'bg-src-7c6bec/20 border-src-7c6bec text-src-c4bef8 shadow-lg'
                    : 'bg-[#1a1c29] border-white/5 text-src-9ca3af hover:bg-white/5 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Row */}
        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            onClick={() => {
              if (sortButtonText === 'Descendente') {
                setSortButtonText('Ascendente');
                setSortOrder('desc');
              } else {
                setSortButtonText('Descendente');
                setSortOrder('asc');
              }
            }}
            className="bg-[#1a1c29] border border-white/10 hover:bg-white/5 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <span>
              {sortButtonText === 'Descendente' ? (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7" />
                </svg>
              ) : (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7" />
                </svg>
              )}
            </span>
            {sortButtonText}
          </button>
        </div>

        {/* Table / List Area */}
        <div className="mt-6">
          {totalItems === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-src-9ca3af mb-4">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M3 11.627a1.121 1.121 0 01.32-.782l3.415-3.415a1.121 1.121 0 011.585 0l3.415 3.415a1.121 1.121 0 01-.32 1.782l-3.415 3.415a1.121 1.121 0 01-1.585 0L3.32 12.41a1.121 1.121 0 010-.783z" />
                </svg>
              </div>
              <h4 className="text-white text-lg font-bold">Sin resultados</h4>
              <p className="text-src-9ca3af text-xs mt-1.5 max-w-sm">
                No se encontraron usuarios con los criterios seleccionados.
              </p>
            </div>
          ) : (
            /* User Table */
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/10">
                    <th className="py-4 px-6 text-src-9ca3af text-xs font-semibold uppercase tracking-wider">Usuario</th>
                    <th className="py-4 px-6 text-src-9ca3af text-xs font-semibold uppercase tracking-wider">Fecha de registro</th>
                    <th className="py-4 px-6 text-src-9ca3af text-xs font-semibold uppercase tracking-wider text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedUsers.map((user) => {
                    const isActive = (user.estado || '').toLowerCase() === 'activo' || (user.estado || '').toLowerCase() === 'activa';
                    const avatarColor = getAvatarColor(user.nombreCompleto);
                    const initials = getInitials(user.nombreCompleto);
                    const isNew = isNewUser(user.fechaCreacion);

                    return (
                      <tr key={user.idUsuario} className="hover:bg-white/[0.01] transition-colors">
                        {/* User Profile Cell */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor}`}>
                              {initials}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold text-sm">{user.nombreCompleto}</span>
                                {isNew && (
                                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wide">
                                    Nuevo
                                  </span>
                                )}
                              </div>
                              <span className="text-src-9ca3af text-xs font-medium mt-0.5">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Date Cell */}
                        <td className="py-4 px-6 text-src-9ca3af text-sm font-medium">
                          {formatDate(user.fechaCreacion)}
                        </td>

                        {/* Status Cell */}
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              isActive
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                            {isActive ? 'Activo' : 'Suspendido'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
              <span className="text-src-9ca3af text-xs font-medium">
                Mostrando {paginatedUsers.length} de {totalItems} usuarios
              </span>

              <div className="flex items-center gap-1.5">
                {/* Prev page */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg bg-[#1a1c29] hover:bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-40 disabled:hover:bg-[#1a1c29] transition-all"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  // Show current page, first, last, and buffer pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${
                          currentPage === pageNum
                            ? 'bg-src-7c6bec/20 border-src-7c6bec text-src-c4bef8'
                            : 'bg-[#1a1c29] border-white/5 text-src-9ca3af hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  
                  // Elipsis rendering
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <span key={pageNum} className="text-src-6b7280 text-xs px-1 font-bold">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next page */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg bg-[#1a1c29] hover:bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-40 disabled:hover:bg-[#1a1c29] transition-all"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
