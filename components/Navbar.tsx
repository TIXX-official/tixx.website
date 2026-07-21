'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';
import { dictionary } from '@/lib/dictionary';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = dictionary[language].navbar;
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === '1';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isEmbed) return null;

  const links = [
    { name: t.app, href: '/app' },
    { name: t.business, href: '/business' },
    { name: t.about, href: '/about' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 transition-all duration-300',
          scrolled ? 'glass-nav' : 'bg-transparent'
        )}
      >
        <Link href='/' className='flex items-center gap-3 cursor-pointer group'>
          <div className='relative w-10 h-10'>
            <div
              className='w-full h-full bg-white group-hover:bg-neon-lime transition-colors duration-300'
              style={{
                maskImage: 'url(/tixx-logo.png)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: 'url(/tixx-logo.png)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            />
          </div>
          <span className='text-3xl font-black tracking-tighter text-white group-hover:text-neon-lime transition-colors'>
            TIXX
          </span>
        </Link>

        <div className='flex items-center gap-8'>
          <div className='hidden md:flex items-center gap-8'>
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='text-sm font-semibold tracking-wide text-zinc-400 hover:text-neon-lime transition-colors'
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-bold text-white hover:text-neon-lime transition-colors"
              suppressHydrationWarning
            >
              {language === 'KO' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                    <path fill="#fff" fillRule="evenodd" d="M0 0h512v512H0Z" />
                    <g fillRule="evenodd" transform="rotate(-56.3 367.2 -111.2)scale(9.375)">
                      <g id="kr-b-d">
                        <path id="kr-a-d" fill="#000001" d="M-6-26H6v2H-6Zm0 3H6v2H-6Zm0 3H6v2H-6Z" />
                        <use href="#kr-a-d" width="100%" height="100%" y="44" />
                      </g>
                      <path stroke="#fff" d="M0 17v10" />
                      <path fill="#cd2e3a" d="M0-12a12 12 0 0 1 0 24Z" />
                      <path fill="#0047a0" d="M0-12a12 12 0 0 0 0 24A6 6 0 0 0 0 0Z" />
                      <circle cy="-6" r="6" fill="#cd2e3a" />
                    </g>
                    <g fillRule="evenodd" transform="rotate(-123.7 196.5 59.5)scale(9.375)">
                      <use href="#kr-b-d" width="100%" height="100%" />
                      <path stroke="#fff" d="M0-23.5v3M0 17v3.5m0 3v3" />
                    </g>
                  </svg>
                  KO
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                    <mask id="us-mask"><circle cx="256" cy="256" r="256" fill="#fff" /></mask>
                    <g mask="url(#us-mask)">
                      <path fill="#b22234" d="M0 0h512v512H0z" />
                      <path fill="#fff" d="M0 45h512v45H0zm0 90h512v45H0zm0 90h512v45H0zm0 90h512v45H0zm0 90h512v45H0z" />
                      <path fill="#3c3b6e" d="M0 0h256v270H0z" />
                      <g fill="#fff">
                        <g id="s">
                          <g id="c">
                            <path id="t" d="M30 18l3.1 9.5h10L35 33.4l3.1 9.5-8.1-5.9-8.1 5.9 3.1-9.5L16.9 27.5h10z" />
                            <use xlinkHref="#t" x="33" />
                            <use xlinkHref="#t" x="66" />
                            <use xlinkHref="#t" x="99" />
                            <use xlinkHref="#t" x="132" />
                            <use xlinkHref="#t" x="165" />
                          </g>
                          <use xlinkHref="#c" y="27" />
                          <use xlinkHref="#c" y="54" />
                          <use xlinkHref="#c" y="81" />
                          <use xlinkHref="#c" y="108" />
                          <use xlinkHref="#c" y="135" />
                          <use xlinkHref="#c" y="162" />
                          <use xlinkHref="#c" y="189" />
                          <use xlinkHref="#c" y="216" />
                        </g>
                        <use xlinkHref="#s" x="16.5" y="13.5" />
                      </g>
                    </g>
                  </svg>
                  EN
                </>
              )}
            </button>
            <Link
              href='/download'
              className='hidden md:block px-6 py-2 bg-neon-lime text-black rounded-full text-sm font-bold hover:bg-[#eef540] transition-colors shadow-[0_0_15px_rgba(242,248,98,0.3)]'
            >
              {t.download}
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden text-white text-xl'
            aria-label='Toggle mobile menu'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              {mobileMenuOpen ? (
                <>
                  <line x1='18' x2='6' y1='6' y2='18' />
                  <line x1='6' x2='18' y1='6' y2='18' />
                </>
              ) : (
                <>
                  <line x1='3' x2='21' y1='6' y2='6' />
                  <line x1='3' x2='21' y1='12' y2='12' />
                  <line x1='3' x2='21' y1='18' y2='18' />
                </>
              )}
            </svg>
          </button>
        </div>
      </motion.nav >

      {/* Mobile Menu */}
      {
        mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='fixed top-16 left-0 right-0 z-40 md:hidden glass-nav'
          >
            <div className='flex flex-col px-6 py-4 gap-4'>
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className='text-sm font-semibold tracking-wide text-zinc-400 hover:text-neon-lime transition-colors py-2'
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className='flex items-center gap-2 text-sm font-bold text-white hover:text-neon-lime transition-colors py-2 text-left'
                suppressHydrationWarning
              >
                {language === 'KO' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                      <path fill="#fff" fillRule="evenodd" d="M0 0h512v512H0Z" />
                      <g fillRule="evenodd" transform="rotate(-56.3 367.2 -111.2)scale(9.375)">
                        <g id="kr-b-m">
                          <path id="kr-a-m" fill="#000001" d="M-6-26H6v2H-6Zm0 3H6v2H-6Zm0 3H6v2H-6Z" />
                          <use href="#kr-a-m" width="100%" height="100%" y="44" />
                        </g>
                        <path stroke="#fff" d="M0 17v10" />
                        <path fill="#cd2e3a" d="M0-12a12 12 0 0 1 0 24Z" />
                        <path fill="#0047a0" d="M0-12a12 12 0 0 0 0 24A6 6 0 0 0 0 0Z" />
                        <circle cy="-6" r="6" fill="#cd2e3a" />
                      </g>
                      <g fillRule="evenodd" transform="rotate(-123.7 196.5 59.5)scale(9.375)">
                        <use href="#kr-b-m" width="100%" height="100%" />
                        <path stroke="#fff" d="M0-23.5v3M0 17v3.5m0 3v3" />
                      </g>
                    </svg>
                    한국어
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                      <mask id="us-mask-m"><circle cx="256" cy="256" r="256" fill="#fff" /></mask>
                      <g mask="url(#us-mask-m)">
                        <path fill="#b22234" d="M0 0h512v512H0z" />
                        <path fill="#fff" d="M0 45h512v45H0zm0 90h512v45H0zm0 90h512v45H0zm0 90h512v45H0zm0 90h512v45H0z" />
                        <path fill="#3c3b6e" d="M0 0h256v270H0z" />
                        <g fill="#fff">
                          <g id="s-m">
                            <g id="c-m">
                              <path id="t-m" d="M30 18l3.1 9.5h10L35 33.4l3.1 9.5-8.1-5.9-8.1 5.9 3.1-9.5L16.9 27.5h10z" />
                              <use xlinkHref="#t-m" x="33" />
                              <use xlinkHref="#t-m" x="66" />
                              <use xlinkHref="#t-m" x="99" />
                              <use xlinkHref="#t-m" x="132" />
                              <use xlinkHref="#t-m" x="165" />
                            </g>
                            <use xlinkHref="#c-m" y="27" />
                            <use xlinkHref="#c-m" y="54" />
                            <use xlinkHref="#c-m" y="81" />
                            <use xlinkHref="#c-m" y="108" />
                            <use xlinkHref="#c-m" y="135" />
                            <use xlinkHref="#c-m" y="162" />
                            <use xlinkHref="#c-m" y="189" />
                            <use xlinkHref="#c-m" y="216" />
                          </g>
                          <use xlinkHref="#s-m" x="16.5" y="13.5" />
                        </g>
                      </g>
                    </svg>
                    English
                  </>
                )}
              </button>
              <Link
                href='/download'
                onClick={() => setMobileMenuOpen(false)}
                className='px-6 py-2 bg-neon-lime text-black rounded-full text-sm font-bold hover:bg-[#eef540] transition-colors shadow-[0_0_15px_rgba(242,248,98,0.3)] text-center'
              >
                {t.download}
              </Link>
            </div>
          </motion.div>
        )
      }
    </>
  );
}
