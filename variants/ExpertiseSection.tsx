import { motion } from 'framer-motion';
import Button from '../src/components/ui/Button';
import SectionHeader from '../src/components/ui/SectionHeader';

const expertise = [
    { title: "Precision Cuts", category: "01", img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80" },
    { title: "Hot Towel Shave", category: "02", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80" },
    { title: "Beard Sculpting", category: "03", img: "https://plus.unsplash.com/premium_photo-1661382196658-9f835c21d6e9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Facial Care", category: "04", img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" }
];

const ExpertiseSection = () => {
    return (
        <section id="booking" className="py-16 md:py-32 w-full bg-salon-surface relative z-10 overflow-hidden">
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
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group relative border-b border-salon-surface py-5 md:py-8 cursor-pointer flex flex-col items-start md:flex-row md:items-center justify-between"
                        >

                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 w-full z-10 relative pointer-events-none">
                                <span className="text-salon-golden-muted text-[9px] font-medium tracking-[0.2em] block">{item.category}</span>
                                <h3 className="text-2xl md:text-4xl lg:text-6xl font-serif text-salon-primary group-hover:italic transition-all duration-700">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Massive Hover Reveal Image */}
                            <div className="fixed top-[50%] left-[65%] -translate-y-1/2 -translate-x-1/2 w-[450px] h-[600px] opacity-0 group-hover:opacity-100 pointer-events-none z-0 transition-all duration-700 overflow-hidden hidden md:block scale-95 group-hover:scale-100">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover scale-[1.3] group-hover:scale-100 transition-transform duration-[2000ms] ease-out drop-shadow-2xl" />
                            </div>

                            <div className="hidden md:block z-10 relative">
                                <Button variant="link" className="text-salon-golden-muted group-hover:text-salon-golden transition-colors duration-300">
                                    Discover
                                </Button>
                            </div>

                            {/* Hover Backdrop Overlay */}
                            <div className="absolute inset-0 bg-salon-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none rounded-sm"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSection;
