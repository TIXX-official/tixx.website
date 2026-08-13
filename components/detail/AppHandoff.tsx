import { buildHandoffScript } from '@/lib/appHandoff';

const LOGO_MASK = {
  maskImage: 'url(/tixx-logo.png)',
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskImage: 'url(/tixx-logo.png)',
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
} as const;

/**
 * Automatic handoff to the native app for visitors who open an event or host
 * detail link inside an in-app browser (KakaoTalk, Instagram, …), where
 * Universal Links never fire. See `lib/appHandoff.ts` for the per-platform
 * strategy and for how the target is read off the path.
 *
 * Rendered from the marketing layout as the first thing in <body>, so the
 * render-blocking script runs before any visible markup is parsed — that is
 * what keeps the web page from flashing. It no-ops on every other page.
 *
 * The interstitial is server-rendered and hidden by CSS until the script adds
 * `.app-handoff` to <html>; nothing is built in JS, so there is no flash on the
 * way in either. When the app isn't installed the class comes back off and the
 * visitor just reads the web page.
 *
 * The language split can't go through LanguageContext: this runs long before
 * React hydrates, so both strings ship and CSS picks one off `navigator.language`.
 */
export function AppHandoff() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: buildHandoffScript() }} />
      <div id='app-handoff-overlay' role='status'>
        <div className='flex flex-col items-center gap-6'>
          <div className='h-16 w-16 bg-white' style={LOGO_MASK} />
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-grayscale-700 border-t-point-500' />
          <p className='text-sm text-grayscale-400'>
            <span className='handoff-ko'>앱에서 여는 중...</span>
            <span className='handoff-en'>Opening in the app...</span>
          </p>
        </div>
      </div>
    </>
  );
}
