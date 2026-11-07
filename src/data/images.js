export const IMG = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: IMG('1619603364937-8d7af41ef206', 1200),
  heroDetail: IMG('1665832102183-b232574131ff', 1200),
  editorial: IMG('1779870634540-cad76818bc85', 1200),
  trench: IMG('1737508945707-ebdccee97cc5', 1600),
  heritage: IMG('1642886513448-6e6997b8de4a', 1200),
  workshop: IMG('1775313316034-9dde306437f4', 1200),
  street: IMG('1553209717-ddc5aa729bd2', 1200),
  tailoring: IMG('1669575903350-9a349b411810', 1200),
  cap: IMG('1772131575602-8828196f47dc', 1200),
  shoes: IMG('1614252235316-8c857d38b5f4', 1000),
  accessories: IMG('1629139033414-76f3c0eacf84', 1000),
};

export const INSTAGRAM_IMAGES = [
  { url: IMG('1772131575602-8828196f47dc', 600), alt: 'Flat cap and field jacket' },
  { url: IMG('1665832102183-b232574131ff', 600), alt: 'Overcoat detail' },
  { url: IMG('1779870634540-cad76818bc85', 600), alt: 'Tweed suit on a stone wall' },
  { url: IMG('1614252235316-8c857d38b5f4', 600), alt: 'Leather brogues' },
  { url: IMG('1642886513448-6e6997b8de4a', 600), alt: 'Tailoring in motion' },
  { url: IMG('1737508945707-ebdccee97cc5', 600), alt: 'Trench coat on the street' },
];
