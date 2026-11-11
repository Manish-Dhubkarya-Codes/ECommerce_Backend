'use strict';

const UNSPLASH = (id, w = 1200, h = 1500) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const CATEGORIES = [
  { slug: 'outerwear', name: 'Outerwear', gender: 'all', sort_order: 1,
    description: 'Sculpted coats and jackets cut for a long, clean line.',
    image_url: UNSPLASH('1485968579580-b6d095142e6e') },
  { slug: 'knitwear', name: 'Knitwear', gender: 'all', sort_order: 2,
    description: 'Fine-gauge merino and cashmere against the skin.',
    image_url: UNSPLASH('1576566588028-4147f3842f27') },
  { slug: 'shirts', name: 'Shirts & Tops', gender: 'all', sort_order: 3,
    description: 'Poplin, silk and jersey foundations of the wardrobe.',
    image_url: UNSPLASH('1489987707025-afc232f7ea0f') },
  { slug: 'trousers', name: 'Trousers', gender: 'all', sort_order: 4,
    description: 'Tailored with a fluid drape, hemmed to break just so.',
    image_url: UNSPLASH('1594633312681-425c7b97ccd1') },
  { slug: 'dresses', name: 'Dresses', gender: 'women', sort_order: 5,
    description: 'Evening and day dresses with restrained drama.',
    image_url: UNSPLASH('1495385794356-15371f348c31') },
  { slug: 'accessories', name: 'Accessories', gender: 'unisex', sort_order: 6,
    description: 'Leather goods, belts and finishing pieces.',
    image_url: UNSPLASH('1492707892479-7bc8d5a4ee93') },
];

const COLLECTIONS = [
  { slug: 'noir-etude', name: 'Noir Étude', season: 'AW 2026', is_featured: true,
    tagline: 'A study in shadow and structure.',
    description: 'Our winter chapter: double-faced wool, liquid silks and a palette drawn from candlelight on stone.',
    image_url: UNSPLASH('1524504388940-b1c1722653e1', 1800, 1200) },
  { slug: 'silk-route', name: 'Silk Route', season: 'SS 2027', is_featured: false,
    tagline: 'Weightless layers for long light.',
    description: 'Air-spun cottons, washed silks and hand-rolled hems for the season of open windows.',
    image_url: UNSPLASH('1483985988355-763728e1935b', 1800, 1200) },
  { slug: 'atelier-classics', name: 'Atelier Classics', season: 'Permanent', is_featured: false,
    tagline: 'The house codes, made to stay.',
    description: 'The pieces we remake every year — the coat, the shirt, the trouser — refined rather than replaced.',
    image_url: UNSPLASH('1558769132-cb1aea458c5e', 1800, 1200) },
];

const S = (list) => list.map((size) => ({ size, available: true }));

const PRODUCTS = [
  {
    slug: 'meridian-overcoat', name: 'Meridian Overcoat', subtitle: 'Double-faced wool, unlined',
    description: 'A single-breasted overcoat drafted from our archive pattern, cut in double-faced Italian wool so it needs no lining. The shoulder is soft, the lapel hand-rolled, and the hem falls to mid-calf.',
    price: 1480, compare_at_price: 1750, category: 'outerwear', collection: 'noir-etude',
    gender: 'unisex', color_name: 'Charcoal', color_hex: '#2f3134', trim_hex: '#c8a96a',
    rail_kind: 'coat', fabric: '90% virgin wool, 10% cashmere', care: 'Dry clean only',
    images: [UNSPLASH('1485968579580-b6d095142e6e'), UNSPLASH('1548624313-0396c75e4b1a'), UNSPLASH('1591047139829-d91aecb6caea')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL']),
    details: ['Fully canvassed chest', 'Horn buttons', 'Interior pocket', 'Model is 183cm wearing M'],
    tags: ['coat', 'wool', 'winter', 'signature'], is_featured: true, is_new: false, stock: 14, sort_order: 1,
  },
  {
    slug: 'eclipse-trench', name: 'Eclipse Trench', subtitle: 'Bonded cotton gabardine',
    description: 'A storm trench in bonded cotton gabardine with a matte, water-repellent finish. Raglan sleeves keep the shoulder quiet under a bag; the belt is cut from the same cloth.',
    price: 1180, category: 'outerwear', collection: 'silk-route',
    gender: 'unisex', color_name: 'Black', color_hex: '#17181a', trim_hex: '#8d8f93',
    rail_kind: 'jacket', fabric: '100% cotton, bonded', care: 'Dry clean, cool iron',
    images: [UNSPLASH('1544441893-675973e31985'), UNSPLASH('1551488831-00ddcb6c6bd3')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL']),
    details: ['Storm flap', 'Concealed placket', 'Removable belt', 'Water repellent finish'],
    tags: ['trench', 'cotton', 'rain'], is_featured: true, is_new: true, stock: 22, sort_order: 2,
  },
  {
    slug: 'aria-silk-blouse', name: 'Aria Silk Blouse', subtitle: 'Washed silk crêpe',
    description: 'A blouse in washed silk crêpe with a covered placket and a collar that sits slightly open at the neck. Finished with mother-of-pearl buttons and French seams.',
    price: 590, category: 'shirts', collection: 'silk-route',
    gender: 'women', color_name: 'Ivory', color_hex: '#f2ede3', trim_hex: '#c8a96a',
    fabric: '100% silk', care: 'Hand wash cold, line dry',
    images: [UNSPLASH('1554412933-514a83d2f3c8'), UNSPLASH('1566206091558-7f218b696731')],
    sizes: S(['XS', 'S', 'M', 'L']),
    details: ['Covered placket', 'Mother-of-pearl buttons', 'French seams'],
    tags: ['silk', 'blouse', 'evening'], is_featured: true, is_new: true, stock: 31, sort_order: 3,
  },
  {
    slug: 'lumen-cashmere-crew', name: 'Lumen Cashmere Crew', subtitle: '12-gauge cashmere',
    description: 'A fine 12-gauge crewneck in Grade-A Mongolian cashmere, knitted with fully fashioned sides so the silhouette holds wash after wash.',
    price: 720, compare_at_price: 850, category: 'knitwear', collection: 'noir-etude',
    gender: 'unisex', color_name: 'Oat', color_hex: '#d9cdb8', trim_hex: '#2f3134',
    rail_kind: 'knit', fabric: '100% Grade-A cashmere', care: 'Hand wash cold, dry flat',
    images: [UNSPLASH('1576566588028-4147f3842f27'), UNSPLASH('1434389677669-e08b4cac3105')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL']),
    details: ['Fully fashioned', 'Ribbed collar and cuffs', '12-gauge'],
    tags: ['cashmere', 'knit', 'winter'], is_featured: true, is_new: false, stock: 27, sort_order: 4,
  },
  {
    slug: 'nocturne-turtleneck', name: 'Nocturne Turtleneck', subtitle: 'Extra-fine merino',
    description: 'A close-ribbed turtleneck in extra-fine merino — thin enough to layer under tailoring, dense enough to stand alone.',
    price: 340, category: 'knitwear', collection: 'noir-etude',
    gender: 'unisex', color_name: 'Noir', color_hex: '#17181a', trim_hex: '#c8a96a',
    rail_kind: 'knit', fabric: '100% extra-fine merino wool', care: 'Hand wash cold, dry flat',
    images: [UNSPLASH('1515886657613-9f3515b0c78f'), UNSPLASH('1550614000-4895a10e1bfd')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL']),
    details: ['Close rib', 'Flat-linked seams', 'Slim fit'],
    tags: ['merino', 'layering', 'black'], is_featured: false, is_new: true, stock: 44, sort_order: 5,
  },
  {
    slug: 'atelier-oxford-shirt', name: 'Atelier Oxford Shirt', subtitle: 'Japanese oxford cotton',
    description: 'The house shirt, cut from a dense Japanese oxford that softens with wear. A soft collar, single-needle side seams, and a slightly longer back hem.',
    price: 290, category: 'shirts', collection: 'atelier-classics',
    gender: 'men', color_name: 'Sky', color_hex: '#b9c9d8', trim_hex: '#f2ede3',
    rail_kind: 'shirt', fabric: '100% Japanese oxford cotton', care: 'Machine wash cold, warm iron',
    images: [UNSPLASH('1489987707025-afc232f7ea0f'), UNSPLASH('1525507119028-ed4c629a60a3')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    details: ['Soft collar', 'Single-needle seams', 'Curved hem'],
    tags: ['oxford', 'shirt', 'classic'], is_featured: true, is_new: false, stock: 58, sort_order: 6,
  },
  {
    slug: 'silk-avenue-shirt', name: 'Silk Avenue Shirt', subtitle: 'Sand-washed silk twill',
    description: 'A relaxed shirt in sand-washed silk twill with a camp collar and patch pockets — made for warm evenings and open collars.',
    price: 540, category: 'shirts', collection: 'silk-route',
    gender: 'unisex', color_name: 'Sage', color_hex: '#9aa88f', trim_hex: '#f2ede3',
    rail_kind: 'shirt', fabric: '100% silk twill', care: 'Dry clean only',
    images: [UNSPLASH('1596755094514-f87e34085b2c'), UNSPLASH('1618932260643-eee4a2f652a6')],
    sizes: S(['XS', 'S', 'M', 'L']),
    details: ['Camp collar', 'Patch pockets', 'Relaxed fit'],
    tags: ['silk', 'camp collar'], is_featured: false, is_new: true, stock: 19, sort_order: 7,
  },
  {
    slug: 'foundation-tee', name: 'Foundation Tee', subtitle: 'Heavyweight loopback jersey',
    description: 'A boxy tee in 240gsm loopback jersey, garment-dyed so each colour sits slightly differently. Ribbed neck that refuses to stretch out.',
    price: 140, category: 'shirts', collection: 'atelier-classics',
    gender: 'unisex', color_name: 'Bone', color_hex: '#e7e1d5', trim_hex: '#2f3134',
    rail_kind: 'tee', fabric: '100% organic cotton, 240gsm', care: 'Machine wash cold, tumble low',
    images: [UNSPLASH('1521572163474-6864f9cf17ab'), UNSPLASH('1618354691373-d851c5c3a990')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    details: ['240gsm loopback', 'Garment-dyed', 'Boxy fit'],
    tags: ['tee', 'essential', 'cotton'], is_featured: false, is_new: false, stock: 96, sort_order: 8,
  },
  {
    slug: 'signal-graphic-tee', name: 'Signal Graphic Tee', subtitle: 'Hand-screened print',
    description: 'Our house emblem hand-screened in metallic ink onto the Foundation tee base — a small signal for those who know.',
    price: 185, category: 'shirts', collection: 'silk-route',
    gender: 'unisex', color_name: 'Ink', color_hex: '#1d2733', trim_hex: '#c8a96a',
    rail_kind: 'tee', fabric: '100% organic cotton, 240gsm', care: 'Wash inside out, cold',
    images: [UNSPLASH('1490481651871-ab68de25d43d'), UNSPLASH('1571945153237-4929e783af4a')],
    sizes: S(['S', 'M', 'L', 'XL']),
    details: ['Hand-screened emblem', 'Metallic ink', 'Boxy fit'],
    tags: ['graphic', 'tee'], is_featured: false, is_new: true, stock: 62, sort_order: 9,
  },
  {
    slug: 'drift-hoodie', name: 'Drift Hoodie', subtitle: 'Brushed-back fleece',
    description: 'A heavyweight hoodie in brushed-back fleece with a double-layer hood, raglan sleeves and a hidden zip pocket at the side seam.',
    price: 320, category: 'knitwear', collection: 'atelier-classics',
    gender: 'unisex', color_name: 'Ash', color_hex: '#8f9296', trim_hex: '#17181a',
    rail_kind: 'hoodie', fabric: '80% cotton, 20% recycled poly', care: 'Machine wash cold',
    images: [UNSPLASH('1517841905240-472988babdf9'), UNSPLASH('1556905055-8f358a7a47b2')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL']),
    details: ['Double-layer hood', 'Hidden zip pocket', 'Raglan sleeve'],
    tags: ['hoodie', 'fleece', 'street'], is_featured: false, is_new: false, stock: 38, sort_order: 10,
  },
  {
    slug: 'ledger-trouser', name: 'Ledger Trouser', subtitle: 'Fluid wool suiting',
    description: 'A high-rise trouser in fluid wool suiting with a single forward pleat, side adjusters and an unfinished hem ready for your tailor.',
    price: 480, category: 'trousers', collection: 'noir-etude',
    gender: 'men', color_name: 'Graphite', color_hex: '#3a3d42', trim_hex: '#c8a96a',
    fabric: '96% wool, 4% elastane', care: 'Dry clean only',
    images: [UNSPLASH('1594633312681-425c7b97ccd1'), UNSPLASH('1617137968427-85924c800a22')],
    sizes: S(['28', '30', '32', '34', '36', '38']),
    details: ['Single forward pleat', 'Side adjusters', 'Unfinished hem'],
    tags: ['tailoring', 'wool', 'trouser'], is_featured: true, is_new: false, stock: 33, sort_order: 11,
  },
  {
    slug: 'halo-satin-trouser', name: 'Halo Satin Trouser', subtitle: 'Silk-blend satin',
    description: 'A wide-leg trouser in silk-blend satin that catches light as you move. Elasticated at the back of the waist for ease.',
    price: 520, category: 'trousers', collection: 'silk-route',
    gender: 'women', color_name: 'Champagne', color_hex: '#e4d3ae', trim_hex: '#f2ede3',
    fabric: '62% acetate, 38% viscose', care: 'Dry clean only',
    images: [UNSPLASH('1551028719-00167b16eac5'), UNSPLASH('1584917865442-de89df76afd3')],
    sizes: S(['XS', 'S', 'M', 'L']),
    details: ['Wide leg', 'Back elastic waist', 'Slant pockets'],
    tags: ['satin', 'wide leg'], is_featured: false, is_new: true, stock: 24, sort_order: 12,
  },
  {
    slug: 'column-knit-dress', name: 'Column Knit Dress', subtitle: 'Ribbed viscose knit',
    description: 'A floor-skimming column dress in ribbed viscose knit, cut close through the body and finished with a slit at the left ankle.',
    price: 680, category: 'dresses', collection: 'noir-etude',
    gender: 'women', color_name: 'Espresso', color_hex: '#41322a', trim_hex: '#c8a96a',
    fabric: '78% viscose, 22% polyamide', care: 'Hand wash cold, dry flat',
    images: [UNSPLASH('1495385794356-15371f348c31'), UNSPLASH('1496747611176-843222e1e57c')],
    sizes: S(['XS', 'S', 'M', 'L']),
    details: ['Ankle slit', 'Ribbed knit', 'Midi length'],
    tags: ['dress', 'knit', 'evening'], is_featured: true, is_new: true, stock: 17, sort_order: 13,
  },
  {
    slug: 'veil-slip-dress', name: 'Veil Slip Dress', subtitle: 'Bias-cut silk charmeuse',
    description: 'A bias-cut slip in silk charmeuse with adjustable straps and a cowl back — the quietest kind of statement.',
    price: 740, compare_at_price: 890, category: 'dresses', collection: 'silk-route',
    gender: 'women', color_name: 'Noir', color_hex: '#17181a', trim_hex: '#e4d3ae',
    fabric: '100% silk charmeuse', care: 'Dry clean only',
    images: [UNSPLASH('1502716119720-b23a93e5fe1b'), UNSPLASH('1515372039744-b8f02a3ae446')],
    sizes: S(['XS', 'S', 'M', 'L']),
    details: ['Bias cut', 'Cowl back', 'Adjustable straps'],
    tags: ['slip', 'silk', 'evening'], is_featured: false, is_new: false, stock: 12, sort_order: 14,
  },
  {
    slug: 'arc-leather-belt', name: 'Arc Leather Belt', subtitle: 'Vegetable-tanned calfskin',
    description: 'A slim belt in vegetable-tanned calfskin with a brushed champagne buckle, cut to patina beautifully with wear.',
    price: 240, category: 'accessories', collection: 'atelier-classics',
    gender: 'unisex', color_name: 'Cognac', color_hex: '#8a5a33', trim_hex: '#c8a96a',
    fabric: 'Full-grain calfskin', care: 'Wipe with soft cloth',
    images: [UNSPLASH('1553062407-98eeb64c6a62'), UNSPLASH('1548036328-c9fa89d128fa')],
    sizes: S(['80', '85', '90', '95', '100']),
    details: ['Brushed buckle', 'Vegetable-tanned', '30mm width'],
    tags: ['belt', 'leather'], is_featured: false, is_new: false, stock: 47, sort_order: 15,
  },
  {
    slug: 'orbit-tote', name: 'Orbit Tote', subtitle: 'Structured pebbled leather',
    description: 'A structured tote in pebbled leather with a suede-lined interior, magnetic closure and a detachable pouch for the small things.',
    price: 890, category: 'accessories', collection: 'noir-etude',
    gender: 'women', color_name: 'Black', color_hex: '#17181a', trim_hex: '#c8a96a',
    fabric: 'Pebbled cowhide, suede lining', care: 'Store in dust bag',
    images: [UNSPLASH('1584917865442-de89df76afd3'), UNSPLASH('1590874103328-eac38a683ce7')],
    sizes: S(['One Size']),
    details: ['Magnetic closure', 'Detachable pouch', 'Suede lining'],
    tags: ['bag', 'leather'], is_featured: true, is_new: true, stock: 9, sort_order: 16,
  },
  {
    slug: 'halo-runner-sneaker', name: 'Halo Runner Sneaker', subtitle: 'Nappa leather, cupsole',
    description: 'A minimal runner in nappa leather on a hand-stitched cupsole, finished with a tonal lace and a suede heel counter.',
    price: 420, category: 'accessories', collection: 'silk-route',
    gender: 'unisex', color_name: 'White', color_hex: '#f4f2ee', trim_hex: '#d9cdb8',
    fabric: 'Nappa leather, rubber cupsole', care: 'Wipe clean, protect before wear',
    images: [UNSPLASH('1479064555552-3ef4979f8908'), UNSPLASH('1509631179647-0177331693ae')],
    sizes: S(['38', '39', '40', '41', '42', '43', '44']),
    details: ['Hand-stitched cupsole', 'Suede heel counter', 'Nappa upper'],
    tags: ['sneaker', 'leather'], is_featured: false, is_new: true, stock: 41, sort_order: 17,
  },
  {
    slug: 'fog-wool-scarf', name: 'Fog Wool Scarf', subtitle: 'Brushed lambswool',
    description: 'An oversized scarf in brushed lambswool with hand-twisted fringe, woven in a mill that has been at it for four generations.',
    price: 260, category: 'accessories', collection: 'noir-etude',
    gender: 'unisex', color_name: 'Fog', color_hex: '#b7b3ab', trim_hex: '#17181a',
    fabric: '100% lambswool', care: 'Dry clean only',
    images: [UNSPLASH('1487412720507-e7ab37603c6f'), UNSPLASH('1445205170230-053b83016050')],
    sizes: S(['One Size']),
    details: ['Hand-twisted fringe', 'Oversized 200×70cm', 'Brushed finish'],
    tags: ['scarf', 'wool', 'winter'], is_featured: false, is_new: false, stock: 55, sort_order: 18,
  },
  {
    slug: 'axis-denim', name: 'Axis Denim', subtitle: '13oz selvedge, straight leg',
    description: 'A straight-leg jean in 13oz selvedge denim from a shuttle loom in Okayama — rigid at first, then yours.',
    price: 360, category: 'trousers', collection: 'atelier-classics',
    gender: 'unisex', color_name: 'Indigo', color_hex: '#2c3d55', trim_hex: '#c8a96a',
    fabric: '100% cotton, 13oz selvedge', care: 'Wash cold, hang dry',
    images: [UNSPLASH('1560243563-062bfc001d68'), UNSPLASH('1543076447-215ad9ba6923')],
    sizes: S(['28', '30', '32', '34', '36']),
    details: ['Selvedge ID', 'Button fly', 'Straight leg'],
    tags: ['denim', 'selvedge'], is_featured: false, is_new: false, stock: 40, sort_order: 19,
  },
  {
    slug: 'ember-bomber', name: 'Ember Bomber', subtitle: 'Wool-blend bomber',
    description: 'A collarless bomber in wool-blend melton with ribbed hem and cuffs, lined in cupro and finished with a two-way zip.',
    price: 860, category: 'outerwear', collection: 'noir-etude',
    gender: 'unisex', color_name: 'Bordeaux', color_hex: '#6d2733', trim_hex: '#17181a',
    rail_kind: 'jacket', fabric: '70% wool, 30% polyamide', care: 'Dry clean only',
    images: [UNSPLASH('1551028719-00167b16eac5'), UNSPLASH('1490114538077-0a7f8cb49891')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL']),
    details: ['Two-way zip', 'Cupro lining', 'Ribbed hem'],
    tags: ['bomber', 'wool'], is_featured: false, is_new: true, stock: 16, sort_order: 20,
  },
  {
    slug: 'linea-poplin-shirt', name: 'Linea Poplin Shirt', subtitle: 'Crisp cotton poplin',
    description: 'A long-line poplin shirt with a hidden placket and a curved shirt-tail hem — worn open over the Foundation tee or alone.',
    price: 310, category: 'shirts', collection: 'atelier-classics',
    gender: 'unisex', color_name: 'White', color_hex: '#f4f2ee', trim_hex: '#b9c9d8',
    rail_kind: 'shirt', fabric: '100% cotton poplin', care: 'Machine wash warm, iron hot',
    images: [UNSPLASH('1525507119028-ed4c629a60a3'), UNSPLASH('1495121605193-b116b5b9c5fe')],
    sizes: S(['XS', 'S', 'M', 'L', 'XL']),
    details: ['Hidden placket', 'Curved hem', 'Crisp poplin'],
    tags: ['poplin', 'shirt'], is_featured: false, is_new: false, stock: 64, sort_order: 21,
  },
  {
    slug: 'pulse-hoodie', name: 'Pulse Hoodie', subtitle: 'Boxy fleece, raw hem',
    description: 'A boxy hoodie in midweight fleece with a raw-cut hem and a deep kangaroo pocket — the off-duty uniform of the studio.',
    price: 280, category: 'knitwear', collection: 'silk-route',
    gender: 'unisex', color_name: 'Sand', color_hex: '#cdbfa6', trim_hex: '#8a5a33',
    rail_kind: 'hoodie', fabric: '100% cotton, 380gsm', care: 'Machine wash cold',
    images: [UNSPLASH('1488426862026-3ee34a7d66df'), UNSPLASH('1556905055-8f358a7a47b2')],
    sizes: S(['S', 'M', 'L', 'XL']),
    details: ['Raw hem', 'Kangaroo pocket', '380gsm fleece'],
    tags: ['hoodie', 'cotton'], is_featured: false, is_new: false, stock: 49, sort_order: 22,
  },
  {
    slug: 'quartz-chain-necklace', name: 'Quartz Chain Necklace', subtitle: 'Brushed gold vermeil',
    description: 'A medium curb chain in gold vermeil over sterling silver, brushed to a soft matte so it reads quiet against the collarbone.',
    price: 380, category: 'accessories', collection: 'silk-route',
    gender: 'unisex', color_name: 'Gold', color_hex: '#c8a96a', trim_hex: '#f4f2ee',
    fabric: 'Gold vermeil over sterling silver', care: 'Store dry, avoid perfume',
    images: [UNSPLASH('1492707892479-7bc8d5a4ee93'), UNSPLASH('1519345182560-3f2917c472ef')],
    sizes: S(['One Size']),
    details: ['Curb chain', '45cm length', 'Brushed finish'],
    tags: ['jewelry', 'gold'], is_featured: false, is_new: true, stock: 28, sort_order: 23,
  },
  {
    slug: 'strata-field-jacket', name: 'Strata Field Jacket', subtitle: 'Waxed cotton canvas',
    description: 'A four-pocket field jacket in waxed cotton canvas that will crease and lighten exactly where you move.',
    price: 780, category: 'outerwear', collection: 'atelier-classics',
    gender: 'unisex', color_name: 'Olive', color_hex: '#4d5240', trim_hex: '#8a5a33',
    rail_kind: 'jacket', fabric: '100% waxed cotton canvas', care: 'Sponge clean, re-wax yearly',
    images: [UNSPLASH('1495105787522-5334e3ffa0ef'), UNSPLASH('1517445312882-bc9910d016b7')],
    sizes: S(['S', 'M', 'L', 'XL']),
    details: ['Four bellows pockets', 'Waxed finish', 'Corduroy collar'],
    tags: ['field jacket', 'wax'], is_featured: false, is_new: false, stock: 21, sort_order: 24,
  },
];

async function seed(client) {
  const q = (text, params) => client.query(text, params);

  for (const c of CATEGORIES) {
    await q(
      `INSERT INTO categories (slug, name, description, image_url, gender, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, description = EXCLUDED.description,
         image_url = EXCLUDED.image_url, gender = EXCLUDED.gender,
         sort_order = EXCLUDED.sort_order`,
      [c.slug, c.name, c.description, c.image_url, c.gender, c.sort_order]
    );
  }

  for (const c of COLLECTIONS) {
    await q(
      `INSERT INTO collections (slug, name, tagline, description, image_url, season, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, tagline = EXCLUDED.tagline,
         description = EXCLUDED.description, image_url = EXCLUDED.image_url,
         season = EXCLUDED.season, is_featured = EXCLUDED.is_featured`,
      [c.slug, c.name, c.tagline, c.description, c.image_url, c.season, c.is_featured]
    );
  }

  for (const p of PRODUCTS) {
    const images = p.images.map((url, i) => ({
      url,
      alt: `${p.name} — view ${i + 1}`,
      position: i,
    }));
    await q(
      `INSERT INTO products (
         slug, name, subtitle, description, price, compare_at_price, currency,
         category_id, collection_id, gender, color_name, color_hex, trim_hex,
         rail_kind, fabric, care, images, sizes, details, tags,
         is_featured, is_new, stock, sort_order
       ) VALUES (
         $1,$2,$3,$4,$5,$6,'USD',
         (SELECT id FROM categories WHERE slug = $7),
         (SELECT id FROM collections WHERE slug = $8),
         $9,$10,$11,$12,$13,$14,$15,
         $16::jsonb,$17::jsonb,$18::jsonb,$19::jsonb,
         $20,$21,$22,$23
       )
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, subtitle = EXCLUDED.subtitle,
         description = EXCLUDED.description, price = EXCLUDED.price,
         compare_at_price = EXCLUDED.compare_at_price,
         category_id = EXCLUDED.category_id, collection_id = EXCLUDED.collection_id,
         gender = EXCLUDED.gender, color_name = EXCLUDED.color_name,
         color_hex = EXCLUDED.color_hex, trim_hex = EXCLUDED.trim_hex,
         rail_kind = EXCLUDED.rail_kind, fabric = EXCLUDED.fabric, care = EXCLUDED.care,
         images = EXCLUDED.images, sizes = EXCLUDED.sizes, details = EXCLUDED.details,
         tags = EXCLUDED.tags, is_featured = EXCLUDED.is_featured,
         is_new = EXCLUDED.is_new, stock = EXCLUDED.stock, sort_order = EXCLUDED.sort_order`,
      [
        p.slug, p.name, p.subtitle, p.description, p.price,
        p.compare_at_price || null,
        p.category, p.collection, p.gender, p.color_name, p.color_hex, p.trim_hex,
        p.rail_kind || null, p.fabric, p.care,
        JSON.stringify(images),
        JSON.stringify(p.sizes),
        JSON.stringify(p.details),
        JSON.stringify(p.tags),
        p.is_featured, p.is_new, p.stock, p.sort_order,
      ]
    );
  }

  return { categories: CATEGORIES.length, collections: COLLECTIONS.length, products: PRODUCTS.length };
}

module.exports = { seed, CATEGORIES, COLLECTIONS, PRODUCTS };
