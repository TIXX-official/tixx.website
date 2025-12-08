'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

export default function ContactForm() {
  const [company, setCompany] = useState('');
  const [person, setPerson] = useState('');
  const [contact, setContact] = useState('');
  const [inquiryType, setInquiryType] = useState('입점 문의 (Club/Lounge)');
  const [message, setMessage] = useState('');

  const mailtoHref = useMemo(() => {
    const subject = `[TIXX] ${inquiryType} 문의`;
    const bodyTemplate = [
      `Company Name: ${company || '업체명'}`,
      `Contact Person: ${person || '담당자 성함'}`,
      `Email / Phone: ${contact || '연락처'}`,
      `Inquiry Type: ${inquiryType}`,
      '',
      'Message:',
      message || '문의 내용을 자유롭게 적어주세요.',
    ].join('\n');

    return `mailto:tixxofficial@tixx.im?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyTemplate)}`;
  }, [company, contact, inquiryType, message, person]);

  return (
    <section
      id='contact'
      className='py-32 bg-zinc-950 border-t border-zinc-900'
    >
      <div className='container mx-auto max-w-3xl px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-black font-display text-white mb-4'>
            Contact Us
          </h2>
          <p className='text-zinc-400 font-kr'>
            TIXX와 함께 씬을 만들어갈 파트너를 기다립니다.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='space-y-6'
          onSubmit={(e) => e.preventDefault()}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-500 uppercase tracking-wider'>
                Company Name
              </label>
              <input
                type='text'
                className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors'
                placeholder='업체명'
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-500 uppercase tracking-wider'>
                Contact Person
              </label>
              <input
                type='text'
                className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors'
                placeholder='담당자 성함'
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-zinc-500 uppercase tracking-wider'>
              Email / Phone
            </label>
            <input
              type='text'
              className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors'
              placeholder='연락처'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-zinc-500 uppercase tracking-wider'>
              Inquiry Type
            </label>
            <select
              className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors appearance-none'
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
            >
              <option>입점 문의 (Club/Lounge)</option>
              <option>기획 대행 문의 (Agency)</option>
              <option>제작 문의 (Creative)</option>
              <option>기타 제휴</option>
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-zinc-500 uppercase tracking-wider'>
              Message
            </label>
            <textarea
              rows={4}
              className='w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime transition-colors'
              placeholder='문의 내용을 자유롭게 적어주세요.'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <a
            className='block w-full bg-neon-lime text-black text-center font-bold text-lg py-4 rounded-xl hover:bg-[#eef540] transition-colors mt-8'
            href={mailtoHref}
          >
            기본 메일 앱으로 보내기
          </a>
          <p className='text-xs text-zinc-500 text-center'>
            메일 앱에서 현재 입력된 정보가 템플릿으로 채워집니다.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
