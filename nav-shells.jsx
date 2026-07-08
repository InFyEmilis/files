// Navigation shell variants — 4 approaches for the full Mecca app.
// Each shell renders the chrome (rails, headers, switchers) + a generic
// module-content placeholder so the user can compare how nav holds up
// across Chat / Tasks / Files / Procurement / Team.

const { useState: nS, useMemo: nM } = React;

// ── Mini icon set (self-contained — doesn't depend on MC.I) ─────────────────
const _Ic = ({ d, size = 16, stroke = 1.7, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>{d}</svg>
);
const NI = {
  chat:    p => <_Ic {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  tasks:   p => <_Ic {...p} d={<><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m9 12 2 2 4-4"/></>} />,
  files:   p => <_Ic {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
  procure: p => <_Ic {...p} d={<><path d="M2 3h2l3 12h13l3-9H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>} />,
  team:    p => <_Ic {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  inbox:   p => <_Ic {...p} d={<><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>} />,
  search:  p => <_Ic {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  plus:    p => <_Ic {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  chev:    p => <_Ic {...p} d={<><path d="m6 9 6 6 6-6"/></>} />,
  chevR:   p => <_Ic {...p} d={<><path d="m9 18 6-6-6-6"/></>} />,
  bell:    p => <_Ic {...p} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />,
  panel:   p => <_Ic {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></>} />,
  pin:     p => <_Ic {...p} d={<><path d="M12 17v5"/><path d="M9 10.76V6h6v4.76l3 3.24v3H6v-3z"/></>} />,
  star:    p => <_Ic {...p} d={<><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></>} />,
  bolt:    p => <_Ic {...p} d={<><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></>} />,
  cmd:     p => <_Ic {...p} d={<><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></>} />,
  dots:    p => <_Ic {...p} d={<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>} />,
};

// ── Demo data ────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 'mh', initials: 'MH', name: 'Mecca HQ Renovation',  unread: 7, prio: 'crit', hue: 220 },
  { id: 'dr', initials: 'DR', name: 'Downtown Retail Build', unread: 3, prio: 'crit', hue: 25  },
  { id: 'nm', initials: 'NM', name: 'North Miami Office',    unread: 5, prio: 'high', hue: 290 },
  { id: 'wr', initials: 'WR', name: 'Wynwood Restaurant',    unread: 2, prio: 'high', hue: 50  },
  { id: 'cg', initials: 'CG', name: 'Coral Gables Villa',    unread: 4, prio: 'high', hue: 340 },
  { id: 'ba', initials: 'BA', name: 'Brickell Apartment',    unread: 0, prio: 'norm', hue: 200 },
  { id: 'bh', initials: 'BH', name: 'Bayfront Hotel Reno',   unread: 9, prio: 'crit', hue: 160 },
];

const MODULES = [
  { id: 'inbox',   label: 'Inbox',       icon: NI.inbox,   count: 12 },
  { id: 'chat',    label: 'Chat',        icon: NI.chat,    count: 5  },
  { id: 'tasks',   label: 'Tasks',       icon: NI.tasks,   count: 8  },
  { id: 'files',   label: 'Files',       icon: NI.files                },
  { id: 'procure', label: 'Procurement', icon: NI.procure, count: 3  },
];

const GLOBAL_MODULES = [
  { id: 'team',    label: 'Team',        icon: NI.team     },
];

// ── Shared atoms ─────────────────────────────────────────────────────────────
function ProjectBubble({ p, selected, size = 36, showInitials = true }) {
  return (
    <div className={'ns-bubble' + (selected ? ' is-sel' : '')}
      style={{
        width: size, height: size,
        background: selected ? 'var(--mc-accent)' : `oklch(0.30 0.05 ${p.hue})`,
        color: selected ? 'var(--mc-accent-fg)' : `oklch(0.92 0.06 ${p.hue})`,
        fontSize: size <= 28 ? 10 : 11,
      }}
    >
      {showInitials && p.initials}
      {p.prio === 'crit' && <span className="ns-bubble__dot ns-bubble__dot--crit" />}
      {p.prio === 'high' && <span className="ns-bubble__dot ns-bubble__dot--high" />}
      {p.unread > 0 && !showInitials && (
        <span className="ns-bubble__badge">{p.unread > 9 ? '9+' : p.unread}</span>
      )}
    </div>
  );
}

function ProjectRow({ p, selected, dense, onClick }) {
  return (
    <button className={'ns-prow' + (selected ? ' is-sel' : '') + (dense ? ' is-dense' : '')} onClick={onClick}>
      <ProjectBubble p={p} selected={selected} size={dense ? 26 : 30} />
      <div className="ns-prow__text">
        <div className="ns-prow__name">{p.name}</div>
        {!dense && <div className="ns-prow__sub">{p.unread > 0 ? `${p.unread} unread` : 'No new'}</div>}
      </div>
      {p.unread > 0 && <span className="ns-prow__count">{p.unread}</span>}
    </button>
  );
}

function ModuleTab({ m, active, withCount = true }) {
  const Glyph = m.icon;
  return (
    <button className={'ns-tab' + (active ? ' is-active' : '')}>
      <Glyph size={15} />
      <span>{m.label}</span>
      {withCount && m.count > 0 && <span className="ns-tab__count">{m.count}</span>}
    </button>
  );
}

function SearchBar({ wide = false, placeholder = 'Search projects, tasks, files…' }) {
  return (
    <div className={'ns-search' + (wide ? ' is-wide' : '')}>
      <NI.search size={14} />
      <span>{placeholder}</span>
      <kbd>⌘ K</kbd>
    </div>
  );
}

function UserChip() {
  return <div className="ns-user">YO</div>;
}

function Brand({ withName = true, size = 28 }) {
  return (
    <div className="ns-brand">
      <div className="ns-brand__mark" style={{ width: size, height: size }}>M</div>
      {withName && <span>Mecca</span>}
    </div>
  );
}

// ── Module content (middle column + detail) ─────────────────────────────────
// All variants share a simple shape: a left "list" column + a right "detail"
// column. Visual treatment varies enough that the nav reads as connected.

function ChatModule({ project }) {
  const convs = [
    { title: 'Project Chat',          who: 'Sarah Chen',     msg: 'Site walk scheduled for 8AM tomorrow.', t: '12m', unread: 3, kind: 'chat' },
    { title: 'Finish wall framing — L3', who: 'Mike R.',     msg: 'Still waiting on lumber delivery.',    t: '45m', unread: 4, kind: 'task' },
    { title: 'Lighting fixture quote',   who: 'David Kim',   msg: 'Quote from 3 vendors. Need sign-off.', t: '30m', unread: 2, kind: 'procure' },
    { title: 'Water leak — storage',     who: 'Mike R.',     msg: 'Plumber on-site. Temporary patch.',    t: '18m', unread: 1, kind: 'issue' },
    { title: 'Sarah Chen',               who: 'Direct',      msg: 'Quick question on Level 3 spec.',      t: '35m', unread: 2, kind: 'dm' },
  ];
  return (
    <>
      <div className="ns-list">
        <div className="ns-list__head">
          <span>Conversations</span>
          <span className="ns-list__count">{convs.length}</span>
        </div>
        <div className="ns-list__search">
          <NI.search size={13} />
          <span>Search in {project.initials}…</span>
        </div>
        <div className="ns-list__items">
          {convs.map((c, i) => (
            <div key={i} className={'ns-conv' + (i === 0 ? ' is-sel' : '')}>
              <div className="ns-conv__icon" style={{ '--h': project.hue }}>
                {c.kind === 'task' ? <NI.tasks size={14}/> :
                 c.kind === 'procure' ? <NI.procure size={14}/> :
                 c.kind === 'issue' ? <span style={{color:'var(--mc-red)'}}>!</span> :
                 c.kind === 'dm' ? <NI.team size={14}/> :
                 <NI.chat size={14}/>}
              </div>
              <div className="ns-conv__body">
                <div className="ns-conv__top">
                  <span className="ns-conv__title">{c.title}</span>
                  <span className="ns-conv__time">{c.t}</span>
                </div>
                <div className="ns-conv__msg"><b>{c.who}:</b> {c.msg}</div>
              </div>
              {c.unread > 0 && <span className="ns-conv__badge">{c.unread}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="ns-detail">
        <div className="ns-detail__head">
          <div className="ns-detail__icon" style={{ '--h': project.hue }}><NI.chat size={16}/></div>
          <div className="ns-detail__titlecol">
            <div className="ns-detail__title">Project Chat</div>
            <div className="ns-detail__sub">{project.name} · 4 members</div>
          </div>
        </div>
        <div className="ns-stream">
          <div className="ns-bub">Lumber delivery is delayed again. Following up with supplier by noon.</div>
          <div className="ns-bub ns-bub--own">Can you escalate to the backup supplier?</div>
          <div className="ns-bub">On it. I have a contact at Timber Pro. Will call now.</div>
          <div className="ns-bub">Site walk scheduled for 8AM tomorrow.</div>
        </div>
        <div className="ns-composer">
          <span>Message Project Chat…</span>
          <div className="ns-composer__send"><NI.bolt size={13}/></div>
        </div>
      </div>
    </>
  );
}

function TasksModule({ project }) {
  const cols = [
    { name: 'To do',       count: 3, items: ['Finalize Level 3 spec', 'Order rebar (28t)', 'Confirm inspector time'] },
    { name: 'In progress', count: 4, items: ['Wall framing — L3', 'MEP coordination', 'Permit resubmission', 'HVAC review'] },
    { name: 'Blocked',     count: 1, items: ['Pool deck waterproofing'] },
    { name: 'Done',        count: 2, items: ['Site survey', 'Demo phase 1'] },
  ];
  return (
    <>
      <div className="ns-list">
        <div className="ns-list__head">
          <span>Tasks · {project.initials}</span>
          <span className="ns-list__count">10</span>
        </div>
        <div className="ns-tfilter">
          <span className="ns-tfilter__chip is-active">All</span>
          <span className="ns-tfilter__chip">Mine</span>
          <span className="ns-tfilter__chip">Overdue · 4</span>
        </div>
        <div className="ns-list__items">
          {[
            { t: 'Finish wall framing — Level 3', w: 'Mike R.', due: 'Overdue 1d', crit: true },
            { t: 'Permit resubmission — zoning',  w: 'Sarah C.', due: 'Overdue 5d', crit: true },
            { t: 'MEP coordination sign-off',     w: 'Lisa P.',  due: 'Due today' },
            { t: 'Upload progress photos — L2',   w: 'Lisa P.',  due: 'Due today' },
            { t: 'Pool deck waterproofing',       w: 'Mike R.',  due: 'On hold' },
          ].map((t, i) => (
            <div key={i} className={'ns-task' + (i === 0 ? ' is-sel' : '')}>
              <div className="ns-task__check"/>
              <div className="ns-task__body">
                <div className="ns-task__title">{t.t}</div>
                <div className="ns-task__meta">
                  <span className={'ns-task__due' + (t.crit ? ' is-crit' : '')}>{t.due}</span>
                  <span>·</span><span>{t.w}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ns-detail">
        <div className="ns-detail__head">
          <div className="ns-detail__icon" style={{ '--h': 155 }}><NI.tasks size={16}/></div>
          <div className="ns-detail__titlecol">
            <div className="ns-detail__title">Finish wall framing — Level 3</div>
            <div className="ns-detail__sub">{project.name} · Overdue 1d · Mike Rodriguez</div>
          </div>
        </div>
        <div className="ns-kb">
          {cols.map(c => (
            <div key={c.name} className="ns-kbcol">
              <div className="ns-kbcol__head">{c.name} <span>{c.count}</span></div>
              {c.items.map((t, i) => (
                <div key={i} className="ns-kbcard">{t}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function FilesModule({ project }) {
  return (
    <>
      <div className="ns-list">
        <div className="ns-list__head">
          <span>Files · {project.initials}</span>
          <span className="ns-list__count">142</span>
        </div>
        <div className="ns-tfilter">
          <span className="ns-tfilter__chip is-active">All</span>
          <span className="ns-tfilter__chip">Drawings</span>
          <span className="ns-tfilter__chip">Photos</span>
          <span className="ns-tfilter__chip">Contracts</span>
        </div>
        <div className="ns-list__items">
          {[
            { n: 'Drawings', sub: '34 files · updated 2h ago', folder: true },
            { n: 'Site Photos / Level 3', sub: '18 files · Mike R.', folder: true },
            { n: 'Contracts', sub: '6 files · Sarah C.', folder: true },
            { n: 'L3-framing-plan-v4.pdf', sub: 'PDF · 4.2 MB · 30m ago' },
            { n: 'IMG_2456.jpg', sub: 'Photo · Mike R. · 1h ago' },
            { n: 'lumber-quote-timberpro.pdf', sub: 'PDF · David K. · 2h ago' },
          ].map((f, i) => (
            <div key={i} className={'ns-file' + (i === 3 ? ' is-sel' : '')}>
              <div className="ns-file__icon">{f.folder ? '▣' : '◳'}</div>
              <div className="ns-file__body">
                <div className="ns-file__name">{f.n}</div>
                <div className="ns-file__sub">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ns-detail">
        <div className="ns-detail__head">
          <div className="ns-detail__icon" style={{ '--h': 245 }}><NI.files size={16}/></div>
          <div className="ns-detail__titlecol">
            <div className="ns-detail__title">L3-framing-plan-v4.pdf</div>
            <div className="ns-detail__sub">{project.name} · Drawings · 4.2 MB</div>
          </div>
        </div>
        <div className="ns-doc">
          <div className="ns-doc__page">
            <div className="ns-doc__skeleton" style={{width:'45%'}}/>
            <div className="ns-doc__skeleton" style={{width:'78%'}}/>
            <div className="ns-doc__skeleton" style={{width:'62%'}}/>
            <div className="ns-doc__skeleton" style={{width:'90%', height:120}}/>
            <div className="ns-doc__skeleton" style={{width:'70%'}}/>
            <div className="ns-doc__skeleton" style={{width:'55%'}}/>
            <div className="ns-doc__skeleton" style={{width:'80%', height:80}}/>
          </div>
        </div>
      </div>
    </>
  );
}

function ProcurementModule({ project }) {
  return (
    <>
      <div className="ns-list">
        <div className="ns-list__head">
          <span>Orders · {project.initials}</span>
          <span className="ns-list__count">7</span>
        </div>
        <div className="ns-tfilter">
          <span className="ns-tfilter__chip is-active">All</span>
          <span className="ns-tfilter__chip">Pending · 3</span>
          <span className="ns-tfilter__chip">Approved</span>
        </div>
        <div className="ns-list__items">
          {[
            { n: 'Lighting fixtures', sub: '3 quotes · waiting approval', amt: '$24,800', warn: true },
            { n: 'Steel beams (W12×26)', sub: 'Quote pending · 1 vendor', amt: '$112k' },
            { n: 'HVAC unit', sub: 'Approval needed', amt: '$48k', warn: true },
            { n: 'Lumber resupply', sub: 'Ordered · ETA Friday', amt: '$8,200' },
          ].map((p, i) => (
            <div key={i} className={'ns-po' + (i === 0 ? ' is-sel' : '')}>
              <div className="ns-po__icon"><NI.procure size={13}/></div>
              <div className="ns-po__body">
                <div className="ns-po__top">
                  <span className="ns-po__name">{p.n}</span>
                  <span className="ns-po__amt">{p.amt}</span>
                </div>
                <div className={'ns-po__sub' + (p.warn ? ' is-warn' : '')}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ns-detail">
        <div className="ns-detail__head">
          <div className="ns-detail__icon" style={{ '--h': 35 }}><NI.procure size={16}/></div>
          <div className="ns-detail__titlecol">
            <div className="ns-detail__title">Lighting fixtures — 3 quotes</div>
            <div className="ns-detail__sub">{project.name} · Waiting approval · $24,800</div>
          </div>
        </div>
        <div className="ns-quotes">
          {['Lithonia Lighting', 'Acuity Brands', 'Cree Lighting'].map((v, i) => (
            <div key={v} className={'ns-quote' + (i === 1 ? ' is-best' : '')}>
              <div className="ns-quote__head">
                <span>{v}</span>
                {i === 1 && <span className="ns-quote__pill">Best price</span>}
              </div>
              <div className="ns-quote__amt">${[26400, 24800, 27200][i].toLocaleString()}</div>
              <div className="ns-quote__sub">{['8 wk lead', '4 wk lead', '6 wk lead'][i]} · Warranty {[5,5,7][i]}y</div>
              <div className="ns-quote__btn">{i === 1 ? 'Approve →' : 'Review'}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TeamModule() {
  const people = [
    { i: 'SC', n: 'Sarah Chen',     r: 'Project Manager',     h: 220, on: 'online' },
    { i: 'MR', n: 'Mike Rodriguez', r: 'Site Superintendent', h: 25,  on: 'online' },
    { i: 'DK', n: 'David Kim',      r: 'Procurement Lead',    h: 145, on: 'away' },
    { i: 'EJ', n: 'Emily Johnson',  r: 'Architect',           h: 290, on: 'online' },
    { i: 'JW', n: 'James Wilson',   r: 'Structural Engineer', h: 200, on: 'off' },
    { i: 'LP', n: 'Lisa Park',      r: 'MEP Coordinator',     h: 340, on: 'online' },
    { i: 'CR', n: 'Carlos Rivera',  r: 'General Contractor',  h: 50,  on: 'off' },
    { i: 'AT', n: 'Anna Torres',    r: 'Interior Designer',   h: 320, on: 'away' },
  ];
  return (
    <>
      <div className="ns-list">
        <div className="ns-list__head">
          <span>Team</span>
          <span className="ns-list__count">28</span>
        </div>
        <div className="ns-tfilter">
          <span className="ns-tfilter__chip is-active">All</span>
          <span className="ns-tfilter__chip">My projects</span>
          <span className="ns-tfilter__chip">Online · 12</span>
        </div>
        <div className="ns-list__items">
          {people.map((p, i) => (
            <div key={p.i} className={'ns-person' + (i === 0 ? ' is-sel' : '')}>
              <div className="ns-person__av" style={{ background: `oklch(0.42 0.06 ${p.h})`, color: `oklch(0.96 0.02 ${p.h})` }}>
                {p.i}
                <span className={'ns-person__dot ns-person__dot--' + p.on} />
              </div>
              <div className="ns-person__body">
                <div className="ns-person__name">{p.n}</div>
                <div className="ns-person__role">{p.r}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ns-detail">
        <div className="ns-detail__head">
          <div className="ns-detail__icon" style={{ '--h': 220 }}><NI.team size={16}/></div>
          <div className="ns-detail__titlecol">
            <div className="ns-detail__title">Sarah Chen</div>
            <div className="ns-detail__sub">Project Manager · Online</div>
          </div>
        </div>
        <div className="ns-profile">
          <div className="ns-profile__hero">
            <div className="ns-profile__av" style={{ background: 'oklch(0.42 0.06 220)' }}>SC</div>
            <div className="ns-profile__name">Sarah Chen</div>
            <div className="ns-profile__role">Project Manager · Mecca Construction</div>
          </div>
          <div className="ns-profile__section">
            <div className="ns-profile__lbl">Active on</div>
            <div className="ns-profile__chips">
              <span className="ns-pchip">MH HQ Renovation</span>
              <span className="ns-pchip">Downtown Retail</span>
              <span className="ns-pchip">Bayfront Hotel</span>
              <span className="ns-pchip">+2 more</span>
            </div>
          </div>
          <div className="ns-profile__section">
            <div className="ns-profile__lbl">Open with Sarah</div>
            <div className="ns-profile__row">5 tasks · 2 unread messages · 1 pending approval</div>
          </div>
        </div>
      </div>
    </>
  );
}

function ModuleContent({ moduleId, project }) {
  switch (moduleId) {
    case 'chat':    return <ChatModule project={project}/>;
    case 'tasks':   return <TasksModule project={project}/>;
    case 'files':   return <FilesModule project={project}/>;
    case 'procure': return <ProcurementModule project={project}/>;
    case 'team':    return <TeamModule/>;
    default:        return null;
  }
}

// ── Shell A: Module top bar + project rail (RECOMMENDED) ────────────────────
function ShellTopBar({ moduleId, selectedProjectId }) {
  const project = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];
  const isGlobal = moduleId === 'team';
  return (
    <div className="ns-shell ns-shell--top">
      <header className="ns-top">
        <div className="ns-top__left">
          <Brand />
          <div className="ns-top__divider"/>
          {[...MODULES, ...GLOBAL_MODULES].map(m => (
            <ModuleTab key={m.id} m={m} active={m.id === moduleId} />
          ))}
        </div>
        <div className="ns-top__right">
          <SearchBar />
          <button className="ns-iconbtn"><NI.bell size={15}/></button>
          <UserChip/>
        </div>
      </header>
      <div className="ns-body ns-body--3col">
        <aside className={'ns-prail' + (isGlobal ? ' is-dim' : '')}>
          <div className="ns-prail__head">
            <span>{isGlobal ? 'Filter by project' : 'Projects'}</span>
            <button className="ns-iconbtn ns-iconbtn--sm"><NI.plus size={13}/></button>
          </div>
          <div className="ns-prail__group">
            <div className="ns-prail__grouplbl">Critical · 3</div>
            {PROJECTS.filter(p => p.prio === 'crit').map(p => (
              <ProjectRow key={p.id} p={p} selected={!isGlobal && p.id === project.id} />
            ))}
          </div>
          <div className="ns-prail__group">
            <div className="ns-prail__grouplbl">Active · 3</div>
            {PROJECTS.filter(p => p.prio === 'high').map(p => (
              <ProjectRow key={p.id} p={p} selected={!isGlobal && p.id === project.id} />
            ))}
          </div>
          <div className="ns-prail__group">
            <div className="ns-prail__grouplbl">Quiet · 1</div>
            {PROJECTS.filter(p => p.prio === 'norm').map(p => (
              <ProjectRow key={p.id} p={p} selected={!isGlobal && p.id === project.id} />
            ))}
          </div>
        </aside>
        <main className="ns-main">
          <ModuleContent moduleId={moduleId} project={project} />
        </main>
      </div>
    </div>
  );
}

// ── Shell B: Twin rail (Slack-style icon rail + project rail) ───────────────
function ShellTwinRail({ moduleId, selectedProjectId }) {
  const project = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];
  const isGlobal = moduleId === 'team';
  return (
    <div className="ns-shell ns-shell--twin">
      <aside className="ns-mrail">
        <div className="ns-brand__mark ns-brand__mark--sm">M</div>
        <div className="ns-mrail__divider"/>
        {MODULES.map(m => {
          const Glyph = m.icon;
          return (
            <button key={m.id} className={'ns-mtab' + (m.id === moduleId ? ' is-active' : '')}>
              <Glyph size={18}/>
              {m.count > 0 && <span className="ns-mtab__badge">{m.count}</span>}
              <span className="ns-mtab__label">{m.label}</span>
            </button>
          );
        })}
        <div className="ns-mrail__spacer"/>
        {GLOBAL_MODULES.map(m => {
          const Glyph = m.icon;
          return (
            <button key={m.id} className={'ns-mtab' + (m.id === moduleId ? ' is-active' : '')}>
              <Glyph size={18}/>
              <span className="ns-mtab__label">{m.label}</span>
            </button>
          );
        })}
        <div className="ns-mrail__foot">
          <UserChip/>
        </div>
      </aside>
      <aside className={'ns-prail' + (isGlobal ? ' is-dim' : '')}>
        <div className="ns-prail__head">
          <span>{isGlobal ? 'Filter by project' : MODULES.find(m => m.id === moduleId)?.label || 'Projects'}</span>
          <SearchBar wide placeholder="Search…" />
        </div>
        {PROJECTS.map(p => (
          <ProjectRow key={p.id} p={p} selected={!isGlobal && p.id === project.id} dense />
        ))}
      </aside>
      <main className="ns-main">
        <ModuleContent moduleId={moduleId} project={project} />
      </main>
    </div>
  );
}

// ── Shell C: Expandable project rail (project-first, modules nested) ────────
function ShellExpandable({ moduleId, selectedProjectId }) {
  const project = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];
  const isGlobal = moduleId === 'team';
  return (
    <div className="ns-shell ns-shell--exp">
      <aside className="ns-xrail">
        <div className="ns-xrail__brand">
          <Brand />
          <button className="ns-iconbtn"><NI.plus size={14}/></button>
        </div>
        <SearchBar wide placeholder="Search Mecca…" />
        <div className="ns-xrail__sec">Pinned</div>
        {PROJECTS.slice(0, 5).map(p => {
          const isOpen = p.id === project.id && !isGlobal;
          return (
            <div key={p.id} className={'ns-xproj' + (isOpen ? ' is-open' : '')}>
              <button className="ns-xproj__row">
                <NI.chev size={12} className="ns-xproj__chev"/>
                <ProjectBubble p={p} size={22} />
                <span className="ns-xproj__name">{p.name}</span>
                {p.unread > 0 && <span className="ns-xproj__unread">{p.unread}</span>}
              </button>
              {isOpen && (
                <div className="ns-xproj__mods">
                  {MODULES.map(m => {
                    const Glyph = m.icon;
                    return (
                      <button key={m.id} className={'ns-xmod' + (m.id === moduleId ? ' is-active' : '')}>
                        <Glyph size={13}/>
                        <span>{m.label}</span>
                        {m.count > 0 && <span className="ns-xmod__count">{m.count}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div className="ns-xrail__divider"/>
        <div className="ns-xrail__sec">Workspace</div>
        {GLOBAL_MODULES.map(m => {
          const Glyph = m.icon;
          return (
            <button key={m.id} className={'ns-xglobal' + (m.id === moduleId ? ' is-active' : '')}>
              <Glyph size={14}/>
              <span>{m.label}</span>
            </button>
          );
        })}
        <button className="ns-xglobal">
          <NI.inbox size={14}/>
          <span>All Inbox</span>
          <span className="ns-xmod__count">12</span>
        </button>
        <div className="ns-xrail__foot">
          <UserChip/>
          <span className="ns-xrail__name">You · PM</span>
        </div>
      </aside>
      <main className="ns-main">
        <ModuleContent moduleId={moduleId} project={project} />
      </main>
    </div>
  );
}

// ── Shell D: Breadcrumb workspace bar + cmd-K (Linear-ish) ──────────────────
function ShellWorkspace({ moduleId, selectedProjectId }) {
  const project = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];
  const isGlobal = moduleId === 'team';
  const activeMod = MODULES.find(m => m.id === moduleId) || GLOBAL_MODULES.find(m => m.id === moduleId);
  return (
    <div className="ns-shell ns-shell--ws">
      <header className="ns-wsbar">
        <div className="ns-wsbar__crumbs">
          <Brand size={22} />
          <span className="ns-wsbar__sep">/</span>
          {!isGlobal && (
            <>
              <button className="ns-wsbar__crumb">
                <ProjectBubble p={project} size={20} />
                <span>{project.name}</span>
                <NI.chev size={11}/>
              </button>
              <span className="ns-wsbar__sep">/</span>
            </>
          )}
          <span className="ns-wsbar__current">{activeMod?.label}</span>
        </div>
        <div className="ns-wsbar__center">
          {!isGlobal && MODULES.map(m => (
            <button key={m.id} className={'ns-wschip' + (m.id === moduleId ? ' is-active' : '')}>
              {React.createElement(m.icon, { size: 13 })}
              <span>{m.label}</span>
            </button>
          ))}
        </div>
        <div className="ns-wsbar__right">
          <SearchBar />
          <UserChip/>
        </div>
      </header>
      <div className="ns-body ns-body--ws">
        <aside className="ns-wsrail">
          <div className="ns-wsrail__sec">Pinned</div>
          {PROJECTS.slice(0, 4).map(p => (
            <button key={p.id} className={'ns-wspin' + (!isGlobal && p.id === project.id ? ' is-active' : '')} title={p.name}>
              <ProjectBubble p={p} size={32} selected={!isGlobal && p.id === project.id} showInitials/>
            </button>
          ))}
          <div className="ns-wsrail__divider"/>
          <button className="ns-wspin ns-wspin--more">
            <div className="ns-wspin__more">+3</div>
          </button>
          <button className="ns-wspin ns-wspin--cmd" title="Switch project (⌘P)">
            <NI.search size={14}/>
          </button>
          <div className="ns-wsrail__spacer"/>
          {GLOBAL_MODULES.map(m => {
            const Glyph = m.icon;
            return (
              <button key={m.id} className={'ns-wspin' + (m.id === moduleId ? ' is-active' : '')} title={m.label}>
                <Glyph size={16}/>
              </button>
            );
          })}
        </aside>
        <main className="ns-main">
          <ModuleContent moduleId={moduleId} project={project} />
        </main>
      </div>
    </div>
  );
}

window.NavShells = { ShellTopBar, ShellTwinRail, ShellExpandable, ShellWorkspace };
