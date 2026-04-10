'use strict';

(function createReservationStore(global) {
  const CONFIG = global.AB_SUPABASE_CONFIG || {};
  const RESERVATIONS_TABLE = CONFIG.reservationsTable || 'reservations';
  const LEGACY_STORAGE_KEY = 'ab_reservations';
  const LEGACY_MIGRATION_KEY = 'ab_reservations_migrated_v1';

  let supabaseClient = null;
  let initError = '';
  let migrationPromise = null;

  function buildClient() {
    if (supabaseClient || initError) {
      return supabaseClient;
    }

    if (!global.supabase || typeof global.supabase.createClient !== 'function') {
      initError = 'Supabase client library failed to load.';
      return null;
    }

    if (!CONFIG.url || !CONFIG.anonKey || CONFIG.url.includes('YOUR_PROJECT_ID') || CONFIG.anonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
      initError = 'Supabase is not configured yet. Update supabase-config.js with your project URL and anon key.';
      return null;
    }

    supabaseClient = global.supabase.createClient(CONFIG.url, CONFIG.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    return supabaseClient;
  }

  function getClient() {
    const client = buildClient();
    if (!client) {
      throw new Error(initError || 'Supabase client is unavailable.');
    }
    return client;
  }

  function normalizeReservation(row) {
    return {
      id: String(row.id),
      name: row.name || '',
      phone: row.phone || '',
      guests: row.guests || '',
      date: row.date || '',
      time: row.time || '',
      status: row.status || 'pending',
      tableId: row.table_id || '',
      bookedAt: row.booked_at || '',
    };
  }

  function createReservationId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }

    return `res-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function toDatabaseRow(reservation) {
    return {
      id: String(reservation.id || createReservationId()),
      name: reservation.name,
      phone: reservation.phone,
      guests: String(reservation.guests || ''),
      date: reservation.date,
      time: reservation.time,
      status: reservation.status || 'pending',
      table_id: reservation.tableId || null,
      booked_at: reservation.bookedAt || new Date().toISOString(),
    };
  }

  function readLegacyReservations() {
    try {
      const raw = global.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function markLegacyReservationsMigrated() {
    try {
      global.localStorage.setItem(LEGACY_MIGRATION_KEY, '1');
    } catch {
      /* Ignore local storage write failures */
    }
  }

  function areLegacyReservationsMigrated() {
    try {
      return global.localStorage.getItem(LEGACY_MIGRATION_KEY) === '1';
    } catch {
      return false;
    }
  }

  async function migrateLegacyReservations() {
    if (migrationPromise) {
      return migrationPromise;
    }

    migrationPromise = (async () => {
      if (areLegacyReservationsMigrated()) {
        return { migrated: 0 };
      }

      const legacyReservations = readLegacyReservations();
      if (!legacyReservations.length) {
        markLegacyReservationsMigrated();
        return { migrated: 0 };
      }

      const rows = legacyReservations.map((reservation) =>
        toDatabaseRow({
          ...reservation,
          id: reservation.id,
          bookedAt: reservation.bookedAt,
          tableId: reservation.tableId,
        })
      );

      const client = getClient();
      const { error } = await client
        .from(RESERVATIONS_TABLE)
        .upsert(rows, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      markLegacyReservationsMigrated();
      return { migrated: rows.length };
    })();

    try {
      return await migrationPromise;
    } finally {
      migrationPromise = null;
    }
  }

  async function listReservations() {
    const client = getClient();
    const { data, error } = await client
      .from(RESERVATIONS_TABLE)
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .order('booked_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(normalizeReservation);
  }

  async function createReservation(payload) {
    const client = getClient();
    const row = toDatabaseRow(payload);

    const { data, error } = await client
      .from(RESERVATIONS_TABLE)
      .insert(row)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return normalizeReservation(data);
  }

  async function updateReservationStatus(id, status) {
    const client = getClient();
    const { data, error } = await client
      .from(RESERVATIONS_TABLE)
      .update({ status })
      .eq('id', String(id))
      .select()
      .single();

    if (error) {
      throw error;
    }

    return normalizeReservation(data);
  }

  async function deleteReservation(id) {
    const client = getClient();
    const { error } = await client
      .from(RESERVATIONS_TABLE)
      .delete()
      .eq('id', String(id));

    if (error) {
      throw error;
    }
  }

  async function clearReservations() {
    const reservations = await listReservations();
    if (!reservations.length) return;

    const client = getClient();
    const ids = reservations.map((reservation) => reservation.id);
    const { error } = await client
      .from(RESERVATIONS_TABLE)
      .delete()
      .in('id', ids);

    if (error) {
      throw error;
    }
  }

  global.ABReservationStore = {
    createReservation,
    clearReservations,
    deleteReservation,
    getConfigError() {
      buildClient();
      return initError;
    },
    isConfigured() {
      return Boolean(buildClient());
    },
    listReservations,
    migrateLegacyReservations,
    updateReservationStatus,
  };
})(window);
