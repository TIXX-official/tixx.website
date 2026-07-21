import ReactMarkdown from 'react-markdown';
import type { Term } from '@/lib/api/types';

const markdownComponents = {
  h1: (props: React.ComponentPropsWithoutRef<'h1'>) => (
    <h2 className="text-2xl font-bold text-white mt-10 mb-4 first:mt-0" {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => (
    <h3 className="text-xl font-bold text-white mt-8 mb-3" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <h4 className="text-lg font-semibold text-white mt-6 mb-2" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p className="text-zinc-400 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc list-outside pl-5 text-zinc-400 leading-relaxed mb-4 space-y-1" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol className="list-decimal list-outside pl-5 text-zinc-400 leading-relaxed mb-4 space-y-1" {...props} />
  ),
  a: (props: React.ComponentPropsWithoutRef<'a'>) => (
    <a className="text-neon-lime hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  strong: (props: React.ComponentPropsWithoutRef<'strong'>) => (
    <strong className="text-white font-semibold" {...props} />
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-500 italic mb-4" {...props} />
  ),
};

export function LegalDocument({ term, anchor }: { term: Term; anchor?: string }) {
  return (
    <section id={anchor} className="scroll-mt-24">
      <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{term.title}</h1>
      <p className="text-xs text-zinc-600 mb-8">
        시행일 {term.effectiveAt.slice(0, 10)}
      </p>
      <div className="font-kr">
        <ReactMarkdown components={markdownComponents}>{term.content}</ReactMarkdown>
      </div>
    </section>
  );
}
