import { useState } from 'react'
import EmptyPage from './pages/EmptyPage.jsx'
import PremiumPreviewPage from './pages/PremiumPreviewPage.jsx'
import Variation1Page from './pages/Variation1Page.jsx'
import Phase1Page from './pages/Phase1Page.jsx'
import TierSegmentedPage from './pages/TierSegmentedPage.jsx'
import TierCardsPage from './pages/TierCardsPage.jsx'
import FlowChoosePlanPage from './pages/FlowChoosePlanPage.jsx'
import UserTestingPage from './pages/UserTestingPage.jsx'
import UserTestingOption2Page from './pages/UserTestingOption2Page.jsx'
import UserTestingOption3Page from './pages/UserTestingOption3Page.jsx'
import CodeConnectGuidePage from './pages/CodeConnectGuidePage.jsx'
import PrototypingSkillPage from './pages/PrototypingSkillPage.jsx'
import DesignSkillsPage from './pages/DesignSkillsPage.jsx'

const pages = [
  {
    id: 'empty',
    sidebarLabel: 'Welcome',
    topbarTitle: 'Welcome to Plymouth Rock Design Playground',
    component: ({ nav }) => <EmptyPage onNavigate={nav} />,
  },
  {
    id: 'example-1',
    sidebarLabel: 'Example 1',
    topbarTitle: 'Example 1',
    component: () => <PremiumPreviewPage />,
  },
  {
    id: 'tier-tab-nav',
    sidebarLabel: 'Tier: Tab Nav',
    topbarTitle: 'Tier: Tab Nav',
    component: () => <Variation1Page />,
  },
  {
    id: 'phase-1',
    sidebarLabel: 'Phase 1',
    topbarTitle: 'Phase 1',
    component: () => <Phase1Page />,
  },
  {
    id: 'tier-segmented',
    sidebarLabel: 'Tier: Segmented',
    topbarTitle: 'Tier: Segmented',
    component: () => <TierSegmentedPage />,
  },
  {
    id: 'tier-cards',
    sidebarLabel: 'Tier: Cards',
    topbarTitle: 'Tier: Cards',
    component: () => <TierCardsPage />,
  },
  {
    id: 'flow-choose-plan',
    sidebarLabel: 'Flow: Choose Plan',
    topbarTitle: 'Flow: Choose Plan',
    component: () => <FlowChoosePlanPage />,
  },
  {
    id: 'user-testing',
    sidebarLabel: 'User Testing',
    topbarTitle: 'User Testing',
    component: () => <UserTestingPage />,
  },
  {
    id: 'user-testing-2',
    sidebarLabel: 'User Testing Option 2',
    topbarTitle: 'User Testing Option 2',
    component: () => <UserTestingOption2Page />,
  },
  {
    id: 'user-testing-3',
    sidebarLabel: 'User Testing Option 3',
    topbarTitle: 'User Testing Option 3',
    component: () => <UserTestingOption3Page />,
  },
  {
    id: 'code-connect-guide',
    sidebarLabel: null, // hidden from sidebar — reachable via Welcome card
    topbarTitle: 'Code Connect Guide',
    component: ({ nav }) => <CodeConnectGuidePage onNavigate={nav} />,
  },
  {
    id: 'prototyping-skill',
    sidebarLabel: null, // hidden from sidebar — reachable via Welcome card
    topbarTitle: 'Prototyping Skill',
    component: ({ nav }) => <PrototypingSkillPage onNavigate={nav} />,
  },
  {
    id: 'design-skills',
    sidebarLabel: null, // hidden from sidebar — reachable via Welcome card
    topbarTitle: 'Design Skills',
    component: ({ nav }) => <DesignSkillsPage onNavigate={nav} />,
  },
]

function PanelToggleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState('tier-segmented')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const active = pages.find((p) => p.id === activeId)
  const ActiveComponent = active.component

  return (
    <div className={`app ${sidebarOpen ? '' : 'app--sidebar-collapsed'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Design Playground</div>
        </div>
        <nav className="sidebar-nav">
          {pages
            .filter((p) => p.sidebarLabel !== null)
            .map((p) => (
              <button
                key={p.id}
                className={`nav-item ${p.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(p.id)}
              >
                <span>{p.sidebarLabel}</span>
              </button>
            ))}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            type="button"
            className="topbar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <PanelToggleIcon />
          </button>
          <h1 className="topbar-title">{active.topbarTitle}</h1>
        </header>
        <ActiveComponent nav={setActiveId} />
      </main>
    </div>
  )
}
