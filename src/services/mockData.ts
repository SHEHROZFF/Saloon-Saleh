export interface Product {
    id: string;
    title: string;
    brand: string;
    price: string;
    img: string;
    category: string;
    description: string;
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
        brand: 'Saloon Saleh',
        price: '45.00',
        img: 'https://images.unsplash.com/photo-1590156206659-9993ed6e9d69?q=80&w=1287&auto=format&fit=crop',
        category: 'Beard Care',
        description: 'Enriched with natural oils to soften and condition your beard.'
    },
    {
        id: 'p2',
        title: 'Matte Clay Wax',
        brand: 'Saloon Saleh',
        price: '38.00',
        img: 'https://images.unsplash.com/photo-1592647420248-b730bf656201?q=80&w=1287&auto=format&fit=crop',
        category: 'Hair Styling',
        description: 'Strong hold with a professional matte finish for all-day style.'
    },
    {
        id: 'p3',
        title: 'Revitalizing Face Wash',
        brand: 'Saloon Saleh',
        price: '32.00',
        img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1287&auto=format&fit=crop',
        category: 'Skin Care',
        description: 'Deep cleaning formula that removes impurities without drying.'
    },
    {
        id: 'p4',
        title: 'Classic Shave Cream',
        brand: 'Saloon Saleh',
        price: '28.00',
        img: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6a?q=80&w=1332&auto=format&fit=crop',
        category: 'Shaving',
        description: 'Rich lather for a smooth, irritation-free traditional shave.'
    },
    {
        id: 'p5',
        title: 'Sea Salt Spray',
        brand: 'Saloon Saleh',
        price: '35.00',
        img: 'https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=1287&auto=format&fit=crop',
        category: 'Hair Styling',
        description: 'Add texture and volume for a relaxed, natural beach look.'
    },
    {
        id: 'p6',
        title: 'Professional Hair Trimmer',
        brand: 'Elite Pro',
        price: '185.00',
        img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1170&auto=format&fit=crop',
        category: 'Tools',
        description: 'Precision engineering for the perfect fade and lineup.'
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
