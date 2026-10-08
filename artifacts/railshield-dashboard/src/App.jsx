import { useEffect, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, Bell, Camera, Check, ChevronDown,
  CircleHelp, Clock3, Compass, Gauge, Lightbulb, MapPin, Menu, Route,
  Settings, Shield, ShieldAlert, ShieldCheck, Siren, Users, X,
} from 'lucide-react';
import { stationData } from './data/station-data.js';

const stationSignals = [
  { label: 'Lighting', dataKey: 'lighting', tone: 'good', icon: Lightbulb },
  { label: 'CCTV Coverage', dataKey: 'cctv', tone: 'good', icon: Camera },
  { label: 'Crowd Density', dataKey: 'crowd', tone: 'moderate', icon: Users },
  { label: 'Emergency Access', dataKey: 'emergencyAccess', tone: 'good', icon: ShieldCheck },
  { label: 'Incident Risk', dataKey: 'incidentRisk', tone: 'good', icon: Activity },
];

const navigation = [
  { label: 'Dashboard', icon: Gauge, active: true },
  { label: 'New Journey', icon: Route },
  { label: 'SafeZone', icon: Shield },
  { label: 'Safe Route', icon: Compass },
  { label: 'Crowd Intelligence', icon: Users },
  { label: 'Emergency SOS', icon: Siren },
];

const quickActions = [
  { title: 'View SafeZone', description: 'Explore station risk zones', icon: Shield, tone: 'mint' },
  { title: 'Find Safe Route', description: 'Choose the safest practical route', icon: Route, tone: 'blue' },
  { title: 'Crowd Forecast', description: 'Predict upcoming congestion', icon: Activity, tone: 'gold' },
];

function BrandMark() {
  return <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>;
}

function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-scrim ${mobileOpen ? 'is-visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
        <div className="brand">
          <BrandMark />
          <span>RailShield <b>AI</b></span>
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="workspace-label">PASSENGER SAFETY</div>
        <nav className="main-nav">
          {navigation.map(({ label, icon: Icon, active }) => (
            <button key={label} className={`nav-item ${active ? 'nav-active' : 'nav-disabled'}`} disabled={!active} aria-current={active ? 'page' : undefined} data-testid={`nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {!active && <span className="nav-next">Coming next</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item nav-disabled" disabled><Settings size={18} strokeWidth={1.8} /><span>Settings</span></button>
          <div className="prototype-version"><span className="version-dot" />Prototype v1.0</div>
        </div>
      </aside>
    </>
  );
}

function SignalRow({ signal }) {
  const Icon = signal.icon;
  return (
    <div className="signal-row" data-testid={`signal-${signal.label.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="signal-name"><Icon size={16} /><span>{signal.label}</span></div>
      <span className={`signal-value tone-${signal.tone}`}><i />{stationData[signal.dataKey]}</span>
    </div>
  );
}

function EmergencyDialog({ onCancel, onActivate }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="emergency-dialog" role="alertdialog" aria-modal="true" aria-labelledby="sos-title" aria-describedby="sos-copy">
        <div className="dialog-icon"><AlertTriangle size={22} /></div>
        <button className="dialog-close icon-button" aria-label="Close confirmation" onClick={onCancel}><X size={18} /></button>
        <p className="eyebrow">EMERGENCY WORKFLOW</p>
        <h2 id="sos-title">Activate Emergency Mode?</h2>
        <p id="sos-copy">Your emergency workflow will prepare your location and notify configured trusted contacts.</p>
        <div className="prototype-note"><span className="note-mark">i</span>This is a prototype. No emergency services will be contacted.</div>
        <div className="dialog-actions">
          <button className="button-secondary" ref={cancelRef} onClick={onCancel}>Cancel</button>
          <button className="button-danger" onClick={onActivate}><Siren size={16} />Activate SOS</button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [whyOpen, setWhyOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeDialog = () => setShowDialog(false);
  const activateEmergency = () => {
    setEmergencyActive(true);
    setShowDialog(false);
  };

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-trigger" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="header-heading">
            <div className="header-title">Safety Dashboard</div>
            <span className="prototype-badge">PROTOTYPE • SIMULATED DATA</span>
          </div>
          <div className="header-right">
            <span className="notification-indicator" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></span>
            <div className="header-divider" />
            <div className="user-profile"><div className="avatar">R</div><span>Rose</span><ChevronDown size={15} className="profile-chevron" /></div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div>
              <p className="eyebrow welcome-eyebrow">YOUR JOURNEY, WITH MORE CLARITY</p>
              <h1>Good evening, Rose <span aria-hidden="true">👋</span></h1>
              <p className="welcome-copy">Here's your station safety overview.</p>
            </div>
            <div className="overview-date"><Clock3 size={15} /><span>STATION OVERVIEW</span></div>
          </section>

          {emergencyActive && (
            <div className="active-emergency" role="status" data-testid="status-emergency-active">
              <div className="active-emergency-icon"><ShieldAlert size={18} /></div>
              <div><strong>Emergency mode active</strong><span>Prototype emergency workflow</span></div>
              <button className="dismiss-alert" aria-label="Dismiss emergency status" onClick={() => setEmergencyActive(false)}><X size={17} /></button>
            </div>
          )}

          <section className="station-card" aria-labelledby="station-title">
            <div className="station-main">
              <div className="station-heading">
                <div className="station-heading-icon"><MapPin size={18} /></div>
                <div>
                  <p className="eyebrow">CURRENT STATION</p>
                  <h2 id="station-title">{stationData.station}</h2>
                  <p className="station-subtitle">Station detected from your current journey</p>
                </div>
              </div>
              <div className="score-panel">
                <div className="score-topline"><span>SAFETY SCORE</span><span className="score-icon"><ShieldCheck size={16} /></span></div>
                <div className="score-value">{stationData.riskScore}<span> / 100</span></div>
                <div className="score-meter" aria-label={`Safety score ${stationData.riskScore} out of 100`}><span style={{ width: `${stationData.riskScore}%` }} /></div>
                <div className="risk-label"><i />{stationData.riskLevel}</div>
              </div>
            </div>

            <div className="station-details">
              <div className="signals-header"><span>SAFETY CONDITIONS</span><span className="simulated-label"><span /> SIMULATED DATA</span></div>
              <div className="signals-list">
                {stationSignals.map((signal) => <SignalRow key={signal.label} signal={signal} />)}
              </div>
              <button className="why-toggle" aria-expanded={whyOpen} aria-controls="score-explanation" onClick={() => setWhyOpen(!whyOpen)} data-testid="button-why-score">
                <CircleHelp size={15} />Why this score?<ChevronDown size={15} className={whyOpen ? 'chevron-open' : ''} />
              </button>
              {whyOpen && <div className="score-explanation" id="score-explanation">RailShield combines station conditions such as crowd density, lighting, CCTV coverage, emergency access and incident risk to estimate the current safety level.</div>}
            </div>
            <div className="station-footnote"><span className="footnote-dot" />Prototype assessment based on simulated station data.</div>
          </section>

          <section className="signals-section" aria-labelledby="signals-title">
            <div className="section-heading">
              <div><p className="eyebrow">AT A GLANCE</p><h2 id="signals-title">Safety signals</h2></div>
              <span className="section-caption">Station conditions</span>
            </div>
            <div className="signal-cards">
              <article className="mini-signal-card">
                <div className="mini-card-top"><div className="mini-icon icon-crowd"><Users size={18} /></div><span className="signal-index">01</span></div>
                <div className="mini-title">Crowd</div><div className="mini-reading">{stationData.crowdPercentage}<span>%</span></div>
                <div className="mini-card-bottom"><span className="state-pill state-moderate"><i />Moderate</span></div>
                <div className="mini-progress"><span style={{ width: `${stationData.crowdPercentage}%` }} /></div>
              </article>
              <article className="mini-signal-card">
                <div className="mini-card-top"><div className="mini-icon icon-cctv"><Camera size={18} /></div><span className="signal-index">02</span></div>
                <div className="mini-title">CCTV</div><div className="mini-reading word-reading">{stationData.cctv.toUpperCase()}</div>
                <div className="mini-card-bottom"><span className="state-pill state-good"><i />Coverage</span></div>
                <div className="coverage-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div>
              </article>
              <article className="mini-signal-card">
                <div className="mini-card-top"><div className="mini-icon icon-night"><Lightbulb size={18} /></div><span className="signal-index">03</span></div>
                <div className="mini-title">Night Safety</div><div className="mini-reading word-reading">{stationData.nightSafety.toUpperCase()}</div>
                <div className="mini-card-bottom"><span className="state-pill state-safe"><i />Conditions</span></div>
                <div className="night-track"><span /></div>
              </article>
            </div>
          </section>

          <section className="quick-section" aria-labelledby="quick-title">
            <div className="section-heading">
              <div><p className="eyebrow">PLAN WITH CONFIDENCE</p><h2 id="quick-title">Quick actions</h2></div>
              <span className="section-caption">More tools, coming next</span>
            </div>
            <div className="quick-action-list">
              {quickActions.map(({ title, description, icon: Icon, tone }, index) => (
                <article className="quick-action-card" key={title} aria-disabled="true" data-testid={`action-${index + 1}`}>
                  <div className={`quick-icon quick-${tone}`}><Icon size={19} /></div>
                  <div className="quick-copy"><h3>{title}</h3><p>{description}</p></div>
                  <span className="coming-next">Coming next</span>
                  <ArrowUpRight size={17} className="quick-arrow" />
                </article>
              ))}
            </div>
          </section>

          <footer className="dashboard-footer"><BrandMark /><span>RailShield AI</span><i />Detect • Predict • Protect</footer>
        </div>
      </main>

      <button className="floating-sos" onClick={() => setShowDialog(true)} aria-label="Open emergency mode confirmation" data-testid="button-open-sos">
        <span className="sos-symbol"><Siren size={19} /></span><span className="sos-copy"><strong>SOS</strong><small>Hold 2 sec</small></span>
      </button>
      {showDialog && <EmergencyDialog onCancel={closeDialog} onActivate={activateEmergency} />}
    </div>
  );
}

export default App;
