import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Term } from '@/lib/api/types';
import { effectiveDateKST } from '@/lib/format/termsDate';

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
  table: (props: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-left border-collapse" {...props} />
    </div>
  ),
  thead: (props: React.ComponentPropsWithoutRef<'thead'>) => (
    <thead className="border-b border-zinc-700" {...props} />
  ),
  tr: (props: React.ComponentPropsWithoutRef<'tr'>) => (
    <tr className="border-b border-zinc-800" {...props} />
  ),
  th: (props: React.ComponentPropsWithoutRef<'th'>) => (
    <th className="py-2 pr-4 text-white font-semibold whitespace-nowrap" {...props} />
  ),
  td: (props: React.ComponentPropsWithoutRef<'td'>) => (
    <td className="py-2 pr-4 text-zinc-400 align-top" {...props} />
  ),
};

export function LegalDocument({
  term,
  anchor,
  badge,
}: {
  term: Term;
  anchor?: string;
  badge?: string;
}) {
  return (
    <section id={anchor} className="scroll-mt-24">
      <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{term.title}</h1>
      {badge && (
        <p className="inline-block text-xs text-black bg-neon-lime font-semibold px-2 py-0.5 rounded mb-3">
          {badge}
        </p>
      )}
      <p className="text-xs text-zinc-600 mb-8">
        시행일 {effectiveDateKST(term.effectiveAt)}
      </p>
      <div className="font-kr">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {term.content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
