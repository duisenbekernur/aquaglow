export const HERO_COPY = {
  headline: 'Stop Hair Damage From Hard Water in Just 7 Days',
  subheadline:
    'Filter chlorine, rust and hard water minerals for visibly softer hair and clearer skin from your very first shower.',
  bullets: [
    'Removes chlorine, rust & heavy minerals',
    'Boosts water pressure',
    'Softer hair & clearer skin in days',
    'Fits standard showers in minutes',
  ],
  cta: 'Get Yours Now',
  trustStrip: ['Free Shipping', '30-Day Guarantee', '3,000+ Happy Customers'],
} as const;

export const PROBLEM_POINTS = [
  {
    title: 'Hard water stresses hair',
    body: 'Mineral buildup can leave hair feeling rough and harder to manage after washing.',
  },
  {
    title: 'Dryness & dullness',
    body: 'Chlorine and metals can strip moisture, making color-treated or fine hair look flat.',
  },
  {
    title: 'Breakage & tangles',
    body: 'When the cuticle is roughed up, knots and split ends show up faster.',
  },
  {
    title: 'Skin irritation',
    body: 'Residual chlorine may leave skin feeling tight, itchy, or reactive after hot showers.',
  },
] as const;

export const SOLUTION_POINTS = [
  {
    title: 'Built-in filtration',
    body: 'AquaGlow uses filtration media to help reduce impurities before water touches your hair and skin.',
  },
  {
    title: 'Cleaner rinse water',
    body: 'Enjoy a shower that feels fresher, with less of that harsh “pool water” smell.',
  },
  {
    title: 'Stronger shower pressure',
    body: 'An efficient spray design helps water feel fuller — without wasting water.',
  },
  {
    title: 'Tool-free install',
    body: 'Twists onto standard fittings in minutes — no plumber needed for typical setups.',
  },
] as const;

export const BENEFIT_BLOCKS = [
  {
    id: 'filtration',
    title: 'Deep Filtration',
    body: 'Helps reduce chlorine, rust particles, and heavy minerals for a gentler rinse.',
  },
  {
    id: 'pressure',
    title: 'Higher Pressure',
    body: 'Laser-cut nozzles keep spray focused so your shower feels more invigorating.',
  },
  {
    id: 'hair',
    title: 'Softer Hair',
    body: 'Many customers notice less dryness and easier detangling within the first week.',
  },
  {
    id: 'install',
    title: 'Easy Install',
    body: 'Designed for standard hoses and arms — swap it in and shower the same day.',
  },
] as const;

export const COMPARISON_ROWS = [
  {label: 'Removes chlorine', aquaglow: true, ordinary: false},
  {label: 'Improves hair softness', aquaglow: true, ordinary: false},
  {label: 'Better water pressure', aquaglow: true, ordinary: false},
  {label: 'Easy install', aquaglow: true, ordinary: true},
  {label: 'Helps reduce dryness', aquaglow: true, ordinary: false},
] as const;

export const WHY_IT_WORKS = {
  title: 'Engineered for cleaner water & a fuller spray',
  paragraphs: [
    'AquaGlow combines a multi-stage filtration cartridge with a high-pressure spray plate. Water passes through filtration media that targets common shower concerns like chlorine odor and metallic taste, then exits through precision nozzles for an even, satisfying rinse.',
    'This is not a medical device and results vary by home water chemistry — but thousands of customers across Europe use AquaGlow as part of a simpler hair and skin routine.',
  ],
} as const;

export const REVIEW_SUMMARY = {
  rating: '4.8',
  countLabel: '3,000+ verified buyers',
} as const;

export type ReviewCard = {
  name: string;
  location: string;
  quote: string;
  stars: number;
};

export const REVIEWS: ReviewCard[] = [
  {
    name: 'Lena Hoffmann',
    location: 'Berlin, Germany',
    quote:
      'Honestly did not expect much but my hair has been so much softer since I started using this. I used to use a lot of conditioner and now I barely need it.',
    stars: 5,
  },
  {
    name: 'María González',
    location: 'Valencia, Spain',
    quote:
      'My skin was always itchy after showering, especially in winter. After three weeks the difference is real — less dry and my hair sheds less in the brush.',
    stars: 5,
  },
  {
    name: 'Tobias Becker',
    location: 'Hamburg, Germany',
    quote:
      'Super easy to install, maybe ninety seconds. The water pressure feels stronger than before, which I did not expect. My partner noticed my hair looked better before I said I changed anything.',
    stars: 5,
  },
  {
    name: 'Clara Weiss',
    location: 'Munich, Germany',
    quote:
      'Very hard water where I live — my hair always felt rough after showering. After about two weeks it is noticeably softer and easier to manage.',
    stars: 5,
  },
  {
    name: 'David Schmitt',
    location: 'Frankfurt, Germany',
    quote:
      'Installation was literally under a minute. The shower stream feels fuller than our old head. Worth it for the daily upgrade alone.',
    stars: 5,
  },
  {
    name: 'Lucía Fernández',
    location: 'Madrid, Spain',
    quote:
      'I bought this because my skin was dry after every shower. It feels smoother now and less irritated, and my hair has a bit more shine.',
    stars: 5,
  },
  {
    name: 'Carlos Martínez',
    location: 'Barcelona, Spain',
    quote:
      'I was skeptical but it does what it says. My partner noticed my hair looked healthier after a few uses. Nice bonus that the rinse feels quicker.',
    stars: 5,
  },
  {
    name: 'Sophie Keller',
    location: 'Stuttgart, Germany',
    quote:
      'I used to load on conditioner after every wash. Now I use much less and my hair still feels soft. Bigger difference than I expected.',
    stars: 5,
  },
  {
    name: 'Markus Vogel',
    location: 'Berlin, Germany',
    quote:
      'For the price it feels like a small upgrade that makes the daily routine nicer. The water somehow feels cleaner going through the filter.',
    stars: 5,
  },
  {
    name: 'Elena Ruiz',
    location: 'Valencia, Spain',
    quote:
      'Very easy to install and the build quality feels solid. After a few weeks my hair breaks less and feels stronger — I would buy it again.',
    stars: 5,
  },
  {
    name: 'Leonie Weber',
    location: 'Cologne, Germany',
    quote:
      'Chlorine smell in our building is strong — this reduced it enough that I notice right away. Pressure is great too.',
    stars: 4,
  },
  {
    name: 'Marc Sánchez',
    location: 'Seville, Spain',
    quote:
      'Fits our hose without drama. The spray is even across the face of the head and does not sting. Happy customer.',
    stars: 5,
  },
];

export type FaqItem = {question: string; answer: string};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Does it fit standard shower hoses?',
    answer:
      'Yes — AquaGlow is designed for common ½\" connections used on most handheld and fixed showers in Germany and Spain. If your setup is unusual, check your fitting size before ordering.',
  },
  {
    question: 'Does it really help with hard water?',
    answer:
      'The built-in filtration targets common impurities like chlorine and helps reduce metallic taste and odor. Hardness levels vary by building; many customers notice a gentler rinse right away.',
  },
  {
    question: 'How long do the filter beads last?',
    answer:
      'Typical households replace the internal cartridge every 3–6 months depending on usage and local water quality. Your Shopify product page lists the exact SKU options we ship.',
  },
  {
    question: 'Is installation easy?',
    answer:
      'Yes — unscrew your old shower head and twist AquaGlow on by hand. Use the included washer and avoid overtightening.',
  },
  {
    question: 'Does it reduce pressure or improve it?',
    answer:
      'The spray plate is designed to keep pressure feeling strong and even. If your home already has very low pressure, results depend on plumbing.',
  },
  {
    question: 'Is there a return policy?',
    answer:
      'We offer a 30-day money-back guarantee on qualifying orders. See our Return Policy page for details and how to start a return in your region.',
  },
];

export const FINAL_CTA = {
  headline: 'Try AquaGlow Risk-Free Today',
  subheadline:
    'Enjoy free shipping and a 30-day money-back guarantee.',
  cta: 'Get Mine Now',
} as const;
