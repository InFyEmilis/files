// Month view — calendar grid with multi-day event bars

const { useMemo: _MM } = React;

function MonthView() {
  const weeks = window.CalHelpers.getMonthGrid();
  const events = window.CalEvents;
  const today = 11; // March 11, 2026

  // Layout events into rows per week, respecting overlaps
  const weekEventLayouts = _MM(() => {
    return weeks.map((weekDays) => {
      const weekStart = weekDays[0];
      const weekEnd = weekDays[6];
      // Find events that overlap this week
      const overlapping = events
        .filter(e => {
          const s = e.start.getDate() * (e.start.getMonth() === 1 ? -1 : 1); // crude
          // Use day value directly: convert Date to day-of-march number where Feb days = negative-ish
          const sd = e.start.getMonth() === 2 ? e.start.getDate() : e.start.getMonth() === 1 ? -(28 - e.start.getDate()) : (e.start.getDate() + 31);
          const ed = e.end.getMonth() === 2 ? e.end.getDate() : e.end.getMonth() === 1 ? -(28 - e.end.getDate()) : (e.end.getDate() + 31);
          return sd <= weekEnd && ed >= weekStart;
        })
        .map(e => {
          const sd = e.start.getMonth() === 2 ? e.start.getDate() : e.start.getMonth() === 1 ? -(28 - e.start.getDate()) : (e.start.getDate() + 31);
          const ed = e.end.getMonth() === 2 ? e.end.getDate() : e.end.getMonth() === 1 ? -(28 - e.end.getDate()) : (e.end.getDate() + 31);
          return {
            ...e,
            startCol: Math.max(0, weekDays.indexOf(Math.max(sd, weekStart))),
            endCol: Math.min(6, weekDays.indexOf(Math.min(ed, weekEnd))),
            continuesLeft: sd < weekStart,
            continuesRight: ed > weekEnd,
            origStart: sd,
            origEnd: ed,
          };
        });
      // Assign row indices (track-based packing) — sort by start then length
      overlapping.sort((a, b) => a.origStart - b.origStart || (b.origEnd - b.origStart) - (a.origEnd - a.origStart));
      const tracks = []; // tracks[i] = lastEndCol used
      overlapping.forEach(ev => {
        let placed = false;
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i] < ev.startCol) {
            ev.row = i;
            tracks[i] = ev.endCol;
            placed = true;
            break;
          }
        }
        if (!placed) {
          ev.row = tracks.length;
          tracks.push(ev.endCol);
        }
      });
      return overlapping;
    });
  }, [weeks]);

  const MAX_VISIBLE_ROWS = 4;

  return (
    <div className="cal-grid-wrap">
      <div className="cal-grid">
        <div className="dow-row">
          {window.CalHelpers.DOW_LONG.map(d => <div key={d} className="dow">{d}</div>)}
        </div>
        {weeks.map((week, wi) => {
          const layouts = weekEventLayouts[wi];
          const overflowByCol = Array(7).fill(0);
          layouts.forEach(ev => {
            if (ev.row >= MAX_VISIBLE_ROWS) {
              for (let c = ev.startCol; c <= ev.endCol; c++) overflowByCol[c]++;
            }
          });
          return (
            <div className="week-row" key={wi}>
              {week.map((d, ci) => {
                const isTodayCell = d === today;
                const otherMonth = window.CalHelpers.isOtherMonth(d);
                return (
                  <div key={ci} className={`day-cell ${otherMonth ? 'other-month' : ''} ${isTodayCell ? 'today' : ''}`}>
                    <div className="day-header">
                      <span className="day-num">{window.CalHelpers.dayLabel(d)}</span>
                      {overflowByCol[ci] > 0 && <span className="more-link">+{overflowByCol[ci]}</span>}
                    </div>
                  </div>
                );
              })}
              {/* Event bars layer */}
              <div className="event-layer">
                {layouts.filter(ev => ev.row < MAX_VISIBLE_ROWS).map(ev => {
                  const startPct = (ev.startCol / 7) * 100;
                  const widthPct = ((ev.endCol - ev.startCol + 1) / 7) * 100;
                  const top = 30 + ev.row * 26; // 22px bar + 4px gap
                  return (
                    <div
                      key={ev.id}
                      className={`event-bar cat-${ev.cat} ${ev.continuesLeft ? 'continues-left' : ''} ${ev.continuesRight ? 'continues-right' : ''}`}
                      style={{
                        left: `calc(${startPct}% + 4px)`,
                        width: `calc(${widthPct}% - 8px)`,
                        top: top + 'px',
                      }}
                      title={ev.title}
                    >
                      {!ev.continuesLeft && <span className="e-dot" />}
                      <span className="e-title">{ev.title}{ev.time ? ` · ${ev.time}` : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.MonthView = MonthView;
