'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'APP', href: '/app' },
    { name: 'BUSINESS', href: '/business' },
    { name: 'ABOUT', href: '/about' },
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

          <Link
            href='/download'
            className='hidden md:block px-6 py-2 bg-neon-lime text-black rounded-full text-sm font-bold hover:bg-[#eef540] transition-colors shadow-[0_0_15px_rgba(242,248,98,0.3)]'
          >
            App Download
          </Link>

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
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
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
            <Link
              href='/download'
              onClick={() => setMobileMenuOpen(false)}
              className='px-6 py-2 bg-neon-lime text-black rounded-full text-sm font-bold hover:bg-[#eef540] transition-colors shadow-[0_0_15px_rgba(242,248,98,0.3)] text-center'
            >
              App Download
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
