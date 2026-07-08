// Agenda view — day-grouped list

function AgendaView() {
  const events = window.CalEvents;

  // Build week Mar 9-15, 2026
  const days = [
    { dow: 'Mon', date: 9 },
    { dow: 'Tue', date: 10 },
    { dow: 'Wed', date: 11, today: true },
    { dow: 'Thu', date: 12 },
    { dow: 'Fri', date: 13 },
    { dow: 'Sat', date: 14 },
    { dow: 'Sun', date: 15 },
  ];

  const colorMap = {
    rose: 'oklch(0.65 0.16 20)',
    emerald: 'oklch(0.65 0.13 155)',
    violet: 'oklch(0.65 0.16 295)',
    blue: 'oklch(0.65 0.14 245)',
    amber: 'oklch(0.70 0.14 70)',
    cyan: 'oklch(0.65 0.13 210)',
  };

  // Get events on a given day (March day d)
  const eventsForDay = (d) => {
    return events.filter(e => {
      const sd = e.start.getMonth() === 2 ? e.start.getDate() : e.start.getMonth() === 1 ? -(28 - e.start.getDate()) : e.start.getDate() + 31;
      const ed = e.end.getMonth() === 2 ? e.end.getDate() : e.end.getMonth() === 1 ? -(28 - e.end.getDate()) : e.end.getDate() + 31;
      return sd <= d && ed >= d;
    });
  };

  // Synthesize times for each event so the agenda has variety
  const eventTimes = {
    e1: { time: '09:00', dur: '6d' },
    e2: { time: '08:00', dur: '29d' },
    e3: { time: '10:00', dur: '11d' },
    e4: { time: '20:42', dur: '1d' },
    e5: { time: '14:00', dur: '2h' },
    e6: { time: '11:30', dur: '2d' },
    e7: { time: '22:54', dur: '6d' },
    e8: { time: '23:40', dur: '1d' },
    e9: { time: '07:30', dur: '8d' },
    e10: { time: '13:00', dur: '3h' },
    e11: { time: '17:30', dur: '1h' },
    e12: { time: '06:00', dur: '9d' },
    e13: { time: '08:30', dur: '4d' },
    e14: { time: '09:00', dur: '9d' },
    e15: { time: '15:00', dur: '4d' },
    e16: { time: '07:00', dur: '6d' },
    e17: { time: '10:30', dur: '3d' },
  };

  return (
    <div className="agenda-wrap">
      <div className="agenda-weekrange">
        <button className="nav-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Previous week
        </button>
        <h3>Mar 9 — 15, 2026</h3>
        <button className="nav-btn">
          Next week
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {days.map(day => {
        const dayEvents = eventsForDay(day.date)
          .sort((a, b) => (eventTimes[a.id]?.time || '').localeCompare(eventTimes[b.id]?.time || ''));
        return (
          <div className="agenda-day" key={day.date}>
            <div className={`agenda-day-meta ${day.today ? 'today' : ''}`}>
              <p className="dow">{day.dow}</p>
              <div className="date">{day.date}</div>
              <div className="count">{dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}</div>
            </div>
            <div className="agenda-events">
              {dayEvents.length === 0 && (
                <div style={{ padding: '20px 0', color: 'var(--cal-text-faint)', fontSize: 13, fontStyle: 'italic' }}>
                  Nothing scheduled
                </div>
              )}
              {dayEvents.map(ev => {
                const t = eventTimes[ev.id] || { time: '—', dur: '' };
                return (
                  <div className="agenda-event" key={ev.id} style={{ '--accent': colorMap[ev.cat] || colorMap.violet }}>
                    <div className="agenda-event-time">
                      <span className="start">{t.time}</span>
                      <span className="dur">{t.dur}</span>
                    </div>
                    <div className="agenda-event-color" />
                    <div className="agenda-event-main">
                      <div className="agenda-event-title">{ev.title}</div>
                      <div className="agenda-event-meta">
                        <span className="proj">
                          <span className="pdot" style={{ background: colorMap[ev.projectColor] || colorMap.violet }} />
                          {ev.project}
                        </span>
                        <span className={`status ${ev.status === 'completed' ? 'completed' : ev.status === 'in-progress' ? 'in-progress' : 'scheduled'}`}>
                          {ev.status === 'completed' ? '✓ Completed' : ev.status === 'in-progress' ? 'In progress' : 'Scheduled'}
                        </span>
                      </div>
                    </div>
                    <div className="agenda-event-side">
                      <span className={`priority-pill ${ev.priority || 'medium'}`}>
                        {ev.priority === 'high' ? 'High' : ev.priority === 'low' ? 'Low' : 'Medium'}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cal-text-faint)' }}>
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.AgendaView = AgendaView;
