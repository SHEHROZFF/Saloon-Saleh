import SectionHeader from '../ui/SectionHeader';
import DecorativeCard from '../ui/DecorativeCard';

const ServicesSection = () => {
    return (
        <section id="services" className="py-12 md:py-24 w-full bg-salon-surface relative z-10 group overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">

                <SectionHeader
                    title="Waiting"
                    italicTitle="List"
                    description="Book your appointment today."
                />

                {/* Booking Iframe Wrapper (Styled elegantly so it doesn't break the sleek design) */}
                <DecorativeCard className="group" padding="p-2 md:p-8">
                    {/* The Reference iframe inside a sleek container */}
                    <div className="w-full h-[450px] mt-2 bg-white/5 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <iframe
                            loading="lazy"
                            src="http://waitwhile.com/locations/stylish"
                            className="w-full h-full border-none grayscale invert contrast-125"
                            title="Saloon Saleh Waitlist"
                        />
                    </div>
                </DecorativeCard>
            </div>
        </section>
    );
};

export default ServicesSection;
