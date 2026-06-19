// Local Image Imports
import crimsonSilkPeony from '../assets/crimson_silk_peony.jpg';
import redChrysanthemums from '../assets/red_chrysanthemum.png';
import sakuraSpringBloom from '../assets/sakura_spring_bloom.jpg';
import mauveRadianceDahlia from '../assets/mauve_radiance_dahlia.jpg';
import serenityWhite from '../assets/serenity_white.jpg';
import wildHearth from '../assets/wild_hearth.jpg';
import redRose from '../assets/red_rose.png';
import purplecarnation
  from '../assets/purple_carnation.png';
import pinkChrysanthemums from '../assets/pink_chrysanthemum.png';
import lilyHeaddress from '../assets/lily_headdress.jpg';
import pinkLilyStem from '../assets/pink_lily.jpg';
import pinkRosesBouquet from '../assets/pink_roses_bouquet.png';

// Head Dresses Image Imports
import roseCrownHeadDress from '../assets/images/head-dresses/rose-crown-head-dress.png';
import pearlBlossomFloralCrown from '../assets/images/head-dresses/pearl-blossom-floral-crown.png';
import bridalFlowerTiara from '../assets/images/head-dresses/bridal-flower-tiara.png';
import whiteOrchidWeddingCrown from '../assets/images/head-dresses/white-orchid-wedding-crown.png';
import luxuryWeddingFlowerHalo from '../assets/images/head-dresses/luxury-wedding-flower-halo.png';
import pinkCelebrationFloralCrown from '../assets/images/head-dresses/pink-celebration-floral-crown.png';
import rainbowBlossomHeadDress from '../assets/images/head-dresses/rainbow-blossom-head-dress.png';
import birthdayPrincessCrown from '../assets/images/head-dresses/birthday-princess-crown.png';
import pastelGardenFloralHeadband from '../assets/images/head-dresses/pastel-garden-floral-headband.png';
import floralPartyHeadDress from '../assets/images/head-dresses/floral-party-head-dress.png';

export const products = [
  {
    id: 1,
    title: 'Pink Roses Bouquet',
    category: 'silk',
    color: 'pink',
    type: 'bouquet',
    subcategory: 'anniversary',
    subtitle: 'The Bloom Collection',
    price: 'Rs 15000.00',
    numericPrice: 15000,
    rating: 4.8,
    reviewCount: 124,
    image: pinkRosesBouquet,
    thumbnails: [
      pinkRosesBouquet
    ],
    description: 'Crafted with surgical precision from the finest premium silk, our Everlasting Peony captures the ethereal beauty of nature without the impermanence. Featuring hand-painted details and flexible architectural stems.',
    colors: [
      { name: 'Pastel Pink', hex: '#f5ccd4' },
      { name: 'Pale Yellow', hex: '#fbfbe3' },
      { name: 'Soft White', hex: '#ffffff' }
    ],
    features: ['Global Shipping', 'Sustainable Fibers'],
    has360: true,
    reviews: [
      {
        id: 101,
        name: 'Eleanor M.',
        verified: true,
        date: '2 weeks ago',
        rating: 5,
        text: 'I was skeptical about artificial flowers, but RedShan360 has completely changed my mind. The texture of these peonies is so realistic that my guests often touch them to check. Absolute elegance!'
      },
      {
        id: 102,
        name: 'Julian L.',
        verified: true,
        date: '1 month ago',
        rating: 4,
        text: 'The packaging alone felt like a luxury experience. The flower is stunning. My only note is that the stem was a bit longer than expected, but easily adjustable.'
      }
    ]
  },
  {
    id: 2,
    title: 'Red Chrysanthemums',
    category: 'velvet',
    color: 'white',
    type: 'single-stem',
    subtitle: 'Luxe Velvet Series',
    price: 'Rs 11420.00',
    numericPrice: 11420,
    rating: 4.8,
    reviewCount: 86,
    image: redChrysanthemums,
    thumbnails: [
      redChrysanthemums
    ],
    description: 'An exquisite arrangement of velvet-textured tulips, hand-stitched for an elegant velvet finish. Designed to reflect soft moonlight in high-end spaces.',
    colors: [
      { name: 'Ivory White', hex: '#ffffff' },
      { name: 'Cream Beige', hex: '#f4f0ed' }
    ],
    features: ['Global Shipping', 'Hand-Crafted Velvet'],
    has360: true,
    reviews: [
      {
        id: 201,
        name: 'Sophie R.',
        verified: true,
        date: '3 weeks ago',
        rating: 5,
        text: 'These look incredibly luxurious. The velvet texture gives them a lifelike volume that plastic/silk just can’t replicate. Worth every penny!'
      }
    ]
  },
  {
    id: 3,
    title: 'Purple Carnation',
    category: 'dried',
    color: 'beige',
    type: 'single-stem',
    subtitle: 'Everlasting Dried Flora',
    price: 'Rs 800.00',
    numericPrice: 800,
    rating: 5.0,
    reviewCount: 42,
    image: purplecarnation,
    thumbnails: [
      purplecarnation
    ],
    description: 'A whimsical cloud of natural dried pampas grass and preserved botanicals, styled in an organic, rustic-modern fashion. Perfect for boho-chic decor.',
    colors: [
      { name: 'Warm Beige', hex: '#f4f0ed' },
      { name: 'Natural Sand', hex: '#c7b1a9' }
    ],
    features: ['Real Preserved Flora', 'Sustainable Fibers'],
    has360: true,
    reviews: [
      {
        id: 301,
        name: 'Marcus D.',
        verified: true,
        date: '2 months ago',
        rating: 5,
        text: 'Adds a beautiful boho-luxury aesthetic to my living room. They do not shed at all!'
      }
    ]
  },
  {
    id: 4,
    title: 'Sakura Spring Bloom',
    category: 'silk',
    color: 'pink',
    type: 'bouquet',
    subcategory: 'birthday',
    subtitle: 'Spring Silk Collection',
    price: 'Rs 1500.00',
    numericPrice: 1500,
    rating: 4.7,
    reviewCount: 38,
    image: sakuraSpringBloom,
    thumbnails: [
      sakuraSpringBloom,
      crimsonSilkPeony,
      '/images/peonies_vase.png'
    ],
    description: 'Inspired by Japanese cherry blossoms, these delicate silk stems bring a fresh, modern touch of spring into your home year-round. Featuring flexible branches.',
    colors: [
      { name: 'Soft Pink', hex: '#e8b4b8' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    features: ['Global Shipping', 'Flexible Branches'],
    has360: true,
    reviews: [
      {
        id: 401,
        name: 'Aiko K.',
        verified: true,
        date: '1 week ago',
        rating: 5,
        text: 'So graceful and delicate. Brings a clean minimalist energy to my entry table.'
      }
    ]
  },
  {
    id: 5,
    title: 'Pink Chrysanthemums',
    category: 'velvet',
    color: 'pink',
    type: 'single-stem',
    subtitle: 'Signature Single Stem',
    price: 'Rs 2750.00',
    numericPrice: 2750,
    rating: 4.9,
    reviewCount: 56,
    image: pinkChrysanthemums,
    thumbnails: [
      pinkChrysanthemums
    ],
    description: 'An exotic protea bloom with structural leaves and a bold burgundy color palette, making it a dramatic centerpiece for minimalist styling.',
    colors: [
      { name: 'Deep Burgundy', hex: '#6b3b3b' },
      { name: 'Olive Green', hex: '#8c8d7b' }
    ],
    features: ['Unique Exotic Sculpting', 'Global Shipping'],
    has360: true,
    reviews: [
      {
        id: 501,
        name: 'David W.',
        verified: true,
        date: '3 months ago',
        rating: 5,
        text: 'The structural details are phenomenal. It acts as an artistic object in my foyer.'
      }
    ]
  },
  {
    id: 6,
    title: 'Mauve Radiance Dahlia',
    category: 'velvet',
    color: 'grey',
    type: 'bouquet',
    subcategory: 'convocation',
    subtitle: 'Velvet Bloom Bouquet',
    price: 'Rs 4110.00',
    numericPrice: 4110,
    rating: 4.6,
    reviewCount: 29,
    image: mauveRadianceDahlia,
    thumbnails: [
      mauveRadianceDahlia,
      '/images/peonies_vase.png',
      '/images/roses_vase.png'
    ],
    description: 'A rich bouquet of velvet dahlias in dusty mauve tones. Perfect for adding a warm, sophisticated pop of color to neutral spaces.',
    colors: [
      { name: 'Dusty Mauve', hex: '#c7b1a9' },
      { name: 'Soft Rose', hex: '#e8b4b8' }
    ],
    features: ['Sustainable Fibers', 'Water-Resistant Coating'],
    has360: true,
    reviews: [
      {
        id: 601,
        name: 'Victoria S.',
        verified: true,
        date: '2 weeks ago',
        rating: 4,
        text: 'Beautiful colors, very dramatic. They fit well in a tall, narrow glass vase.'
      }
    ]
  },
  {
    id: 7,
    title: 'Lily Headdress',
    category: 'silk',
    color: 'white',
    type: 'arrangement',
    subtitle: 'Classic Orchid Series',
    price: 'Rs 3420.00',
    numericPrice: 3420,
    rating: 4.9,
    reviewCount: 94,
    image: lilyHeaddress,
    thumbnails: [
      lilyHeaddress
    ],
    description: 'A minimalist white orchid stem presented in a modern matte black ceramic pot. Truly timeless and elegant.',
    colors: [
      { name: 'Pure White', hex: '#ffffff' }
    ],
    features: ['Ceramic Pot Included', 'UV Resistant'],
    has360: true,
    reviews: [
      {
        id: 701,
        name: 'Katherine P.',
        verified: true,
        date: '5 days ago',
        rating: 5,
        text: 'Most artificial orchids look so fake and plasticky, but this one is incredibly lifelike! The waxy petals look so authentic.'
      }
    ]
  },
  {
    id: 8,
    title: 'Red Rose',
    category: 'velvet',
    color: 'burgundy',
    type: 'single-stem',
    subtitle: 'Luxe Velvet Series',
    price: 'Rs 6500.00',
    numericPrice: 6500,
    rating: 4.8,
    reviewCount: 112,
    image: redRose,
    thumbnails: [
      redRose
    ],
    description: 'Three long-stemmed velvet roses in a rich crimson hue, meticulously detailed to represent real fresh-cut roses.',
    colors: [
      { name: 'Crimson Red', hex: '#6b3b3b' },
      { name: 'Pastel Pink', hex: '#e8b4b8' }
    ],
    features: ['Global Shipping', 'Velvet Hand-Finish'],
    has360: true,
    reviews: [
      {
        id: 801,
        name: 'Jessica T.',
        verified: true,
        date: '2 weeks ago',
        rating: 5,
        text: 'Stunning! The deep burgundy shade is gorgeous, and the velvet leaves have a great feel.'
      }
    ]
  },
  {
    id: 9,
    title: 'Faux Lavender Bundle',
    category: 'dried',
    color: 'purple',
    type: 'arrangement',
    subtitle: 'Preserved Look Lavender',
    price: 'Rs 3850.00',
    numericPrice: 3850,
    rating: 4.7,
    reviewCount: 78,
    image: wildHearth,
    thumbnails: [
      wildHearth,
      '/images/cat_roses.png'
    ],
    description: 'A rustic bundle of French lavender, coated with a light dusting of powder to perfectly mimic natural lavender blooms.',
    colors: [
      { name: 'Lavender Blue', hex: '#c5b4e3' }
    ],
    features: ['Dust-Resistant', 'Rustic Presentation'],
    has360: false,
    reviews: [
      {
        id: 901,
        name: 'Oliver N.',
        verified: true,
        date: '1 month ago',
        rating: 4,
        text: 'Very full bundle. Adding a drop of lavender essential oil makes them completely indistinguishable from real ones!'
      }
    ]
  },
  {
    id: 10,
    title: 'Pink Lily',
    category: 'silk',
    color: 'white',
    type: 'single-stem',
    subtitle: 'Classic Magnolia Series',
    price: 'Rs 7800.00',
    numericPrice: 7800,
    rating: 4.9,
    reviewCount: 63,
    image: pinkLilyStem,
    thumbnails: [
      pinkLilyStem
    ],
    description: 'An impressive single-stem magnolia bloom with thick, waxy white petals and realistic woody branch detailing.',
    colors: [
      { name: 'Cream Ivory', hex: '#fcf9f8' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    features: ['Thick Waxy Petals', 'Sustainable Fibers'],
    has360: true,
    reviews: [
      {
        id: 1001,
        name: 'Camilla L.',
        verified: true,
        date: '3 weeks ago',
        rating: 5,
        text: 'The size of the bloom is majestic. Looks beautiful on my dining room console.'
      }
    ]
  },
  {
    id: 11,
    title: 'Red Romance Bouquet',
    category: 'silk',
    color: 'burgundy',
    type: 'bouquet',
    subcategory: 'anniversary',
    subtitle: 'Velvet Love Series',
    price: 'Rs 9500.00',
    numericPrice: 9500,
    rating: 4.9,
    reviewCount: 88,
    image: redRose,
    thumbnails: [redRose],
    description: 'An elegant arrangement of crimson red roses crafted from premium velvet, perfectly arranged to express timeless love and romance.',
    colors: [
      { name: 'Crimson Red', hex: '#6b3b3b' },
      { name: 'Pastel Pink', hex: '#e8b4b8' }
    ],
    features: ['Luxury Packaging', 'Velvet Roses'],
    has360: false,
    reviews: []
  },
  {
    id: 12,
    title: 'Golden Celebration Bouquet',
    category: 'silk',
    color: 'yellow',
    type: 'bouquet',
    subcategory: 'birthday',
    subtitle: 'Celebration Series',
    price: 'Rs 12000.00',
    numericPrice: 12000,
    rating: 4.7,
    reviewCount: 45,
    image: pinkRosesBouquet,
    thumbnails: [pinkRosesBouquet],
    description: 'A cheerful celebration arrangement combining hand-painted silk flowers in bright gold and pink tones, ideal for birthdays and happy occasions.',
    colors: [
      { name: 'Pale Yellow', hex: '#fbfbe3' },
      { name: 'Soft White', hex: '#ffffff' }
    ],
    features: ['Gift Card Included', 'Vibrant Aesthetics'],
    has360: false,
    reviews: []
  },
  {
    id: 13,
    title: 'Graduation Glory Bouquet',
    category: 'silk',
    color: 'white',
    type: 'bouquet',
    subcategory: 'convocation',
    subtitle: 'Achievement Series',
    price: 'Rs 8500.00',
    numericPrice: 8500,
    rating: 4.8,
    reviewCount: 62,
    image: serenityWhite,
    thumbnails: [serenityWhite],
    description: 'A stately bouquet of pure white orchids and lilies symbolizing honor, success, and high achievements. Perfect for graduation ceremonies.',
    colors: [
      { name: 'Soft White', hex: '#ffffff' },
      { name: 'Ivory White', hex: '#fcf9f8' }
    ],
    features: ['Sustainable Fibers', 'UV Protection'],
    has360: false,
    reviews: []
  },
  {
    id: 14,
    title: 'Rose Crown Head Dress',
    category: 'silk',
    color: 'pink',
    type: 'head-dress',
    subcategory: 'wedding',
    subtitle: 'Bridal Royalty Series',
    price: 'Rs 5500.00',
    numericPrice: 5500,
    rating: 4.9,
    reviewCount: 88,
    image: roseCrownHeadDress,
    thumbnails: [roseCrownHeadDress],
    description: 'A beautiful luxury rose crown handcrafted from premium silk roses. Designed to add majestic bridal elegance on your dream wedding day.',
    colors: [
      { name: 'Soft Pink', hex: '#f5ccd4' },
      { name: 'Cream White', hex: '#ffffff' }
    ],
    features: ['Handcrafted Silk', 'Adjustable Ribbon Fit'],
    has360: false,
    reviews: []
  },
  {
    id: 15,
    title: 'Pearl Blossom Floral Crown',
    category: 'silk',
    color: 'white',
    type: 'head-dress',
    subcategory: 'wedding',
    subtitle: 'Bridal Majesty Series',
    price: 'Rs 6200.00',
    numericPrice: 6200,
    rating: 4.8,
    reviewCount: 42,
    image: pearlBlossomFloralCrown,
    thumbnails: [pearlBlossomFloralCrown],
    description: 'An elegant floral crown featuring premium white blossoms and delicate pearl accents, bringing graceful style to bridal ensembles.',
    colors: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Ivory Cream', hex: '#fcf9f8' }
    ],
    features: ['Premium Faux Pearls', 'Comfortable Hair Base'],
    has360: false,
    reviews: []
  },
  {
    id: 16,
    title: 'Elegant Bridal Flower Tiara',
    category: 'silk',
    color: 'white',
    type: 'head-dress',
    subcategory: 'wedding',
    subtitle: 'Classic Wedding Series',
    price: 'Rs 4800.00',
    numericPrice: 4800,
    rating: 4.7,
    reviewCount: 31,
    image: bridalFlowerTiara,
    thumbnails: [bridalFlowerTiara],
    description: 'A gorgeous wedding tiara crafted with cream rose buds and delicate baby\'s breath, providing a subtle, sophisticated bridal charm.',
    colors: [
      { name: 'Cream White', hex: '#fcf9f8' }
    ],
    features: ['Wired Metal Base', 'Handmade Detail'],
    has360: false,
    reviews: []
  },
  {
    id: 17,
    title: 'White Orchid Wedding Crown',
    category: 'silk',
    color: 'white',
    type: 'head-dress',
    subcategory: 'wedding',
    subtitle: 'Exotic Bridal Series',
    price: 'Rs 7000.00',
    numericPrice: 7000,
    rating: 5.0,
    reviewCount: 15,
    image: whiteOrchidWeddingCrown,
    thumbnails: [whiteOrchidWeddingCrown],
    description: 'A stately head dress of hyper-realistic white orchid blooms and fresh green leaves, perfect for destination or garden weddings.',
    colors: [
      { name: 'Pure White', hex: '#ffffff' }
    ],
    features: ['Flexible Fit', 'Real-touch Silk Orchids'],
    has360: false,
    reviews: []
  },
  {
    id: 18,
    title: 'Luxury Wedding Flower Halo',
    category: 'silk',
    color: 'pink',
    type: 'head-dress',
    subcategory: 'wedding',
    subtitle: 'Bridal Romance Series',
    price: 'Rs 5900.00',
    numericPrice: 5900,
    rating: 4.9,
    reviewCount: 27,
    image: luxuryWeddingFlowerHalo,
    thumbnails: [luxuryWeddingFlowerHalo],
    description: 'A romantic floral halo crown in soft pink and cream tones, evoking an ethereal garden vibe for brides and bridesmaids.',
    colors: [
      { name: 'Dusty Pink', hex: '#e8b4b8' },
      { name: 'Pale Yellow', hex: '#fbfbe3' }
    ],
    features: ['Natural Preserved Look', 'Global Shipping'],
    has360: false,
    reviews: []
  },
  {
    id: 19,
    title: 'Pink Celebration Floral Crown',
    category: 'silk',
    color: 'pink',
    type: 'head-dress',
    subcategory: 'birthday',
    subtitle: 'Cheerful Birthday Series',
    price: 'Rs 3500.00',
    numericPrice: 3500,
    rating: 4.8,
    reviewCount: 54,
    image: pinkCelebrationFloralCrown,
    thumbnails: [pinkCelebrationFloralCrown],
    description: 'A vibrant celebration floral crown featuring bright pink silk roses and pastel ranunculus, perfect for birthday parties and celebrations.',
    colors: [
      { name: 'Vibrant Pink', hex: '#ff6b8b' },
      { name: 'Soft Cream', hex: '#ffffff' }
    ],
    features: ['Vibrant Color Pop', 'Soft-Lined Headband'],
    has360: false,
    reviews: []
  },
  {
    id: 20,
    title: 'Rainbow Blossom Head Dress',
    category: 'silk',
    color: 'pink',
    type: 'head-dress',
    subcategory: 'birthday',
    subtitle: 'Festival Birthday Series',
    price: 'Rs 3800.00',
    numericPrice: 3800,
    rating: 4.7,
    reviewCount: 22,
    image: rainbowBlossomHeadDress,
    thumbnails: [rainbowBlossomHeadDress],
    description: 'A playful festival-style head dress with colorful pastel blossoms and cascading ribbons, perfect for a cheerful birthday celebration.',
    colors: [
      { name: 'Rainbow Pastel', hex: '#fad0c4' }
    ],
    features: ['Ribbon Streamers', 'Lightweight Construction'],
    has360: false,
    reviews: []
  },
  {
    id: 21,
    title: 'Birthday Princess Flower Crown',
    category: 'silk',
    color: 'purple',
    type: 'head-dress',
    subcategory: 'birthday',
    subtitle: 'Royal Birthday Series',
    price: 'Rs 4200.00',
    numericPrice: 4200,
    rating: 4.9,
    reviewCount: 39,
    image: birthdayPrincessCrown,
    thumbnails: [birthdayPrincessCrown],
    description: 'An elegant princess tiara crown made of lavender and cream roses, adorned with subtle golden stars to celebrate your special birthday.',
    colors: [
      { name: 'Lavender Star', hex: '#c5b4e3' },
      { name: 'Pastel Pink', hex: '#e8b4b8' }
    ],
    features: ['Metallic Star Details', 'Satin-wrapped Band'],
    has360: false,
    reviews: []
  },
  {
    id: 22,
    title: 'Pastel Garden Floral Headband',
    category: 'silk',
    color: 'yellow',
    type: 'head-dress',
    subcategory: 'birthday',
    subtitle: 'Garden Birthday Series',
    price: 'Rs 3200.00',
    numericPrice: 3200,
    rating: 4.6,
    reviewCount: 19,
    image: pastelGardenFloralHeadband,
    thumbnails: [pastelGardenFloralHeadband],
    description: 'A delicate floral headband featuring pastel green, yellow and pink flowers, ideal for comfortable wear during outdoor birthday garden parties.',
    colors: [
      { name: 'Lemon Yellow', hex: '#fff9ae' },
      { name: 'Mint Green', hex: '#cbf1f5' }
    ],
    features: ['Comfort-Flex Headband', 'Soft Felt Backing'],
    has360: false,
    reviews: []
  },
  {
    id: 23,
    title: 'Floral Party Head Dress',
    category: 'silk',
    color: 'purple',
    type: 'head-dress',
    subcategory: 'birthday',
    subtitle: 'Party Celebration Series',
    price: 'Rs 3900.00',
    numericPrice: 3900,
    rating: 4.7,
    reviewCount: 28,
    image: floralPartyHeadDress,
    thumbnails: [floralPartyHeadDress],
    description: 'A beautiful head dress boasting vibrant lilac, soft cream, and rose gold blossoms, adding a glamorous floral finish to any party outfit.',
    colors: [
      { name: 'Lilac Rose Gold', hex: '#d2b4de' }
    ],
    features: ['Secure Fit Combs', 'Glitter Accent Petals'],
    has360: false,
    reviews: []
  }
];
