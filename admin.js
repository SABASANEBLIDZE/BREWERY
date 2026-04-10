'use strict';

(function initAdminPage() {
  const ADMIN_PASSWORD = 'ss123';
  const store = window.ABReservationStore;

  const state = {
    reservations: [],
    sortField: 'date',
    sortAsc: false,
    refreshTimer: null,
  };

  const gateInput = document.getElementById('gate-input');
  const tbody = document.getElementById('reservations-tbody');
  const syncStatus = document.getElementById('sync-status');

  if (!gateInput || !tbody || !store) {
    return;
  }

  gateInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      window.checkPassword();
    }
  });

  function setSyncStatus(message, tone) {
    if (!syncStatus) return;

    syncStatus.textContent = message || '';
    syncStatus.className = `sync-status${tone ? ` ${tone}` : ''}`;
  }

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function escHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function quoteJs(value) {
    return JSON.stringify(String(value));
  }

  function updateStats() {
    const all = state.reservations;
    const today = todayStr();

    document.getElementById('stat-total').textContent = all.length;
    document.getElementById('stat-today').textContent = all.filter((reservation) => reservation.date === today).length;
    document.getElementById('stat-pending').textContent = all.filter((reservation) => (reservation.status || 'pending') === 'pending').length;
    document.getElementById('stat-confirmed').textContent = all.filter((reservation) => reservation.status === 'confirmed').length;
  }

  function filteredReservations() {
    const search = document.getElementById('search-input').value.trim().toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const today = todayStr();

    let data = [...state.reservations];

    if (search) {
      data = data.filter((reservation) =>
        reservation.name.toLowerCase().includes(search) ||
        reservation.phone.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      data = data.filter((reservation) => (reservation.status || 'pending') === statusFilter);
    }

    if (dateFilter === 'today') {
      data = data.filter((reservation) => reservation.date === today);
    } else if (dateFilter === 'upcoming') {
      data = data.filter((reservation) => reservation.date > today);
    } else if (dateFilter === 'past') {
      data = data.filter((reservation) => reservation.date < today);
    }

    data.sort((left, right) => {
      let a = left[state.sortField] ?? '';
      let b = right[state.sortField] ?? '';

      if (state.sortField === 'guests' || state.sortField === 'tableId') {
        a = Number(a) || 0;
        b = Number(b) || 0;
      } else {
        a = String(a).toLowerCase();
        b = String(b).toLowerCase();
      }

      if (a === b) return 0;
      return state.sortAsc ? (a > b ? 1 : -1) : (a < b ? 1 : -1);
    });

    return data;
  }

  function renderTable() {
    const data = filteredReservations();

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="8">
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-text">No reservations found.</div>
        </div>
      </td></tr>`;
      updateStats();
      return;
    }

    tbody.innerHTML = data.map((reservation) => {
      const status = reservation.status || 'pending';
      const bookedAt = reservation.bookedAt
        ? new Date(reservation.bookedAt).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '-';

      const id = quoteJs(reservation.id);

      return `
        <tr>
          <td class="td-name">${escHtml(reservation.name)}<br><span style="font-size:0.68rem;color:var(--text-muted);">Booked: ${escHtml(bookedAt)}</span></td>
          <td class="td-phone">${escHtml(reservation.phone)}</td>
          <td class="td-date">${escHtml(reservation.date)}</td>
          <td><span class="td-time">${escHtml(reservation.time)}</span></td>
          <td class="td-guests">${escHtml(reservation.guests || '-')}</td>
          <td class="td-table">${reservation.tableId ? `T${escHtml(reservation.tableId)}` : '-'}</td>
          <td><span class="badge badge-${escHtml(status)}">${escHtml(status)}</span></td>
          <td class="td-actions">
            ${status !== 'confirmed' ? `<button class="btn btn-sm" style="background:rgba(76,175,125,0.2);color:var(--green);border:1px solid rgba(76,175,125,0.3);" onclick="setStatus(${id}, 'confirmed')">✓ Confirm</button>` : ''}
            ${status !== 'cancelled' ? `<button class="btn btn-sm" style="background:rgba(224,92,92,0.15);color:var(--red);border:1px solid rgba(224,92,92,0.25);" onclick="setStatus(${id}, 'cancelled')">✕ Cancel</button>` : ''}
            <button class="btn btn-sm btn-outline" onclick="deleteEntry(${id})">🗑</button>
          </td>
        </tr>
      `;
    }).join('');

    updateStats();
  }

  function renderLoadingState(message) {
    tbody.innerHTML = `<tr><td colspan="8">
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">${escHtml(message || 'Loading reservations...')}</div>
      </div>
    </td></tr>`;
  }

  function renderErrorState(message) {
    state.reservations = [];
    updateStats();
    tbody.innerHTML = `<tr><td colspan="8">
      <div class="empty-state">
        <div class="empty-icon">⚠</div>
        <div class="empty-text">${escHtml(message)}</div>
      </div>
    </td></tr>`;
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  async function refreshReservations(options = {}) {
    const { silent = false } = options;

    if (!store.isConfigured()) {
      const message = store.getConfigError();
      setSyncStatus('Supabase setup required', 'error');
      renderErrorState(message);
      return;
    }

    if (!silent) {
      renderLoadingState('Loading reservations...');
      setSyncStatus('Syncing with shared database...', '');
    }

    try {
      const migrationResult = await store.migrateLegacyReservations();
      state.reservations = await store.listReservations();
      renderTable();

      if (migrationResult.migrated > 0) {
        setSyncStatus(`Synced to shared database. Migrated ${migrationResult.migrated} legacy reservation(s).`, '');
      } else {
        setSyncStatus(`Last synced ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, '');
      }
    } catch (error) {
      const message = error?.message || 'Unable to load reservations from Supabase.';
      setSyncStatus('Database sync failed', 'error');
      renderErrorState(message);
    }
  }

  function startAutoRefresh() {
    if (state.refreshTimer) {
      clearInterval(state.refreshTimer);
    }

    state.refreshTimer = setInterval(() => {
      if (document.hidden) return;
      if (document.getElementById('app').style.display === 'none') return;
      refreshReservations({ silent: true });
    }, 15000);
  }

  window.checkPassword = async function checkPassword() {
    const value = gateInput.value.trim();
    const errorNode = document.getElementById('gate-error');

    if (value !== ADMIN_PASSWORD) {
      errorNode.textContent = 'Wrong password. Try again.';
      gateInput.value = '';
      gateInput.focus();
      return;
    }

    document.getElementById('gate').style.display = 'none';
    document.getElementById('app').style.display = '';
    document.getElementById('main-content').style.display = '';
    errorNode.textContent = '';

    await refreshReservations();
    startAutoRefresh();
  };

  window.sortBy = function sortBy(field) {
    if (state.sortField === field) {
      state.sortAsc = !state.sortAsc;
    } else {
      state.sortField = field;
      state.sortAsc = true;
    }

    document.querySelectorAll('th').forEach((header) => header.classList.remove('sorted'));
    const headers = ['name', 'phone', 'date', 'time', 'guests', 'tableId', 'status'];
    const index = headers.indexOf(field);
    if (index >= 0) {
      document.querySelectorAll('th')[index].classList.add('sorted');
    }

    renderTable();
  };

  window.renderTable = renderTable;
  window.refreshReservations = function refreshReservationsFromButton() {
    return refreshReservations();
  };

  window.setStatus = async function setStatus(id, status) {
    try {
      setSyncStatus('Updating reservation...', '');
      await store.updateReservationStatus(id, status);
      await refreshReservations({ silent: true });
      showToast(`Reservation ${status}.`);
    } catch (error) {
      setSyncStatus('Database update failed', 'error');
      showToast(error?.message || 'Unable to update reservation.');
    }
  };

  window.deleteEntry = async function deleteEntry(id) {
    if (!globalThis.confirm('Delete this reservation?')) return;

    try {
      setSyncStatus('Deleting reservation...', '');
      await store.deleteReservation(id);
      await refreshReservations({ silent: true });
      showToast('Reservation deleted.');
    } catch (error) {
      setSyncStatus('Database delete failed', 'error');
      showToast(error?.message || 'Unable to delete reservation.');
    }
  };

  window.clearAll = async function clearAll() {
    if (!globalThis.confirm('Delete ALL reservations? This cannot be undone.')) return;

    try {
      setSyncStatus('Clearing reservations...', '');
      await store.clearReservations();
      await refreshReservations({ silent: true });
      showToast('All reservations cleared.');
    } catch (error) {
      setSyncStatus('Database clear failed', 'error');
      showToast(error?.message || 'Unable to clear reservations.');
    }
  };

  window.exportCSV = function exportCSV() {
    const data = [...state.reservations];
    if (!data.length) {
      showToast('No data to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Phone', 'Date', 'Time', 'Guests', 'Table', 'Status', 'BookedAt'];
    const rows = data.map((reservation) => [
      reservation.id,
      reservation.name,
      reservation.phone,
      reservation.date,
      reservation.time,
      reservation.guests || '',
      reservation.tableId ? `T${reservation.tableId}` : '',
      reservation.status || 'pending',
      reservation.bookedAt || '',
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `austrian-brewery-reservations-${todayStr()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported.');
  };

  document.getElementById('search-input').addEventListener('input', renderTable);
  document.getElementById('status-filter').addEventListener('change', renderTable);
  document.getElementById('date-filter').addEventListener('change', renderTable);
  window.addEventListener('focus', () => {
    if (document.getElementById('app').style.display !== 'none') {
      refreshReservations({ silent: true });
    }
  });
})();
