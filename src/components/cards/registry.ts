/**
 * Central home card registry.
 *
 * Features register their cards declaratively at module load; the
 * home screen renders whatever the registry yields. Registration
 * order is stable, so priority ties resolve deterministically.
 */
import type { HomeCardDefinition } from './types';

const registry: HomeCardDefinition[] = [];

export function registerHomeCard(definition: HomeCardDefinition): void {
  if (registry.some((card) => card.id === definition.id)) {
    throw new Error(`Home card "${definition.id}" is already registered`);
  }
  registry.push(definition);
}

export function listHomeCards(): readonly HomeCardDefinition[] {
  return registry;
}
