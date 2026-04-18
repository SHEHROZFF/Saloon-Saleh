export interface Product {
    id: string;
    title: string;
    brand: string;
    price: string;
    img: string;
    category: string;
    description: string;
    details: string;
    usage: string;
    benefits: string[];
}

export interface SalonService {
    id: string;
    name: string;
    price: string;
    duration: string;
    category: string;
    description?: string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

export const shopProducts: Product[] = [
    {
        id: 'p1',
        title: 'Premium Beard Oil',
        brand: 'Salon Saleh',
        price: '45.00',
        img: 'https://images.unsplash.com/photo-1590156206659-9993ed6e9d69?q=80&w=1287&auto=format&fit=crop',
        category: 'Beard Care',
        description: 'Enriched with natural oils to soften and condition your beard.',
        details: 'Our Premium Beard Oil is a masterfully crafted blend of Jojoba, Argan, and Moroccan oils. It penetrates deep into the hair follicle to prevent itchiness and dandruff while providing a healthy, non-greasy shine.',
        usage: 'Apply 3-5 drops to palms and massage into a clean, damp beard. Work from the roots to the tips for best results.',
        benefits: ['Eliminates beard itch', 'Promotes healthy growth', 'Non-greasy finish', 'Natural cedarwood scent']
    },
    {
        id: 'p2',
        title: 'Matte Clay Wax',
        brand: 'Salon Saleh',
        price: '38.00',
        img: 'https://images.unsplash.com/photo-1592647420248-b730bf656201?q=80&w=1287&auto=format&fit=crop',
        category: 'Hair Styling',
        description: 'Strong hold with a professional matte finish for all-day style.',
        details: 'Designed for the modern gentleman, our Matte Clay provides a powerful hold without the weight. Perfect for textured, messy styles or sharp, structured looks that need to stay in place from morning to midnight.',
        usage: 'Rub a small amount between palms to warm. Distribute evenly through dry or towel-dried hair. Style as desired.',
        benefits: ['High hold', 'Zero shine', 'Water-soluble', 'Reshapable throughout the day']
    },
    {
        id: 'p3',
        title: 'Revitalizing Face Wash',
        brand: 'Salon Saleh',
        price: '32.00',
        img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1287&auto=format&fit=crop',
        category: 'Skin Care',
        description: 'Deep cleaning formula that removes impurities without drying.',
        details: 'Start your grooming ritual with a clean slate. This revitalizing wash uses activated charcoal and aloe vera to pull toxins from the skin while maintaining essential moisture levels.',
        usage: 'Wet face with warm water. Massage a small pump onto skin in circular motions. Rinse thoroughly.',
        benefits: ['pH balanced', 'Unclogs pores', 'Hydrating formula', 'Suitable for all skin types']
    },
    {
        id: 'p4',
        title: 'Classic Shave Cream',
        brand: 'Salon Saleh',
        price: '28.00',
        img: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6a?q=80&w=1332&auto=format&fit=crop',
        category: 'Shaving',
        description: 'Rich lather for a smooth, irritation-free traditional shave.',
        details: 'Experience the art of the traditional shave. Our cream creates a thick, lubricating buffer between the blade and your skin, ensuring a close cut without the common redness or irritation.',
        usage: 'Apply to damp skin using a brush or fingertips. Lather well before shaving.',
        benefits: ['Reduces razor burn', 'Softens coarse hair', 'Moisturizing effect', 'Vintage barber scent']
    },
    {
        id: 'p5',
        title: 'Sea Salt Spray',
        brand: 'Salon Saleh',
        price: '35.00',
        img: 'https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=1287&auto=format&fit=crop',
        category: 'Hair Styling',
        description: 'Add texture and volume for a relaxed, natural beach look.',
        details: 'Bring the ocean to your hair. This mineral-rich spray adds instant grip and "day-at-the-beach" texture without making hair feel stiff or crunchy.',
        usage: 'Spray onto damp or dry hair. Scrunch with hands to enhance natural waves or blow-dry for massive volume.',
        benefits: ['Instant texture', 'Natural volume', 'Matte finish', 'Lightweight feel']
    },
    {
        id: 'p6',
        title: 'Professional Hair Trimmer',
        brand: 'Elite Pro',
        price: '185.00',
        img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1170&auto=format&fit=crop',
        category: 'Tools',
        description: 'Precision engineering for the perfect fade and lineup.',
        details: 'The ultimate tool for the precision artist. Featuring diamond-like carbon blades and a high-torque brushless motor, this trimmer delivers the sharpest lines and smoothest fades in the industry.',
        usage: 'Use for trimming, edging, and detail work. Keep blades oiled for maximum longevity.',
        benefits: ['4-hour battery life', 'Zero-gap adjustable', 'Ergonomic design', 'Professional grade']
    }
];

export const salonServices: SalonService[] = [
    { id: 's1', name: 'Classic Haircut', price: '60.00', duration: '45 mins', category: 'Hair' },
    { id: 's2', name: 'Signature Beard Trim', price: '45.00', duration: '30 mins', category: 'Beard' },
    { id: 's3', name: 'Royal Shave', price: '55.00', duration: '45 mins', category: 'Beard' },
    { id: 's4', name: 'Luxury Facial', price: '85.00', duration: '60 mins', category: 'Skin' },
    { id: 's5', name: 'Head Shave', price: '50.00', duration: '40 mins', category: 'Hair' },
    { id: 's6', name: 'Kid\'s Haircut', price: '40.00', duration: '30 mins', category: 'Hair' }
];

export const salonStaff: Staff[] = [
    { id: 'st1', name: 'Abedalaziz', role: 'Master Barber', avatar: 'https://i.pravatar.cc/150?u=abedalaziz' },
    { id: 'st2', name: 'Khalil', role: 'Stylist', avatar: 'https://i.pravatar.cc/150?u=khalil' },
    { id: 'st3', name: 'Mhmad Saidi', role: 'Senior Barber', avatar: 'https://i.pravatar.cc/150?u=mhmad' },
    { id: 'st4', name: 'Yamen', role: 'Skin Specialist', avatar: 'https://i.pravatar.cc/150?u=yamen' }
];
