import { motion } from 'framer-motion';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';

const expertise = [
    { title: "Precision Cuts", category: "01", img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80" },
    { title: "Hot Towel Shave", category: "02", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80" },
    { title: "Beard Sculpting", category: "03", img: "https://plus.unsplash.com/premium_photo-1661382196658-9f835c21d6e9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Facial Care", category: "04", img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" }
];

const ExpertiseSection = () => {
    return (
        <section id="expertise" className="py-16 md:py-24 w-full bg-salon-base relative z-10 border-t border-salon-surface">
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">

                <SectionHeader
                    title="Our"
                    italicTitle="Expertise"
                    description="Meticulously crafted styles across all disciplines."
                    layout="side"
                    stackTitle={true}
                    border={false}
                    className="mb-8"
                />

                <div className="flex flex-col gap-0 border-t border-salon-surface relative">
                    {expertise.map((item, idx) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group flex items-center justify-between py-6 border-b border-salon-surface hover:bg-salon-surface/50 transition-all duration-500 cursor-pointer px-4 -mx-4"
                        >
                            <div className="flex items-center gap-10">
                                <span className="text-salon-golden-muted text-[10px] font-light font-serif tracking-widest">{item.category}</span>
                                <h3 className="text-2xl md:text-3xl font-serif text-salon-primary group-hover:translate-x-3 transition-transform duration-700">{item.title}</h3>
                            </div>

                            <div className="flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-5 group-hover:translate-x-0">
                                <div className="hidden lg:block w-40 h-20 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000 border border-salon-golden/10">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" />
                                </div>
                                <div className="flex items-center gap-2 group/btn">
                                    <span className="text-[10px] uppercase tracking-widest text-salon-golden translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">Discover</span>
                                    <svg className="w-5 h-5 text-salon-golden transition-transform duration-500 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex justify-end">
                    <Button variant="link" className="text-salon-golden group flex items-center gap-3 font-medium">
                        View Full Menu
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSection;
