'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { classifyWebPath, trackWebEvent } from '@/lib/analytics';

let lastTrackedPath: string | null = null;

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || lastTrackedPath === pathname) return;
    lastTrackedPath = pathname;

    const { pageType, pathTemplate } = classifyWebPath(pathname);
    void trackWebEvent('web_page_view', {
      page_type: pageType,
      path_template: pathTemplate,
    });
  }, [pathname]);

  return children;
}

