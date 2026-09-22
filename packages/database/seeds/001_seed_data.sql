-- ============================================================================
-- Tanmayee Technologies — Seed Data
-- 130+ products from Blue Star & Rockwell catalogues
-- ============================================================================

-- ============================================================================
-- BRANDS
-- ============================================================================
INSERT INTO brands (id, name, slug, description, seo_title, seo_description, website_url, sort_order) VALUES
    ('b0000001-0000-0000-0000-000000000001', 'Blue Star', 'blue-star',
     'Blue Star Limited is India''s leading air conditioning and commercial refrigeration company. Tanmayee Technologies is a trusted source for Blue Star products including split ACs, cassette ACs, tower ACs, and window ACs for commercial and residential applications.',
     'Blue Star Products | Tanmayee Technologies',
     'Explore Blue Star air conditioners and cooling solutions available through Tanmayee Technologies. Split ACs, cassette ACs, tower ACs, and window ACs.',
     'https://www.bluestarindia.com', 1),
    ('b0000001-0000-0000-0000-000000000002', 'Rockwell', 'rockwell',
     'Rockwell Industries Limited is a leading manufacturer of commercial refrigeration and cooling equipment. Tanmayee Technologies offers the complete Rockwell range including freezers, visi coolers, water coolers, ice makers, and specialized refrigeration solutions.',
     'Rockwell Products | Tanmayee Technologies',
     'Explore Rockwell commercial refrigeration products available through Tanmayee Technologies. Freezers, visi coolers, water coolers, ice makers, and more.',
     'https://www.rockwellindia.com', 2);

-- ============================================================================
-- CATEGORIES (parent categories)
-- ============================================================================
INSERT INTO categories (id, parent_id, name, slug, description, seo_title, seo_description, sort_order) VALUES
    -- Top level
    ('c0000001-0000-0000-0000-000000000001', NULL, 'Air Conditioners', 'air-conditioners',
     'Commercial and residential air conditioning solutions from leading brands. Split ACs, cassette ACs, tower ACs, and window ACs for every application.',
     'Air Conditioners | Tanmayee Technologies',
     'Browse air conditioners from Blue Star at Tanmayee Technologies. Inverter split ACs, cassette ACs, tower ACs, and window ACs.', 1),
    ('c0000001-0000-0000-0000-000000000002', NULL, 'Freezers', 'freezers',
     'Commercial freezers and cold storage solutions from Rockwell. Green freezers, hard top freezers, glass top freezers, eutectic freezers, blast freezers, and more.',
     'Commercial Freezers | Tanmayee Technologies',
     'Browse Rockwell commercial freezers at Tanmayee Technologies. Green freezers, hard top freezers, glass top freezers, and blast freezers.', 2),
    ('c0000001-0000-0000-0000-000000000003', NULL, 'Visi Coolers', 'visi-coolers',
     'Commercial display coolers and visi freezers from Rockwell for retail, hospitality, and food service applications.',
     'Visi Coolers | Tanmayee Technologies',
     'Browse Rockwell visi coolers and display coolers at Tanmayee Technologies.', 3),
    ('c0000001-0000-0000-0000-000000000004', NULL, 'Water Coolers & Dispensers', 'water-coolers-dispensers',
     'Stainless steel water coolers and bottled water dispensers from Rockwell for commercial and industrial use.',
     'Water Coolers & Dispensers | Tanmayee Technologies',
     'Browse Rockwell water coolers and dispensers at Tanmayee Technologies.', 4),
    ('c0000001-0000-0000-0000-000000000005', NULL, 'Ice Makers', 'ice-makers',
     'Commercial and portable ice makers from Rockwell for hospitality, restaurants, healthcare, and industrial applications.',
     'Ice Makers | Tanmayee Technologies',
     'Browse Rockwell commercial ice makers at Tanmayee Technologies.', 5),
    ('c0000001-0000-0000-0000-000000000006', NULL, 'Commercial Kitchen Refrigeration', 'commercial-kitchen-refrigeration',
     'Professional reach-in refrigerators, chillers, under-counter units, and back bar coolers from Rockwell for commercial kitchens.',
     'Commercial Kitchen Refrigeration | Tanmayee Technologies',
     'Browse Rockwell commercial kitchen refrigeration at Tanmayee Technologies.', 6),
    ('c0000001-0000-0000-0000-000000000007', NULL, 'Specialty Cooling', 'specialty-cooling',
     'Wine coolers, car coolers, mini refrigerators, and confectionery showcases from Rockwell.',
     'Specialty Cooling | Tanmayee Technologies',
     'Browse Rockwell specialty cooling products at Tanmayee Technologies.', 7);

-- ============================================================================
-- SUBCATEGORIES
-- ============================================================================
INSERT INTO categories (id, parent_id, name, slug, description, seo_title, seo_description, sort_order) VALUES
    -- AC subcategories
    ('c0000002-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001',
     'Inverter Split AC', 'inverter-split-ac', 'Energy-efficient inverter split air conditioners from Blue Star.',
     'Inverter Split AC | Blue Star | Tanmayee Technologies', 'Blue Star inverter split ACs at Tanmayee Technologies.', 1),
    ('c0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001',
     'Non-Inverter Split AC', 'non-inverter-split-ac', 'Reliable non-inverter split air conditioners from Blue Star.',
     'Non-Inverter Split AC | Blue Star | Tanmayee Technologies', 'Blue Star non-inverter split ACs at Tanmayee Technologies.', 2),
    ('c0000002-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001',
     'Cassette AC', 'cassette-ac', 'Commercial cassette air conditioners from Blue Star for offices and large spaces.',
     'Cassette AC | Blue Star | Tanmayee Technologies', 'Blue Star cassette ACs at Tanmayee Technologies.', 3),
    ('c0000002-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001',
     'Tower AC', 'tower-ac', 'High-capacity tower air conditioners from Blue Star for large commercial spaces.',
     'Tower AC | Blue Star | Tanmayee Technologies', 'Blue Star tower ACs at Tanmayee Technologies.', 4),
    ('c0000002-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000001',
     'Window Inverter AC', 'window-inverter-ac', 'Energy-efficient window inverter air conditioners from Blue Star.',
     'Window Inverter AC | Blue Star | Tanmayee Technologies', 'Blue Star window inverter ACs at Tanmayee Technologies.', 5),
    ('c0000002-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000001',
     'Window Non-Inverter AC', 'window-non-inverter-ac', 'Dependable window non-inverter air conditioners from Blue Star.',
     'Window Non-Inverter AC | Blue Star | Tanmayee Technologies', 'Blue Star window non-inverter ACs at Tanmayee Technologies.', 6),

    -- Freezer subcategories
    ('c0000002-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000002',
     'Convertible Green Freezer', 'convertible-green-freezer', 'Rockwell convertible green freezers with advanced energy efficiency.',
     'Convertible Green Freezer | Rockwell | Tanmayee Technologies', 'Rockwell convertible green freezers at Tanmayee Technologies.', 1),
    ('c0000002-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000002',
     'Large Freezer', 'large-freezer', 'Rockwell large capacity commercial freezers.',
     'Large Freezer | Rockwell | Tanmayee Technologies', 'Rockwell large freezers at Tanmayee Technologies.', 2),
    ('c0000002-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000002',
     'Eutectic Freezer', 'eutectic-freezer', 'Rockwell eutectic freezers for extended cold retention without power.',
     'Eutectic Freezer | Rockwell | Tanmayee Technologies', 'Rockwell eutectic freezers at Tanmayee Technologies.', 3),
    ('c0000002-0000-0000-0000-000000000013', 'c0000001-0000-0000-0000-000000000002',
     'Freezer on Wheels', 'freezer-on-wheels', 'Rockwell mobile freezers on wheels for flexible cold storage.',
     'Freezer on Wheels | Rockwell | Tanmayee Technologies', 'Rockwell freezers on wheels at Tanmayee Technologies.', 4),
    ('c0000002-0000-0000-0000-000000000014', 'c0000001-0000-0000-0000-000000000002',
     'Convertible Hard Top Freezer', 'convertible-hard-top-freezer', 'Rockwell convertible hard top freezers.',
     'Convertible Hard Top Freezer | Rockwell | Tanmayee Technologies', 'Rockwell hard top freezers at Tanmayee Technologies.', 5),
    ('c0000002-0000-0000-0000-000000000015', 'c0000001-0000-0000-0000-000000000002',
     'Glass Top Freezer', 'glass-top-freezer', 'Rockwell glass top freezers for display and storage.',
     'Glass Top Freezer | Rockwell | Tanmayee Technologies', 'Rockwell glass top freezers at Tanmayee Technologies.', 6),
    ('c0000002-0000-0000-0000-000000000016', 'c0000001-0000-0000-0000-000000000002',
     'Combi Freezer & Cooler', 'combi-freezer-cooler', 'Rockwell combination freezer and cooler units.',
     'Combi Freezer & Cooler | Rockwell | Tanmayee Technologies', 'Rockwell combi freezer and cooler at Tanmayee Technologies.', 7),
    ('c0000002-0000-0000-0000-000000000017', 'c0000001-0000-0000-0000-000000000002',
     'Blast Freezer', 'blast-freezer', 'Rockwell blast freezers for rapid freezing in commercial kitchens.',
     'Blast Freezer | Rockwell | Tanmayee Technologies', 'Rockwell blast freezers at Tanmayee Technologies.', 8),

    -- Visi subcategories
    ('c0000002-0000-0000-0000-000000000020', 'c0000001-0000-0000-0000-000000000003',
     'Visi Cooler', 'visi-cooler', 'Rockwell display visi coolers for beverages and perishables.',
     'Visi Cooler | Rockwell | Tanmayee Technologies', 'Rockwell visi coolers at Tanmayee Technologies.', 1),
    ('c0000002-0000-0000-0000-000000000021', 'c0000001-0000-0000-0000-000000000003',
     'Visi Freezer', 'visi-freezer', 'Rockwell display visi freezers for frozen products.',
     'Visi Freezer | Rockwell | Tanmayee Technologies', 'Rockwell visi freezers at Tanmayee Technologies.', 2),
    ('c0000002-0000-0000-0000-000000000022', 'c0000001-0000-0000-0000-000000000003',
     'Upright Freezer', 'upright-freezer', 'Rockwell upright freezers for space-efficient storage.',
     'Upright Freezer | Rockwell | Tanmayee Technologies', 'Rockwell upright freezers at Tanmayee Technologies.', 3),

    -- Water subcategories
    ('c0000002-0000-0000-0000-000000000030', 'c0000001-0000-0000-0000-000000000004',
     'Stainless Steel Water Cooler', 'ss-water-cooler', 'Rockwell stainless steel water coolers.',
     'SS Water Cooler | Rockwell | Tanmayee Technologies', 'Rockwell stainless steel water coolers at Tanmayee Technologies.', 1),
    ('c0000002-0000-0000-0000-000000000031', 'c0000001-0000-0000-0000-000000000004',
     'Bottled Water Dispenser', 'bottled-water-dispenser', 'Rockwell bottled water dispensers.',
     'Bottled Water Dispenser | Rockwell | Tanmayee Technologies', 'Rockwell bottled water dispensers at Tanmayee Technologies.', 2),

    -- Kitchen subcategories
    ('c0000002-0000-0000-0000-000000000040', 'c0000001-0000-0000-0000-000000000006',
     'Reach-In Freezer/Chiller', 'reach-in-freezer-chiller', 'Rockwell reach-in freezers and chillers for commercial kitchens.',
     'Reach-In Freezer/Chiller | Rockwell | Tanmayee Technologies', 'Rockwell reach-in units at Tanmayee Technologies.', 1),
    ('c0000002-0000-0000-0000-000000000041', 'c0000001-0000-0000-0000-000000000006',
     'Under Counter Freezer/Chiller', 'under-counter-freezer-chiller', 'Rockwell under counter freezers and chillers.',
     'Under Counter | Rockwell | Tanmayee Technologies', 'Rockwell under counter units at Tanmayee Technologies.', 2),
    ('c0000002-0000-0000-0000-000000000042', 'c0000001-0000-0000-0000-000000000006',
     'Back Bar Cooler', 'back-bar-cooler', 'Rockwell back bar coolers for hospitality and bars.',
     'Back Bar Cooler | Rockwell | Tanmayee Technologies', 'Rockwell back bar coolers at Tanmayee Technologies.', 3),

    -- Specialty subcategories
    ('c0000002-0000-0000-0000-000000000050', 'c0000001-0000-0000-0000-000000000007',
     'Wine Cooler', 'wine-cooler', 'Rockwell wine coolers for precise temperature storage.',
     'Wine Cooler | Rockwell | Tanmayee Technologies', 'Rockwell wine coolers at Tanmayee Technologies.', 1),
    ('c0000002-0000-0000-0000-000000000051', 'c0000001-0000-0000-0000-000000000007',
     'Car Cooler', 'car-cooler', 'Rockwell portable car coolers for on-the-go cooling.',
     'Car Cooler | Rockwell | Tanmayee Technologies', 'Rockwell car coolers at Tanmayee Technologies.', 2),
    ('c0000002-0000-0000-0000-000000000052', 'c0000001-0000-0000-0000-000000000007',
     'Mini Refrigerator', 'mini-refrigerator', 'Rockwell mini refrigerators for hotels, offices, and personal use.',
     'Mini Refrigerator | Rockwell | Tanmayee Technologies', 'Rockwell mini refrigerators at Tanmayee Technologies.', 3),
    ('c0000002-0000-0000-0000-000000000053', 'c0000001-0000-0000-0000-000000000007',
     'Confectionery Showcase', 'confectionery-showcase', 'Rockwell confectionery display showcases for bakeries and pastry shops.',
     'Confectionery Showcase | Rockwell | Tanmayee Technologies', 'Rockwell confectionery showcases at Tanmayee Technologies.', 4);

-- ============================================================================
-- CATEGORY ATTRIBUTES — Dynamic filter definitions
-- ============================================================================

-- AC attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, attribute_unit, filter_type, possible_values, is_filterable, sort_order) VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Capacity', 'enum', 'Ton', 'select', '["1 Ton","1.5 Ton","2 Ton","2.5 Ton","3 Ton","4 Ton"]', true, 1),
    ('c0000001-0000-0000-0000-000000000001', 'Star Rating', 'enum', 'Star', 'select', '["2 Star","3 Star","5 Star"]', true, 2),
    ('c0000001-0000-0000-0000-000000000001', 'Type', 'enum', NULL, 'select', '["Split","Cassette","Tower","Window"]', true, 3),
    ('c0000001-0000-0000-0000-000000000001', 'Inverter', 'boolean', NULL, 'checkbox', '["Yes","No"]', true, 4);

-- Freezer attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, attribute_unit, filter_type, possible_values, is_filterable, sort_order) VALUES
    ('c0000001-0000-0000-0000-000000000002', 'Capacity', 'number', 'L', 'range', NULL, true, 1),
    ('c0000001-0000-0000-0000-000000000002', 'Doors', 'enum', NULL, 'select', '["1","2","3"]', true, 2),
    ('c0000001-0000-0000-0000-000000000002', 'Type', 'enum', NULL, 'select', '["Convertible Green","Large","Eutectic","Wheels","Hard Top","Glass Top","Combi","Blast"]', true, 3);

-- Visi Cooler attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, attribute_unit, filter_type, possible_values, is_filterable, sort_order) VALUES
    ('c0000001-0000-0000-0000-000000000003', 'Capacity', 'number', 'L', 'range', NULL, true, 1),
    ('c0000001-0000-0000-0000-000000000003', 'Doors', 'enum', NULL, 'select', '["1","2","3"]', true, 2);

-- Water Cooler attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, attribute_unit, filter_type, possible_values, is_filterable, sort_order) VALUES
    ('c0000001-0000-0000-0000-000000000004', 'Capacity', 'number', 'L', 'range', NULL, true, 1),
    ('c0000001-0000-0000-0000-000000000004', 'Taps', 'enum', NULL, 'select', '["1","2","3","4"]', true, 2);

-- Ice Maker attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, attribute_unit, filter_type, possible_values, is_filterable, sort_order) VALUES
    ('c0000001-0000-0000-0000-000000000005', 'Production Capacity', 'text', NULL, 'search', NULL, true, 1);

-- Kitchen Refrigeration attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, attribute_unit, filter_type, possible_values, is_filterable, sort_order) VALUES
    ('c0000001-0000-0000-0000-000000000006', 'Capacity', 'number', 'L', 'range', NULL, true, 1),
    ('c0000001-0000-0000-0000-000000000006', 'Doors', 'enum', NULL, 'select', '["1","2","3"]', true, 2);

-- ============================================================================
-- SERVICES
-- ============================================================================
INSERT INTO services (name, slug, short_description, description, sort_order) VALUES
    ('AC Installation', 'ac-installation', 'Professional air conditioner installation service.',
     'Expert installation of split, cassette, tower, and window air conditioners. Our trained technicians ensure proper installation for optimal performance and energy efficiency.', 1),
    ('AC Maintenance & Service', 'ac-maintenance-service', 'Regular AC maintenance and repair service.',
     'Comprehensive AC maintenance including cleaning, gas charging, filter replacement, and troubleshooting for all types of air conditioners.', 2),
    ('Freezer Installation', 'freezer-installation', 'Commercial freezer installation service.',
     'Professional installation of commercial freezers including green freezers, hard top freezers, glass top freezers, and blast freezers.', 3),
    ('Freezer Maintenance', 'freezer-maintenance', 'Commercial freezer maintenance and repair service.',
     'Regular maintenance, troubleshooting, and repair service for all types of commercial freezers.', 4),
    ('Water Cooler Installation', 'water-cooler-installation', 'Water cooler installation service.',
     'Professional installation of stainless steel water coolers and bottled water dispensers.', 5),
    ('AMC - Annual Maintenance Contract', 'annual-maintenance-contract', 'Annual maintenance contract for all equipment.',
     'Comprehensive annual maintenance contracts covering regular servicing, emergency repairs, and replacement support for all cooling equipment.', 6);

-- ============================================================================
-- PRODUCTS — Blue Star Air Conditioners (24 products)
-- ============================================================================
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    -- Inverter Split ACs
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000001',
     'Blue Star 1 Ton 3 Star Inverter Split AC', 'blue-star-1-ton-3-star-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1 Ton 3 Star inverter split air conditioner for energy-efficient cooling.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000001',
     'Blue Star 1 Ton 5 Star Inverter Split AC', 'blue-star-1-ton-5-star-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1 Ton 5 Star inverter split air conditioner with premium energy efficiency.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000001',
     'Blue Star 1.5 Ton 3 Star Inverter Split AC', 'blue-star-1-5-ton-3-star-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1.5 Ton 3 Star inverter split air conditioner for medium-sized rooms.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000001',
     'Blue Star 1.5 Ton 5 Star Inverter Split AC', 'blue-star-1-5-ton-5-star-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1.5 Ton 5 Star inverter split air conditioner with top energy efficiency.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000001',
     'Blue Star 2 Ton 3 Star Inverter Split AC', 'blue-star-2-ton-3-star-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton 3 Star inverter split air conditioner for large rooms.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000001',
     'Blue Star 2 Ton 5 Star Inverter Split AC', 'blue-star-2-ton-5-star-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton 5 Star inverter split air conditioner with maximum energy savings.'),

    -- Non-Inverter Split ACs
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002',
     'Blue Star 1 Ton 2 Star Non-Inverter Split AC', 'blue-star-1-ton-2-star-non-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1 Ton 2 Star non-inverter split air conditioner.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002',
     'Blue Star 1.5 Ton 2 Star Non-Inverter Split AC', 'blue-star-1-5-ton-2-star-non-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1.5 Ton 2 Star non-inverter split air conditioner.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002',
     'Blue Star 2 Ton 2 Star Non-Inverter Split AC', 'blue-star-2-ton-2-star-non-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton 2 Star non-inverter split air conditioner.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002',
     'Blue Star 2.5 Ton 2 Star Non-Inverter Split AC', 'blue-star-2-5-ton-2-star-non-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2.5 Ton 2 Star non-inverter split air conditioner for large commercial spaces.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000002',
     'Blue Star 3 Ton 2 Star Non-Inverter Split AC', 'blue-star-3-ton-2-star-non-inverter-split-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 3 Ton 2 Star non-inverter split air conditioner for commercial applications.'),

    -- Cassette ACs
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000003',
     'Blue Star 1.5 Ton Cassette AC', 'blue-star-1-5-ton-cassette-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1.5 Ton cassette air conditioner for ceiling-mounted commercial cooling.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000003',
     'Blue Star 2 Ton Cassette AC', 'blue-star-2-ton-cassette-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton cassette air conditioner for offices and commercial spaces.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000003',
     'Blue Star 3 Ton Cassette AC', 'blue-star-3-ton-cassette-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 3 Ton cassette air conditioner for large commercial spaces.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000003',
     'Blue Star 4 Ton Cassette AC', 'blue-star-4-ton-cassette-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 4 Ton cassette air conditioner for high-capacity commercial cooling.'),

    -- Tower ACs
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000004',
     'Blue Star 2 Ton Tower AC', 'blue-star-2-ton-tower-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton tower air conditioner for powerful floor-standing cooling.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000004',
     'Blue Star 3 Ton Tower AC', 'blue-star-3-ton-tower-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 3 Ton tower air conditioner for large commercial areas.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000004',
     'Blue Star 4 Ton Tower AC', 'blue-star-4-ton-tower-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 4 Ton tower air conditioner for maximum commercial cooling.'),

    -- Window Inverter ACs
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000005',
     'Blue Star 1.5 Ton 3 Star Window Inverter AC', 'blue-star-1-5-ton-3-star-window-inverter-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1.5 Ton 3 Star window inverter air conditioner.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000005',
     'Blue Star 1.5 Ton 5 Star Window Inverter AC', 'blue-star-1-5-ton-5-star-window-inverter-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1.5 Ton 5 Star window inverter air conditioner with premium efficiency.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000005',
     'Blue Star 2 Ton 3 Star Window Inverter AC', 'blue-star-2-ton-3-star-window-inverter-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton 3 Star window inverter air conditioner.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000005',
     'Blue Star 2 Ton 5 Star Window Inverter AC', 'blue-star-2-ton-5-star-window-inverter-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton 5 Star window inverter air conditioner with best-in-class efficiency.'),

    -- Window Non-Inverter ACs
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000006',
     'Blue Star 1.5 Ton 3 Star Window Non-Inverter AC', 'blue-star-1-5-ton-3-star-window-non-inverter-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 1.5 Ton 3 Star window non-inverter air conditioner.'),
    ('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'c0000002-0000-0000-0000-000000000006',
     'Blue Star 2 Ton 5 Star Window Non-Inverter AC', 'blue-star-2-ton-5-star-window-non-inverter-ac', NULL, 'DRAFT', 'ON_REQUEST',
     'Blue Star 2 Ton 5 Star window non-inverter air conditioner.');

-- ============================================================================
-- PRODUCTS — Rockwell (90+ products)
-- ============================================================================

-- Convertible Green Freezers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR250D/C4S Convertible Green Freezer 194L', 'rockwell-gfr250d-c4s-convertible-green-freezer-194l', 'GFR250D/C4S', 'DRAFT', 'ON_REQUEST',
     'Rockwell 194L single door convertible green freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR350D/C5S Convertible Green Freezer 294L', 'rockwell-gfr350d-c5s-convertible-green-freezer-294l', 'GFR350D/C5S', 'DRAFT', 'ON_REQUEST',
     'Rockwell 294L single door convertible green freezer with 5-star efficiency.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR350D/C4S Convertible Green Freezer 294L', 'rockwell-gfr350d-c4s-convertible-green-freezer-294l', 'GFR350D/C4S', 'DRAFT', 'ON_REQUEST',
     'Rockwell 294L single door convertible green freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR450D/C5S Convertible Green Freezer 390L', 'rockwell-gfr450d-c5s-convertible-green-freezer-390l', 'GFR450D/C5S', 'DRAFT', 'ON_REQUEST',
     'Rockwell 390L double door convertible green freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR550D/C5S Convertible Green Freezer 491L', 'rockwell-gfr550d-c5s-convertible-green-freezer-491l', 'GFR550D/C5S', 'DRAFT', 'ON_REQUEST',
     'Rockwell 491L double door convertible green freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR910IC Convertible Green Freezer 750L', 'rockwell-gfr910ic-convertible-green-freezer-750l', 'GFR910IC', 'DRAFT', 'ON_REQUEST',
     'Rockwell 750L triple door convertible green freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR1210F/C Convertible Green Freezer 998L', 'rockwell-gfr1210f-c-convertible-green-freezer-998l', 'GFR1210F/C', 'DRAFT', 'ON_REQUEST',
     'Rockwell 998L triple door convertible green freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000010',
     'Rockwell GFR1510F Convertible Green Freezer 1295L', 'rockwell-gfr1510f-convertible-green-freezer-1295l', 'GFR1510F', 'DRAFT', 'ON_REQUEST',
     'Rockwell 1295L triple door convertible green freezer for large commercial use.');

-- Large Freezers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000011',
     'Rockwell GFR250FDT Large Freezer 194L', 'rockwell-gfr250fdt-large-freezer-194l', 'GFR250FDT', 'DRAFT', 'ON_REQUEST',
     'Rockwell 194L single door large freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000011',
     'Rockwell GFR350FDT Large Freezer 294L', 'rockwell-gfr350fdt-large-freezer-294l', 'GFR350FDT', 'DRAFT', 'ON_REQUEST',
     'Rockwell 294L single door large freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000011',
     'Rockwell GFR450FDT Large Freezer 390L', 'rockwell-gfr450fdt-large-freezer-390l', 'GFR450FDT', 'DRAFT', 'ON_REQUEST',
     'Rockwell 390L double door large freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000011',
     'Rockwell GFR550FDT Large Freezer 491L', 'rockwell-gfr550fdt-large-freezer-491l', 'GFR550FDT', 'DRAFT', 'ON_REQUEST',
     'Rockwell 491L double door large freezer.');

-- Eutectic Freezers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000012',
     'Rockwell GFR450D/C5 Eutectic Freezer 415L', 'rockwell-gfr450d-c5-eutectic-freezer-415l', 'GFR450D/C5 EUTECTIC', 'DRAFT', 'ON_REQUEST',
     'Rockwell 415L double door eutectic freezer for extended cold retention.');

-- Freezer on Wheels
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000013',
     'Rockwell FOW200 Freezer on Wheels 197L', 'rockwell-fow200-freezer-on-wheels-197l', 'FOW200', 'DRAFT', 'ON_REQUEST',
     'Rockwell 197L mobile freezer on wheels.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000013',
     'Rockwell FOW450 Freezer on Wheels 390L', 'rockwell-fow450-freezer-on-wheels-390l', 'FOW450', 'DRAFT', 'ON_REQUEST',
     'Rockwell 390L mobile freezer on wheels.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000013',
     'Rockwell FOW5504D2D Freezer on Wheels 491L', 'rockwell-fow5504d2d-freezer-on-wheels-491l', 'FOW5504D2D', 'DRAFT', 'ON_REQUEST',
     'Rockwell 491L double door mobile freezer on wheels.');

-- Convertible Hard Top Freezers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR70 Convertible Hard Top Freezer 62L', 'rockwell-sfr70-hard-top-freezer-62l', 'SFR70', 'DRAFT', 'ON_REQUEST',
     'Rockwell 62L compact convertible hard top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR150SDU Convertible Hard Top Freezer 99L', 'rockwell-sfr150sdu-hard-top-freezer-99l', 'SFR150SDU', 'DRAFT', 'ON_REQUEST',
     'Rockwell 99L convertible hard top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR250SDU Convertible Hard Top Freezer 210L', 'rockwell-sfr250sdu-hard-top-freezer-210l', 'SFR250SDU', 'DRAFT', 'ON_REQUEST',
     'Rockwell 210L convertible hard top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR350SDU/ODU Convertible Hard Top Freezer 308L', 'rockwell-sfr350sdu-odu-hard-top-freezer-308l', 'SFR350SDU/ODU', 'DRAFT', 'ON_REQUEST',
     'Rockwell 308L convertible hard top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR450DDU Convertible Hard Top Freezer 407L', 'rockwell-sfr450ddu-hard-top-freezer-407l', 'SFR450DDU', 'DRAFT', 'ON_REQUEST',
     'Rockwell 407L convertible hard top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR550DDU Convertible Hard Top Freezer 506L', 'rockwell-sfr550ddu-hard-top-freezer-506l', 'SFR550DDU', 'DRAFT', 'ON_REQUEST',
     'Rockwell 506L double door convertible hard top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR650DDU Convertible Hard Top Freezer 595L', 'rockwell-sfr650ddu-hard-top-freezer-595l', 'SFR650DDU', 'DRAFT', 'ON_REQUEST',
     'Rockwell 595L double door convertible hard top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000014',
     'Rockwell SFR750TD Convertible Hard Top Freezer 650L', 'rockwell-sfr750td-hard-top-freezer-650l', 'SFR750TD', 'DRAFT', 'ON_REQUEST',
     'Rockwell 650L triple door convertible hard top freezer.');

-- Glass Top Freezers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000015',
     'Rockwell SFRN250GT Glass Top Freezer 205L', 'rockwell-sfrn250gt-glass-top-freezer-205l', 'SFRN250GT', 'DRAFT', 'ON_REQUEST',
     'Rockwell 205L sliding glass top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000015',
     'Rockwell SFR350GTS Glass Top Freezer 315L', 'rockwell-sfr350gts-glass-top-freezer-315l', 'SFR350GTS', 'DRAFT', 'ON_REQUEST',
     'Rockwell 315L sliding glass top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000015',
     'Rockwell SFR450GTS Glass Top Freezer 415L', 'rockwell-sfr450gts-glass-top-freezer-415l', 'SFR450GTS', 'DRAFT', 'ON_REQUEST',
     'Rockwell 415L sliding glass top freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000015',
     'Rockwell SFR550GTS Glass Top Freezer 485L', 'rockwell-sfr550gts-glass-top-freezer-485l', 'SFR550GTS', 'DRAFT', 'ON_REQUEST',
     'Rockwell 485L sliding glass top freezer.');

-- Combi Freezer & Cooler
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000016',
     'Rockwell COMBI300A Combi Freezer & Cooler 241L', 'rockwell-combi300a-combi-freezer-cooler-241l', 'COMBI300A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 241L double door combi freezer and cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000016',
     'Rockwell COMBI400A Combi Freezer & Cooler 341L', 'rockwell-combi400a-combi-freezer-cooler-341l', 'COMBI400A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 341L double door combi freezer and cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000016',
     'Rockwell COMBI450 Combi Freezer & Cooler', 'rockwell-combi450-combi-freezer-cooler', 'COMBI450', 'DRAFT', 'ON_REQUEST',
     'Rockwell double door combi freezer and cooler. Capacity to be verified from original brochure.');

-- Visi Coolers (14 models)
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC200A Visi Cooler 170L', 'rockwell-rvc200a-visi-cooler-170l', 'RVC200A', 'DRAFT', 'ON_REQUEST', 'Rockwell 170L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC300B Visi Cooler 285L', 'rockwell-rvc300b-visi-cooler-285l', 'RVC300B', 'DRAFT', 'ON_REQUEST', 'Rockwell 285L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC320A Visi Cooler 240L', 'rockwell-rvc320a-visi-cooler-240l', 'RVC320A', 'DRAFT', 'ON_REQUEST', 'Rockwell 240L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC390B Visi Cooler 358L', 'rockwell-rvc390b-visi-cooler-358l', 'RVC390B', 'DRAFT', 'ON_REQUEST', 'Rockwell 358L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC400A Visi Cooler 310L', 'rockwell-rvc400a-visi-cooler-310l', 'RVC400A', 'DRAFT', 'ON_REQUEST', 'Rockwell 310L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC500A Visi Cooler 370L', 'rockwell-rvc500a-visi-cooler-370l', 'RVC500A', 'DRAFT', 'ON_REQUEST', 'Rockwell 370L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC550B Visi Cooler 453L', 'rockwell-rvc550b-visi-cooler-453l', 'RVC550B', 'DRAFT', 'ON_REQUEST', 'Rockwell 453L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC600A Visi Cooler 460L', 'rockwell-rvc600a-visi-cooler-460l', 'RVC600A', 'DRAFT', 'ON_REQUEST', 'Rockwell 460L double door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC700 Visi Cooler 600L', 'rockwell-rvc700-visi-cooler-600l', 'RVC700', 'DRAFT', 'ON_REQUEST', 'Rockwell 600L single door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC950C Visi Cooler 739L', 'rockwell-rvc950c-visi-cooler-739l', 'RVC950C', 'DRAFT', 'ON_REQUEST', 'Rockwell 739L double door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC1100 Visi Cooler 954L', 'rockwell-rvc1100-visi-cooler-954l', 'RVC1100', 'DRAFT', 'ON_REQUEST', 'Rockwell 954L double door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC1100C Visi Cooler 872L', 'rockwell-rvc1100c-visi-cooler-872l', 'RVC1100C', 'DRAFT', 'ON_REQUEST', 'Rockwell 872L double door visi cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000020',
     'Rockwell RVC1250C Visi Cooler 998L', 'rockwell-rvc1250c-visi-cooler-998l', 'RVC1250C', 'DRAFT', 'ON_REQUEST', 'Rockwell 998L triple door visi cooler.');

-- Visi Freezers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000021',
     'Rockwell VF500C Visi Freezer 413L', 'rockwell-vf500c-visi-freezer-413l', 'VF500C', 'DRAFT', 'ON_REQUEST', 'Rockwell 413L double door visi freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000021',
     'Rockwell VF1100C Visi Freezer 951L', 'rockwell-vf1100c-visi-freezer-951l', 'VF1100C', 'DRAFT', 'ON_REQUEST', 'Rockwell 951L double door visi freezer.');

-- Upright Freezer
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000022',
     'Rockwell UF300A Upright Freezer 280L', 'rockwell-uf300a-upright-freezer-280l', 'UF300A', 'DRAFT', 'ON_REQUEST', 'Rockwell 280L single door upright freezer.');

-- Water Coolers (selected models — some need verification)
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000030',
     'Rockwell RWCS15/40D15A SS Water Cooler 40L', 'rockwell-rwcs15-40d15a-ss-water-cooler-40l', 'RWCS15/40D15A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 40L stainless steel water cooler with 1 tap.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000030',
     'Rockwell RWCS540BGCISIA SS Water Cooler 80L', 'rockwell-rwcs540bgcisia-ss-water-cooler-80l', 'RWCS540BGCISIA', 'DRAFT', 'ON_REQUEST',
     'Rockwell 80L stainless steel water cooler with 2 taps.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000030',
     'Rockwell RWCS550D12SIA SS Water Cooler 120L', 'rockwell-rwcs550d12sia-ss-water-cooler-120l', 'RWCS550D12SIA', 'DRAFT', 'ON_REQUEST',
     'Rockwell 120L stainless steel water cooler with 2 taps.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000030',
     'Rockwell RWCS650D12SIA SS Water Cooler 150L', 'rockwell-rwcs650d12sia-ss-water-cooler-150l', 'RWCS650D12SIA', 'DRAFT', 'ON_REQUEST',
     'Rockwell 150L stainless steel water cooler with 3 taps.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000030',
     'Rockwell RWCS515040SIA SS Water Cooler 400L', 'rockwell-rwcs515040sia-ss-water-cooler-400l', 'RWCS515040SIA', 'DRAFT', 'ON_REQUEST',
     'Rockwell 400L stainless steel water cooler with 4 taps.');

-- Bottled Water Dispensers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000031',
     'Rockwell PURE MINI Bottled Water Dispenser 12L', 'rockwell-pure-mini-water-dispenser-12l', 'PURE MINI', 'DRAFT', 'ON_REQUEST',
     'Rockwell Pure Mini 12L bottled water dispenser.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000031',
     'Rockwell PURE BLACK Bottled Water Dispenser 12L', 'rockwell-pure-black-water-dispenser-12l', 'PURE BLACK', 'DRAFT', 'ON_REQUEST',
     'Rockwell Pure Black 12L bottled water dispenser.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004', 'c0000002-0000-0000-0000-000000000031',
     'Rockwell PURE R Bottled Water Dispenser 12L', 'rockwell-pure-r-water-dispenser-12l', 'PURE R', 'DRAFT', 'ON_REQUEST',
     'Rockwell Pure R 12L bottled water dispenser.');

-- Commercial Ice Makers (selected key models)
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000005', NULL,
     'Rockwell RICM80/90 Commercial Ice Maker 55L/day', 'rockwell-ricm80-90-ice-maker-55l', 'RICM80/90', 'DRAFT', 'ON_REQUEST',
     'Rockwell commercial ice maker producing 55 L/day.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000005', NULL,
     'Rockwell RICM400 Commercial Ice Maker 191kg/day', 'rockwell-ricm400-ice-maker-191kg', 'RICM400', 'DRAFT', 'ON_REQUEST',
     'Rockwell commercial ice maker producing 191 kg/day.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000005', NULL,
     'Rockwell RICM500 Commercial Ice Maker 318kg/day', 'rockwell-ricm500-ice-maker-318kg', 'RICM500', 'DRAFT', 'ON_REQUEST',
     'Rockwell commercial ice maker producing 318 kg/day.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000005', NULL,
     'Rockwell RICM700 Commercial Ice Maker 455kg/day', 'rockwell-ricm700-ice-maker-455kg', 'RICM700', 'DRAFT', 'ON_REQUEST',
     'Rockwell commercial ice maker producing 455 kg/day.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000005', NULL,
     'Rockwell RICM900 Commercial Ice Maker 602kg/day', 'rockwell-ricm900-ice-maker-602kg', 'RICM900', 'DRAFT', 'ON_REQUEST',
     'Rockwell commercial ice maker producing 602 kg/day.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000005', NULL,
     'Rockwell RICM1900 Commercial Ice Maker 909kg/day', 'rockwell-ricm1900-ice-maker-909kg', 'RICM1900', 'DRAFT', 'ON_REQUEST',
     'Rockwell commercial ice maker producing 909 kg/day.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000005', NULL,
     'Rockwell RICM22 Commercial Ice Maker 20kg/day', 'rockwell-ricm22-ice-maker-20kg', 'RICM22', 'DRAFT', 'ON_REQUEST',
     'Rockwell compact commercial ice maker producing 20 kg/day.');

-- Reach-In Freezer/Chiller
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000040',
     'Rockwell RGN600F/C Reach-In Freezer/Chiller 600L', 'rockwell-rgn600fc-reach-in-600l', 'RGN600F/C', 'DRAFT', 'ON_REQUEST',
     'Rockwell 600L double door reach-in freezer/chiller.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000040',
     'Rockwell RGN1200F/C Reach-In Freezer/Chiller 1200L', 'rockwell-rgn1200fc-reach-in-1200l', 'RGN1200F/C', 'DRAFT', 'ON_REQUEST',
     'Rockwell 1200L double door reach-in freezer/chiller.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000040',
     'Rockwell RGN650GCA Reach-In Chiller 650L', 'rockwell-rgn650gca-reach-in-chiller-650l', 'RGN650GCA', 'DRAFT', 'ON_REQUEST',
     'Rockwell 650L single door glass reach-in chiller.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000040',
     'Rockwell RGN1410GCA Reach-In Chiller 1300L', 'rockwell-rgn1410gca-reach-in-chiller-1300l', 'RGN1410GCA', 'DRAFT', 'ON_REQUEST',
     'Rockwell 1300L single door glass reach-in chiller.');

-- Under Counter
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000041',
     'Rockwell RUT1000A Under Counter Freezer/Chiller', 'rockwell-rut1000a-under-counter', 'RUT1000A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 2-door under counter freezer/chiller with 4× GN 1/4 capacity.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000041',
     'Rockwell RUT1600A Under Counter Freezer/Chiller', 'rockwell-rut1600a-under-counter', 'RUT1600A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 2-door under counter freezer/chiller with 4× GN 1/4 capacity.');

-- Blast Freezers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000017',
     'Rockwell BF20A Blast Freezer 160L', 'rockwell-bf20a-blast-freezer-160l', 'BF20A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 160L single door blast freezer for rapid freezing.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000017',
     'Rockwell BF40A Blast Freezer 323L', 'rockwell-bf40a-blast-freezer-323l', 'BF40A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 323L single door blast freezer.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000017',
     'Rockwell BF60A Blast Freezer 421L', 'rockwell-bf60a-blast-freezer-421l', 'BF60A', 'DRAFT', 'ON_REQUEST',
     'Rockwell 421L single door blast freezer.');

-- Mini Refrigerators
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000052',
     'Rockwell MB49 Mini Refrigerator 45L', 'rockwell-mb49-mini-refrigerator-45l', 'MB49', 'DRAFT', 'ON_REQUEST', 'Rockwell 45L mini refrigerator.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000052',
     'Rockwell MB50 Mini Refrigerator 46L', 'rockwell-mb50-mini-refrigerator-46l', 'MB50', 'DRAFT', 'ON_REQUEST', 'Rockwell 46L mini refrigerator.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000052',
     'Rockwell MB55GR Mini Refrigerator 47L', 'rockwell-mb55gr-mini-refrigerator-47l', 'MB55GR', 'DRAFT', 'ON_REQUEST', 'Rockwell 47L mini refrigerator.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000052',
     'Rockwell MB55GBL Mini Refrigerator 47L', 'rockwell-mb55gbl-mini-refrigerator-47l', 'MB55GBL', 'DRAFT', 'ON_REQUEST', 'Rockwell 47L mini refrigerator (Black).'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000052',
     'Rockwell MB100 Mini Refrigerator 91L', 'rockwell-mb100-mini-refrigerator-91l', 'MB100', 'DRAFT', 'ON_REQUEST', 'Rockwell 91L mini refrigerator.');

-- Back Bar Coolers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000042',
     'Rockwell BB120C Back Bar Cooler 149L', 'rockwell-bb120c-back-bar-cooler-149l', 'BB120C', 'DRAFT', 'ON_REQUEST', 'Rockwell 149L single door back bar cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000042',
     'Rockwell BB220C Back Bar Cooler 235L', 'rockwell-bb220c-back-bar-cooler-235l', 'BB220C', 'DRAFT', 'ON_REQUEST', 'Rockwell 235L double door back bar cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000042',
     'Rockwell BB340C Back Bar Cooler 365L', 'rockwell-bb340c-back-bar-cooler-365l', 'BB340C', 'DRAFT', 'ON_REQUEST', 'Rockwell 365L triple door back bar cooler.');

-- Wine Coolers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000050',
     'Rockwell RWNS13 Wine Cooler 45L', 'rockwell-rwns13-wine-cooler-45l', 'RWNS13', 'DRAFT', 'ON_REQUEST', 'Rockwell 45L single zone wine cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000050',
     'Rockwell RWNS31 Wine Cooler 67L', 'rockwell-rwns31-wine-cooler-67l', 'RWNS31', 'DRAFT', 'ON_REQUEST', 'Rockwell 67L single zone wine cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000050',
     'Rockwell RWNS51 Wine Cooler 155L', 'rockwell-rwns51-wine-cooler-155l', 'RWNS51', 'DRAFT', 'ON_REQUEST', 'Rockwell 155L single zone wine cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000050',
     'Rockwell RWND67 Wine Cooler 148L', 'rockwell-rwnd67-wine-cooler-148l', 'RWND67', 'DRAFT', 'ON_REQUEST', 'Rockwell 148L dual zone wine cooler.');

-- Car Coolers
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000051',
     'Rockwell RMC15S Car Cooler 15.3L', 'rockwell-rmc15s-car-cooler-15l', 'RMC15S', 'DRAFT', 'ON_REQUEST', 'Rockwell 15.3L portable car cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000051',
     'Rockwell RMC30S Car Cooler 27.8L', 'rockwell-rmc30s-car-cooler-28l', 'RMC30S', 'DRAFT', 'ON_REQUEST', 'Rockwell 27.8L portable car cooler.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000051',
     'Rockwell RMC60D Car Cooler 56.5L', 'rockwell-rmc60d-car-cooler-57l', 'RMC60D', 'DRAFT', 'ON_REQUEST', 'Rockwell 56.5L portable car cooler.');

-- Confectionery Showcases
INSERT INTO products (brand_id, category_id, subcategory_id, product_name, slug, model_number, status, price_display, short_description) VALUES
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000053',
     'Rockwell RCSLA/3SS Confectionery Showcase 360L', 'rockwell-rcsla-3ss-confectionery-showcase-360l', 'RCSLA/3SS', 'DRAFT', 'ON_REQUEST',
     'Rockwell 360L sliding confectionery showcase.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000053',
     'Rockwell RCSLA/4SS Confectionery Showcase 500L', 'rockwell-rcsla-4ss-confectionery-showcase-500l', 'RCSLA/4SS', 'DRAFT', 'ON_REQUEST',
     'Rockwell 500L sliding confectionery showcase.'),
    ('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000007', 'c0000002-0000-0000-0000-000000000053',
     'Rockwell RCSLA/5SS Confectionery Showcase 660L', 'rockwell-rcsla-5ss-confectionery-showcase-660l', 'RCSLA/5SS', 'DRAFT', 'ON_REQUEST',
     'Rockwell 660L sliding confectionery showcase.');

-- ============================================================================
-- DEFAULT ADMIN USER (password: TanmayeeAdmin@2026 — CHANGE IMMEDIATELY)
-- Password hash is bcrypt of "TanmayeeAdmin@2026"
-- ============================================================================
INSERT INTO admin_users (email, password_hash, full_name, role) VALUES
    ('admin@tanmayeetechnologies.com',
     '$2a$12$LQv3c1yqBo9SkvXS7QTJPOoGqYFDfVr1c5r1wUfkPkGzYDt9yGQ6y',
     'Tanmayee Admin',
     'SUPER_ADMIN');
