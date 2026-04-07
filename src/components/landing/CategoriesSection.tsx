import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { useGetProductCategories } from '../../hooks/queries/useProducts';

const CategoriesSection = () => {
    const { data: categoriesData } = useGetProductCategories();
    // Safely extract from backend response structure: { status: 'success', data: { categories: [...] } }
    const liveCategories = (categoriesData?.data as any)?.categories || categoriesData?.data || [];
    
    // We will map the real categories and provide fallback styling
    const getFallbackImage = (index: number) => {
        const fallbacks = [
            "https://images.unsplash.com/photo-1620330198031-6e3eebacdfae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1608248593842-801081e18dc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ];
        return fallbacks[index % fallbacks.length];
    };
    return (
        <section id="categories" className="py-10 bg-salon-base w-full">
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">
                
                <SectionHeader 
                    title="Browse" 
                    italicTitle="Categories" 
                    align="center"
                    border={false}
                    className="mb-6"
                />

                {/* Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {liveCategories.map((cat: any, idx: number) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group relative h-[350px] bg-[#0A0A0A] overflow-hidden cursor-pointer border border-transparent hover:border-salon-golden/30 transition-all duration-500"
                        >
                            <img 
                                src={cat.image_url || getFallbackImage(idx)} 
                                alt={cat.name} 
                                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-[2000ms] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-white font-serif text-2xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-salon-golden opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.count || "Featured Ritual"}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CategoriesSection;
