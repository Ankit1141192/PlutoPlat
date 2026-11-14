const User = require('../models/User');
const Property = require('../models/Property');
const Testimonial = require('../models/Testimonial');
const Notification = require('../models/Notifications');

const INITIAL_PROPERTIES = [
  {
    title: 'The Imperial Villa, Civil Lines',
    slug: 'the-imperial-villa-civil-lines',
    subtitle: 'Heritage Colonial Estate with Private Grounds & Gated Portico',
    location: {
      address: '14/110 Civil Lines, Near Ganges Club',
      city: 'Civil Lines',
      state: 'Kanpur, Uttar Pradesh',
      country: 'India',
      pincode: '208001',
    },
    price: 85000000,
    numericPrice: 85000000,
    purpose: 'Buy',
    type: 'Villas',
    featured: true,
    isFeatured: true,
    isVerified: true,
    status: 'active',
    beds: 6,
    baths: 7,
    sqft: '8,500',
    lotSize: '1.2 Acres',
    yearBuilt: 2023,
    garage: '4 Cars',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Perched prestigiously on one of Civil Lines most coveted private avenues, The Imperial Villa represents an extraordinary convergence of colonial grandeur, organic warmth, and state-of-the-art engineering.',
    features: ['Heated Lap Pool', 'Subterranean Wine Cellar', 'Private Cinema', 'Chef Kitchen with Marble Islands'],
    amenities: ['Private Security', 'CCTV Grid', 'Power Backup', 'Landscaped Lawn'],
  },
  {
    title: 'Modern Cliffside Haven, Swaroop Nagar',
    slug: 'modern-cliffside-haven-swaroop-nagar',
    subtitle: 'Dramatic Architectural Masterpiece with Panoramic City Views',
    location: {
      address: 'Block B, Swaroop Nagar',
      city: 'Swaroop Nagar',
      state: 'Kanpur, Uttar Pradesh',
      country: 'India',
      pincode: '208002',
    },
    price: 124000000,
    numericPrice: 124000000,
    purpose: 'Buy',
    type: 'Homes',
    featured: true,
    isFeatured: true,
    isVerified: true,
    status: 'active',
    beds: 5,
    baths: 6,
    sqft: '6,200',
    lotSize: '0.9 Acres',
    yearBuilt: 2024,
    garage: '3 Cars',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Commanding unmatched luxury drama, this bespoke urban sanctuary offers sweeping terraces, custom imported Italian joinery, and private elevator access.',
    features: ['Private Elevator', 'Double-Height Living Salon', 'Steam Room & Spa', 'Solar Microgrid'],
    amenities: ['Smart Automation', 'Concierge', 'EV Charging', 'Infinity Plunge Pool'],
  },
  {
    title: 'Riverfront Sky Penthouse, VIP Road',
    slug: 'riverfront-sky-penthouse-vip-road',
    subtitle: 'Unobstructed River Ganges Vistas from 22nd Floor Private Skydeck',
    location: {
      address: 'VIP Road & Ganga Promenade',
      city: 'VIP Road',
      state: 'Kanpur, Uttar Pradesh',
      country: 'India',
      pincode: '208001',
    },
    price: 95000000,
    numericPrice: 95000000,
    purpose: 'Buy',
    type: 'Penthouses',
    featured: true,
    isFeatured: true,
    isVerified: true,
    status: 'active',
    beds: 4,
    baths: 5,
    sqft: '5,400',
    lotSize: 'Sky Penthouse',
    yearBuilt: 2024,
    garage: '3 Cars',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Unmatched sunrise views over the holy Ganga River. Features private rooftop infinity deck, floor-to-ceiling glass, and discrete biometric elevator access.',
    features: ['Rooftop Infinity Deck', 'Biometric Private Lift', 'Ganga Views', 'Crestron Home Automation'],
    amenities: ['Clubhouse Access', '24/7 Security', 'Valet Parking', 'Helipad Access'],
  },
  {
    title: 'The Solstice Heritage Bungalow, Tilak Nagar',
    slug: 'the-solstice-heritage-bungalow-tilak-nagar',
    subtitle: 'Sprawling Acreage with Century-Old Banyan Trees & Heated Courtyard Pool',
    location: {
      address: 'Tilak Nagar Green Avenue',
      city: 'Tilak Nagar',
      state: 'Kanpur, Uttar Pradesh',
      country: 'India',
      pincode: '208002',
    },
    price: 110000000,
    numericPrice: 110000000,
    purpose: 'Buy',
    type: 'Homes',
    featured: true,
    isFeatured: true,
    isVerified: true,
    status: 'active',
    beds: 5,
    baths: 6,
    sqft: '7,100',
    lotSize: '1.5 Acres',
    yearBuilt: 2022,
    garage: '4 Cars',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
    ],
    description: 'A rare jewel in Tilak Nagar offering sprawling lawns, antique teakwood ceilings, and a fully modernised smart interior.',
    features: ['Courtyard Heated Pool', 'Heritage Arches', 'Staff Quarters', 'Private Gymnasium'],
    amenities: ['Gated Security', 'EV Charging Station', 'Full Generator Backup', 'Billiards Room'],
  },
  {
    title: 'Downtown Marina Sky Villa, Dubai',
    slug: 'downtown-marina-sky-villa-dubai',
    subtitle: 'Ultra-Luxury High-Rise Residence with Burj Khalifa & Marina Views',
    location: {
      address: 'Sheikh Mohammed bin Rashid Blvd',
      city: 'Dubai',
      state: 'Downtown Dubai, UAE',
      country: 'UAE',
      pincode: '00000',
    },
    price: 165000000,
    numericPrice: 165000000,
    purpose: 'Buy',
    type: 'Villas',
    featured: true,
    isFeatured: true,
    isVerified: true,
    status: 'active',
    beds: 4,
    baths: 5,
    sqft: '6,800',
    lotSize: 'Sky Residence',
    yearBuilt: 2024,
    garage: '3 Cars',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Iconic Dubai sky villa featuring private cantilevered pool, bespoke Italian finishes, and panoramic views of the Burj Khalifa.',
    features: ['Private Infinity Pool', 'Burj Khalifa Views', 'Chauffeur Service', 'Smart Automation'],
    amenities: ['Concierge 24/7', 'Valet Parking', 'Luxury Spa', 'Cigar Lounge'],
  },
  {
    title: 'Palm Crescent Waterfront Mansion',
    slug: 'palm-crescent-waterfront-mansion',
    subtitle: 'Exclusive Beachfront Residence on Palm Jumeirah with Private Dock',
    location: {
      address: 'Frond N, Palm Jumeirah',
      city: 'Palm Jumeirah',
      state: 'Dubai, UAE',
      country: 'UAE',
      pincode: '00000',
    },
    price: 280000000,
    numericPrice: 280000000,
    purpose: 'Buy',
    type: 'Villas',
    featured: true,
    isFeatured: true,
    isVerified: true,
    status: 'active',
    beds: 6,
    baths: 8,
    sqft: '11,200',
    lotSize: '0.45 Acres',
    yearBuilt: 2024,
    garage: '6 Cars',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
    ],
    description: 'Direct Arabian Gulf access with private white sand beach and yacht docking privileges on Palm Jumeirah.',
    features: ['Private Beach', 'Yacht Dock', 'Indoor Spa', 'Cinema Room'],
    amenities: ['24/7 Frond Security', 'Zero Edge Pool', 'Smart Home', 'Outdoor Teppanyaki'],
  },
];

const INITIAL_TESTIMONIALS = [
  {
    client: 'Julian & Genevieve Beaumont',
    name: 'Julian & Genevieve Beaumont',
    role: 'Private Equity Principal, London & New York',
    property: 'Acquired Imperial Villa, Civil Lines',
    company: 'Acquired Imperial Villa, Civil Lines',
    content: 'PlutoPlat redefined our expectations of what luxury real estate advisory can be. Their confidential advisory and access to off-market estates secured our family residence in Kanpur without any media friction.',
    message: 'PlutoPlat redefined our expectations of what luxury real estate advisory can be. Their confidential advisory and access to off-market estates secured our family residence in Kanpur without any media friction.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    client: 'Arthur K. Vance',
    name: 'Arthur K. Vance',
    role: 'Tech Founder & Industrialist',
    property: 'Acquired Riverfront Penthouse, VIP Road',
    company: 'Acquired Riverfront Penthouse, VIP Road',
    content: 'The architectural curation on PlutoPlat is second to none. Every property listed is vetted down to the structural engineering and title integrity. Working with their team felt like consulting with trusted private family office partners.',
    message: 'The architectural curation on PlutoPlat is second to none. Every property listed is vetted down to the structural engineering and title integrity. Working with their team felt like consulting with trusted private family office partners.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    client: 'Claire Montgomerie',
    name: 'Claire Montgomerie',
    role: 'Architectural Historian & Designer',
    property: 'Acquired The Solstice Bungalow',
    company: 'Acquired The Solstice Bungalow',
    content: 'The level of detail—from high-definition walkthroughs to zoning and environmental disclosures—saved us countless weeks. PlutoPlat sets the benchmark for international luxury real estate.',
    message: 'The level of detail—from high-definition walkthroughs to zoning and environmental disclosures—saved us countless weeks. PlutoPlat sets the benchmark for international luxury real estate.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
];

const seedInitialData = async () => {
  try {
    let isFirstRun = false;
    // 1. Ensure SuperAdmin user exists
    let superAdmin = await User.findOne({ role: 'super_admin' });
    if (!superAdmin) {
      isFirstRun = true;
      superAdmin = await User.create({
        name: 'Julian Beaumont',
        email: 'owner@plutoplat.com',
        phone: '+919956346155',
        password: 'Password123!',
        role: 'super_admin',
        subscriptionTier: 'Website Owner',
        location: { city: 'Kanpur', state: 'Uttar Pradesh', country: 'India' },
        isVerified: true,
      });
      console.log('[Seed] SuperAdmin account seeded: owner@plutoplat.com / Password123!');
    }

    // 2. Ensure Agent user exists
    let agentUser = await User.findOne({ email: 'm.sharma@plutoplat.com' });
    if (!agentUser) {
      agentUser = await User.create({
        name: 'Michael Sharma',
        email: 'm.sharma@plutoplat.com',
        phone: '+919821033445',
        password: 'Password123!',
        role: 'admin',
        subscriptionTier: 'agent_pro',
        location: { city: 'Civil Lines', state: 'Kanpur, UP', country: 'India' },
        isVerified: true,
      });
      console.log('[Seed] Agent account seeded: m.sharma@plutoplat.com / Password123!');
    }

    // 3. Ensure Client/User exists
    let clientUser = await User.findOne({ email: 'client@plutoplat.com' });
    if (!clientUser) {
      clientUser = await User.create({
        name: 'Vikramaditya Singhania',
        email: 'client@plutoplat.com',
        phone: '+919811044521',
        password: 'Password123!',
        role: 'user',
        subscriptionTier: 'vip_concierge',
        location: { city: 'Civil Lines', state: 'Kanpur, UP', country: 'India' },
        isVerified: true,
      });
      console.log('[Seed] Client account seeded: client@plutoplat.com / Password123!');
    }

    // 4. Seed Properties if none exist on very first platform setup
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0 && isFirstRun) {
      const docsToInsert = INITIAL_PROPERTIES.map(p => ({
        ...p,
        owner: superAdmin._id,
        postedBy: superAdmin._id,
      }));
      const inserted = await Property.insertMany(docsToInsert);
      console.log(`[Seed] Seeded ${inserted.length} luxury properties to MongoDB.`);

      // Also link some saved properties to the client user
      if (inserted.length > 0 && clientUser) {
        clientUser.savedProperties = [inserted[0]._id, inserted[1]._id];
        await clientUser.save();
      }
    }

    // 5. Seed Testimonials if none exist
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(INITIAL_TESTIMONIALS);
      console.log(`[Seed] Seeded ${INITIAL_TESTIMONIALS.length} client testimonials to MongoDB.`);
    }

    // 6. Notifications - Clean up any default mock notifications; start with empty notification feed
    const defaultTitles = [
      'PlutoPlat Sovereign Real Estate Network Active',
      'Broker Workstation Provisioned',
      'Exclusive Off-Market Collection Open',
      'Welcome to PlutoPlat Private Advisory Stream',
      'Direct Agent Concierge Established',
      'Chauffeured On-Site Visit Confirmed for The Imperial Villa',
      'Site Visit Completed for The Imperial Villa Deal',
      'Sea View Penthouse, Worli valuation revised',
      'Property Listing Live on Public Portal',
      'New VIP Buyer Inquiry Received',
      'SuperAdmin Policy Notice',
      'Listing Under Active Representation',
    ];
    await Notification.deleteMany({
      $or: [
        { title: { $in: defaultTitles } },
        { isDefault: true },
      ],
    });
    console.log('[Seed] Default mock notifications purged. System ready for live SuperAdmin broadcasts.');
  } catch (err) {
    console.warn('[Seed Warning] Data seeding notice:', err.message);
  }
};

module.exports = {
  seedInitialData,
  INITIAL_TESTIMONIALS,
};
