// src/presets/index.ts
import { spring } from './spring';
import { fade } from './fade';
import { pop } from './pop';
import { stagger } from './stagger';
import { iris } from './iris';
import type { RadialDockAnimationCustom, RadialDockAnimationName } from '../types';

export { spring, fade, pop, stagger, iris };

export const presets: Record<RadialDockAnimationName, RadialDockAnimationCustom> = {
  spring,
  fade,
  pop,
  stagger,
  iris,
};
