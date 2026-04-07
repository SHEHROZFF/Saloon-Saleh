
import Header from '../components/layout/Header';
import HeroSection from '../components/landing/HeroSection';
import ExpertiseSection from '../components/landing/ExpertiseSection';
import Marquee from '../components/ui/Marquee';
import BookingSection from '../components/landing/BookingSection';
import ProductsCarousel from '../components/landing/ProductsCarousel';
import CategoriesSection from '../components/landing/CategoriesSection';
import Footer from '../components/landing/Footer';
import { useGetBootstrapSettings } from '../hooks/queries/useSettings';

const LandingPage = () => {
    const { data: bootstrapData } = useGetBootstrapSettings();
    const marqueeItems = bootstrapData?.data?.marquee_items?.items || ['HIGH-END LUXURY SALON', 'EXCLUSIVE GROOMING', 'MASTER BARBERING'];

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary font-sans antialiased selection:bg-salon-golden selection:text-salon-base overflow-x-hidden">
            <Header />
            <HeroSection />
            <ExpertiseSection />
            <Marquee items={marqueeItems} speed={2} />
            <BookingSection />
            <CategoriesSection />
            <ProductsCarousel />
            <Footer />
        </div>
    );
};

export default LandingPage;
