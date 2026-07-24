'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

const ALL_COUNTRIES = getCountries();

// Native, dependency-free country names — no flag/country-name package
// needed. Node 18+ (required by Next 16) ships full ICU, so this behaves
// identically during SSR and in the browser. Two separate resolvers (not
// Intl.DisplayNames(['ko', 'en'], ...)): passing multiple locales resolves
// to a single negotiated locale ('ko', since it's fully supported), so
// English names are never actually produced — only used for display. Search
// still checks both so typing "japan" or "일본" both work.
const koRegionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['ko'], { type: 'region' })
    : null;
const enRegionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

function countryDisplayName(country: CountryCode): string {
  return koRegionNames?.of(country) ?? country;
}

function countryDisplayNameEn(country: CountryCode): string {
  return enRegionNames?.of(country) ?? country;
}

function countryCodeToFlagEmoji(country: CountryCode): string {
  return String.fromCodePoint(
    ...country
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
  );
}

interface PhoneCountryPickerProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
}

// Rendered via a portal into document.body: RsvpStepEngine's step content
// wrapper has overflow-hidden (intentional, keeps AnimatePresence's slide
// transition from flashing a scrollbar), which would clip a plain
// position:absolute dropdown, especially on short mobile viewports with the
// on-screen keyboard open. Portaling + position:fixed off the trigger's own
// rect sidesteps that entirely.
export function PhoneCountryPicker({ value, onChange }: PhoneCountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [menuColors, setMenuColors] = useState<{
    bg: string;
    answer: string;
    placeholder: string;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COUNTRIES;
    const qDigits = q.replace(/^\+/, '');
    return ALL_COUNTRIES.filter(
      (c) =>
        countryDisplayName(c).toLowerCase().includes(q) ||
        countryDisplayNameEn(c).toLowerCase().includes(q) ||
        c.toLowerCase().includes(q) ||
        (qDigits && getCountryCallingCode(c).includes(qDigits))
    );
  }, [query]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, left: rect.left });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  // The menu is portaled to document.body, outside the DOM subtree where
  // RsvpFormShell declares --rsvp-* as inline custom properties — so var()
  // references inside the portal resolve to nothing there. Reading the
  // resolved values off the trigger (which does sit inside that subtree)
  // and applying them as plain color strings lets the menu match the host's
  // theme regardless of where the portal lands. Uses --rsvp-answer-color
  // (not --rsvp-font-color) to match the trigger button, which already
  // colors itself with the answer color.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const computed = getComputedStyle(triggerRef.current);
    setMenuColors({
      bg: computed.getPropertyValue('--rsvp-bg-color').trim(),
      answer: computed.getPropertyValue('--rsvp-answer-color').trim(),
      placeholder: computed.getPropertyValue('--rsvp-answer-placeholder-color').trim(),
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // Stops here so RsvpStepEngine's step-level Enter-advances-to-next-question
  // handler never sees these keys — Enter/Arrows here mean "navigate this
  // menu", not "advance the form". Its BUTTON-target guard already exempts
  // the country list rows for free; only this search input needs it.
  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = filtered[highlightedIndex];
      if (picked) {
        onChange(picked);
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          setQuery('');
          setHighlightedIndex(0);
          setOpen(true);
        }}
        className="flex shrink-0 items-center gap-1.5 border-b border-current px-2 py-2"
        style={{ color: 'var(--rsvp-answer-color)' }}
      >
        <span>{countryCodeToFlagEmoji(value)}</span>
        <span>+{getCountryCallingCode(value)}</span>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>

      {open &&
        menuPos &&
        menuColors &&
        createPortal(
          <div
            ref={menuRef}
            onKeyDown={handleMenuKeyDown}
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              color: menuColors.answer,
              backgroundColor: menuColors.bg,
              borderColor: `color-mix(in srgb, ${menuColors.answer} 15%, transparent)`,
            }}
            className="z-50 w-64 rounded-xl border shadow-lg"
          >
            <style>{`[data-rsvp-country-search="${searchInputId}"]::placeholder { color: ${menuColors.placeholder}; }`}</style>
            <div
              className="flex items-center gap-2 border-b px-3 py-2"
              style={{ borderColor: `color-mix(in srgb, ${menuColors.answer} 15%, transparent)` }}
            >
              <Search className="h-4 w-4 opacity-50" />
              <input
                autoFocus
                data-rsvp-country-search={searchInputId}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="국가 검색"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto py-1">
              {filtered.map((c, i) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(c);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                    style={
                      i === highlightedIndex
                        ? { backgroundColor: `color-mix(in srgb, ${menuColors.answer} 12%, transparent)` }
                        : undefined
                    }
                  >
                    <span>{countryCodeToFlagEmoji(c)}</span>
                    <span className="min-w-0 flex-1 truncate">{countryDisplayName(c)}</span>
                    <span className="opacity-60">+{getCountryCallingCode(c)}</span>
                    {c === value && <Check className="h-4 w-4" />}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-sm opacity-50">검색 결과 없음</li>
              )}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}
