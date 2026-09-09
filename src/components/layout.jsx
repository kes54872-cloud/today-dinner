import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Icon } from './ui'
import { cx } from '../lib/format'

const DESKTOP_NAV = [
  { to: '/', label: '오늘 추천', end: true },
  { to: '/fridge', label: '냉장고' },
  { to: '/planner', label: '식단' },
  { to: '/cooking', label: '요리' },
  { to: '/delivery', label: '배달/외식' },
]

const MOBILE_NAV = [
  { to: '/', label: '홈', icon: 'home', end: true },
  { to: '/fridge', label: '냉장고', icon: 'fridge' },
  { to: '/planner', label: '식단', icon: 'calendar' },
  { to: '/saved', label: '찜', icon: 'heart' },
  { to: '/my', label: 'MY', icon: 'user' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-bg/85 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-8 px-8">
        <NavLink to="/" className="flex items-center gap-2 text-[17px] font-extrabold text-ink">
          <span aria-hidden="true">🍳</span> 오늘 뭐 먹지?
        </NavLink>
        <nav className="flex items-center gap-1" aria-label="주요 메뉴">
          {DESKTOP_NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cx(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:text-ink',
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button aria-label="검색" className="rounded-full p-2 text-muted hover:bg-line/60 hover:text-ink">
            <Icon name="search" size={20} />
          </button>
          <NavLink
            to="/saved"
            aria-label="찜한 메뉴"
            className={({ isActive }) =>
              cx('rounded-full p-2 hover:bg-line/60', isActive ? 'text-primary' : 'text-muted hover:text-ink')
            }
          >
            <Icon name="heart" size={20} />
          </NavLink>
          <NavLink
            to="/my"
            className={({ isActive }) =>
              cx(
                'ml-1 rounded-full px-3 py-1.5 text-sm font-semibold',
                isActive ? 'bg-primary text-white' : 'border border-line-strong text-ink hover:border-ink/40',
              )
            }
          >
            MY
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 backdrop-blur md:hidden pb-safe"
      aria-label="주요 메뉴"
    >
      <ul className="mx-auto flex max-w-md">
        {MOBILE_NAV.map((n) => (
          <li key={n.to} className="flex-1">
            <NavLink
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cx(
                  'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={n.icon}
                    size={23}
                    strokeWidth={isActive ? 2 : 1.7}
                    className={isActive && n.icon === 'heart' ? 'fill-primary' : ''}
                  />
                  {n.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function PageContainer({ children, width = 'default', className = '' }) {
  return (
    <div
      className={cx(
        'mx-auto w-full px-4 sm:px-6 md:px-8',
        width === 'narrow' ? 'max-w-[760px]' : 'max-w-[1280px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg">
      <ScrollToTop />
      <Header />
      <main className="py-5 pb-28 md:py-8 md:pb-16">{children}</main>
      <MobileBottomNav />
    </div>
  )
}
