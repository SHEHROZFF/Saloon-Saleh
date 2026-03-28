const Footer = () => {
    return (
        <footer className="w-full bg-salon-base pt-8 mb-0 pb-4 border-t border-salon-surface">
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 border-b border-salon-surface pb-6">

                    {/* Massive Footer Logo */}
                    <div className="mb-4 lg:mb-0">
                        <img src="/Main_logo_wo_BG.png" alt="Saloon Saleh Logo" className="w-14 md:w-18 h-auto object-contain mb-3" />
                        <h2 className="text-[2rem] md:text-[3.5rem] lg:text-[4.5rem] font-serif font-normal leading-[0.8] tracking-tighter">
                            SALOON<span className="text-salon-golden">SALEH.</span>
                        </h2>

                        <div className="flex gap-4 mt-5">
                            <a href="https://apps.apple.com/us/app/id1571552874" target="_blank" rel="noreferrer" className="w-[100px] opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.hazem.stylish_by_hazem" target="_blank" rel="noreferrer" className="w-[115px] opacity-70 hover:opacity-100 transition-opacity">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 md:gap-10">
                        <FooterColumn
                            title="Locations"
                            links={["Dubai - UAE", "Dohat Aramoun - LBN", "Calgary - CAN"]}
                        />
                        <FooterColumn
                            title="Navigation"
                            links={["Home", "Shop", "Booking", "Expertise"]}
                        />
                        <FooterColumn
                            title="Connect"
                            links={["Instagram", "WhatsApp", "Facebook"]}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-salon-golden-muted uppercase tracking-[0.2em] font-light">
                        Copyright {new Date().getFullYear()} &copy; SALOON SALEH. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8 text-[10px] text-salon-golden-muted uppercase tracking-[0.2em]">
                        <a href="https://www.instagram.com/stylishbyhazem" target="_blank" rel="noreferrer" className="hover:text-salon-golden transition-colors">Instagram</a>
                        <a href="https://wa.me/971557441551" target="_blank" rel="noreferrer" className="hover:text-salon-golden transition-colors">WhatsApp</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
    <div className="flex flex-col gap-4 max-w-[150px]">
        <span className="text-salon-golden text-[10px] uppercase tracking-[0.3em] font-medium border-l border-salon-golden pl-2">
            {title}
        </span>
        <ul className="flex flex-col gap-2.5 text-xs text-salon-golden-muted font-light">
            {links.map((link) => (
                <li key={link} className="hover:text-salon-primary cursor-pointer transition-colors uppercase tracking-widest text-[9px]">
                    {link}
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;
