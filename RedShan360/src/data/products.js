// Local Image Imports
import crimsonSilkPeony from '../assets/crimson_silk_peony.jpg';
import moonlightVelvetTulip from '../assets/moonlight_velvet_tulip.jpg';
import etherealPampasCloud from '../assets/ethereal_pampas_cloud.jpg';
import sakuraSpringBloom from '../assets/sakura_spring_bloom.jpg';
import architecturalProtea from '../assets/architectural_protea.jpg';
import mauveRadianceDahlia from '../assets/mauve_radiance_dahlia.jpg';
import serenityWhite from '../assets/serenity_white.jpg';
import wildHearth from '../assets/wild_hearth.jpg';

export const products = [
  {
    id: 1,
    title: 'Everlasting Silk Peony',
    category: 'silk',
    color: 'pink',
    type: 'bouquet',
    subtitle: 'The Bloom Collection',
    price: 'Rs 15000.00',
    numericPrice: 15000,
    rating: 4.8,
    reviewCount: 124,
    image: crimsonSilkPeony,
    thumbnails: [
      crimsonSilkPeony,
      '/images/peonies_vase.png',
      '/images/cat_peonies.png'
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
    title: 'Moonlight Velvet Tulip',
    category: 'velvet',
    color: 'white',
    type: 'bouquet',
    subtitle: 'Luxe Velvet Series',
    price: 'Rs 11420.00',
    numericPrice: 11420,
    rating: 4.8,
    reviewCount: 86,
    image: moonlightVelvetTulip,
    thumbnails: [
      moonlightVelvetTulip,
      serenityWhite,
      '/images/cat_lilies.png'
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
    title: 'Ethereal Pampas Cloud',
    category: 'dried',
    color: 'beige',
    type: 'arrangement',
    subtitle: 'Everlasting Dried Flora',
    price: 'Rs 9800.00',
    numericPrice: 9800,
    rating: 5.0,
    reviewCount: 42,
    image: etherealPampasCloud,
    thumbnails: [
      etherealPampasCloud,
      wildHearth,
      '/images/visualizer_360.png'
    ],
    description: 'A whimsical cloud of natural dried pampas grass and preserved botanicals, styled in an organic, rustic-modern fashion. Perfect for boho-chic decor.',
    colors: [
      { name: 'Warm Beige', hex: '#f4f0ed' },
      { name: 'Natural Sand', hex: '#c7b1a9' }
    ],
    features: ['Real Preserved Flora', 'Sustainable Fibers'],
    has360: false,
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
    type: 'single-stem',
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
    title: 'Architectural Protea',
    category: 'vases',
    color: 'burgundy',
    type: 'centerpiece',
    subtitle: 'Signature Single Stem',
    price: 'Rs 2750.00',
    numericPrice: 2750,
    rating: 4.9,
    reviewCount: 56,
    image: architecturalProtea,
    thumbnails: [
      architecturalProtea,
      mauveRadianceDahlia,
      '/images/cat_orchids.png'
    ],
    description: 'An exotic protea bloom with structural leaves and a bold burgundy color palette, making it a dramatic centerpiece for minimalist styling.',
    colors: [
      { name: 'Deep Burgundy', hex: '#6b3b3b' },
      { name: 'Olive Green', hex: '#8c8d7b' }
    ],
    features: ['Unique Exotic Sculpting', 'Global Shipping'],
    has360: false,
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
    title: 'Silk Orchid Stem',
    category: 'silk',
    color: 'white',
    type: 'single-stem',
    subtitle: 'Classic Orchid Series',
    price: 'Rs 3420.00',
    numericPrice: 3420,
    rating: 4.9,
    reviewCount: 94,
    image: '/images/cat_orchids.png',
    thumbnails: [
      '/images/cat_orchids.png',
      serenityWhite,
      '/images/peonies_vase.png'
    ],
    description: 'A minimalist white orchid stem presented in a modern matte black ceramic pot. Truly timeless and elegant.',
    colors: [
      { name: 'Pure White', hex: '#ffffff' }
    ],
    features: ['Ceramic Pot Included', 'UV Resistant'],
    has360: false,
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
    title: 'Velvet Rose Trio',
    category: 'velvet',
    color: 'burgundy',
    type: 'bouquet',
    subtitle: 'Luxe Velvet Series',
    price: 'Rs 6500.00',
    numericPrice: 6500,
    rating: 4.8,
    reviewCount: 112,
    image: '/images/roses_vase.png',
    thumbnails: [
      '/images/roses_vase.png',
      crimsonSilkPeony,
      '/images/peonies_vase.png'
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
    title: 'Imperial Magnolia',
    category: 'silk',
    color: 'white',
    type: 'single-stem',
    subtitle: 'Classic Magnolia Series',
    price: 'Rs 7800.00',
    numericPrice: 7800,
    rating: 4.9,
    reviewCount: 63,
    image: serenityWhite,
    thumbnails: [
      serenityWhite,
      '/images/cat_lilies.png'
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
  }
];
