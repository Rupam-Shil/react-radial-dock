type GsapModule = typeof import('gsap');

let cached: GsapModule['default'] | GsapModule | null = null;

export class GsapMissingError extends Error {
  constructor() {
    super(
      '[react-radial-dock] gsap is required as a peer dependency. ' +
        'Install it with: npm i gsap',
    );
    this.name = 'GsapMissingError';
  }
}

export async function loadGsap(): Promise<GsapModule['default']> {
  if (cached && 'timeline' in cached) return cached as GsapModule['default'];
  try {
    const mod = (await import('gsap')) as GsapModule;
    const g = mod.default ?? (mod as unknown as GsapModule['default']);
    cached = g;
    return g;
  } catch {
    throw new GsapMissingError();
  }
}
