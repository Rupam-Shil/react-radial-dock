import { describe, it, expect, vi } from 'vitest';
import { loadGsap, GsapMissingError } from '../src/gsap-loader';

describe('loadGsap', () => {
  it('returns gsap when peer is installed', async () => {
    const g = await loadGsap();
    expect(g).toBeTruthy();
    expect(typeof g.timeline).toBe('function');
  });
  it('exports GsapMissingError', () => {
    const err = new GsapMissingError();
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('GsapMissingError');
  });
});
