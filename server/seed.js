import { many, one, query } from './db.js';
import { hashPassword } from './auth.js';

const IMG = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const C = {
  charcoal: { name: 'Charcoal', hex: '#2B2B2B' },
  black: { name: 'Black', hex: '#111111' },
  stone: { name: 'Stone', hex: '#C9C0B2' },
  navy: { name: 'Navy', hex: '#20293A' },
  camel: { name: 'Camel', hex: '#A9835C' },
  olive: { name: 'Olive', hex: '#55584A' },
  ecru: { name: 'Ecru', hex: '#E6E0D4' },
  brown: { name: 'Chestnut', hex: '#6B4A33' },
  grey: { name: 'Grey', hex: '#8A8A85' },
};

const CLOTHING = ['S', 'M', 'L', 'XL', 'XXL'];
const SHIRT_SIZES = ['S', 'M', 'L', 'XL'];
const WAIST = ['30', '32', '34', '36', '38'];
const CAP_SIZES = ['S/M', 'M/L', 'L/XL'];
const SHOE_SIZES = ['7', '8', '9', '10', '11', '12'];

const categories = [
  { slug: 'suits', name: 'Suits', description: 'Timeless tailoring with character.', image: IMG('1669575903350-9a349b411810'), position: 1 },
  { slug: 'blazers', name: 'Blazers', description: 'Structured jackets, softened for everyday.', image: IMG('1594938298603-c8148c4dae35'), position: 2 },
  { slug: 'outerwear', name: 'Outerwear', description: 'Classic coats for every season.', image: IMG('1619603364937-8d7af41ef206'), position: 3 },
  { slug: 'trench-coats', name: 'Trench Coats', description: 'Rain-ready, quietly commanding.', image: IMG('1737508945707-ebdccee97cc5'), position: 4 },
  { slug: 'waistcoats', name: 'Waistcoats', description: 'The finishing layer of a considered wardrobe.', image: IMG('1775313316034-9dde306437f4'), position: 5 },
  { slug: 'shirts', name: 'Shirts', description: 'Woven in England, cut for today.', image: IMG('1642886513308-d21acc15057d'), position: 6 },
  { slug: 'trousers', name: 'Trousers', description: 'A clean line from waist to hem.', image: IMG('1619603364904-c0498317e145'), position: 7 },
  { slug: 'flat-caps', name: 'Flat Caps', description: 'An iconic look for modern times.', image: IMG('1787675629407-2b3983cdba69'), position: 8 },
  { slug: 'accessories', name: 'Accessories', description: 'The details make the difference.', image: IMG('1629139033414-76f3c0eacf84'), position: 9 },
  { slug: 'shoes', name: 'Shoes', description: 'Crafted for timeless elegance.', image: IMG('1614252235316-8c857d38b5f4'), position: 10 },
];

const products = [
  {
    slug: 'wool-overcoat',
    name: 'Wool Overcoat',
    category: 'outerwear',
    price: 299,
    compare: 349,
    description:
      'A single-breasted overcoat cut from a dense 100% wool melton. Generous through the shoulder, clean through the body — the coat that carries a whole winter wardrobe.',
    story:
      'Drawn from a 1950s Yorkshire mill pattern, the overcoat is finished with horn buttons and a hand-set collar that sits high against the wind.',
    material: '100% wool melton, 820gsm · Horn buttons · Bemberg lining',
    care: 'Dry clean only. Brush after wear, rest on a broad hanger.',
    sizes: CLOTHING,
    colors: [C.charcoal, C.camel, C.navy],
    stock: 14,
    badge: 'Icon',
    isNew: true,
    isFeatured: true,
    isBestseller: true,
    popularity: 98,
    images: [
      { id: '1619603364937-8d7af41ef206', alt: 'Model wearing a long wool overcoat' },
      { id: '1553209717-ddc5aa729bd2', alt: 'Wool overcoat worn on a city street' },
      { id: '1665832102183-b232574131ff', alt: 'Detail of the overcoat collar' },
    ],
  },
  {
    slug: 'three-piece-suit',
    name: 'Three-Piece Suit',
    category: 'suits',
    price: 349,
    compare: 399,
    description:
      'Suit, waistcoat and trouser in a mid-weight Italian wool. A half-canvassed jacket with a soft shoulder, cut for a natural, unhurried line.',
    story: 'Our most complete tailoring — built to be worn as a set, and just as easily broken apart.',
    material: '100% Italian wool · Half-canvas construction · Working cuffs',
    care: 'Dry clean. Air for 24 hours between wears.',
    sizes: CLOTHING,
    colors: [C.charcoal, C.navy],
    stock: 9,
    badge: 'Signature',
    isNew: false,
    isFeatured: true,
    isBestseller: true,
    popularity: 95,
    images: [
      { id: '1669575903350-9a349b411810', alt: 'Model in a three-piece wool suit' },
      { id: '1635205383450-e0fee6fe73c4', alt: 'Three-piece suit worn on the street' },
      { id: '1642886513448-6e6997b8de4a', alt: 'Three-piece suit in motion' },
    ],
  },
  {
    slug: 'tweed-waistcoat',
    name: 'Tweed Waistcoat',
    category: 'waistcoats',
    price: 169,
    description:
      'A five-button waistcoat in a Donegal-style tweed with flecked yarn. Cut close enough to wear under a jacket, and strong enough to wear alone.',
    story: 'Woven in the north of England on looms that have run for four generations.',
    material: '78% wool, 22% polyamide · Adjustable back cinch',
    care: 'Dry clean only.',
    sizes: CLOTHING,
    colors: [C.olive, C.brown, C.charcoal],
    stock: 22,
    badge: null,
    isNew: true,
    isFeatured: true,
    isBestseller: false,
    popularity: 82,
    images: [
      { id: '1642886513448-6e6997b8de4a', alt: 'Tweed waistcoat under a jacket' },
      { id: '1775313316034-9dde306437f4', alt: 'Tweed waistcoat detail' },
    ],
  },
  {
    slug: 'vintage-oxford-shirt',
    name: 'Vintage Oxford Shirt',
    category: 'shirts',
    price: 89,
    description:
      'A washed Oxford cotton shirt with a soft-roll button-down collar. Cut relaxed through the body with a gently curved hem.',
    story: 'Garment-washed for a broken-in hand from the first wear.',
    material: '100% organic cotton Oxford, 140gsm',
    care: 'Machine wash cold. Hang dry.',
    sizes: SHIRT_SIZES,
    colors: [C.ecru, C.stone, C.navy],
    stock: 40,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: true,
    popularity: 76,
    images: [
      { id: '1642886513308-d21acc15057d', alt: 'Oxford shirt worn open at the collar' },
      { id: '1619603364904-c0498317e145', alt: 'Oxford shirt styled with tailoring' },
    ],
  },
  {
    slug: 'peaky-flat-cap',
    name: 'Peaky Flat Cap',
    category: 'flat-caps',
    price: 79,
    description:
      'An eight-panel flat cap in pure wool tweed, with a sewn peak and a cotton twill lining. The shape that defines the EVORA silhouette.',
    story: 'Made in the same small workshop we have used since the house began.',
    material: '100% wool tweed · Cotton twill lining · Sewn peak',
    care: 'Spot clean. Reshape while damp.',
    sizes: CAP_SIZES,
    colors: [C.grey, C.brown, C.charcoal],
    stock: 31,
    badge: 'Bestseller',
    isNew: false,
    isFeatured: true,
    isBestseller: true,
    popularity: 93,
    images: [
      { id: '1787675629407-2b3983cdba69', alt: 'Grey wool flat cap' },
      { id: '1772131575602-8828196f47dc', alt: 'Flat cap worn with a field jacket' },
    ],
  },
  {
    slug: 'heritage-trench-coat',
    name: 'Heritage Trench Coat',
    category: 'trench-coats',
    price: 379,
    compare: 429,
    description:
      'A double-breasted trench in waxed cotton gabardine with a storm flap and belted waist. Built for weather, cut for the city.',
    story: 'Based on a military pattern from 1943, softened for civilian life.',
    material: 'Waxed cotton gabardine · Storm flap · Removable belt',
    care: 'Reproof annually. Sponge clean only.',
    sizes: CLOTHING,
    colors: [C.camel, C.charcoal],
    stock: 7,
    badge: 'Limited',
    isNew: true,
    isFeatured: true,
    isBestseller: false,
    popularity: 88,
    images: [
      { id: '1737508945707-ebdccee97cc5', alt: 'Model in a heritage trench coat' },
      { id: '1548454782-15b189d129ab', alt: 'Trench coat in the countryside' },
    ],
  },
  {
    slug: 'charcoal-wool-blazer',
    name: 'Charcoal Wool Blazer',
    category: 'blazers',
    price: 259,
    description:
      'An unstructured blazer in charcoal wool with patch pockets and a soft, natural shoulder. Tailoring without ceremony.',
    story: 'The jacket we reach for first — with flannel trousers or worn-in denim.',
    material: '100% wool flannel · Patch pockets · Unlined back',
    care: 'Dry clean. Steam to refresh.',
    sizes: CLOTHING,
    colors: [C.charcoal, C.navy, C.olive],
    stock: 18,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: true,
    popularity: 79,
    images: [
      { id: '1594938298603-c8148c4dae35', alt: 'Charcoal wool blazer' },
      { id: '1679101893310-9b9adb4b733b', alt: 'Charcoal blazer worn in town' },
    ],
  },
  {
    slug: 'donegal-tweed-suit',
    name: 'Donegal Tweed Suit',
    category: 'suits',
    price: 399,
    description:
      'A soft-shouldered suit in speckled Donegal tweed. Cut with a fuller trouser and a jacket that moves with you.',
    story: 'Tweed with character — the fleck in the yarn is the signature.',
    material: '100% Donegal wool · Full lining · Two-button front',
    care: 'Dry clean only.',
    sizes: CLOTHING,
    colors: [C.brown, C.olive],
    stock: 6,
    badge: 'Craft',
    isNew: true,
    isFeatured: false,
    isBestseller: false,
    popularity: 71,
    images: [
      { id: '1779870634540-cad76818bc85', alt: 'Donegal tweed suit with a flat cap' },
      { id: '1665832102183-b232574131ff', alt: 'Donegal tweed suit detail' },
    ],
  },
  {
    slug: 'prince-of-wales-trousers',
    name: 'Prince of Wales Trousers',
    category: 'trousers',
    price: 129,
    description:
      'Pleated trousers in a Prince of Wales check with a high rise, side adjusters and a tapered leg.',
    story: 'Cut from a cloth first drawn for a country house weekend.',
    material: '96% wool, 4% elastane · Side adjusters · Unhemmed',
    care: 'Dry clean only.',
    sizes: WAIST,
    colors: [C.grey, C.charcoal],
    stock: 24,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    popularity: 62,
    images: [
      { id: '1619603364904-c0498317e145', alt: 'Checked wool trousers' },
      { id: '1642886513308-d21acc15057d', alt: 'Checked trousers styled with a coat' },
    ],
  },
  {
    slug: 'oxford-brogue',
    name: 'Oxford Brogue',
    category: 'shoes',
    price: 219,
    compare: 245,
    description:
      'A full-brogue Oxford in chestnut calf leather, Goodyear-welted onto a leather sole. The shoe that improves with every season.',
    story: 'Bench-made in Northamptonshire by a workshop of eleven.',
    material: 'Full-grain calf leather · Goodyear welt · Leather sole',
    care: 'Cedar trees between wears. Cream polish monthly.',
    sizes: SHOE_SIZES,
    colors: [C.brown, C.black],
    stock: 16,
    badge: 'Craft',
    isNew: false,
    isFeatured: false,
    isBestseller: true,
    popularity: 84,
    images: [
      { id: '1614252235316-8c857d38b5f4', alt: 'Brown leather brogue shoes' },
      { id: '1533867617858-e7b97e060509', alt: 'Pair of brown leather shoes' },
    ],
  },
  {
    slug: 'leather-derby-boot',
    name: 'Leather Derby Boot',
    category: 'shoes',
    price: 249,
    description:
      'A sturdy derby boot in oiled leather with a commando sole. Built for wet pavements and long walks home.',
    story: 'The boot that pairs with tweed as readily as with denim.',
    material: 'Oiled leather upper · Commando rubber sole',
    care: 'Wax regularly. Re-sole with a cobbler.',
    sizes: SHOE_SIZES,
    colors: [C.brown, C.black],
    stock: 11,
    badge: null,
    isNew: true,
    isFeatured: false,
    isBestseller: false,
    popularity: 68,
    images: [
      { id: '1479064555552-3ef4979f8908', alt: 'Brown leather derby boots' },
      { id: '1668069226492-508742b03147', alt: 'Black leather boots' },
    ],
  },
  {
    slug: 'suede-chelsea-boot',
    name: 'Suede Chelsea Boot',
    category: 'shoes',
    price: 229,
    description:
      'A clean Chelsea boot in tobacco suede with elastic gussets and a stacked leather heel.',
    story: 'Quietly formal, quietly practical.',
    material: 'Italian suede · Leather lining · Stacked heel',
    care: 'Brush with a suede brush. Protect before first wear.',
    sizes: SHOE_SIZES,
    colors: [C.camel, C.brown],
    stock: 13,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    popularity: 58,
    images: [
      { id: '1668069226492-508742b03147', alt: 'Suede Chelsea boots' },
      { id: '1603191659812-ee978eeeef76', alt: 'Suede boots on leather' },
    ],
  },
  {
    slug: 'herringbone-waistcoat',
    name: 'Herringbone Waistcoat',
    category: 'waistcoats',
    price: 159,
    description:
      'A herringbone waistcoat in brushed wool with a notch lapel and mother-of-pearl buttons.',
    story: 'A layer for the shoulder seasons, cut to sit clean under a coat.',
    material: '100% brushed wool · Mother-of-pearl buttons',
    care: 'Dry clean only.',
    sizes: CLOTHING,
    colors: [C.grey, C.navy],
    stock: 19,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    popularity: 54,
    images: [
      { id: '1775313316034-9dde306437f4', alt: 'Herringbone waistcoat' },
      { id: '1779870634540-cad76818bc85', alt: 'Waistcoat under a tweed coat' },
    ],
  },
  {
    slug: 'merino-roll-neck',
    name: 'Merino Roll Neck',
    category: 'shirts',
    price: 119,
    description:
      'A fine-gauge merino roll neck that layers under tailoring without bulk. Ribbed collar, cuffs and hem.',
    story: 'Knitted in Scotland from extra-fine merino.',
    material: '100% extra-fine merino wool',
    care: 'Hand wash cold. Dry flat.',
    sizes: SHIRT_SIZES,
    colors: [C.charcoal, C.ecru, C.navy],
    stock: 27,
    badge: null,
    isNew: true,
    isFeatured: false,
    isBestseller: false,
    popularity: 66,
    images: [
      { id: '1772131575602-8828196f47dc', alt: 'Merino roll neck with a jacket' },
      { id: '1775313316034-9dde306437f4', alt: 'Merino roll neck detail' },
    ],
  },
  {
    slug: 'tattersall-check-shirt',
    name: 'Tattersall Check Shirt',
    category: 'shirts',
    price: 95,
    description:
      'A tattersall check shirt in brushed cotton twill, with a classic point collar and a single chest pocket.',
    story: 'The country shirt, brought back into the city.',
    material: '100% brushed cotton twill',
    care: 'Machine wash cold. Iron on reverse.',
    sizes: SHIRT_SIZES,
    colors: [C.ecru, C.olive],
    stock: 33,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    popularity: 49,
    images: [
      { id: '1775507661264-7b6214ce179d', alt: 'Tattersall check shirt' },
      { id: '1642886513308-d21acc15057d', alt: 'Check shirt with a coat' },
    ],
  },
  {
    slug: 'cashmere-scarf',
    name: 'Cashmere Scarf',
    category: 'accessories',
    price: 89,
    description:
      'A long brushed cashmere scarf, woven in Scotland and finished with hand-knotted fringing.',
    story: 'Warmth without weight — the quiet luxury of good cashmere.',
    material: '100% cashmere · 200 × 35cm',
    care: 'Hand wash cold or dry clean.',
    sizes: ['One Size'],
    colors: [C.camel, C.charcoal, C.ecru],
    stock: 35,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    popularity: 61,
    images: [
      { id: '1732613842479-4ff0c5031f25', alt: 'Cashmere scarf folded with accessories' },
      { id: '1629139033414-76f3c0eacf84', alt: 'Scarf styled with leather accessories' },
    ],
  },
  {
    slug: 'bridle-leather-wallet',
    name: 'Bridle Leather Wallet',
    category: 'accessories',
    price: 69,
    description:
      'A slim bifold wallet in English bridle leather, with eight card slots and a full-length note pocket.',
    story: 'Bridle leather takes on a deeper colour with every year of use.',
    material: 'English bridle leather · Hand-burnished edges',
    care: 'Condition lightly twice a year.',
    sizes: ['One Size'],
    colors: [C.brown, C.black],
    stock: 42,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: true,
    popularity: 73,
    images: [
      { id: '1629139033414-76f3c0eacf84', alt: 'Leather wallet with glasses' },
      { id: '1724318497004-084cece3e7ae', alt: 'Leather accessories flat lay' },
    ],
  },
  {
    slug: 'heritage-pocket-watch',
    name: 'Heritage Pocket Watch',
    category: 'accessories',
    price: 189,
    description:
      'A mechanical pocket watch in brushed steel with a hand-wound movement and a leather fob.',
    story: 'A small anachronism, worn with intent.',
    material: 'Brushed steel case · Hand-wound movement · Leather fob',
    care: 'Wind daily. Service every five years.',
    sizes: ['One Size'],
    colors: [C.brown, C.black],
    stock: 5,
    badge: 'Limited',
    isNew: true,
    isFeatured: false,
    isBestseller: false,
    popularity: 44,
    images: [
      { id: '1541495532687-d41ee8904943', alt: 'Silver watch with leather accessories' },
      { id: '1724318497004-084cece3e7ae', alt: 'Pocket watch with shoes and tie' },
    ],
  },
  {
    slug: 'grey-wool-flat-cap',
    name: 'Grey Wool Flat Cap',
    category: 'flat-caps',
    price: 75,
    description:
      'A softer, lower-crown flat cap in brushed grey wool. Understated, and endlessly wearable.',
    story: 'The everyday cap — cut on the same last as the Peaky, with a lower crown.',
    material: '100% brushed wool · Quilted lining',
    care: 'Spot clean only.',
    sizes: CAP_SIZES,
    colors: [C.grey, C.charcoal],
    stock: 28,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    popularity: 57,
    images: [
      { id: '1790316855860-d9e0ad5cceb5', alt: 'Grey flat cap worn in the street' },
      { id: '1787675629407-2b3983cdba69', alt: 'Grey flat cap on a table' },
    ],
  },
  {
    slug: 'navy-pinstripe-suit',
    name: 'Navy Pinstripe Suit',
    category: 'suits',
    price: 369,
    description:
      'A two-piece suit in navy wool with a fine chalk stripe. Peak lapels, a clean front and a straight trouser.',
    story: 'For the days that ask for a little more ceremony.',
    material: '100% wool · Peak lapel · Full canvas front',
    care: 'Dry clean only.',
    sizes: CLOTHING,
    colors: [C.navy],
    stock: 8,
    badge: null,
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    popularity: 63,
    images: [
      { id: '1594938298603-c8148c4dae35', alt: 'Navy pinstripe suit jacket' },
      { id: '1635205383450-e0fee6fe73c4', alt: 'Navy suit worn on the street' },
    ],
  },
];

const collections = [
  {
    slug: 'english-vintage',
    title: 'ENGLISH VINTAGE',
    subtitle: 'NEW SEASON',
    description:
      'Refined pieces. Authentic style. Inspired by a timeless era — from Donegal tweed to horn-button overcoats.',
    image: IMG('1779870634540-cad76818bc85', 1200),
    ctaLabel: 'DISCOVER THE COLLECTION',
    ctaHref: '/shop?collection=english-vintage',
    position: 1,
  },
  {
    slug: 'the-tailoring-room',
    title: 'THE TAILORING ROOM',
    subtitle: 'MADE TO LAST',
    description: 'Half-canvassed jackets and full suits, cut from cloths chosen to age well.',
    image: IMG('1669575903350-9a349b411810', 1200),
    ctaLabel: 'SHOP TAILORING',
    ctaHref: '/shop?category=suits',
    position: 2,
  },
  {
    slug: 'country-weekend',
    title: 'COUNTRY WEEKEND',
    subtitle: 'OFF-DUTY HERITAGE',
    description: 'Tweed, waxed cotton and brushed wool — a wardrobe for the road out of town.',
    image: IMG('1737508945707-ebdccee97cc5', 1200),
    ctaLabel: 'EXPLORE THE EDIT',
    ctaHref: '/shop?category=outerwear',
    position: 3,
  },
];

const settings = {
  store_name: 'EVORA STYLE',
  slogan: 'HERITAGE • CHARACTER • ALWAYS RELEVANT',
  announcement: 'Complimentary worldwide delivery on orders over $250 — returns within 14 days',
  hero_eyebrow: 'ENGLISH HERITAGE FOR A MODERN GENERATION.',
  hero_title: 'EVORA',
  hero_season: 'NEW COLLECTION 2026',
  hero_lead:
    'Tailoring, outerwear and accessories drawn from the English countryside and cut for the modern city.',
  contact_email: 'concierge@evorastyle.com',
  instagram_handle: '@evorastyle',
  currency: 'USD',
  shipping_standard: 12,
  shipping_express: 24,
  free_shipping_threshold: 250,
  returns_window_days: 14,
  payment_provider: 'Stripe',
  payment_configured: false,
};

export async function seed() {
  // Always make sure the administrator account exists so the dashboard is reachable.
  await query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role)
     VALUES ($1,$2,$3,$4,'admin')
     ON CONFLICT (email) DO NOTHING`,
    ['Eleanor', 'Vaughan', 'admin@evorastyle.com', hashPassword('Evora2026!')]
  );
  await query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, phone)
     VALUES ($1,$2,$3,$4,'customer',$5)
     ON CONFLICT (email) DO NOTHING`,
    ['James', 'Whitfield', 'james.whitfield@example.com', hashPassword('Evora2026!'), '+44 7700 900123']
  );

  for (const [key, value] of Object.entries(settings)) {
    await query('INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO NOTHING', [
      key,
      JSON.stringify(value),
    ]);
  }

  const existing = await one('SELECT count(*)::int AS count FROM products');
  if (existing?.count > 0) return;

  for (const category of categories) {
    await query(
      `INSERT INTO categories (slug, name, description, image_url, position)
       VALUES ($1,$2,$3,$4,$5) ON CONFLICT (slug) DO NOTHING`,
      [category.slug, category.name, category.description, category.image, category.position]
    );
  }

  for (const product of products) {
    const inserted = await one(
      `INSERT INTO products
        (slug, name, category_slug, price, compare_price, description, story, material, care,
         sizes, colors, stock, badge, is_new, is_featured, is_bestseller, popularity)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING id`,
      [
        product.slug,
        product.name,
        product.category,
        product.price,
        product.compare ?? null,
        product.description,
        product.story,
        product.material,
        product.care,
        product.sizes,
        JSON.stringify(product.colors),
        product.stock,
        product.badge,
        Boolean(product.isNew),
        Boolean(product.isFeatured),
        Boolean(product.isBestseller),
        product.popularity,
      ]
    );
    let position = 0;
    for (const image of product.images) {
      await query(
        'INSERT INTO product_images (product_id, url, alt, position) VALUES ($1,$2,$3,$4)',
        [inserted.id, IMG(image.id), image.alt, position++]
      );
    }
  }

  for (const collection of collections) {
    await query(
      `INSERT INTO collections (slug, title, subtitle, description, image_url, cta_label, cta_href, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (slug) DO NOTHING`,
      [
        collection.slug,
        collection.title,
        collection.subtitle,
        collection.description,
        collection.image,
        collection.ctaLabel,
        collection.ctaHref,
        collection.position,
      ]
    );
  }

  const discounts = [
    { code: 'WELCOME10', type: 'percent', value: 10, min: 0 },
    { code: 'HERITAGE25', type: 'percent', value: 25, min: 400 },
    { code: 'SHIPFREE', type: 'fixed', value: 12, min: 100 },
  ];
  for (const discount of discounts) {
    await query(
      `INSERT INTO discount_codes (code, type, value, min_subtotal)
       VALUES ($1,$2,$3,$4) ON CONFLICT (code) DO NOTHING`,
      [discount.code, discount.type, discount.value, discount.min]
    );
  }

  await query(
    `INSERT INTO newsletter_subscribers (email, source) VALUES
      ('edmund.hale@example.com','footer'),
      ('clara.rowntree@example.com','popup'),
      ('arthur.pennington@example.com','footer')
     ON CONFLICT (email) DO NOTHING`
  );

  // A small order history so the admin dashboard has real data on first load.
  const customer = await one("SELECT id FROM users WHERE email = 'james.whitfield@example.com'");
  const orderSeed = [
    { number: 'EV-24108', status: 'delivered', payment: 'not_charged', method: 'card', delivery: 'express', items: [['wool-overcoat', 'M', 'Charcoal', 1], ['peaky-flat-cap', 'M/L', 'Grey', 1]], days: 26 },
    { number: 'EV-24151', status: 'shipped', payment: 'not_charged', method: 'card', delivery: 'standard', items: [['three-piece-suit', 'L', 'Navy', 1]], days: 12 },
    { number: 'EV-24177', status: 'processing', payment: 'not_charged', method: 'invoice', delivery: 'standard', items: [['tweed-waistcoat', 'M', 'Olive', 2], ['vintage-oxford-shirt', 'M', 'Ecru', 1]], days: 5 },
    { number: 'EV-24189', status: 'awaiting_confirmation', payment: 'not_charged', method: 'invoice', delivery: 'express', items: [['heritage-trench-coat', 'XL', 'Camel', 1]], days: 1 },
  ];

  for (const order of orderSeed) {
    const lines = [];
    let subtotal = 0;
    for (const [slug, size, color, quantity] of order.items) {
      const product = await one(
        `SELECT p.*, (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image
         FROM products p WHERE slug = $1`,
        [slug]
      );
      if (!product) continue;
      subtotal += Number(product.price) * quantity;
      lines.push({ product, size, color, quantity });
    }
    const shipping = order.delivery === 'express' ? 24 : subtotal >= 250 ? 0 : 12;
    const total = subtotal + shipping;
    const inserted = await one(
      `INSERT INTO orders (order_number, user_id, email, status, payment_status, payment_method,
         delivery_method, subtotal, shipping, discount, total, customer, shipping_address, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$10,$11,$12, now() - ($13 || ' days')::interval, now() - ($13 || ' days')::interval)
       RETURNING id`,
      [
        order.number,
        customer?.id ?? null,
        'james.whitfield@example.com',
        order.status,
        order.payment,
        order.method,
        order.delivery,
        subtotal,
        shipping,
        total,
        JSON.stringify({ firstName: 'James', lastName: 'Whitfield', email: 'james.whitfield@example.com', phone: '+44 7700 900123' }),
        JSON.stringify({ fullName: 'James Whitfield', line1: '14 Cavendish Row', line2: 'Marylebone', city: 'London', postcode: 'W1G 9HP', country: 'United Kingdom', phone: '+44 7700 900123' }),
        String(order.days),
      ]
    );
    for (const line of lines) {
      await query(
        `INSERT INTO order_items (order_id, product_id, name, slug, price, size, color, quantity, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [inserted.id, line.product.id, line.product.name, line.product.slug, line.product.price, line.size, line.color, line.quantity, line.product.image]
      );
    }
  }
}

export async function runSeedIfNeeded() {
  const existing = await one('SELECT count(*)::int AS count FROM products');
  if (existing?.count > 0) return;
  await seed();
}

export { categories, products, collections, settings };
