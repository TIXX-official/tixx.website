import { describe, expect, it } from 'vitest';
import { classifyWebPath, sanitizeAnalyticsProperties } from './analytics';

describe('classifyWebPath', () => {
  it.each([
    ['/forms/abc123', 'rsvp_form', '/forms/:id'],
    ['/forms/abc123/preview', 'rsvp_form_preview', '/forms/:id/preview'],
    ['/events/42/rsvp', 'event_rsvp', '/events/:id/rsvp'],
    ['/events/42', 'event_detail', '/events/:id'],
    ['/open/hosts/7', 'host_detail', '/hosts/:id'],
    ['/download', 'download', '/download'],
  ])('classifies %s without exposing its dynamic id in the path template', (path, pageType, pathTemplate) => {
    expect(classifyWebPath(path)).toEqual({ pageType, pathTemplate });
  });
});

describe('sanitizeAnalyticsProperties', () => {
  it('drops sensitive properties and keeps allowlisted analytics context', () => {
    expect(
      sanitizeAnalyticsProperties({
        form_id: 'public-id',
        surface: 'custom_rsvp_complete',
        phone: '+821012345678',
        guest_code: 'SECRET',
        answers: 'private',
        full_url: 'https://tixx.im/forms/abc?code=SECRET',
      }),
    ).toEqual({
      form_id: 'public-id',
      surface: 'custom_rsvp_complete',
    });
  });

  it('truncates unexpectedly long string properties', () => {
    expect(sanitizeAnalyticsProperties({ failure_code: 'x'.repeat(250) }).failure_code).toHaveLength(200);
  });
});

