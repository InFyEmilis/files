// Details drawer (right-side panel) + Members popover.
// One drawer with type-specific entity card on top, then Members,
// Notifications, and a Danger Zone. Members popover is a lightweight
// roster anchored to the chat header's stacked avatars.

const { useState: _ds, useEffect: _de, useRef: _dr, useMemo: _dm } = React;
const _DD2 = window.MeccaData;
const _MC2 = window.MC;
const _I2 = _MC2.I;
const _TC2 = _MC2.TYPE_CFG;

// ── Tiny primitives ───────────────────────────────────────────────────────

function StatusPill({ tone = 'neutral', children, icon }) {
  return (
    <span className={'mc-det__pill mc-det__pill--' + tone}>
      {icon}<span>{children}</span>
    </span>
  );
}

// One row of metadata: label on the left, value on the right (or a custom
// render). Used everywhere in the entity card.
function Field({ label, value, mono }) {
  return (
    <div className="mc-det__field">
      <span className="mc-det__field-label">{label}</span>
      <span className={'mc-det__field-value' + (mono ? ' is-mono' : '')}>{value}</span>
    </div>
  );
}

function Section({ title, count, action, children }) {
  return (
    <section className="mc-det__section">
      <header className="mc-det__sec-head">
        <span className="mc-det__sec-title">
          {title}
          {count != null && <span className="mc-det__sec-count">{count}</span>}
        </span>
        {action}
      </header>
      <div className="mc-det__sec-body">{children}</div>
    </section>
  );
}

// Faux presence dot — deterministic from a name so the same person
// renders consistently across the popover and drawer.
function presenceFor(name) {
  const h = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return ['online', 'online', 'away', 'offline'][h % 4];
}

function PresenceDot({ state }) {
  return <span className={'mc-det__presence mc-det__presence--' + state} title={state} />;
}

// ── Entity cards ──────────────────────────────────────────────────────────
// Each card renders the "About" content unique to a chat type. The mock
// fields below (address, contract value, supplier, etc.) are synthesized
// deterministically from the conv/project id so reloads show the same
// numbers — no need to plumb new data through data.js.

function pickFrom(seedStr, list) {
  const h = [...seedStr].reduce((s, c) => s + c.charCodeAt(0), 0);
  return list[h % list.length];
}

function ProjectAboutCard({ project }) {
  if (!project) return null;
  const phases = ['Foundation', 'Framing', 'MEP rough-in', 'Drywall', 'Finishes', 'Punch list'];
  const phase = pickFrom(project.id + 'phase', phases);
  const pct = 25 + ([...project.id].reduce((s, c) => s + c.charCodeAt(0), 0) % 60);
  const value = pickFrom(project.id + 'v', ['$1.2M', '$2.4M', '$3.8M', '$5.1M', '$840K']);
  const addr = pickFrom(project.id + 'a', [
    '1240 NW 12th Ave, Miami FL',
    '88 SE 1st Street, Miami FL',
    '5500 Biscayne Blvd, Miami FL',
    '7110 Collins Ave, Miami Beach FL',
  ]);
  const scheduleTone = project.overdueTasks > 0 ? 'danger' : project.dueTodayTasks > 0 ? 'warn' : 'ok';
  const scheduleText = project.overdueTasks > 0
    ? `${project.overdueTasks} overdue`
    : project.dueTodayTasks > 0 ? `${project.dueTodayTasks} due today` : 'On schedule';

  return (
    <div className="mc-det__about">
      <div className="mc-det__hero">
        <div className="mc-det__hero-chip" style={{ background: project.color + '22', color: project.color }}>
          {project.initials}
        </div>
        <div className="mc-det__hero-text">
          <h2>{project.name}</h2>
          <p>{phase} · {pct}% complete</p>
        </div>
      </div>

      <div className="mc-det__progress" title={`${pct}% complete`}>
        <span style={{ width: pct + '%' }} />
      </div>

      <div className="mc-det__pills">
        <StatusPill tone={scheduleTone}>{scheduleText}</StatusPill>
        {project.hasBlocker && <StatusPill tone="danger">Blocker</StatusPill>}
        {project.hasWaitingApproval && <StatusPill tone="warn">Approval pending</StatusPill>}
        {project.hasSiteIssue && <StatusPill tone="danger">Site issue</StatusPill>}
      </div>

      <div className="mc-det__fields">
        <Field label="Manager" value={project.manager} />
        <Field label="Address" value={addr} />
        <Field label="Phase" value={phase} />
        <Field label="Contract value" value={value} mono />
        <Field label="Open tasks" value={project.overdueTasks + project.dueTodayTasks + 8} mono />
      </div>
    </div>
  );
}

function TaskAboutCard({ conv, project }) {
  const statusMap = {
    'in-progress': { tone: 'info',  label: 'In progress' },
    'on-hold':     { tone: 'warn',  label: 'On hold' },
    'blocked':     { tone: 'danger', label: 'Blocked' },
    'complete':    { tone: 'ok',    label: 'Complete' },
  };
  const s = statusMap[conv.status] || statusMap['in-progress'];
  const assignee = conv.participants.find(p => conv.lastSender?.startsWith(p.name.split(' ')[0])) || conv.participants[0];
  const overdue = (conv.subtitle || '').toLowerCase().includes('overdue');
  const dueLabel = (conv.subtitle || '').split('·')[0].trim() || 'No due date';

  return (
    <div className="mc-det__about">
      <div className="mc-det__hero">
        <div className="mc-det__hero-icon" style={{ '--h': _TC2.task.hue }}>
          <_TC2.task.Glyph size={18} stroke={1.8} />
        </div>
        <div className="mc-det__hero-text">
          <h2>{conv.title}</h2>
          {project && <p>{project.name}</p>}
        </div>
      </div>

      <div className="mc-det__pills">
        <StatusPill tone={s.tone}>{s.label}</StatusPill>
        <StatusPill tone={overdue ? 'danger' : 'neutral'}>
          {overdue ? <_I2.alert size={11} stroke={2.4} /> : <_I2.check size={11} stroke={2.4} />}
          {dueLabel}
        </StatusPill>
      </div>

      <div className="mc-det__fields">
        <Field label="Assignee" value={
          <span className="mc-det__person">
            <_MC2.Avatar p={assignee} size={20} /><span>{assignee.name}</span>
          </span>
        } />
        <Field label="Project" value={project?.name || '—'} />
        <Field label="Created" value={_DD2.fmtDay(conv.timestamp)} />
        <Field label="Updated" value={_DD2.fmtRelative(conv.timestamp) + ' ago'} />
      </div>
    </div>
  );
}

function ProcurementAboutCard({ conv, project }) {
  const statusMap = {
    'pending':           { tone: 'warn', label: 'Quoting' },
    'waiting-approval':  { tone: 'warn', label: 'Awaiting approval' },
    'approved':          { tone: 'info', label: 'Approved' },
    'ordered':           { tone: 'info', label: 'Ordered' },
    'delivered':         { tone: 'ok',   label: 'Delivered' },
  };
  const s = statusMap[conv.status] || statusMap['pending'];
  const supplier = pickFrom(conv.id + 's', ['BrightSpec', 'Lumina Co.', 'ElectroSupply', 'Timber Pro', 'Atlantic Steel']);
  const total = pickFrom(conv.id + 't', ['$12,400', '$42,800', '$8,150', '$94,200', '$3,750']);
  const eta = pickFrom(conv.id + 'd', ['In 3 weeks', 'In 6 weeks', 'In 2 weeks', 'Awaiting selection']);

  return (
    <div className="mc-det__about">
      <div className="mc-det__hero">
        <div className="mc-det__hero-icon" style={{ '--h': _TC2.procurement.hue }}>
          <_TC2.procurement.Glyph size={18} stroke={1.8} />
        </div>
        <div className="mc-det__hero-text">
          <h2>{conv.title}</h2>
          {project && <p>{project.name}</p>}
        </div>
      </div>

      <div className="mc-det__pills">
        <StatusPill tone={s.tone}>{s.label}</StatusPill>
      </div>

      <div className="mc-det__fields">
        <Field label="Supplier" value={supplier} />
        <Field label="Quote total" value={total} mono />
        <Field label="Expected" value={eta} />
        <Field label="Lead" value={
          <span className="mc-det__person">
            <_MC2.Avatar p={conv.participants[0]} size={20} /><span>{conv.participants[0].name}</span>
          </span>
        } />
      </div>
    </div>
  );
}

function SiteIssueAboutCard({ conv, project }) {
  const sev = conv.priorityLevel === 'p1' ? { tone: 'danger', label: 'Critical' }
            : conv.priorityLevel === 'p2' ? { tone: 'warn',   label: 'High'     }
            :                                { tone: 'info',   label: 'Medium'   };
  const statusMap = {
    'open':      { tone: 'warn',   label: 'Open' },
    'escalated': { tone: 'danger', label: 'Escalated' },
    'resolved':  { tone: 'ok',     label: 'Resolved' },
  };
  const st = statusMap[conv.status] || statusMap['open'];
  const location = pickFrom(conv.id + 'l', [
    'Level 1 — Storage wall',
    'Roof — North quadrant',
    'Basement — Pump room',
    'Level 3 — East elevation',
    'Site exterior — Drainage',
  ]);
  const openedBy = conv.participants[0];
  const issueCfg = _TC2['site-issue'];
  const IssueGlyph = issueCfg.Glyph;

  return (
    <div className="mc-det__about">
      <div className="mc-det__hero">
        <div className="mc-det__hero-icon" style={{ '--h': issueCfg.hue }}>
          <IssueGlyph size={18} stroke={1.8} />
        </div>
        <div className="mc-det__hero-text">
          <h2>{conv.title}</h2>
          {project && <p>{project.name}</p>}
        </div>
      </div>

      <div className="mc-det__pills">
        <StatusPill tone={sev.tone}>{sev.label}</StatusPill>
        <StatusPill tone={st.tone}>{st.label}</StatusPill>
      </div>

      <div className="mc-det__fields">
        <Field label="Location" value={location} />
        <Field label="Opened by" value={
          <span className="mc-det__person">
            <_MC2.Avatar p={openedBy} size={20} /><span>{openedBy.name}</span>
          </span>
        } />
        <Field label="Opened" value={_DD2.fmtDay(conv.timestamp) + ' · ' + _DD2.fmtRelative(conv.timestamp) + ' ago'} />
      </div>
    </div>
  );
}

function DirectAboutCard({ conv }) {
  const p = conv.participants[0];
  if (!p) return null;
  const phone = pickFrom(p.name + 'p', ['(305) 555-0142', '(786) 555-0119', '(305) 555-0203', '(786) 555-0488']);
  const email = (p.name.toLowerCase().replace(' ', '.')) + '@mecca.co';
  const presence = presenceFor(p.name);

  return (
    <div className="mc-det__about">
      <div className="mc-det__hero mc-det__hero--direct">
        <div className="mc-det__hero-avatar">
          <_MC2.Avatar p={p} size={56} />
          <PresenceDot state={presence} />
        </div>
        <div className="mc-det__hero-text">
          <h2>{p.name}</h2>
          <p>{p.role}</p>
        </div>
      </div>

      <div className="mc-det__quickrow">
        <button className="mc-det__quickbtn"><_I2.phone size={13} /><span>Call</span></button>
        <button className="mc-det__quickbtn"><_I2.video size={13} /><span>Video</span></button>
        <button className="mc-det__quickbtn"><_I2.msg size={13} /><span>Message</span></button>
      </div>

      <div className="mc-det__fields">
        <Field label="Phone" value={phone} mono />
        <Field label="Email" value={email} mono />
        <Field label="Status" value={presence === 'online' ? 'Online now' : presence === 'away' ? 'Away' : 'Offline'} />
      </div>
    </div>
  );
}

function ChatAboutCard({ conv }) {
  const cfg = _TC2[conv.type] || _TC2.project;
  const Glyph = cfg.Glyph;
  const context = conv.subtitle || conv.status || '';
  const memberCount = conv.participants.filter(p => p.name !== 'You').length + 1;

  return (
    <div className="mc-det__about">
      <div className="mc-det__hero">
        {conv.type === 'direct' && conv.participants[0] ? (
          <div className="mc-det__hero-avatar">
            <_MC2.Avatar p={conv.participants[0]} size={48} />
            <PresenceDot state={presenceFor(conv.participants[0].name)} />
          </div>
        ) : (
          <div className="mc-det__hero-icon" style={{ '--h': cfg.hue }}>
            <Glyph size={18} stroke={1.8} />
          </div>
        )}
        <div className="mc-det__hero-text">
          <h2>{conv.title}</h2>
          <p>{cfg.name || cfg.label}</p>
        </div>
      </div>

      <div className="mc-det__fields">
        <Field label="Chat type" value={cfg.name || cfg.label} />
        {context && <Field label="Context" value={context} />}
        <Field label="Members" value={memberCount} mono />
      </div>
    </div>
  );
}

function SharedResourcesSection({ conv }) {
  const [active, setActive] = _ds('media');
  const seed = [...conv.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const media = 3 + (seed % 3);
  const files = 2 + (seed % 4);
  const links = seed % 3;
  const resources = [
    {
      id: 'media',
      label: 'Media',
      count: media,
      countLabel: media ? `${media} items` : 'None yet',
      Icon: _I2.video,
      items: Array.from({ length: media }, (_, i) => ({
        title: ['Site photo', 'Progress clip', 'Markup image', 'Delivery photo'][i % 4],
        meta: `${i + 1}d ago`
      }))
    },
    {
      id: 'files',
      label: 'Files',
      count: files,
      countLabel: `${files} files`,
      Icon: _I2.paper,
      items: Array.from({ length: Math.min(files, 4) }, (_, i) => ({
        title: ['Updated quote.pdf', 'Framing plan.pdf', 'Site notes.docx', 'Schedule export.xlsx'][i % 4],
        meta: `${i + 2}d ago`
      }))
    },
    {
      id: 'links',
      label: 'Links',
      count: links,
      countLabel: links ? `${links} links` : 'None yet',
      Icon: _I2.link,
      items: Array.from({ length: links }, (_, i) => ({
        title: ['Vendor portal', 'Shared folder', 'Inspection reference'][i % 3],
        meta: `${i + 3}d ago`
      }))
    },
  ];
  const activeResource = resources.find(r => r.id === active) || resources[0];

  return (
    <Section title="Shared">
      <div className="mc-det__shared">
        <div className="mc-det__shared-list">
          {resources.map(r => (
            <button
              key={r.id}
              className={'mc-det__shared-row' + (active === r.id ? ' is-active' : '')}
              onClick={() => setActive(r.id)}
              type="button"
              aria-label={`Open shared ${r.label.toLowerCase()}: ${r.countLabel}`}
            >
              <span className="mc-det__shared-icon"><r.Icon size={14} stroke={1.9} /></span>
              <span className="mc-det__shared-label">{r.label}</span>
              <span className="mc-det__shared-count">{r.countLabel}</span>
              <_I2.panelR size={12} />
            </button>
          ))}
        </div>

        <div className="mc-det__shared-preview" aria-live="polite">
          {activeResource.items.length ? (
            activeResource.items.map((item, i) => (
              <button key={i} className="mc-det__shared-item" type="button">
                <span className="mc-det__shared-thumb">
                  <activeResource.Icon size={13} stroke={1.9} />
                </span>
                <span className="mc-det__shared-item-text">
                  <span className="mc-det__shared-item-title">{item.title}</span>
                  <span className="mc-det__shared-item-meta">{item.meta}</span>
                </span>
              </button>
            ))
          ) : (
            <div className="mc-det__shared-empty">No shared {activeResource.label.toLowerCase()} yet</div>
          )}
        </div>
      </div>
    </Section>
  );
}

// ── Member row (used in drawer + popover) ────────────────────────────────

function MemberRow({ person, isYou, compact, onOpenProfile, onMessage }) {
  const presence = presenceFor(person.name);
  const interactive = !isYou && onOpenProfile;
  const Wrap = interactive ? 'button' : 'div';
  return (
    <Wrap
      className={'mc-det__member' + (compact ? ' is-compact' : '') + (interactive ? ' is-interactive' : '')}
      onClick={interactive ? () => onOpenProfile(person) : undefined}
      type={interactive ? 'button' : undefined}
    >
      <div className="mc-det__member-avatar">
        <_MC2.Avatar p={person} size={compact ? 28 : 32} />
        <PresenceDot state={presence} />
      </div>
      <div className="mc-det__member-text">
        <span className="mc-det__member-name">
          {person.name}
          {isYou && <span className="mc-det__member-you">you</span>}
        </span>
        <span className="mc-det__member-role">{person.role}</span>
      </div>
      {!compact && !isYou && (
        <div className="mc-det__member-actions">
          <button
            className="mc-iconbtn"
            title={'Message ' + person.name.split(' ')[0]}
            onClick={(e) => { e.stopPropagation(); onMessage && onMessage(person); }}
          >
            <_I2.msg size={13} />
          </button>
          <button
            className="mc-iconbtn"
            title="Call"
            onClick={(e) => e.stopPropagation()}
          >
            <_I2.phone size={13} />
          </button>
        </div>
      )}
    </Wrap>
  );
}

// ── Member profile sheet (replaces drawer body when a member is opened) ──
// Shows rich info about a person: contact, trade/cert, projects they share
// with you, and the last few messages they sent in this chat. Footer CTAs
// route back through onMessage/onCall/onEmail.

function MemberProfile({ person, conv, onBack, onMessage }) {
  if (!person) return null;
  const presence = presenceFor(person.name);
  const phone = pickFrom(person.name + 'p', ['(305) 555-0142', '(786) 555-0119', '(305) 555-0203', '(786) 555-0488', '(305) 555-0317']);
  const email = person.name.toLowerCase().replace(' ', '.') + '@mecca.co';
  const company = pickFrom(person.name + 'co', [
    'Mecca Construction',
    'Atlantic Builders Co.',
    'Cardinal Trades LLC',
    'Sunfield Engineering',
    'Coastal MEP',
    'Northstar Architecture',
  ]);
  const trade = pickFrom(person.name + 'tr', [
    'Licensed General Contractor · OSHA 30',
    'PE Licensed Structural · 12 yrs',
    'NCARB Architect · LEED AP',
    'Master Electrician · OSHA 10',
    'Procurement & Logistics',
    'Project Management · PMP',
  ]);
  const zone = pickFrom(person.name + 'z', ['On site — Level 3', 'Office — Brickell', 'Field — Multiple sites', 'Remote']);

  // Projects they share with the active user: walk all CONVERSATIONS, find
  // ones where this person appears in participants, collect unique project
  // IDs, then look up project metadata.
  const sharedProjects = _dm(() => {
    const ids = new Set();
    for (const c of _DD2.CONVERSATIONS) {
      if (!c.projectId) continue;
      if (c.participants.some(pp => pp.name === person.name)) ids.add(c.projectId);
    }
    return _DD2.PRIORITY_PROJECTS.filter(p => ids.has(p.id));
  }, [person.name]);

  // Recent messages from this person in the current chat (last 3).
  const recentMsgs = _dm(() => {
    if (!conv) return [];
    return _DD2.getMessages(conv.id)
      .filter(m => m.sender?.name === person.name)
      .slice(-3)
      .reverse();
  }, [person.name, conv?.id]);

  return (
    <div className="mc-det__profile">
      {/* Hero */}
      <div className="mc-det__prof-hero">
        <div className="mc-det__prof-avatar">
          <_MC2.Avatar p={person} size={72} />
          <PresenceDot state={presence} />
        </div>
        <h2 className="mc-det__prof-name">{person.name}</h2>
        <p className="mc-det__prof-role">{person.role}</p>
        <p className="mc-det__prof-company">{company}</p>
        <span className={'mc-det__prof-status mc-det__prof-status--' + presence}>
          {presence === 'online' ? 'Online now' : presence === 'away' ? 'Away' : 'Offline'}
          <span className="mc-det__prof-dot"> · </span>
          {zone}
        </span>
      </div>

      {/* Quick action row */}
      <div className="mc-det__quickrow">
        <button className="mc-det__quickbtn mc-det__quickbtn--primary" onClick={() => onMessage && onMessage(person)}>
          <_I2.msg size={13} /><span>Message</span>
        </button>
        <button className="mc-det__quickbtn">
          <_I2.phone size={13} /><span>Call</span>
        </button>
        <button className="mc-det__quickbtn">
          <_I2.paper size={13} /><span>Email</span>
        </button>
      </div>

      {/* Contact + credentials */}
      <Section title="Contact">
        <div className="mc-det__fields">
          <Field label="Phone" value={phone} mono />
          <Field label="Email" value={email} mono />
          <Field label="Location" value={zone} />
          <Field label="Credentials" value={trade} />
        </div>
      </Section>

      {/* Shared projects */}
      {sharedProjects.length > 0 && (
        <Section title="Shared projects" count={sharedProjects.length}>
          <div className="mc-det__projects">
            {sharedProjects.map(p => (
              <div key={p.id} className="mc-det__proj">
                <div className="mc-det__proj-chip" style={{ background: p.color + '22', color: p.color }}>
                  {p.initials}
                </div>
                <div className="mc-det__proj-text">
                  <span className="mc-det__proj-name">{p.name}</span>
                  <span className="mc-det__proj-meta">{p.manager} · {p.priorityReason}</span>
                </div>
                <_I2.panelR size={13} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recent in this chat */}
      {recentMsgs.length > 0 && (
        <Section title={'Recent in this chat'}>
          <div className="mc-det__recents">
            {recentMsgs.map(m => (
              <div key={m.id} className="mc-det__recent">
                <span className="mc-det__recent-time">{_DD2.fmtRelative(m.timestamp)} ago</span>
                <span className="mc-det__recent-text">{m.content}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}



// ── Notifications section ────────────────────────────────────────────────

function NotificationsSection({ value, onChange }) {
  const opts = [
    { id: 'all',      label: 'All messages' },
    { id: 'mentions', label: 'Mentions only' },
    { id: 'muted',    label: 'Muted' },
  ];
  return (
    <div className="mc-det__noti">
      {opts.map(o => (
        <button
          key={o.id}
          className={'mc-det__noti-row' + (value === o.id ? ' is-active' : '')}
          onClick={() => onChange(o.id)}
        >
          <span className={'mc-det__noti-radio' + (value === o.id ? ' is-active' : '')} />
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Danger zone (chat-type aware) ────────────────────────────────────────

function DangerZone({ conv, isArchived, onArchive }) {
  return (
    <div className="mc-det__danger">
      <button className="mc-det__danger-row" onClick={onArchive}>
        <_I2.archive size={13} />
        <span>{isArchived ? 'Unarchive chat' : 'Archive chat'}</span>
      </button>
      <button className="mc-det__danger-row mc-det__danger-row--danger">
        <_I2.reply size={13} />
        <span>Leave chat</span>
      </button>
    </div>
  );
}

// ── Main drawer ──────────────────────────────────────────────────────────

function DetailsDrawer({ conv, isArchived, onArchive, onClose, scrollToMembers, onOpenDM, pendingProfile }) {
  const [noti, setNoti] = _ds('all');
  const [viewingMember, setViewingMember] = _ds(null); // when set, body swaps to profile sheet
  const membersRef = _dr(null);
  const bodyRef = _dr(null);

  // When opened via the Members affordance, scroll the section into view.
  _de(() => {
    if (scrollToMembers && membersRef.current && bodyRef.current && !viewingMember) {
      bodyRef.current.scrollTop = membersRef.current.offsetTop - 8;
    }
  }, [scrollToMembers, conv?.id, viewingMember]);

  // External trigger: when a Members popover row is clicked, the parent
  // bumps `pendingProfile`. Enter the profile view for that person.
  _de(() => {
    if (pendingProfile) setViewingMember(pendingProfile);
  }, [pendingProfile]);

  // Reset profile view when the chat changes — the prior person may not be in
  // this conversation's roster.
  _de(() => { setViewingMember(null); }, [conv?.id]);

  if (!conv) return null;
  const inProfile = !!viewingMember;
  const t = conv.type;
  const card = <ChatAboutCard conv={conv} />;

  const members = conv.participants.filter(p => p.name !== 'You');
  const headTitle = inProfile ? 'Profile' : (t === 'direct' ? 'Profile' : 'Details');

  const handleMessage = (person) => {
    if (onOpenDM) onOpenDM(person.name);
  };

  return (
    <aside className="mc-det" aria-label={headTitle}>
      <header className="mc-det__head">
        {inProfile ? (
          <button className="mc-det__back" onClick={() => setViewingMember(null)} title="Back to details">
            <span className="mc-det__back-arrow" aria-hidden="true">‹</span>
            <span>Details</span>
          </button>
        ) : (
          <span className="mc-det__head-title">{headTitle}</span>
        )}
        <button className="mc-iconbtn" onClick={onClose} title="Close details">
          <_I2.plus size={15} style={{ transform: 'rotate(45deg)' }} />
        </button>
      </header>

      <div className="mc-det__body" ref={bodyRef}>
        {inProfile ? (
          <MemberProfile
            person={viewingMember}
            conv={conv}
            onBack={() => setViewingMember(null)}
            onMessage={handleMessage}
          />
        ) : (
          <>
            {card}

            <div ref={membersRef}>
              <Section
                title="Members"
                count={members.length + 1}
              >
                <div className="mc-det__members">
                  <MemberRow person={_DD2.participants.you} isYou />
                  {members.map(p => (
                    <MemberRow
                      key={p.name}
                      person={p}
                      onOpenProfile={setViewingMember}
                      onMessage={handleMessage}
                    />
                  ))}
                </div>
              </Section>
            </div>

            <SharedResourcesSection conv={conv} />

            <Section title="Notifications">
              <NotificationsSection value={noti} onChange={setNoti} />
            </Section>

            <DangerZone conv={conv} isArchived={isArchived} onArchive={onArchive} />
          </>
        )}
      </div>
    </aside>
  );
}

// ── Members popover ──────────────────────────────────────────────────────
// Anchored under the stacked avatars in the chat header. Click outside or
// press Esc to dismiss. Has a "View all in details" affordance that hands
// control back to the parent so the full drawer opens with members focus.

function MembersPopover({ conv, anchorRef, onClose, onOpenDetails, onOpenMemberProfile }) {
  const popRef = _dr(null);
  const [pos, setPos] = _ds(null);

  _de(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    // Right-align the popover with the anchor; account for viewport edges.
    const width = 280;
    const left = Math.min(window.innerWidth - width - 12, Math.max(12, r.right - width));
    setPos({ top: r.bottom + 6, left });
  }, [anchorRef, conv?.id]);

  _de(() => {
    const onDown = e => {
      if (popRef.current && !popRef.current.contains(e.target) && !anchorRef.current?.contains(e.target)) {
        onClose();
      }
    };
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [anchorRef, onClose]);

  if (!conv || !pos) return null;

  const handleProfile = (person) => {
    onClose();
    if (onOpenMemberProfile) onOpenMemberProfile(person);
  };

  return (
    <div className="mc-det__popover" ref={popRef} style={{ top: pos.top, left: pos.left }}>
      <div className="mc-det__pop-head">
        <span className="mc-det__pop-title">Members</span>
        <span className="mc-det__pop-count">{conv.participants.filter(p => p.name !== 'You').length + 1}</span>
      </div>
      <div className="mc-det__pop-body">
        <MemberRow person={_DD2.participants.you} isYou compact />
        {conv.participants.filter(p => p.name !== 'You').map(p => (
          <MemberRow
            key={p.name}
            person={p}
            compact
            onOpenProfile={handleProfile}
          />
        ))}
      </div>
      <button className="mc-det__pop-foot" onClick={onOpenDetails}>
        <span>View in details</span>
        <_I2.panelR size={12} />
      </button>
    </div>
  );
}

window.MC.DetailsDrawer = DetailsDrawer;
window.MC.MembersPopover = MembersPopover;
// Re-exports so phone-details.jsx can reuse the same building blocks.
Object.assign(window.MC, {
  MemberProfile, ChatAboutCard, SharedResourcesSection,
  ProjectAboutCard, TaskAboutCard, ProcurementAboutCard, SiteIssueAboutCard, DirectAboutCard,
  MemberRow, DetailsSection: Section, NotificationsSection, DangerZone, PresenceDot,
});
