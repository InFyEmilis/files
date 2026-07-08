// Mobile navigation explorations — phone screens for approaches A, C, D.
// Each screen renders inside an IOSDevice frame (390×844, dark).

const { useState: mnS } = React;

// ── Mini icons ──────────────────────────────────────────────────────────────
const _MI = ({ d, size = 18, stroke = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const MI = {
  chat:    p => <_MI {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  tasks:   p => <_MI {...p} d={<><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m9 12 2 2 4-4"/></>} />,
  files:   p => <_MI {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
  procure: p => <_MI {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  team:    p => <_MI {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  inbox:   p => <_MI {...p} d={<><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>} />,
  search:  p => <_MI {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  plus:    p => <_MI {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  chev:    p => <_MI {...p} d={<><path d="m6 9 6 6 6-6"/></>} />,
  back:    p => <_MI {...p} d={<><path d="m15 18-6-6 6-6"/></>} />,
  filter:  p => <_MI {...p} d={<><path d="M3 6h18"/><path d="M7 12h10"/><path d="M11 18h2"/></>} />,
  dots:    p => <_MI {...p} d={<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>} />,
  bell:    p => <_MI {...p} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />,
  bolt:    p => <_MI {...p} d={<><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></>} fill="currentColor" stroke="none" />,
  alert:   p => <_MI {...p} d={<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />,
};

// ── Demo data (subset, shaped for mobile) ───────────────────────────────────
const MN_PROJECTS = [
  { id: 'mh', initials: 'MH', name: 'Mecca HQ Renovation',  unread: 7, prio: 'crit', hue: 220, sub: '4 overdue tasks' },
  { id: 'bh', initials: 'BH', name: 'Bayfront Hotel Reno',  unread: 9, prio: 'crit', hue: 160, sub: 'Elevator safety' },
  { id: 'dr', initials: 'DR', name: 'Downtown Retail',      unread: 3, prio: 'crit', hue: 25,  sub: 'Site issue open' },
  { id: 'nm', initials: 'NM', name: 'North Miami Office',   unread: 5, prio: 'high', hue: 290, sub: '2 quotes pending' },
  { id: 'cg', initials: 'CG', name: 'Coral Gables Villa',   unread: 4, prio: 'high', hue: 340, sub: '3 overdue tasks' },
  { id: 'wr', initials: 'WR', name: 'Wynwood Restaurant',   unread: 2, prio: 'high', hue: 50,  sub: 'Awaiting approval' },
];

const MN_MODULES = [
  { id: 'inbox',   label: 'Inbox',  icon: MI.inbox,   count: 12 },
  { id: 'chat',    label: 'Chat',   icon: MI.chat,    count: 5  },
  { id: 'tasks',   label: 'Tasks',  icon: MI.tasks,   count: 8  },
  { id: 'files',   label: 'Files',  icon: MI.files                },
  { id: 'procure', label: 'Buy',    icon: MI.procure, count: 3  },
];

// ── Shared atoms ────────────────────────────────────────────────────────────
function MNBubble({ p, size = 32 }) {
  return (
    <div className="mn-bubble" style={{
      width: size, height: size,
      background: `oklch(0.32 0.06 ${p.hue})`,
      color: `oklch(0.92 0.06 ${p.hue})`,
      fontSize: size <= 22 ? 9 : size <= 28 ? 10 : 11,
    }}>
      {p.initials}
      {p.prio === 'crit' && <span className="mn-bubble__dot mn-bubble__dot--crit"/>}
      {p.prio === 'high' && <span className="mn-bubble__dot mn-bubble__dot--high"/>}
    </div>
  );
}

// Project chip — appears in the top header of approach A.
// Tap → opens project picker sheet.
function ProjectChip({ project, label }) {
  return (
    <button className="mn-pchip">
      {project ? <MNBubble p={project} size={22}/> : <div className="mn-pchip__all">●</div>}
      <span>{label || project?.initials || 'All'}</span>
      <MI.chev size={12}/>
    </button>
  );
}

// Bottom tab bar (Approach A & C)
function BottomTabs({ active, compact = false }) {
  return (
    <nav className="mn-tabs">
      {MN_MODULES.map(m => {
        const Glyph = m.icon;
        return (
          <button key={m.id} className={'mn-tab' + (m.id === active ? ' is-active' : '')}>
            <div className="mn-tab__iconwrap">
              <Glyph size={20}/>
              {m.count > 0 && m.id !== active && (
                <span className="mn-tab__badge">{m.count > 9 ? '9+' : m.count}</span>
              )}
            </div>
            <span className="mn-tab__lbl">{m.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Three-tab simpler version (Approach C uses fewer tabs)
function BottomTabsC({ active }) {
  const tabs = [
    { id: 'projects', label: 'Projects', icon: MI.inbox },
    { id: 'team',     label: 'Team',     icon: MI.team },
    { id: 'me',       label: 'You',      icon: MI.dots },
  ];
  return (
    <nav className="mn-tabs">
      {tabs.map(t => {
        const Glyph = t.icon;
        return (
          <button key={t.id} className={'mn-tab' + (t.id === active ? ' is-active' : '')}>
            <div className="mn-tab__iconwrap"><Glyph size={20}/></div>
            <span className="mn-tab__lbl">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Phone-frame wrapper — sets padding so content clears status bar + home indicator.
function PhoneFrame({ children, dark = true, lightChrome = false }) {
  const { IOSDevice } = window;
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <IOSDevice width={390} height={844} dark={dark}>
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          paddingTop: 60, boxSizing: 'border-box',
          background: dark ? 'oklch(0.16 0.01 270)' : '#f6f4ef',
          color: dark ? 'oklch(0.96 0.005 270)' : 'oklch(0.20 0.012 270)',
          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          overflow: 'hidden',
        }}>
          {children}
        </div>
      </IOSDevice>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// APPROACH A — Bottom tabs + project chip at top
// ════════════════════════════════════════════════════════════════════════════

function HeaderA({ project, title, projectLabel, isGlobal }) {
  return (
    <header className="mn-headA">
      <ProjectChip project={isGlobal ? null : project} label={projectLabel} />
      <h1 className="mn-headA__title">{title}</h1>
      <button className="mn-headA__btn"><MI.search size={18}/></button>
    </header>
  );
}

function ScreenA_Inbox() {
  const p = MN_PROJECTS[0];
  return (
    <PhoneFrame>
      <HeaderA project={p} title="Inbox" />
      <div className="mn-scroll">
        <div className="mn-secthd">Critical · 2</div>
        <div className="mn-list">
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 0 }}><MI.alert size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top">
                <span className="mn-conv__title">Water leak — storage</span>
                <span className="mn-conv__time">12m</span>
              </div>
              <div className="mn-conv__sub">MH HQ · Mike: Plumber on-site. Temporary patch.</div>
            </div>
            <span className="mn-conv__badge">1</span>
          </div>
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 220 }}><MI.chat size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top">
                <span className="mn-conv__title">Project Chat</span>
                <span className="mn-conv__time">15m</span>
              </div>
              <div className="mn-conv__sub">BH Bayfront · Sarah: Guest floors delayed 2 weeks.</div>
            </div>
            <span className="mn-conv__badge">6</span>
          </div>
        </div>
        <div className="mn-secthd">Today · 4</div>
        <div className="mn-list">
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 155 }}><MI.tasks size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top">
                <span className="mn-conv__title">Wall framing — Level 3</span>
                <span className="mn-conv__time">45m</span>
              </div>
              <div className="mn-conv__sub">MH HQ · Mike: Still waiting on lumber.</div>
            </div>
            <span className="mn-conv__badge">4</span>
          </div>
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 35 }}><MI.procure size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top">
                <span className="mn-conv__title">Lighting fixture quote</span>
                <span className="mn-conv__time">30m</span>
              </div>
              <div className="mn-conv__sub">MH HQ · David: 3 vendors. Need sign-off.</div>
            </div>
            <span className="mn-conv__badge">2</span>
          </div>
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 270 }}><MI.team size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top">
                <span className="mn-conv__title">Sarah Chen</span>
                <span className="mn-conv__time">10m</span>
              </div>
              <div className="mn-conv__sub">Can you review the updated schedule?</div>
            </div>
            <span className="mn-conv__badge">1</span>
          </div>
        </div>
      </div>
      <BottomTabs active="inbox" />
    </PhoneFrame>
  );
}

function ScreenA_PickerSheet() {
  return (
    <PhoneFrame>
      {/* Dimmed underlying inbox */}
      <div style={{ position: 'absolute', inset: 0, paddingTop: 60, display: 'flex', flexDirection: 'column', filter: 'brightness(0.5) blur(0.3px)' }}>
        <HeaderA project={MN_PROJECTS[0]} title="Inbox" />
        <div className="mn-scroll">
          <div className="mn-secthd">Critical · 2</div>
          <div className="mn-list">
            <div className="mn-conv"><div className="mn-conv__icon" style={{ '--h': 0 }}><MI.alert size={15}/></div><div className="mn-conv__body"><div className="mn-conv__top"><span className="mn-conv__title">Water leak — storage</span><span className="mn-conv__time">12m</span></div><div className="mn-conv__sub">MH HQ · Mike: Plumber on-site.</div></div></div>
          </div>
        </div>
        <BottomTabs active="inbox"/>
      </div>
      {/* Sheet overlay */}
      <div className="mn-sheet">
        <div className="mn-sheet__grabber"/>
        <div className="mn-sheet__head">
          <h2>Switch project</h2>
          <button className="mn-sheet__close">✕</button>
        </div>
        <div className="mn-sheet__search">
          <MI.search size={15}/>
          <span>Search projects…</span>
        </div>
        <div className="mn-sheet__scroll">
          <div className="mn-secthd">Critical · 3</div>
          {MN_PROJECTS.filter(p => p.prio === 'crit').map((p, i) => (
            <button key={p.id} className={'mn-prow' + (i === 0 ? ' is-sel' : '')}>
              <MNBubble p={p} size={36}/>
              <div className="mn-prow__body">
                <div className="mn-prow__name">{p.name}</div>
                <div className="mn-prow__sub">{p.sub}</div>
              </div>
              {p.unread > 0 && <span className="mn-prow__count">{p.unread}</span>}
            </button>
          ))}
          <div className="mn-secthd">Active · 3</div>
          {MN_PROJECTS.filter(p => p.prio === 'high').map(p => (
            <button key={p.id} className="mn-prow">
              <MNBubble p={p} size={36}/>
              <div className="mn-prow__body">
                <div className="mn-prow__name">{p.name}</div>
                <div className="mn-prow__sub">{p.sub}</div>
              </div>
              {p.unread > 0 && <span className="mn-prow__count">{p.unread}</span>}
            </button>
          ))}
          <button className="mn-prow mn-prow--all">
            <div className="mn-prow__all">+</div>
            <div className="mn-prow__body">
              <div className="mn-prow__name">All projects</div>
              <div className="mn-prow__sub">View 15 projects</div>
            </div>
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function ScreenA_Chat() {
  const p = MN_PROJECTS[0];
  return (
    <PhoneFrame>
      <header className="mn-headA mn-headA--detail">
        <button className="mn-headA__back"><MI.back size={20}/></button>
        <div className="mn-headA__titlecol">
          <div className="mn-headA__t1">Project Chat</div>
          <div className="mn-headA__t2">
            <MNBubble p={p} size={14}/>
            <span>MH HQ · 4 members</span>
          </div>
        </div>
        <button className="mn-headA__btn"><MI.dots size={18}/></button>
      </header>
      <div className="mn-stream">
        <div className="mn-day"><span>Today</span></div>
        <div className="mn-msg">
          <div className="mn-msg__name">Mike Rodriguez</div>
          <div className="mn-bub">Lumber delivery is delayed again. Following up with supplier by noon.</div>
        </div>
        <div className="mn-msg mn-msg--own">
          <div className="mn-bub mn-bub--own">@David can you escalate to backup supplier?</div>
        </div>
        <div className="mn-msg">
          <div className="mn-msg__name">David Kim</div>
          <div className="mn-bub">On it. I have a contact at Timber Pro. Calling now.</div>
        </div>
        <div className="mn-msg">
          <div className="mn-msg__name">Sarah Chen</div>
          <div className="mn-bub">Site walk scheduled for 8AM tomorrow.</div>
        </div>
      </div>
      <div className="mn-composer">
        <button className="mn-composer__plus"><MI.plus size={18}/></button>
        <div className="mn-composer__input">Message Project Chat…</div>
        <button className="mn-composer__send"><MI.bolt size={14}/></button>
      </div>
    </PhoneFrame>
  );
}

function ScreenA_Tasks() {
  const p = MN_PROJECTS[0];
  const tasks = [
    { t: 'Wall framing — Level 3', w: 'Mike R.', due: 'Overdue 1d', crit: true, group: 'over' },
    { t: 'Permit resubmission',    w: 'Sarah C.', due: 'Overdue 5d', crit: true, group: 'over' },
    { t: 'MEP sign-off',           w: 'Lisa P.', due: 'Due today', group: 'today' },
    { t: 'Upload progress photos', w: 'Lisa P.', due: 'Due today', group: 'today' },
    { t: 'Order rebar (28t)',      w: 'David K.', due: 'Fri', group: 'week' },
    { t: 'Confirm inspector',      w: 'Mike R.', due: 'Mon', group: 'week' },
  ];
  return (
    <PhoneFrame>
      <HeaderA project={p} title="Tasks" />
      <div className="mn-segrow">
        <span className="mn-seg is-active">All · 10</span>
        <span className="mn-seg">Mine · 4</span>
        <span className="mn-seg">Overdue · 4</span>
      </div>
      <div className="mn-scroll mn-scroll--tight">
        <div className="mn-secthd"><MI.alert size={11}/> Overdue · 2</div>
        <div className="mn-list">
          {tasks.filter(t => t.group === 'over').map((t, i) => (
            <div key={i} className="mn-task">
              <div className="mn-task__check"/>
              <div className="mn-task__body">
                <div className="mn-task__title">{t.t}</div>
                <div className="mn-task__meta">
                  <span className={'mn-task__due' + (t.crit ? ' is-crit' : '')}>{t.due}</span>
                  <span>·</span><span>{t.w}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mn-secthd">Due today · 2</div>
        <div className="mn-list">
          {tasks.filter(t => t.group === 'today').map((t, i) => (
            <div key={i} className="mn-task">
              <div className="mn-task__check"/>
              <div className="mn-task__body">
                <div className="mn-task__title">{t.t}</div>
                <div className="mn-task__meta">
                  <span className="mn-task__due">{t.due}</span>
                  <span>·</span><span>{t.w}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs active="tasks" />
    </PhoneFrame>
  );
}

function ScreenA_Team() {
  const people = [
    { i: 'SC', n: 'Sarah Chen',     r: 'PM',  h: 220, on: 'online', proj: 'MH · BH · DR' },
    { i: 'MR', n: 'Mike Rodriguez', r: 'Site Superintendent', h: 25, on: 'online', proj: 'MH · DR · WC' },
    { i: 'LP', n: 'Lisa Park',      r: 'MEP Coordinator', h: 340, on: 'online', proj: 'NM · MH · CG' },
    { i: 'DK', n: 'David Kim',      r: 'Procurement Lead', h: 145, on: 'away', proj: 'MH · NM · WR' },
    { i: 'EJ', n: 'Emily Johnson',  r: 'Architect', h: 290, on: 'online', proj: 'NM · DS · OM' },
    { i: 'JW', n: 'James Wilson',   r: 'Structural Eng', h: 200, on: 'off', proj: 'DR · CG · WC' },
  ];
  return (
    <PhoneFrame>
      <header className="mn-headA">
        <ProjectChip label="All people" />
        <h1 className="mn-headA__title">Team</h1>
        <button className="mn-headA__btn"><MI.search size={18}/></button>
      </header>
      <div className="mn-segrow">
        <span className="mn-seg is-active">All · 28</span>
        <span className="mn-seg">My projects · 12</span>
        <span className="mn-seg">Online · 4</span>
      </div>
      <div className="mn-scroll">
        <div className="mn-secthd">Online · 4</div>
        <div className="mn-list">
          {people.filter(p => p.on === 'online').map(p => (
            <div key={p.i} className="mn-person">
              <div className="mn-person__av" style={{ background: `oklch(0.42 0.06 ${p.h})`, color: `oklch(0.96 0.02 ${p.h})` }}>
                {p.i}
                <span className={'mn-person__dot mn-person__dot--' + p.on}/>
              </div>
              <div className="mn-person__body">
                <div className="mn-person__name">{p.n}</div>
                <div className="mn-person__role">{p.r} · {p.proj}</div>
              </div>
              <button className="mn-person__msg"><MI.chat size={15}/></button>
            </div>
          ))}
        </div>
        <div className="mn-secthd">Away · 2</div>
        <div className="mn-list">
          {people.filter(p => p.on !== 'online').slice(0, 2).map(p => (
            <div key={p.i} className="mn-person">
              <div className="mn-person__av" style={{ background: `oklch(0.32 0.04 ${p.h})`, color: `oklch(0.80 0.04 ${p.h})` }}>
                {p.i}
                <span className={'mn-person__dot mn-person__dot--' + p.on}/>
              </div>
              <div className="mn-person__body">
                <div className="mn-person__name">{p.n}</div>
                <div className="mn-person__role">{p.r} · {p.proj}</div>
              </div>
              <button className="mn-person__msg"><MI.chat size={15}/></button>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs active="team" />
    </PhoneFrame>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// APPROACH C — Project-first home (drill down into modules)
// ════════════════════════════════════════════════════════════════════════════

function ScreenC_Home() {
  return (
    <PhoneFrame>
      <header className="mn-headC">
        <div className="mn-headC__row">
          <h1>Projects</h1>
          <div className="mn-headC__btns">
            <button className="mn-headA__btn"><MI.search size={18}/></button>
            <button className="mn-headA__btn"><MI.plus size={18}/></button>
          </div>
        </div>
        <div className="mn-headC__sub">15 projects · 31 unread</div>
      </header>
      <div className="mn-scroll mn-scroll--cards">
        <div className="mn-secthd">Critical</div>
        {MN_PROJECTS.filter(p => p.prio === 'crit').map(p => (
          <div key={p.id} className="mn-pcard">
            <div className="mn-pcard__top">
              <MNBubble p={p} size={38}/>
              <div className="mn-pcard__titlecol">
                <div className="mn-pcard__name">{p.name}</div>
                <div className="mn-pcard__sub">{p.sub}</div>
              </div>
              <span className="mn-pcard__unread">{p.unread}</span>
            </div>
            <div className="mn-pcard__mods">
              <span className="mn-pcard__mod"><MI.chat size={11}/> 3</span>
              <span className="mn-pcard__mod"><MI.tasks size={11}/> 4</span>
              <span className="mn-pcard__mod"><MI.procure size={11}/> 2</span>
              <span className="mn-pcard__mod mn-pcard__mod--warn"><MI.alert size={11}/> 1</span>
            </div>
          </div>
        ))}
        <div className="mn-secthd">Active</div>
        {MN_PROJECTS.filter(p => p.prio === 'high').slice(0, 1).map(p => (
          <div key={p.id} className="mn-pcard">
            <div className="mn-pcard__top">
              <MNBubble p={p} size={38}/>
              <div className="mn-pcard__titlecol">
                <div className="mn-pcard__name">{p.name}</div>
                <div className="mn-pcard__sub">{p.sub}</div>
              </div>
              <span className="mn-pcard__unread">{p.unread}</span>
            </div>
            <div className="mn-pcard__mods">
              <span className="mn-pcard__mod"><MI.chat size={11}/> 2</span>
              <span className="mn-pcard__mod"><MI.tasks size={11}/> 1</span>
              <span className="mn-pcard__mod"><MI.procure size={11}/> 2</span>
            </div>
          </div>
        ))}
      </div>
      <BottomTabsC active="projects"/>
    </PhoneFrame>
  );
}

function ScreenC_ProjectHome() {
  const p = MN_PROJECTS[0];
  return (
    <PhoneFrame>
      <header className="mn-headA mn-headA--detail">
        <button className="mn-headA__back"><MI.back size={20}/></button>
        <div className="mn-headA__titlecol">
          <div className="mn-headA__t1">{p.name}</div>
          <div className="mn-headA__t2"><span>PM Sarah · 23 members</span></div>
        </div>
        <button className="mn-headA__btn"><MI.dots size={18}/></button>
      </header>
      <div className="mn-scroll mn-scroll--cards">
        {/* Status hero */}
        <div className="mn-phero">
          <div className="mn-phero__pill mn-phero__pill--crit">4 OVERDUE</div>
          <div className="mn-phero__title">Site walk scheduled for 8AM tomorrow</div>
          <div className="mn-phero__sub">Latest from Sarah · 12m ago</div>
        </div>
        {/* Module grid — 2×2 */}
        <div className="mn-modgrid">
          <button className="mn-modtile">
            <div className="mn-modtile__icon" style={{ '--h': 220 }}><MI.chat size={20}/></div>
            <div className="mn-modtile__lbl">Chat</div>
            <div className="mn-modtile__count">3 unread</div>
          </button>
          <button className="mn-modtile mn-modtile--hot">
            <div className="mn-modtile__icon" style={{ '--h': 155 }}><MI.tasks size={20}/></div>
            <div className="mn-modtile__lbl">Tasks</div>
            <div className="mn-modtile__count">4 due · 2 overdue</div>
          </button>
          <button className="mn-modtile">
            <div className="mn-modtile__icon" style={{ '--h': 245 }}><MI.files size={20}/></div>
            <div className="mn-modtile__lbl">Files</div>
            <div className="mn-modtile__count">142 files</div>
          </button>
          <button className="mn-modtile mn-modtile--hot">
            <div className="mn-modtile__icon" style={{ '--h': 35 }}><MI.procure size={20}/></div>
            <div className="mn-modtile__lbl">Procurement</div>
            <div className="mn-modtile__count">2 pending</div>
          </button>
        </div>
        {/* Recent activity */}
        <div className="mn-secthd">Recent activity</div>
        <div className="mn-list">
          <div className="mn-act">
            <span className="mn-act__dot" style={{background:'var(--mc-red)'}}/>
            <div><b>Mike</b> reported a water leak</div>
            <span className="mn-act__time">12m</span>
          </div>
          <div className="mn-act">
            <span className="mn-act__dot" style={{background:'var(--mc-amber)'}}/>
            <div><b>David</b> uploaded 3 quotes</div>
            <span className="mn-act__time">30m</span>
          </div>
          <div className="mn-act">
            <span className="mn-act__dot" style={{background:'var(--mc-blue)'}}/>
            <div><b>Sarah</b> scheduled site walk</div>
            <span className="mn-act__time">2h</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function ScreenC_Module() {
  const p = MN_PROJECTS[0];
  return (
    <PhoneFrame>
      <header className="mn-headA mn-headA--detail">
        <button className="mn-headA__back"><MI.back size={20}/></button>
        <div className="mn-headA__titlecol">
          <div className="mn-headA__t1">Tasks</div>
          <div className="mn-headA__t2">
            <MNBubble p={p} size={14}/>
            <span>{p.name}</span>
          </div>
        </div>
        <button className="mn-headA__btn"><MI.plus size={18}/></button>
      </header>
      <div className="mn-segrow">
        <span className="mn-seg is-active">All · 10</span>
        <span className="mn-seg">Mine · 4</span>
        <span className="mn-seg">Overdue · 4</span>
      </div>
      <div className="mn-scroll mn-scroll--tight">
        <div className="mn-secthd"><MI.alert size={11}/> Overdue · 2</div>
        <div className="mn-list">
          {[
            { t: 'Wall framing — Level 3', w: 'Mike R.', due: 'Overdue 1d', crit: true },
            { t: 'Permit resubmission',    w: 'Sarah C.', due: 'Overdue 5d', crit: true },
          ].map((t, i) => (
            <div key={i} className="mn-task">
              <div className="mn-task__check"/>
              <div className="mn-task__body">
                <div className="mn-task__title">{t.t}</div>
                <div className="mn-task__meta">
                  <span className="mn-task__due is-crit">{t.due}</span>
                  <span>·</span><span>{t.w}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mn-secthd">Due today · 2</div>
        <div className="mn-list">
          {[
            { t: 'MEP sign-off', w: 'Lisa P.', due: 'Due today' },
            { t: 'Upload progress photos', w: 'Lisa P.', due: 'Due today' },
          ].map((t, i) => (
            <div key={i} className="mn-task">
              <div className="mn-task__check"/>
              <div className="mn-task__body">
                <div className="mn-task__title">{t.t}</div>
                <div className="mn-task__meta">
                  <span className="mn-task__due">{t.due}</span>
                  <span>·</span><span>{t.w}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* No bottom tabs — pure stack navigation within project */}
      <div className="mn-stackfoot">
        <button className="mn-stackfoot__btn"><MI.chat size={16}/><span>Chat</span></button>
        <button className="mn-stackfoot__btn is-active"><MI.tasks size={16}/><span>Tasks</span></button>
        <button className="mn-stackfoot__btn"><MI.files size={16}/><span>Files</span></button>
        <button className="mn-stackfoot__btn"><MI.procure size={16}/><span>Buy</span></button>
      </div>
    </PhoneFrame>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// APPROACH D — Breadcrumb + cmd-K (search-first, sparest chrome)
// ════════════════════════════════════════════════════════════════════════════

function ScreenD_Module() {
  const p = MN_PROJECTS[0];
  return (
    <PhoneFrame>
      <header className="mn-headD">
        <button className="mn-headD__crumb">
          <MNBubble p={p} size={20}/>
          <span>{p.initials}</span>
          <MI.chev size={11}/>
        </button>
        <button className="mn-headD__search">
          <MI.search size={14}/>
          <span>Search anything</span>
          <kbd>⌘</kbd>
        </button>
        <button className="mn-headD__user">YO</button>
      </header>
      <div className="mn-segrow mn-segrow--D">
        <span className="mn-seg is-active"><MI.chat size={11}/> Chat</span>
        <span className="mn-seg"><MI.tasks size={11}/> Tasks</span>
        <span className="mn-seg"><MI.files size={11}/> Files</span>
        <span className="mn-seg"><MI.procure size={11}/> Buy</span>
        <span className="mn-seg"><MI.team size={11}/> Team</span>
      </div>
      <div className="mn-scroll">
        <div className="mn-secthd">Pinned</div>
        <div className="mn-list">
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 220 }}><MI.chat size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top">
                <span className="mn-conv__title">Project Chat</span>
                <span className="mn-conv__time">12m</span>
              </div>
              <div className="mn-conv__sub">Sarah: Site walk 8AM tomorrow.</div>
            </div>
            <span className="mn-conv__badge">3</span>
          </div>
        </div>
        <div className="mn-secthd">Conversations</div>
        <div className="mn-list">
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 155 }}><MI.tasks size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top"><span className="mn-conv__title">Wall framing — L3</span><span className="mn-conv__time">45m</span></div>
              <div className="mn-conv__sub">Mike: Lumber still delayed.</div>
            </div>
            <span className="mn-conv__badge">4</span>
          </div>
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 35 }}><MI.procure size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top"><span className="mn-conv__title">Lighting fixtures</span><span className="mn-conv__time">30m</span></div>
              <div className="mn-conv__sub">David: 3 quotes ready for approval.</div>
            </div>
            <span className="mn-conv__badge">2</span>
          </div>
          <div className="mn-conv">
            <div className="mn-conv__icon" style={{ '--h': 0 }}><MI.alert size={15}/></div>
            <div className="mn-conv__body">
              <div className="mn-conv__top"><span className="mn-conv__title">Water leak — storage</span><span className="mn-conv__time">18m</span></div>
              <div className="mn-conv__sub">Mike: Plumber on-site.</div>
            </div>
            <span className="mn-conv__badge">1</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function ScreenD_CommandK() {
  return (
    <PhoneFrame>
      {/* Faint background */}
      <div style={{ position: 'absolute', inset: 0, paddingTop: 60, filter: 'brightness(0.4) blur(1px)' }}>
        <header className="mn-headD">
          <button className="mn-headD__crumb"><MNBubble p={MN_PROJECTS[0]} size={20}/><span>MH</span><MI.chev size={11}/></button>
        </header>
      </div>
      <div className="mn-cmdk">
        <div className="mn-cmdk__head">
          <MI.search size={16}/>
          <span className="mn-cmdk__input">timber<span className="mn-cmdk__caret">|</span></span>
          <button className="mn-cmdk__close">✕</button>
        </div>
        <div className="mn-cmdk__sec">PROJECTS</div>
        <div className="mn-cmdk__row">
          <MNBubble p={MN_PROJECTS[0]} size={26}/>
          <div className="mn-cmdk__rowbody">
            <div className="mn-cmdk__t">Mecca HQ Renovation</div>
            <div className="mn-cmdk__s">Switch project</div>
          </div>
        </div>
        <div className="mn-cmdk__sec">CONVERSATIONS</div>
        <div className="mn-cmdk__row">
          <div className="mn-conv__icon" style={{ '--h': 155, width: 26, height: 26 }}><MI.tasks size={13}/></div>
          <div className="mn-cmdk__rowbody">
            <div className="mn-cmdk__t">Wall framing — Level 3</div>
            <div className="mn-cmdk__s">MH HQ · <mark>Timber</mark> Pro contacted</div>
          </div>
        </div>
        <div className="mn-cmdk__row">
          <div className="mn-conv__icon" style={{ '--h': 35, width: 26, height: 26 }}><MI.procure size={13}/></div>
          <div className="mn-cmdk__rowbody">
            <div className="mn-cmdk__t"><mark>Timber</mark> Pro — lumber resupply</div>
            <div className="mn-cmdk__s">MH HQ · Procurement · Ordered</div>
          </div>
        </div>
        <div className="mn-cmdk__sec">ACTIONS</div>
        <div className="mn-cmdk__row mn-cmdk__row--act">
          <div className="mn-cmdk__icon"><MI.plus size={14}/></div>
          <div className="mn-cmdk__rowbody">
            <div className="mn-cmdk__t">New task… "timber"</div>
          </div>
          <kbd>⏎</kbd>
        </div>
      </div>
    </PhoneFrame>
  );
}

window.MNScreens = {
  ScreenA_Inbox, ScreenA_PickerSheet, ScreenA_Chat, ScreenA_Tasks, ScreenA_Team,
  ScreenC_Home, ScreenC_ProjectHome, ScreenC_Module,
  ScreenD_Module, ScreenD_CommandK,
};
