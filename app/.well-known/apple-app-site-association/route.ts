import { NextResponse } from 'next/server';

// iOS Universal Links: tells the OS that tixx.im owns /events/* and /hosts/*
// for the native app (Team ID 7M876967M4, bundle id com.tixx.mobile). Must be
// served with no redirects and application/json content-type.
export function GET() {
  return NextResponse.json({
    applinks: {
      details: [
        {
          appID: '7M876967M4.com.tixx.mobile',
          paths: ['/events/*', '/hosts/*'],
        },
      ],
    },
  });
}
