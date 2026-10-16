'use client'

import { useEffect, useSyncExternalStore } from 'react'

import { MoonIcon, SunIcon } from '@/components/icons'

const STORAGE_KEY = 'theme'

function readStoredTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    return null
  }
}

function applyTheme(dark: boolean) {
  const root = document.documentElement
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-transition', 'theme-animate')
    window.setTimeout(() => root.classList.remove('theme-transition'), 350)
  }
  root.classList.toggle('dark', dark)
}

// The theme lives on <html class="dark">; subscribe to that instead of mirroring it in state.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}
const isDark = () => document.documentElement.classList.contains('dark')
const unknownOnServer = () => null

/**
 * The initial theme is set before paint by the inline script in the root layout
 * (stored choice, else the OS preference). This button flips it and remembers the
 * choice; without a stored choice the page keeps following the OS setting.
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore<boolean | null>(subscribe, isDark, unknownOnServer)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = (event: MediaQueryListEvent) => {
      if (!readStoredTheme()) applyTheme(event.matches)
    }
    media.addEventListener('change', followSystem)
    return () => media.removeEventListener('change', followSystem)
  }, [])

  const toggle = () => {
    const next = !isDark()
    applyTheme(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // Not persisted; the toggle still works for this page view.
    }
  }

  const label = dark === null ? 'Toggle colour theme' : dark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={label} title={label}>
      <SunIcon className="theme-icon theme-icon-sun" />
      <MoonIcon className="theme-icon theme-icon-moon" />
    </button>
  )
}

/** Runs before first paint (inlined in <head>) so the page never flashes the wrong theme. */
export const themeScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`
