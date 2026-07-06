/**
 * Generates supabase/seed/02_pantry_intelligence.sql from the bundled
 * seed modules in src/lib/seed/ — the single source of truth.
 *
 * Run with: pnpm seed:generate
 * Never edit the generated SQL by hand.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEED_DISHES, SEED_INGREDIENTS, SEED_TRANSFORMATIONS } from '../src/lib/seed';

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlTextArray(values: readonly string[]): string {
  if (values.length === 0) return `'{}'::text[]`;
  return `array[${values.map(sqlString).join(', ')}]::text[]`;
}

function sqlJsonb(value: unknown): string {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function sqlNumberOrNull(value: number | null): string {
  return value === null ? 'null' : String(value);
}

const lines: string[] = [
  '-- ============================================================',
  '-- Pravah — pantry intelligence seed (GENERATED FILE)',
  '-- Source of truth: src/lib/seed/ — regenerate with pnpm seed:generate',
  '-- ============================================================',
  '',
  '-- ---------- ingredients ----------',
];

for (const i of SEED_INGREDIENTS) {
  lines.push(
    `insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)`,
    `values (${sqlString(i.id)}, ${sqlString(i.name)}, ${sqlTextArray(i.name_aliases)}, ${sqlString(
      i.category,
    )}, ${sqlNumberOrNull(i.default_shelf_life_days)}, ${i.is_staple})`,
    `on conflict (id) do nothing;`,
  );
}

lines.push('', '-- ---------- dishes ----------');

for (const d of SEED_DISHES) {
  lines.push(
    `insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)`,
    `values (${sqlString(d.id)}, ${sqlString(d.name)}, ${sqlTextArray(d.slot_tags)}, ${
      d.prep_minutes
    }, ${d.effort_score}, ${d.protein_g}, ${d.calories}, ${sqlJsonb(d.ingredients)}, ${sqlJsonb(
      d.method_steps,
    )}, ${sqlTextArray(d.tags)})`,
    `on conflict (id) do nothing;`,
  );
}

lines.push('', '-- ---------- leftover_transformations ----------');

for (const t of SEED_TRANSFORMATIONS) {
  lines.push(
    `insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)`,
    `values (${sqlString(t.id)}, ${sqlString(t.base_category)}, ${sqlString(
      t.dish_id,
    )}, ${sqlTextArray(t.extra_staples)}, ${t.active})`,
    `on conflict (id) do nothing;`,
  );
}

lines.push('');

const outPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
  'seed',
  '02_pantry_intelligence.sql',
);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join('\n'));

// eslint-disable-next-line no-console
console.log(
  `Wrote ${outPath}: ${SEED_INGREDIENTS.length} ingredients, ${SEED_DISHES.length} dishes, ${SEED_TRANSFORMATIONS.length} transformations`,
);
