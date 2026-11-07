export const NAV_ITEMS = [
  { label: 'Men', to: '/shop', mega: 'men' },
  { label: 'Outerwear', to: '/shop?category=outerwear', mega: 'outerwear' },
  { label: 'Suits', to: '/shop?category=suits', mega: 'suits' },
  { label: 'Caps', to: '/shop?category=flat-caps', mega: 'caps' },
  { label: 'Shoes', to: '/shop?category=shoes', mega: 'shoes' },
  { label: 'Accessories', to: '/shop?category=accessories', mega: 'accessories' },
];

const IMG = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const MEGA_MENUS = {
  men: {
    columns: [
      {
        title: 'The House',
        links: [
          { label: 'New Arrivals', to: '/shop?sort=newest' },
          { label: 'Best Sellers', to: '/shop?bestseller=1' },
          { label: 'The Heritage Edit', to: '/shop?collection=english-vintage' },
          { label: 'View All', to: '/shop' },
        ],
      },
      {
        title: 'Categories',
        links: [
          { label: 'Suits', to: '/shop?category=suits' },
          { label: 'Blazers', to: '/shop?category=blazers' },
          { label: 'Outerwear', to: '/shop?category=outerwear' },
          { label: 'Trench Coats', to: '/shop?category=trench-coats' },
          { label: 'Waistcoats', to: '/shop?category=waistcoats' },
          { label: 'Shirts', to: '/shop?category=shirts' },
          { label: 'Trousers', to: '/shop?category=trousers' },
          { label: 'Flat Caps', to: '/shop?category=flat-caps' },
          { label: 'Shoes', to: '/shop?category=shoes' },
          { label: 'Accessories', to: '/shop?category=accessories' },
        ],
      },
    ],
    feature: {
      image: IMG('1665832102183-b232574131ff'),
      eyebrow: 'New Collection 2026',
      title: 'English Vintage',
      copy: 'Tweed, horn buttons and cloth with a memory.',
      to: '/shop?collection=english-vintage',
      cta: 'Explore the collection',
    },
  },
  outerwear: {
    columns: [
      {
        title: 'Coats',
        links: [
          { label: 'Wool Overcoats', to: '/shop?category=outerwear' },
          { label: 'Trench Coats', to: '/shop?category=trench-coats' },
          { label: 'All Outerwear', to: '/shop?category=outerwear' },
        ],
      },
      {
        title: 'Layers',
        links: [
          { label: 'Tailoring Jackets', to: '/shop?category=blazers' },
          { label: 'Waistcoats', to: '/shop?category=waistcoats' },
          { label: 'Knitwear', to: '/shop?category=shirts' },
        ],
      },
    ],
    feature: {
      image: IMG('1737508945707-ebdccee97cc5'),
      eyebrow: 'Weather, handled',
      title: 'The Heritage Trench',
      copy: 'Waxed cotton gabardine, belted at the waist, built for British rain.',
      to: '/product/heritage-trench-coat',
      cta: 'Shop the trench',
    },
  },
  suits: {
    columns: [
      {
        title: 'Tailoring',
        links: [
          { label: 'Three-Piece Suits', to: '/shop?category=suits' },
          { label: 'Two-Piece Suits', to: '/shop?category=suits' },
          { label: 'Blazers', to: '/shop?category=blazers' },
          { label: 'Waistcoats', to: '/shop?category=waistcoats' },
          { label: 'Trousers', to: '/shop?category=trousers' },
        ],
      },
      {
        title: 'Cloth',
        links: [
          { label: 'Donegal Tweed', to: '/product/donegal-tweed-suit' },
          { label: 'Italian Wool', to: '/product/three-piece-suit' },
          { label: 'Chalk Stripe', to: '/product/navy-pinstripe-suit' },
        ],
      },
    ],
    feature: {
      image: IMG('1669575903350-9a349b411810'),
      eyebrow: 'Half-canvas construction',
      title: 'The Tailoring Room',
      copy: 'Soft shoulders, working cuffs and cloth chosen to age well.',
      to: '/shop?category=suits',
      cta: 'Shop tailoring',
    },
  },
  caps: {
    columns: [
      {
        title: 'Flat Caps',
        links: [
          { label: 'The Peaky Cap', to: '/product/peaky-flat-cap' },
          { label: 'Grey Wool Cap', to: '/product/grey-wool-flat-cap' },
          { label: 'All Headwear', to: '/shop?category=flat-caps' },
        ],
      },
      {
        title: 'Styling',
        links: [
          { label: 'With Tweed', to: '/shop?category=waistcoats' },
          { label: 'With a Field Jacket', to: '/shop?category=outerwear' },
        ],
      },
    ],
    feature: {
      image: IMG('1772131575602-8828196f47dc'),
      eyebrow: 'Made in a small workshop',
      title: 'An Iconic Silhouette',
      copy: 'Eight panels of wool tweed, cut on the same last since 1954.',
      to: '/shop?category=flat-caps',
      cta: 'Shop caps',
    },
  },
  shoes: {
    columns: [
      {
        title: 'Footwear',
        links: [
          { label: 'Brogues', to: '/product/oxford-brogue' },
          { label: 'Derby Boots', to: '/product/leather-derby-boot' },
          { label: 'Chelsea Boots', to: '/product/suede-chelsea-boot' },
          { label: 'All Shoes', to: '/shop?category=shoes' },
        ],
      },
      {
        title: 'Care',
        links: [
          { label: 'Shoe Care Guide', to: '/size-guide' },
          { label: 'Repairs & Resoling', to: '/contact' },
        ],
      },
    ],
    feature: {
      image: IMG('1614252235316-8c857d38b5f4'),
      eyebrow: 'Goodyear welted',
      title: 'Northamptonshire Made',
      copy: 'Bench-made by a workshop of eleven, built to be resoled for decades.',
      to: '/shop?category=shoes',
      cta: 'Shop shoes',
    },
  },
  accessories: {
    columns: [
      {
        title: 'Accessories',
        links: [
          { label: 'Cashmere Scarves', to: '/product/cashmere-scarf' },
          { label: 'Leather Wallets', to: '/product/bridle-leather-wallet' },
          { label: 'Pocket Watches', to: '/product/heritage-pocket-watch' },
          { label: 'All Accessories', to: '/shop?category=accessories' },
        ],
      },
      {
        title: 'The Details',
        links: [
          { label: 'Gift Edit', to: '/shop?sort=popular' },
          { label: 'Under $100', to: '/shop?maxPrice=100' },
        ],
      },
    ],
    feature: {
      image: IMG('1629139033414-76f3c0eacf84'),
      eyebrow: 'Small things, considered',
      title: 'The Finishing Details',
      copy: 'Bridle leather, brushed cashmere and hand-knotted fringing.',
      to: '/shop?category=accessories',
      cta: 'Shop accessories',
    },
  },
};

export const CONTENT_LINKS = [
  { label: 'Our Story', to: '/our-story' },
  { label: 'Our Heritage', to: '/our-heritage' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
];
