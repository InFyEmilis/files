// Chat pane — header, message stream with grouped bubbles, composer
const { useState: _us, useMemo: _um, useEffect: _ue, useRef: _ur, useLayoutEffect: _ul } = React;
const _DD = window.MeccaData;
const _MMC = window.MC;
const _II = _MMC.I;
const _TC = _MMC.TYPE_CFG;

function ChatHeader({ conv, project, detailsOpen, onToggleDetails, onToggleMembers, membersAnchorRef }) {
  if (!conv) return null;
  const cfg = _TC[conv.type];
  const Glyph = cfg.Glyph;
  const others = conv.participants.filter(p => p.name !== 'You');

  return (
    <div className="mc-chat__head">
      <div className="mc-chat__head-left">
        {conv.type === 'direct' && conv.participants[0] ? (
          <_MMC.Avatar p={conv.participants[0]} size={36} ring />
        ) : (
          <div className="mc-chat__head-icon" style={{ '--h': cfg.hue }}>
            <Glyph size={18} stroke={1.8} />
          </div>
        )}
        <div className="mc-chat__head-text">
          <div className="mc-chat__head-titlerow">
            <h1>{conv.title}</h1>
          </div>
          <div className="mc-chat__head-sub">
            {conv.type !== 'direct' && project && (
              <>
                <span className="mc-chat__breadcrumb">
                  <span className="mc-chat__bcdot" style={{ background: project.color }} />
                  {project.name}
                </span>
                <span className="mc-chat__bcsep">›</span>
              </>
            )}
            <span className="mc-chat__bctype">{cfg.name}</span>
            {others.length > 0 && (
              <>
                <span className="mc-chat__bcsep">·</span>
                <span>{others.length + 1} member{others.length === 0 ? '' : 's'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mc-chat__head-right">
        {others.length > 1 && (
          <button
            className="mc-chat__members-btn"
            ref={membersAnchorRef}
            onClick={onToggleMembers}
            title="Members"
          >
            <_MMC.StackedAvatars people={others} max={4} size={26} />
          </button>
        )}
        <button className="mc-iconbtn" title="Search"><_II.search size={15} /></button>
        <button className="mc-iconbtn" title="Call"><_II.phone size={15} /></button>
        <button className="mc-iconbtn" title="Video"><_II.video size={15} /></button>
        <button
          className={'mc-iconbtn' + (detailsOpen ? ' is-active' : '')}
          onClick={onToggleDetails}
          title="Details"
        >
          <_II.info size={15} />
        </button>
      </div>
    </div>
  );
}

function ContextStrip({ conv }) {
  if (!conv.subtitle) return null;
  let icon = null;
  if (conv.type === 'task') icon = <_II.check size={14} />;
  else if (conv.type === 'procurement') icon = <_II.cart size={14} />;
  else if (conv.type === 'site-issue') icon = <_II.alert size={14} />;
  else if (conv.type === 'custom-group') icon = <_II.users size={14} />;
  const linkLabel = conv.type === 'task' ? 'Linked task'
    : conv.type === 'procurement' ? 'Linked procurement'
    : conv.type === 'site-issue' ? 'Linked site issue'
    : conv.type === 'custom-group' ? 'Custom group'
    : 'Linked chat';
  const actionLabel = conv.type === 'task' ? 'Open task'
    : conv.type === 'procurement' ? 'Open procurement'
    : conv.type === 'site-issue' ? 'Open issue'
    : 'Open';
  return (
    <div className="mc-chat__context" style={{ '--h': _TC[conv.type].hue }}>
      <div className="mc-chat__context-icon">{icon}</div>
      <div className="mc-chat__context-body" title={conv.title}>
        <div className="mc-chat__context-title">{linkLabel}</div>
        <div className="mc-chat__context-meta">{conv.subtitle}</div>
      </div>
      <button className="mc-chat__context-link" aria-label={`${actionLabel}: ${conv.title}`}>
        <span>{actionLabel}</span>
        <_II.link size={11} />
      </button>
    </div>
  );
}

// Group messages: first/middle/last/single, by sender + time gap
function groupMessages(msgs) {
  const out = [];
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];
    const prev = msgs[i - 1];
    const next = msgs[i + 1];
    const sameSenderPrev = prev && prev.sender.name === m.sender.name && (m.timestamp - prev.timestamp) < 5 * 60_000;
    const sameSenderNext = next && next.sender.name === m.sender.name && (next.timestamp - m.timestamp) < 5 * 60_000;
    let pos;
    if (!sameSenderPrev && !sameSenderNext) pos = 'single';
    else if (!sameSenderPrev && sameSenderNext) pos = 'first';
    else if (sameSenderPrev && sameSenderNext) pos = 'middle';
    else pos = 'last';
    let showDay = false;
    if (!prev || prev.timestamp.toDateString() !== m.timestamp.toDateString()) showDay = true;
    out.push({ ...m, pos, showDay });
  }
  return out;
}

function MessageBubble({ m, density }) {
  const own = m.isOwn;
  const showAvatar = !own && (m.pos === 'last' || m.pos === 'single');
  const showName = !own && (m.pos === 'first' || m.pos === 'single');

  return (
    <>
      {m.showDay && (
        <div className="mc-day"><span>{_DD.fmtDay(m.timestamp)}</span></div>
      )}
      <div className={'mc-msg mc-msg--' + (own ? 'own' : 'other') + ' mc-msg--' + m.pos + (density === 'compact' ? ' mc-msg--compact' : density === 'spacious' ? ' mc-msg--spacious' : '')}>
        {!own && (
          <div className="mc-msg__avatar">
            {showAvatar && <_MMC.Avatar p={m.sender} size={28} />}
          </div>
        )}
        <div className="mc-msg__col">
          {showName && (
            <div className="mc-msg__name">
              <span style={{ color: `oklch(0.78 0.08 ${m.sender.hue ?? 220})` }}>{m.sender.name}</span>
              <span className="mc-msg__role">{m.sender.role}</span>
            </div>
          )}
          <div className="mc-msg__bubble">
            <span className="mc-msg__text">{m.content}</span>
            <span className="mc-msg__time">{_DD.fmtTime(m.timestamp)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function Composer({ onSend, conv }) {
  const [text, setText] = _us('');
  const taRef = _ur(null);

  _ue(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  return (
    <div className="mc-composer">
      <div className="mc-composer__bar">
        <button className="mc-iconbtn" title="Attach"><_II.paper size={16} /></button>
        <textarea
          ref={taRef}
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={`Message ${conv.title}…`}
        />
        <button className="mc-iconbtn" title="Emoji"><_II.smile size={16} /></button>
        {text.trim() ? (
          <button className="mc-composer__send" onClick={send} title="Send">
            <_II.send size={15} />
          </button>
        ) : (
          <button className="mc-iconbtn" title="Voice"><_II.mic size={16} /></button>
        )}
      </div>
      <div className="mc-composer__hints">
        <span><kbd>↵</kbd> send</span>
        <span><kbd>⇧</kbd>+<kbd>↵</kbd> new line</span>
        <span><kbd>@</kbd> mention</span>
      </div>
    </div>
  );
}

function ChatPane({ conv, project, density, onShowInbox, isArchived, onToggleArchive, detailsOpen, onToggleDetails, onOpenDM }) {
  const [composed, setComposed] = _us({}); // { convId: [extra messages] }
  const [membersOpen, setMembersOpen] = _us(false);
  const [membersTrigger, setMembersTrigger] = _us(0); // bump to rescroll-to-members when drawer opened from popover
  const [pendingProfile, setPendingProfile] = _us(null); // person to show in drawer profile view
  const scrollRef = _ur(null);
  const membersAnchorRef = _ur(null);
  const [typingFrom, setTypingFrom] = _us(null);

  const baseMsgs = _um(() => conv ? _DD.getMessages(conv.id) : [], [conv?.id]);
  const extra = composed[conv?.id] || [];
  const allMsgs = _um(() => groupMessages([...baseMsgs, ...extra]), [baseMsgs, extra]);

  _ul(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conv?.id, allMsgs.length]);

  // Close members popover when the conversation changes.
  _ue(() => { setMembersOpen(false); }, [conv?.id]);

  const handleSend = (text) => {
    setComposed(prev => ({
      ...prev,
      [conv.id]: [...(prev[conv.id] || []), {
        id: 'u' + Date.now(),
        content: text,
        sender: _DD.participants.you,
        timestamp: new Date(),
        isOwn: true,
      }],
    }));
    // simulate reply
    const replier = conv.participants.find(p => p.name !== 'You') || _DD.participants.sarah;
    setTypingFrom(replier);
    setTimeout(() => {
      setComposed(prev => ({
        ...prev,
        [conv.id]: [...(prev[conv.id] || []), {
          id: 'r' + Date.now(),
          content: 'Got it — will follow up shortly.',
          sender: replier,
          timestamp: new Date(),
        }],
      }));
      setTypingFrom(null);
    }, 1800);
  };

  const toggleArchive = () => {
    if (onToggleArchive) onToggleArchive();
  };

  if (!conv) {
    return (
      <div className="mc-chat mc-chat--empty">
        <div className="mc-empty mc-empty--big">
          <_II.msg size={32} />
          <p>Select a conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className={'mc-chat' + (detailsOpen ? ' has-details' : '')}>
      <div className="mc-chat__main">
        {onShowInbox && (
          <button className="mc-chat__showinbox" onClick={onShowInbox} title="Show conversation list">
            <_II.panelR size={14} />
            <span>Conversations</span>
          </button>
        )}
        <ChatHeader
          conv={conv}
          project={project}
          detailsOpen={detailsOpen}
          onToggleDetails={onToggleDetails}
          onToggleMembers={() => setMembersOpen(o => !o)}
          membersAnchorRef={membersAnchorRef}
        />
        {isArchived && (
          <div className="mc-chat__archived">
            <div className="mc-chat__archived-left">
              <_II.archive size={14} />
              <span>This chat is archived</span>
            </div>
            <button className="mc-chat__archived-btn" onClick={toggleArchive} title="Reopen this chat">
              <_II.rotate size={12} />
              <span>Reopen</span>
            </button>
          </div>
        )}
        <ContextStrip conv={conv} />

        <div className="mc-chat__stream" ref={scrollRef}>
          <div className="mc-chat__stream-inner">
            {allMsgs.map(m => <MessageBubble key={m.id} m={m} density={density} />)}
            {typingFrom && !isArchived && (
              <div className="mc-msg mc-msg--other mc-msg--last">
                <div className="mc-msg__avatar"><_MMC.Avatar p={typingFrom} size={28} /></div>
                <div className="mc-msg__col">
                  <div className="mc-msg__bubble mc-msg__bubble--typing">
                    <span className="mc-typing"><i /><i /><i /></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isArchived && <Composer onSend={handleSend} conv={conv} />}
      </div>

      {detailsOpen && _MMC.DetailsDrawer && (
        <_MMC.DetailsDrawer
          conv={conv}
          isArchived={isArchived}
          onArchive={onToggleArchive}
          onClose={onToggleDetails}
          scrollToMembers={membersTrigger}
          pendingProfile={pendingProfile}
          onOpenDM={onOpenDM}
        />
      )}

      {membersOpen && _MMC.MembersPopover && (
        <_MMC.MembersPopover
          conv={conv}
          anchorRef={membersAnchorRef}
          onClose={() => setMembersOpen(false)}
          onOpenDetails={() => {
            setMembersOpen(false);
            setMembersTrigger(t => t + 1);
            setPendingProfile(null);
            if (!detailsOpen && onToggleDetails) onToggleDetails();
          }}
          onOpenMemberProfile={(person) => {
            setMembersOpen(false);
            setPendingProfile(person);
            if (!detailsOpen && onToggleDetails) onToggleDetails();
          }}
        />
      )}
    </div>
  );
}

window.MC.ChatPane = ChatPane;
