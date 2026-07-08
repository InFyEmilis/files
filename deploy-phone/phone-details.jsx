// Phone-side Details + Profile screens. Reuses the entity cards, members
// list, notifications, danger zone, and member profile component from
// components-details.jsx so behavior stays in lockstep with the desktop
// drawer — only the shell (full-screen vs. drawer) changes.

const { useState: hUseState } = React;
const HD = window.MeccaData;
// Lazy proxies — window.MC may not be fully populated when this script
// evaluates (Babel script order isn't guaranteed).
const HMC = new Proxy({}, { get: (_, k) => window.MC[k] });
const HI = new Proxy({}, { get: (_, k) => (window.MC.I || {})[k] });

const HBack = (p) => (
  <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18 9 12l6-6" />
  </svg>
);

// ── PhoneDetails ──────────────────────────────────────────────────────────
// Full-screen details for the current conversation. Mirrors the desktop
// drawer body 1:1.

function PhoneDetails({ conv, project, isArchived, onArchive, onBack, onOpenProfile }) {
  const [noti, setNoti] = hUseState('all');
  if (!conv) return null;

  const t = conv.type;
  const Section = HMC.DetailsSection;
  const MemberRow = HMC.MemberRow;
  const NotificationsSection = HMC.NotificationsSection;
  const DangerZone = HMC.DangerZone;
  const ChatAboutCard = HMC.ChatAboutCard;
  const displayTitle = window.PhoneChatDisplayTitle
    ? window.PhoneChatDisplayTitle(conv, project)
    : conv.title;
  const displayConv = displayTitle === conv.title ? conv : { ...conv, title: displayTitle };

  const members = [
    HD.participants.you,
    ...conv.participants.filter(p => p.name !== 'You')
  ];

  return (
    <div className="ph ph-det">
      <div className="ph-top">
        <button className="ph-top__back" onClick={onBack} aria-label="Back"><HBack /></button>
        <div className="ph-top__title">
          <h1>{t === 'direct' ? 'Profile' : 'Details'}</h1>
          <div className="ph-top__sub">{displayTitle}</div>
        </div>
      </div>

      <div className="ph-det__body">
        {ChatAboutCard && <ChatAboutCard conv={displayConv} />}

        <PhoneSharedBrowser conv={conv} />

        <Section
          title="Members"
          count={members.length}
        >
          <div className="mc-det__members">
            {members.map(p => (
              MemberRow && <MemberRow
                key={p.name}
                person={p}
                isYou={p.name === 'You'}
                onOpenProfile={onOpenProfile}
              />
            ))}
          </div>
        </Section>

        <Section title="Notifications">
          {NotificationsSection && <NotificationsSection value={noti} onChange={setNoti} />}
        </Section>

        {DangerZone && <DangerZone conv={conv} isArchived={isArchived} onArchive={onArchive} />}
      </div>
    </div>
  );
}

function PhoneSharedBrowser({ conv }) {
  const [active, setActive] = hUseState('media');
  const Section = HMC.DetailsSection;
  if (!Section) return null;
  const seed = [...conv.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const media = Array.from({ length: 6 + (seed % 3) }, (_, i) => ({
    label: ['Site photo', 'Progress clip', 'Markup', 'Delivery', 'Fixture', 'Finish'][i % 6],
    tone: [220, 155, 35, 285, 190, 250][(seed + i) % 6],
  }));
  const docs = Array.from({ length: 3 + (seed % 3) }, (_, i) => ({
    title: ['Quote approval.pdf', 'Framing plan.pdf', 'Site notes.docx', 'Schedule export.xlsx', 'Inspection report.pdf'][i % 5],
    meta: [`${(i + 1) * 620} KB`, `${i + 1}d ago`].join(' · '),
    type: ['pdf', 'pdf', 'doc', 'xls', 'pdf'][i % 5],
  }));
  const links = Array.from({ length: 2 + (seed % 3) }, (_, i) => ({
    title: ['Vendor portal', 'Shared folder', 'Inspection reference', 'Fixture specification'][i % 4],
    meta: ['electrosupply.com', 'drive.mecca.co', 'miamidade.gov', 'lumina.co'][i % 4] + ` · ${i + 2}d ago`,
  }));
  const counts = { media: media.length, docs: docs.length, links: links.length };

  return (
    <Section title="Shared">
      <div className="ph-sharebrowser">
        <div className="ph-sharebrowser__tabs" role="tablist" aria-label="Shared content">
          {[
            ['media', 'Media'],
            ['docs', 'Docs'],
            ['links', 'Links'],
          ].map(([id, label]) => (
            <button
              key={id}
              className={'ph-sharebrowser__tab' + (active === id ? ' is-active' : '')}
              onClick={() => setActive(id)}
              type="button"
              role="tab"
              aria-selected={active === id}
            >
              <span>{label}</span>
              <span>{counts[id]}</span>
            </button>
          ))}
        </div>

        {active === 'media' && (
          <div className="ph-sharebrowser__grid" aria-label="Shared media">
            {media.map((item, i) => (
              <button key={i} className="ph-sharebrowser__tile" type="button" style={{ '--h': item.tone }} aria-label={item.label}>
                {HI.video && <HI.video size={18} stroke={1.8} />}
              </button>
            ))}
          </div>
        )}

        {active === 'docs' && (
          <div className="ph-sharebrowser__list" aria-label="Shared documents">
            {docs.map((doc, i) => (
              <button key={i} className="ph-sharebrowser__row" type="button">
                <span className={'ph-sharebrowser__file ph-sharebrowser__file--' + doc.type}>{doc.type}</span>
                <span className="ph-sharebrowser__rowtext">
                  <strong>{doc.title}</strong>
                  <span>{doc.meta}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {active === 'links' && (
          <div className="ph-sharebrowser__list" aria-label="Shared links">
            {links.map((link, i) => (
              <button key={i} className="ph-sharebrowser__row" type="button">
                <span className="ph-sharebrowser__linkicon">{HI.link && <HI.link size={15} stroke={2} />}</span>
                <span className="ph-sharebrowser__rowtext">
                  <strong>{link.title}</strong>
                  <span>{link.meta}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

// ── PhoneProfile ──────────────────────────────────────────────────────────
// Full-screen profile for a member, with the same content as the desktop
// profile sheet.

function PhoneProfile({ person, conv, onBack, onMessage }) {
  if (!person) return null;
  const MemberProfile = HMC.MemberProfile;
  return (
    <div className="ph ph-det">
      <div className="ph-top">
        <button className="ph-top__back" onClick={onBack} aria-label="Back"><HBack /></button>
        <div className="ph-top__title">
          <h1>Profile</h1>
        </div>
      </div>
      <div className="ph-det__body">
        {MemberProfile && <MemberProfile person={person} conv={conv} onMessage={onMessage} />}
      </div>
    </div>
  );
}

window.PMC = window.PMC || {};
window.PMC.PhoneDetails = PhoneDetails;
window.PMC.PhoneProfile = PhoneProfile;
