import { useCallback, useEffect, useRef } from 'react'

/**
 * useSwipeTabs — horizontal scroll-snap tabs with two-way state binding.
 *
 * Usage:
 *   const tabs = [{id:'a'}, {id:'b'}, {id:'c'}]
 *   const { trackRef, registerPanel } = useSwipeTabs(tabs, activeTab, setActiveTab)
 *
 *   <div className="ut-tab-body" ref={trackRef}>
 *     <div className="ut-tab-track">
 *       {tabs.map((t, i) => (
 *         <div key={t.id} ref={registerPanel(i)} className="ut-tab-panel">
 *           ...content
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 *
 * Behaviour:
 *   - When `activeTab` changes (e.g. tab click), the container smooth-scrolls
 *     to that panel.
 *   - When the user swipes/scrolls (mobile) and settles on a new panel,
 *     `setActiveTab` is called with that panel's id.
 *   - Uses IntersectionObserver so we don't fight scroll events across
 *     browsers; threshold 0.6 = "at least 60% of a panel is visible in the
 *     scroll container" → that panel wins.
 */
export default function useSwipeTabs(tabs, activeTab, setActiveTab) {
  const trackRef = useRef(null)
  const panelRefs = useRef([])
  // Guard flag: when we scroll imperatively in response to a tab click, we
  // don't want the intersection observer to fire back and re-set the tab.
  const isProgrammaticScrollRef = useRef(false)

  const registerPanel = useCallback(
    (index) => (el) => {
      panelRefs.current[index] = el || null
    },
    [],
  )

  // Sync tab → scroll position when `activeTab` changes.
  useEffect(() => {
    const container = trackRef.current
    if (!container) return
    const index = tabs.findIndex((t) => t.id === activeTab)
    if (index < 0) return
    const targetLeft = index * container.clientWidth
    // Only scroll if we're not already there (prevents feedback loops when
    // the observer sets the tab that we then try to scroll to).
    if (Math.abs(container.scrollLeft - targetLeft) > 4) {
      isProgrammaticScrollRef.current = true
      container.scrollTo({ left: targetLeft, behavior: 'smooth' })
      // Clear the guard once the smooth scroll should be done.
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, 400)
    }
  }, [activeTab, tabs])

  // Sync scroll position → tab via IntersectionObserver.
  useEffect(() => {
    const container = trackRef.current
    if (!container) return
    const panels = panelRefs.current.filter(Boolean)
    if (panels.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return
        // Pick the most-visible entry.
        let best = null
        for (const e of entries) {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e
        }
        if (best && best.intersectionRatio >= 0.6) {
          const idx = panels.indexOf(best.target)
          const id = tabs[idx]?.id
          if (id && id !== activeTab) setActiveTab(id)
        }
      },
      { root: container, threshold: [0.4, 0.6, 0.8] },
    )
    panels.forEach((p) => observer.observe(p))
    return () => observer.disconnect()
  }, [tabs, activeTab, setActiveTab])

  // Sync tab-body height to the active panel's intrinsic content height.
  // Without this, the horizontal flex row inflates every panel to the tallest
  // sibling's height — so on Summary (short) you'd see empty space below the
  // list because the row matches Edit's height. ResizeObserver keeps it live
  // as content mutates (e.g. selecting an option that expands a card).
  useEffect(() => {
    const container = trackRef.current
    if (!container) return
    const index = tabs.findIndex((t) => t.id === activeTab)
    const active = panelRefs.current[index]
    if (!active) return
    const apply = () => {
      container.style.height = `${active.offsetHeight}px`
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(active)
    return () => ro.disconnect()
  }, [activeTab, tabs])

  return { trackRef, registerPanel }
}
