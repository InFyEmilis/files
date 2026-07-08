// Navigation Explorer — design canvas with 4 nav approaches × multiple modules.

const { useState: neS } = React;

function ArtboardScreen({ approach, moduleId, projectId = 'mh' }) {
  const Shell = window.NavShells[
    approach === 'top' ? 'ShellTopBar' :
    approach === 'twin' ? 'ShellTwinRail' :
    approach === 'exp' ? 'ShellExpandable' :
    'ShellWorkspace'
  ];
  // Wrap in a fixed-size frame so the design renders at its native dimensions
  // and the artboard reads as a real desktop screen.
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--mc-bg-app)' }}>
      <Shell moduleId={moduleId} selectedProjectId={projectId} />
    </div>
  );
}

// Note card — explains rationale + tradeoffs for each approach
function Note({ children, color = 'amber' }) {
  const palettes = {
    amber:  { bg: '#fef4a8', fg: '#5a4a2a' },
    rose:   { bg: '#fde2dc', fg: '#6b2a23' },
    sky:    { bg: '#dbeafe', fg: '#1e3a5f' },
    mint:   { bg: '#d4f1de', fg: '#1e4a32' },
  };
  const p = palettes[color] || palettes.amber;
  return (
    <div style={{
      width: 280, padding: '18px 20px',
      background: p.bg, color: p.fg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      fontSize: 13, lineHeight: 1.45,
      borderRadius: 4,
      boxShadow: '0 8px 22px -6px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.08)',
      transform: 'rotate(-0.6deg)',
    }}>
      {children}
    </div>
  );
}

function App() {
  const { DesignCanvas, DCSection, DCArtboard } = window;
  const W = 1280, H = 760;
  return (
    <DesignCanvas>
      {/* Intro */}
      <DCSection id="intro" title="Navigation exploration" subtitle="Four approaches for the full Mecca app — Chat · Tasks · Files · Procurement · Team">
        <DCArtboard id="reasoning" label="Reasoning" width={420} height={H} style={{background: '#fffaf0'}}>
          <div style={{padding: '32px 36px', fontFamily: 'Inter, system-ui, sans-serif', color: '#2d2418', fontSize: 13.5, lineHeight: 1.55, height: '100%', overflow: 'hidden'}}>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7355', marginBottom: 18}}>The two axes</div>
            <h2 style={{fontSize: 22, fontWeight: 600, letterSpacing: '-0.018em', margin: '0 0 14px', color: '#1a1209'}}>What's the primary dimension?</h2>
            <p style={{margin: '0 0 16px'}}>Mecca has <b>~15+ projects</b> (vertical, long-lived) and <b>5 modules</b> (Chat, Tasks, Files, Procurement, Team — horizontal, short-lived).</p>
            <p style={{margin: '0 0 16px'}}>Your instinct — <i>persistent project rail, content adapts to the current module</i> — is the right model. The question is just <b>where the module switcher lives</b>.</p>
            <div style={{height: 1, background: '#e5dbc7', margin: '20px 0'}}/>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7355', marginBottom: 14}}>Edge case</div>
            <p style={{margin: '0 0 16px'}}><b>Team</b> is global — people exist across many projects. Each shell needs to gracefully handle "no project scope" (dim the rail, or switch to a global mode).</p>
            <div style={{height: 1, background: '#e5dbc7', margin: '20px 0'}}/>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7355', marginBottom: 14}}>My recommendation</div>
            <p style={{margin: '0 0 12px'}}><b>Approach A</b> — modules read horizontally at the top, projects read vertically on the left. The two axes are <i>visually orthogonal</i>, which makes the mental model self-explanatory.</p>
            <p style={{margin: 0, fontSize: 12, color: '#6b5638'}}>Compare each shell across Chat / Tasks / Files / Procurement / Team →</p>
          </div>
        </DCArtboard>
      </DCSection>

      {/* APPROACH A — TOP BAR + PROJECT RAIL */}
      <DCSection id="a-top" title="A · Modules on top, projects on left" subtitle="Recommended. Orthogonal axes. Persistent project context. ⌘1–5 jumps between modules.">
        <DCArtboard id="a-chat" label="Chat" width={W} height={H}>
          <ArtboardScreen approach="top" moduleId="chat" />
        </DCArtboard>
        <DCArtboard id="a-tasks" label="Tasks" width={W} height={H}>
          <ArtboardScreen approach="top" moduleId="tasks" />
        </DCArtboard>
        <DCArtboard id="a-files" label="Files" width={W} height={H}>
          <ArtboardScreen approach="top" moduleId="files" />
        </DCArtboard>
        <DCArtboard id="a-procure" label="Procurement" width={W} height={H}>
          <ArtboardScreen approach="top" moduleId="procure" />
        </DCArtboard>
        <DCArtboard id="a-team" label="Team (global — rail dims)" width={W} height={H}>
          <ArtboardScreen approach="top" moduleId="team" />
        </DCArtboard>
        <DCArtboard id="a-note" label="Tradeoffs" width={420} height={H} style={{background: 'transparent', boxShadow: 'none'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 8}}>
            <Note color="mint">
              <b>Why this works</b><br/>
              Module switch is <b>one click, always one place</b>. Project rail stays put — you never lose context jumping Chat→Tasks→Files. The two axes are visually orthogonal (horizontal vs vertical) which makes the mental model click instantly.
            </Note>
            <Note color="amber">
              <b>Watch out for</b><br/>
              Top bar gets crowded if modules grow past 6. If that happens, demote less-used modules into an overflow menu, or split into "primary" (Chat, Tasks, Files) + "secondary" (Procurement, Team) groups.
            </Note>
            <Note color="sky">
              <b>Global modules (Team)</b><br/>
              When user clicks Team, the project rail <b>stays visible but dims to ~55%</b> — it becomes a <i>filter</i> ("show only people on MH HQ") rather than the primary scope. Cleaner than hiding it entirely.
            </Note>
          </div>
        </DCArtboard>
      </DCSection>

      {/* APPROACH B — TWIN RAIL */}
      <DCSection id="b-twin" title="B · Twin rail (Slack-style)" subtitle="Thin icon rail for modules on the far left + project rail. Everyone knows this pattern.">
        <DCArtboard id="b-chat" label="Chat" width={W} height={H}>
          <ArtboardScreen approach="twin" moduleId="chat" />
        </DCArtboard>
        <DCArtboard id="b-tasks" label="Tasks" width={W} height={H}>
          <ArtboardScreen approach="twin" moduleId="tasks" />
        </DCArtboard>
        <DCArtboard id="b-procure" label="Procurement" width={W} height={H}>
          <ArtboardScreen approach="twin" moduleId="procure" />
        </DCArtboard>
        <DCArtboard id="b-team" label="Team" width={W} height={H}>
          <ArtboardScreen approach="twin" moduleId="team" />
        </DCArtboard>
        <DCArtboard id="b-note" label="Tradeoffs" width={420} height={H} style={{background: 'transparent', boxShadow: 'none'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 8}}>
            <Note color="mint">
              <b>Why this works</b><br/>
              Universally familiar. Anyone who's used Slack, Discord, Linear, or Figma feels at home in 2 seconds. Module switch is also one click, and you can fit 8+ modules vertically without crowding.
            </Note>
            <Note color="rose">
              <b>The cost</b><br/>
              <b>Two left rails = ~320px of fixed chrome</b> before content even starts. On a 13" laptop that's ~30% of the screen gone to navigation. Feels heavy. Especially since most users live in one project for hours at a time.
            </Note>
            <Note color="amber">
              <b>When to pick this</b><br/>
              If you expect users to flip between many modules rapidly, or if you'll add 6+ modules. Otherwise, A wins on screen economy.
            </Note>
          </div>
        </DCArtboard>
      </DCSection>

      {/* APPROACH C — EXPANDABLE */}
      <DCSection id="c-exp" title="C · One expandable rail (project-first)" subtitle="Click a project → it expands inline to reveal its modules. Maximum compactness, maximum project-centricity.">
        <DCArtboard id="c-chat" label="Chat" width={W} height={H}>
          <ArtboardScreen approach="exp" moduleId="chat" />
        </DCArtboard>
        <DCArtboard id="c-tasks" label="Tasks" width={W} height={H}>
          <ArtboardScreen approach="exp" moduleId="tasks" />
        </DCArtboard>
        <DCArtboard id="c-files" label="Files" width={W} height={H}>
          <ArtboardScreen approach="exp" moduleId="files" />
        </DCArtboard>
        <DCArtboard id="c-team" label="Team (global)" width={W} height={H}>
          <ArtboardScreen approach="exp" moduleId="team" />
        </DCArtboard>
        <DCArtboard id="c-note" label="Tradeoffs" width={420} height={H} style={{background: 'transparent', boxShadow: 'none'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 8}}>
            <Note color="mint">
              <b>Why this works</b><br/>
              <b>Most project-centric of the four.</b> Modules feel like <i>parts of a project</i>, not separate apps. Only one column of chrome (no second rail). Globals sit politely at the bottom in a "Workspace" section.
            </Note>
            <Note color="rose">
              <b>The cost</b><br/>
              Switching from "MH / Chat" to "DR / Tasks" is <b>two clicks</b> (collapse one, expand another). Power users will get fatigued. The expanded section also pushes other projects down — long lists feel jumpy.
            </Note>
            <Note color="amber">
              <b>Mitigations</b><br/>
              Keyboard shortcuts for module switching within the active project (⌘1–5). Auto-collapse other projects so the open one always sits flush.
            </Note>
          </div>
        </DCArtboard>
      </DCSection>

      {/* APPROACH D — WORKSPACE BAR */}
      <DCSection id="d-ws" title="D · Breadcrumb workspace + ⌘K (Linear-style)" subtitle="The most ambitious option. Project = workspace. Tiny pinned rail. Everything else accessed via search.">
        <DCArtboard id="d-chat" label="Chat" width={W} height={H}>
          <ArtboardScreen approach="ws" moduleId="chat" />
        </DCArtboard>
        <DCArtboard id="d-tasks" label="Tasks" width={W} height={H}>
          <ArtboardScreen approach="ws" moduleId="tasks" />
        </DCArtboard>
        <DCArtboard id="d-files" label="Files" width={W} height={H}>
          <ArtboardScreen approach="ws" moduleId="files" />
        </DCArtboard>
        <DCArtboard id="d-team" label="Team (global)" width={W} height={H}>
          <ArtboardScreen approach="ws" moduleId="team" />
        </DCArtboard>
        <DCArtboard id="d-note" label="Tradeoffs" width={420} height={H} style={{background: 'transparent', boxShadow: 'none'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: 8}}>
            <Note color="mint">
              <b>Why this works</b><br/>
              <b>Modernest feel.</b> The breadcrumb <i>tells you exactly where you are</i> ("Mecca / MH HQ / Chat"). Pinned rail keeps your top 4 projects one click away. ⌘K does everything else. Spacious — gives the most room to actual work.
            </Note>
            <Note color="rose">
              <b>The cost</b><br/>
              <b>Requires a search-first culture.</b> Construction PMs aren't engineers — many will resist ⌘K and look for a list. The pinned rail of 4 covers most active days, but the discovery story for "show me all 15 projects" is weaker.
            </Note>
            <Note color="amber">
              <b>Mitigations</b><br/>
              Click on the project breadcrumb chip opens a <i>full project picker</i> with grouping, unread counts, and search. So the list isn't gone — it's just one click deeper.
            </Note>
          </div>
        </DCArtboard>
      </DCSection>

      {/* SUMMARY */}
      <DCSection id="summary" title="Pick one to push deeper" subtitle="Tell me which direction resonates and I'll detail the interactions: keyboard nav, drag-to-pin, transitions, mobile, etc.">
        <DCArtboard id="rec" label="My pick" width={720} height={400} style={{background: '#fffaf0'}}>
          <div style={{padding: 40, fontFamily: 'Inter, system-ui, sans-serif', color: '#2d2418', height: '100%'}}>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7355', marginBottom: 16}}>Recommendation</div>
            <h2 style={{fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#1a1209', lineHeight: 1.15}}>Start with <span style={{color: '#7c6cff'}}>A</span>, borrow ⌘K from <span style={{color: '#7c6cff'}}>D</span>.</h2>
            <p style={{fontSize: 14.5, lineHeight: 1.55, margin: '0 0 12px'}}>
              <b>A</b> nails the mental model (two axes, two directions, zero ambiguity) and keeps screen economy honest.
              Add a robust ⌘K from <b>D</b> for power users, and you have a navigation that scales from "Sarah on her first day" to "Sarah's been here 3 years and lives in this app."
            </p>
            <p style={{fontSize: 13, color: '#6b5638', margin: '14px 0 0'}}>If you want the most distinctive feel, <b>C</b> is the boldest — it treats projects as the primary unit of work, which matches how construction PMs actually think.</p>
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const _root = ReactDOM.createRoot(document.getElementById('root'));
_root.render(<App />);
