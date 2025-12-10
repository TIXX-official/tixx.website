'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy, Check, Mail } from 'lucide-react';

export default function ContactForm() {
  const [copied, setCopied] = useState(false);
  const email = 'tixxofficial@tixx.im';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id='contact'
      className='py-32 bg-zinc-950 border-t border-zinc-900'
    >
      <div className='container mx-auto max-w-3xl px-6 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-16'
        >
          <h2 className='text-neon-lime font-bold text-sm md:text-base tracking-[0.3em] mb-4 uppercase'>
            Contact
          </h2>
          <h3 className='text-4xl md:text-6xl font-black font-display text-white mb-6'>
            Be the Next <br />
            Culture Trend.
          </h3>
          <p className='text-xl text-zinc-400 font-kr mb-12'>
            TIXX와 함께 귀사의 브랜드를 하나의 문화로 만드세요. <br />
            업체명, 담당자 성함, 연락처를 포함하여 메일을 보내주시면 빠른 확인이 가능합니다.
          </p>

          <div className="flex flex-col items-center gap-6">

            {/* Email Display & Copy Box */}
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-full pl-8 pr-2 py-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-wide">{email}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-3 rounded-full transition-colors font-bold text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-neon-lime" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "주소 복사하기"}
              </button>
            </div>

            {/* Direct Mail Button */}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-neon-lime transition-colors mt-4"
            >
              <Mail className="w-5 h-5" />
              <span>메일 앱으로 바로 보내기</span>
            </a>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
