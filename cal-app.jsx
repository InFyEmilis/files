// iPad Calendar app entry

const { useState: _US } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "view": "month",
  "accentHue": 252,
  "density": "comfortable"
}/*EDITMODE-END*/;

function CalendarApp() {
  const [tweaks, setTweak] = (window.useTweaks || (() => [TWEAK_DEFAULTS, () => {}]))(TWEAK_DEFAULTS);
  const [view, setView] = _US(tweaks.view || 'month');
  const [month, setMonth] = _US(0);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--cal-accent', `oklch(0.72 0.16 ${tweaks.accentHue})`);
    document.documentElement.style.setProperty('--cal-accent-bg', `oklch(0.30 0.10 ${tweaks.accentHue})`);
  }, [tweaks.accentHue]);

  React.useEffect(() => {
    if (tweaks.view && tweaks.view !== view) setView(tweaks.view);
  }, [tweaks.view]);

  const handleSetView = (v) => {
    setView(v);
    setTweak('view', v);
  };

  return (
    <div className="ipad-stage" data-screen-label="iPad Calendar">
      <div className="ipad-frame">
        <window.StatusBar />
        <div className="cal-app">
          <window.Rail />
          <div className="cal-main">
            <window.Header view={view} setView={handleSetView} month={month} setMonth={setMonth} />
            {view === 'month' && <window.MonthView />}
            {view === 'gantt' && <window.GanttView />}
            {view === 'agenda' && <window.AgendaView />}
          </div>
        </div>
      </div>
      <CalTweaks tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

function CalTweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSlider } = window;
  const accentHexMap = {
    252: '#7c6cff', // indigo
    230: '#4d8cff', // blue
    155: '#3eb88a', // emerald
    50:  '#e8a84a', // amber
    20:  '#e85a4a', // rose
  };
  const hexes = Object.values(accentHexMap);
  const currentHex = accentHexMap[tweaks.accentHue] || hexes[0];
  const setAccent = (h) => {
    const hue = Object.entries(accentHexMap).find(([, v]) => v === h)?.[0];
    if (hue) setTweak('accentHue', Number(hue));
  };
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="View" />
      <TweakRadio label="Mode" value={tweaks.view} onChange={v => setTweak('view', v)}
        options={['month', 'gantt', 'agenda']} />
      <TweakSection label="Theme" />
      <TweakColor label="Accent" value={currentHex} onChange={setAccent} options={hexes} />
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CalendarApp />);
