/**
 * Seed ingredients — the normalised ingredient catalog.
 *
 * Canonical source of truth: this module generates
 * supabase/seed/02_pantry_intelligence.sql and is bundled into the
 * app as the offline catalog. Never edit the generated SQL directly.
 *
 * Conventions:
 * - The 12 canonical Indian staples carry `is_staple: true` and no
 *   shelf life (they are always-on until grocery ingestion exists).
 * - Basic masala-dabba spices are catalogued for search but are not
 *   listed as dish dependencies — every Indian kitchen is assumed to
 *   have them.
 * - `name_aliases` feed pantry search and, later, SKU matching.
 */
import type { Ingredient, IngredientCategory } from '@/types/domain';
import { seedId } from './ids';

let counter = 0;

function ing(
  name: string,
  category: IngredientCategory,
  shelfLifeDays: number | null,
  aliases: string[] = [],
  isStaple = false,
): Ingredient {
  counter += 1;
  return {
    id: seedId('ingredient', counter),
    name,
    name_aliases: aliases,
    category,
    default_shelf_life_days: shelfLifeDays,
    is_staple: isStaple,
  };
}

/** Keyed catalog — reference ingredients as ING.atta.id etc. */
export const ING = {
  // The 12 canonical staples
  atta: ing('atta', 'grain', null, ['wheat flour', 'whole wheat flour'], true),
  rice: ing('rice', 'grain', null, ['chawal', 'basmati'], true),
  dal: ing('dal', 'staple', null, ['toor dal', 'arhar dal', 'lentils'], true),
  onions: ing('onions', 'vegetable', null, ['pyaaz', 'onion'], true),
  ghee: ing('ghee', 'staple', null, ['clarified butter'], true),
  oil: ing('oil', 'staple', null, ['cooking oil', 'mustard oil', 'sunflower oil'], true),
  salt: ing('salt', 'staple', null, ['namak'], true),
  sugar: ing('sugar', 'staple', null, ['cheeni'], true),
  tea: ing('tea', 'staple', null, ['chai patti', 'tea leaves'], true),
  milk: ing('milk', 'dairy', null, ['doodh', 'toned milk'], true),
  curd: ing('curd', 'dairy', null, ['dahi', 'yogurt'], true),
  eggs: ing('eggs', 'protein', null, ['anda', 'egg'], true),

  // Vegetables
  tomatoes: ing('tomatoes', 'vegetable', 5, ['tamatar', 'tomato']),
  potatoes: ing('potatoes', 'vegetable', 21, ['aloo', 'potato']),
  palak: ing('palak', 'vegetable', 3, ['spinach']),
  methi: ing('methi', 'vegetable', 3, ['fenugreek leaves']),
  coriander: ing('coriander', 'vegetable', 4, ['dhania', 'cilantro']),
  greenChillies: ing('green chillies', 'vegetable', 7, ['hari mirch', 'chilli']),
  ginger: ing('ginger', 'vegetable', 14, ['adrak']),
  garlic: ing('garlic', 'vegetable', 21, ['lehsun']),
  capsicum: ing('capsicum', 'vegetable', 7, ['shimla mirch', 'bell pepper']),
  cauliflower: ing('cauliflower', 'vegetable', 7, ['gobi', 'phool gobi']),
  cabbage: ing('cabbage', 'vegetable', 10, ['patta gobi']),
  bhindi: ing('bhindi', 'vegetable', 4, ['okra', 'lady finger']),
  lauki: ing('lauki', 'vegetable', 7, ['bottle gourd', 'doodhi', 'ghiya']),
  greenBeans: ing('green beans', 'vegetable', 5, ['beans', 'french beans']),
  carrots: ing('carrots', 'vegetable', 14, ['gajar', 'carrot']),
  peas: ing('peas', 'vegetable', 7, ['matar', 'green peas']),
  cucumber: ing('cucumber', 'vegetable', 5, ['kheera', 'kakdi']),
  beetroot: ing('beetroot', 'vegetable', 14, ['chukandar']),
  mushrooms: ing('mushrooms', 'vegetable', 3, ['mushroom', 'button mushroom']),
  springOnions: ing('spring onions', 'vegetable', 4, ['hara pyaaz', 'scallions']),
  curryLeaves: ing('curry leaves', 'vegetable', 5, ['kadi patta']),
  lemon: ing('lemon', 'vegetable', 14, ['nimbu', 'lime']),
  mint: ing('mint', 'vegetable', 3, ['pudina']),
  baingan: ing('baingan', 'vegetable', 5, ['brinjal', 'eggplant', 'aubergine']),
  pumpkin: ing('pumpkin', 'vegetable', 10, ['kaddu', 'sitaphal']),

  // Dairy
  paneer: ing('paneer', 'dairy', 4, ['cottage cheese']),
  butter: ing('butter', 'dairy', 30, ['makkhan']),
  cheese: ing('cheese', 'dairy', 15, ['processed cheese', 'cheese slice']),
  cream: ing('cream', 'dairy', 5, ['malai', 'fresh cream']),

  // Proteins
  chicken: ing('chicken', 'protein', 2, ['murgh', 'chicken breast', 'chicken curry cut']),
  fish: ing('fish', 'protein', 1, ['machli', 'rohu', 'surmai']),
  soyaChunks: ing('soya chunks', 'protein', 180, ['soya', 'nutri nuggets']),
  chana: ing('chana', 'protein', 180, ['chickpeas', 'chole', 'kabuli chana']),
  rajma: ing('rajma', 'protein', 180, ['kidney beans']),
  moong: ing('moong', 'protein', 180, ['moong dal', 'green gram']),
  sprouts: ing('sprouts', 'protein', 2, ['moong sprouts', 'sprouted moong']),
  tofu: ing('tofu', 'protein', 5, ['soya paneer']),
  peanuts: ing('peanuts', 'protein', 90, ['moongphali', 'groundnuts']),

  // Grains & flours
  poha: ing('poha', 'grain', 90, ['flattened rice', 'chivda']),
  suji: ing('suji', 'grain', 90, ['rava', 'semolina']),
  besan: ing('besan', 'grain', 90, ['gram flour', 'chickpea flour']),
  oats: ing('oats', 'grain', 180, ['rolled oats', 'masala oats']),
  bread: ing('bread', 'grain', 4, ['brown bread', 'sandwich bread']),
  vermicelli: ing('vermicelli', 'grain', 180, ['seviyan', 'semiya']),

  // Fruit
  bananas: ing('bananas', 'fruit', 4, ['kela', 'banana']),
  apples: ing('apples', 'fruit', 14, ['seb', 'apple']),
  oranges: ing('oranges', 'fruit', 10, ['santra', 'orange']),
  papaya: ing('papaya', 'fruit', 4, ['papita']),
  pomegranate: ing('pomegranate', 'fruit', 7, ['anaar']),
  grapes: ing('grapes', 'fruit', 5, ['angoor']),
  mango: ing('mango', 'fruit', 5, ['aam', 'alphonso']),

  // Masala dabba — catalogued for search, assumed present in every kitchen
  jeera: ing('jeera', 'spice', null, ['cumin', 'cumin seeds']),
  haldi: ing('haldi', 'spice', null, ['turmeric']),
  redChilliPowder: ing('red chilli powder', 'spice', null, ['lal mirch', 'chilli powder']),
  garamMasala: ing('garam masala', 'spice', null, []),
  mustardSeeds: ing('mustard seeds', 'spice', null, ['rai', 'sarson']),
  hing: ing('hing', 'spice', null, ['asafoetida']),
  blackPepper: ing('black pepper', 'spice', null, ['kali mirch', 'pepper']),
  chaatMasala: ing('chaat masala', 'spice', null, []),

  // Other
  peanutButter: ing('peanut butter', 'other', 90, ['pb']),
  jaggery: ing('jaggery', 'other', 180, ['gur', 'gud']),
} as const;

export type IngredientKey = keyof typeof ING;

export const SEED_INGREDIENTS: Ingredient[] = Object.values(ING);

/** The 12 canonical staples, in display order for the baseline grid. */
export const CANONICAL_STAPLES: Ingredient[] = [
  ING.atta,
  ING.rice,
  ING.dal,
  ING.onions,
  ING.ghee,
  ING.oil,
  ING.salt,
  ING.sugar,
  ING.tea,
  ING.milk,
  ING.curd,
  ING.eggs,
];
