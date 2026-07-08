// Gantt view — timeline with grouped tasks

const { useMemo: _MG } = React;

function GanttView() {
  const events = window.CalEvents;
  const DAY_WIDTH = 36;

  // Build day axis: Feb 22 → Apr 5 (~43 days), enough to show all events
  const axis = _MG(() => {
    const days = [];
    // Start Feb 22 (Sunday), 42 days
    for (let i = 22; i <= 28; i++) days.push({ month: 'Feb', d: i, dow: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(i - 22) % 7] });
    for (let i = 1; i <= 31; i++) {
      const dowIdx = (i - 1 + 0) % 7; // Mar 1 = Sunday
      days.push({ month: 'Mar', d: i, dow: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dowIdx] });
    }
    for (let i = 1; i <= 5; i++) {
      const dowIdx = (i + 2) % 7; // Apr 1 = Wed
      days.push({ month: 'Apr', d: i, dow: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dowIdx] });
    }
    return days;
  }, []);

  // Convert event start/end to axis index
  const dateToIdx = (date) => {
    const m = date.getMonth();
    const d = date.getDate();
    if (m === 1) return d - 22; // Feb 22 = 0
    if (m === 2) return 7 + (d - 1); // Mar 1 = 7
    if (m === 3) return 7 + 31 + (d - 1); // Apr 1 = 38
    return 0;
  };

  // Group events by project
  const groups = _MG(() => {
    const g = {};
    events.forEach(e => {
      if (!g[e.project]) g[e.project] = { name: e.project, color: e.projectColor, events: [] };
      g[e.project].events.push(e);
    });
    return Object.values(g);
  }, []);

  // Flatten into rows: [{type:'group', group}, {type:'event', event, group}, ...]
  const rows = _MG(() => {
    const r = [];
    groups.forEach(grp => {
      r.push({ type: 'group', group: grp });
      grp.events.forEach(e => r.push({ type: 'event', event: e, group: grp }));
    });
    return r;
  }, [groups]);

  const projectColorMap = {
    rose: 'oklch(0.65 0.14 20)',
    emerald: 'oklch(0.65 0.13 155)',
    violet: 'oklch(0.65 0.16 295)',
    blue: 'oklch(0.65 0.14 245)',
    amber: 'oklch(0.70 0.14 70)',
  };

  // Today line — Mar 11 = idx 17
  const todayIdx = 7 + 10; // Mar 11

  // Month spans for header
  const monthSpans = [
    { name: 'February 2026', start: 0, end: 6 },
    { name: 'March 2026', start: 7, end: 37 },
    { name: 'April 2026', start: 38, end: 42 },
  ];

  return (
    <div className="gantt-wrap">
      <div className="gantt-tasks">
        <div className="gantt-tasks-header">
          <span>Tasks</span>
          <span style={{ color: 'var(--cal-text-dim)' }}>{events.length}</span>
        </div>
        <div className="gantt-tasks-body">
          {rows.map((r, i) => r.type === 'group' ? (
            <div key={i} className="task-group-header">
              <svg className="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              <span className="task-color" style={{ background: projectColorMap[r.group.color] }} />
              <span>{r.group.name}</span>
              <span className="count">{r.group.events.length}</span>
            </div>
          ) : (
            <div key={i} className="task-row">
              <span className="dot" style={{ background: projectColorMap[r.group.color] }} />
              <span className="task-name">{r.event.title}</span>
              {r.event.priority === 'high' && (
                <span className="priority" title="High priority">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="gantt-timeline">
        <div className="gantt-header">
          <div className="gantt-header-months">
            {monthSpans.map(m => (
              <div key={m.name} className="gantt-month" style={{ width: (m.end - m.start + 1) * DAY_WIDTH + 'px' }}>
                {m.name}
              </div>
            ))}
          </div>
          <div className="gantt-header-days">
            {axis.map((day, i) => {
              const isWeekend = day.dow === 'Sat' || day.dow === 'Sun';
              const isToday = i === todayIdx;
              return (
                <div key={i} className={`gantt-day ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}>
                  <div className="wd">{day.dow[0]}</div>
                  <div className="dt">{day.d}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="gantt-body" style={{ width: axis.length * DAY_WIDTH + 'px' }}>
          {rows.map((r, i) => (
            <div key={i} className={`gantt-row-bg ${r.type === 'group' ? 'group' : ''}`}>
              {axis.map((day, ci) => {
                const isWeekend = day.dow === 'Sat' || day.dow === 'Sun';
                return <div key={ci} className={`gantt-cell-bg ${isWeekend ? 'weekend' : ''}`} />;
              })}
            </div>
          ))}

          {/* Today line */}
          <div className="today-line" style={{ left: (todayIdx * DAY_WIDTH + DAY_WIDTH / 2) + 'px' }} />

          {/* Bars */}
          <div className="gantt-bars-layer">
            {rows.map((r, i) => {
              if (r.type !== 'event') return null;
              const s = dateToIdx(r.event.start);
              const e = dateToIdx(r.event.end);
              const left = s * DAY_WIDTH + 2;
              const width = (e - s + 1) * DAY_WIDTH - 4;
              const top = i * 36 + 7;
              return (
                <div
                  key={r.event.id}
                  className={`gantt-bar cat-${r.event.cat}`}
                  style={{ left: left + 'px', width: width + 'px', top: top + 'px' }}
                  title={r.event.title}
                >
                  <span className="e-dot" />
                  <span className="e-title">{r.event.title}</span>
                  {r.event.priority === 'high' && (
                    <svg className="pri-flag" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

window.GanttView = GanttView;
