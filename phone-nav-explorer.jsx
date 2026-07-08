// Mobile navigation explorer — design canvas with 3 approaches on phones.

function PNote({ children, color = 'amber' }) {
  const palettes = {
    amber: { bg: '#fef4a8', fg: '#5a4a2a' },
    rose:  { bg: '#fde2dc', fg: '#6b2a23' },
    sky:   { bg: '#dbeafe', fg: '#1e3a5f' },
    mint:  { bg: '#d4f1de', fg: '#1e4a32' },
  };
  const p = palettes[color] || palettes.amber;
  return (
    <div style={{
      width: 280, padding: '18px 20px',
      background: p.bg, color: p.fg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      fontSize: 13, lineHeight: 1.5,
      borderRadius: 4,
      boxShadow: '0 8px 22px -6px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.08)',
      transform: 'rotate(-0.6deg)',
    }}>{children}</div>
  );
}

function App() {
  const { DesignCanvas, DCSection, DCArtboard, MNScreens } = window;
  // Artboards sized just larger than the iPhone 14 frame (390×844).
  const W = 420, H = 880;
  const cardStyle = { background: 'transparent', boxShadow: 'none' };
  return (
    <DesignCanvas>
      {/* Intro */}
      <DCSection id="intro" title="Mobile navigation" subtitle="The same three desktop approaches, translated for iPhone. Pan to compare.">
        <DCArtboard id="intro" label="Reasoning" width={420} height={H} style={{background: '#fffaf0'}}>
          <div style={{padding: '32px 36px', fontFamily: 'Inter, system-ui, sans-serif', color: '#2d2418', fontSize: 13.5, lineHeight: 1.55, height: '100%', overflow: 'hidden'}}>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7355', marginBottom: 18}}>Mobile is unforgiving</div>
            <h2 style={{fontSize: 22, fontWeight: 600, letterSpacing: '-0.018em', margin: '0 0 14px', color: '#1a1209'}}>One column. One scope. One job.</h2>
            <p style={{margin: '0 0 14px'}}>Desktop has space for two axes side by side. Mobile doesn't — every screen makes you choose what to surface and what to bury.</p>
            <p style={{margin: '0 0 14px'}}>Each desktop approach maps to a different mobile pattern:</p>
            <div style={{height: 1, background: '#e5dbc7', margin: '16px 0'}}/>
            <p style={{margin: '0 0 12px'}}><b>A · Bottom tabs + project chip</b><br/>
            <span style={{color: '#6b5638'}}>The canonical mobile pattern. Modules anchored at bottom, project context as a chip in the top-left. Tap the chip → full-screen project picker.</span></p>
            <p style={{margin: '0 0 12px'}}><b>C · Project-first drill-down</b><br/>
            <span style={{color: '#6b5638'}}>Home = project list. Tap a project → its "home" with module tiles. Each module is a stack screen. Most native, deepest.</span></p>
            <p style={{margin: '0 0 12px'}}><b>D · Cmd-K everywhere</b><br/>
            <span style={{color: '#6b5638'}}>Sparest chrome — breadcrumb chip + search. Everything reachable via fuzzy search. Power-user heaven; learning-curve hell.</span></p>
            <div style={{height: 1, background: '#e5dbc7', margin: '20px 0'}}/>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7355', marginBottom: 12}}>My pick on mobile</div>
            <p style={{margin: 0}}><b>A</b> for primary nav, with a slightly faster project switcher available via a long-press on the chip. Bottom tabs are muscle memory for everyone.</p>
          </div>
        </DCArtboard>
      </DCSection>

      {/* APPROACH A */}
      <DCSection id="a" title="A · Bottom tabs + project chip" subtitle="Modules anchored at the bottom · Current project as a chip in the header · Tap chip → switcher sheet">
        <DCArtboard id="a-inbox" label="1 · Inbox (all projects, sorted)" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenA_Inbox/>
        </DCArtboard>
        <DCArtboard id="a-picker" label="2 · Project picker sheet" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenA_PickerSheet/>
        </DCArtboard>
        <DCArtboard id="a-tasks" label="3 · Tasks (project-scoped)" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenA_Tasks/>
        </DCArtboard>
        <DCArtboard id="a-chat" label="4 · Chat detail" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenA_Chat/>
        </DCArtboard>
        <DCArtboard id="a-team" label="5 · Team (global, chip flips)" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenA_Team/>
        </DCArtboard>
        <DCArtboard id="a-note" label="Tradeoffs" width={420} height={H} style={cardStyle}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 16}}>
            <PNote color="mint">
              <b>Why this works</b><br/>
              Every iOS user knows bottom tabs already. The chip puts project scope <i>in your dominant-thumb reach</i> without consuming vertical space. Tap chip → full sheet with search.
            </PNote>
            <PNote color="amber">
              <b>The chip's two jobs</b><br/>
              On Chat/Tasks/Files/Procurement it shows the <b>current project</b>. On Team (global) it flips to <i>"All people"</i> with the same chip — tap to filter Team by a specific project.
            </PNote>
            <PNote color="sky">
              <b>Faster switcher</b><br/>
              Long-press the chip → mini horizontal carousel of your 5 most-active projects. One-thumb hop without opening the full sheet.
            </PNote>
          </div>
        </DCArtboard>
      </DCSection>

      {/* APPROACH C */}
      <DCSection id="c" title="C · Project-first drill-down" subtitle="Home is the project list · Tap to enter project home with module tiles · Stack-style navigation">
        <DCArtboard id="c-home" label="1 · Projects (home)" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenC_Home/>
        </DCArtboard>
        <DCArtboard id="c-proj" label="2 · Project home (module tiles)" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenC_ProjectHome/>
        </DCArtboard>
        <DCArtboard id="c-mod" label="3 · Tasks within project" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenC_Module/>
        </DCArtboard>
        <DCArtboard id="c-note" label="Tradeoffs" width={420} height={H} style={cardStyle}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 16}}>
            <PNote color="mint">
              <b>Why this works</b><br/>
              <b>Most "native iOS" feel</b> of the three. Each screen does one job. Project cards on the home screen surface module-level unread counts so you scan the dashboard in 2 seconds.
            </PNote>
            <PNote color="rose">
              <b>The cost</b><br/>
              Jumping between modules across <i>different</i> projects is 3+ taps every time (back to projects → into other project → into module). Power users will resent it.
            </PNote>
            <PNote color="amber">
              <b>Mitigation</b><br/>
              The Inbox/Notification tab cuts across all projects — when you're triaging by urgency rather than browsing, you live there.
            </PNote>
          </div>
        </DCArtboard>
      </DCSection>

      {/* APPROACH D */}
      <DCSection id="d" title="D · Breadcrumb + cmd-K" subtitle="Minimal chrome · Project as a chip-breadcrumb · Search opens to anything in 2 taps">
        <DCArtboard id="d-mod" label="1 · Chat module (segmented tabs)" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenD_Module/>
        </DCArtboard>
        <DCArtboard id="d-cmdk" label="2 · Search palette open" width={W} height={H} style={cardStyle}>
          <MNScreens.ScreenD_CommandK/>
        </DCArtboard>
        <DCArtboard id="d-note" label="Tradeoffs" width={420} height={H} style={cardStyle}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 16}}>
            <PNote color="mint">
              <b>Why this works</b><br/>
              <b>Spacious.</b> Search is omnipresent and surfaces projects, conversations, tasks, and actions from one input. Module tabs are horizontally scrollable so adding a 6th module costs nothing.
            </PNote>
            <PNote color="rose">
              <b>The cost</b><br/>
              No bottom tabs means <i>no thumb anchor</i>. Users must remember the search bar exists; many will hunt for tabs and feel lost. Site PMs in particular won't learn this.
            </PNote>
            <PNote color="amber">
              <b>Hybrid option</b><br/>
              Keep this top bar exactly as drawn, but bring back <b>3 bottom tabs</b> for Inbox / Search / You. Modules then live as segmented tabs scoped to project. Best of both — at the cost of more chrome.
            </PNote>
          </div>
        </DCArtboard>
      </DCSection>

      {/* SUMMARY */}
      <DCSection id="end" title="Summary" subtitle="">
        <DCArtboard id="rec" label="Recommendation" width={720} height={400} style={{background: '#fffaf0'}}>
          <div style={{padding: 40, fontFamily: 'Inter, system-ui, sans-serif', color: '#2d2418', height: '100%'}}>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7355', marginBottom: 16}}>Mobile recommendation</div>
            <h2 style={{fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#1a1209', lineHeight: 1.2}}>Bottom tabs + project chip. Trust the thumb.</h2>
            <p style={{fontSize: 14.5, lineHeight: 1.55, margin: '0 0 12px'}}>
              <b>A</b> wins on mobile harder than it wins on desktop. Bottom tabs are sacred — they're the only iOS pattern users navigate without thinking. The project chip puts switcher access in the corner of the screen, which is exactly where iOS users expect a "scope" affordance (mirrors Apple Mail's account picker).
            </p>
            <p style={{fontSize: 13.5, color: '#6b5638', margin: '14px 0 0', lineHeight: 1.55}}>
              Borrow the cmd-K palette from <b>D</b> as a secondary action — pull-to-search on any list reveals the same fuzzy search you saw in D2.
            </p>
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const _root = ReactDOM.createRoot(document.getElementById('root'));
_root.render(<App />);
