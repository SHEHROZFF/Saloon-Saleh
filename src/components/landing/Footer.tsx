import { useGetBootstrapSettings } from '../../hooks/queries/useSettings';

interface FooterLink {
    label: string;
    url: string;
}

interface FooterData {
    locations: FooterLink[];
    navigation: FooterLink[];
    connect: FooterLink[];
    copyrightName: string;
    appStoreUrl: string;
    playStoreUrl: string;
}

const DEFAULT_FOOTER: FooterData = {
    locations: [
        { label: "Dubai - UAE", url: "" },
        { label: "Dohat Aramoun - LBN", url: "" },
        { label: "Calgary - CAN", url: "" },
    ],
    navigation: [
        { label: "Home", url: "/" },
        { label: "Shop", url: "/shop" },
        { label: "Booking", url: "/booking" },
        { label: "Expertise", url: "/#expertise" },
    ],
    connect: [
        { label: "Instagram", url: "https://www.instagram.com/stylishbyhazem" },
        { label: "WhatsApp", url: "https://wa.me/971557441551" },
        { label: "Facebook", url: "" },
    ],
    copyrightName: "SALOON SALEH",
    appStoreUrl: "https://apps.apple.com/us/app/id1571552874",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.hazem.stylish_by_hazem",
};

/** Normalize old string[] format or new {label,url}[] format */
const normalizeLinks = (arr: any[]): FooterLink[] =>
    (arr || []).map((item: any) =>
        typeof item === 'string' ? { label: item, url: '' } : item
    );

const Footer = () => {
    const { data: bootstrapData } = useGetBootstrapSettings();

    const raw = bootstrapData?.data?.footer_data;
    const footer: FooterData = raw ? {
        locations: normalizeLinks(raw.locations),
        navigation: normalizeLinks(raw.navigation),
        connect: normalizeLinks(raw.connect),
        copyrightName: raw.copyrightName || DEFAULT_FOOTER.copyrightName,
        appStoreUrl: raw.appStoreUrl || DEFAULT_FOOTER.appStoreUrl,
        playStoreUrl: raw.playStoreUrl || DEFAULT_FOOTER.playStoreUrl,
    } : DEFAULT_FOOTER;

    // Extract social links for the bottom bar from the connect column
    const socialLinks = footer.connect.filter(link => link.url);

    return (
        <footer className="w-full bg-salon-base pt-8 mb-0 pb-4 border-t border-salon-surface">
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 border-b border-salon-surface pb-6">

                    {/* Footer Logo + App Store Badges */}
                    <div className="mb-4 lg:mb-0">
                        <img src="/Main_logo_wo_BG.png" alt="Saloon Saleh Logo" className="w-14 md:w-18 h-auto object-contain mb-3" />
                        <h2 className="text-[2rem] md:text-[3.5rem] lg:text-[4.5rem] font-serif font-normal leading-[0.8] tracking-tighter">
                            SALOON<span className="text-salon-golden">SALEH.</span>
                        </h2>

                        <div className="flex gap-4 mt-5">
                            {footer.appStoreUrl && (
                                <a href={footer.appStoreUrl} target="_blank" rel="noreferrer" className="w-[100px] opacity-70 hover:opacity-100 transition-opacity">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" />
                                </a>
                            )}
                            {footer.playStoreUrl && (
                                <a href={footer.playStoreUrl} target="_blank" rel="noreferrer" className="w-[115px] opacity-70 hover:opacity-100 transition-opacity">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 md:gap-10">
                        <FooterColumn title="Locations" links={footer.locations} />
                        <FooterColumn title="Navigation" links={footer.navigation} />
                        <FooterColumn title="Connect" links={footer.connect} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-salon-golden-muted uppercase tracking-[0.2em] font-light">
                        Copyright {new Date().getFullYear()} &copy; {footer.copyrightName}. ALL RIGHTS RESERVED.
                    </p>
                    {socialLinks.length > 0 && (
                        <div className="flex gap-8 text-[10px] text-salon-golden-muted uppercase tracking-[0.2em]">
                            {socialLinks.map(link => (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-salon-golden transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

const FooterColumn = ({ title, links }: { title: string; links: FooterLink[] }) => (
    <div className="flex flex-col gap-4 max-w-[150px]">
        <span className="text-salon-golden text-[10px] uppercase tracking-[0.3em] font-medium border-l border-salon-golden pl-2">
            {title}
        </span>
        <ul className="flex flex-col gap-2.5 text-xs text-salon-golden-muted font-light">
            {links.map((link) => (
                <li key={link.label}>
                    {link.url ? (
                        <a
                            href={link.url}
                            target={link.url.startsWith('http') ? '_blank' : undefined}
                            rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                            className="hover:text-salon-primary cursor-pointer transition-colors uppercase tracking-widest text-[9px]"
                        >
                            {link.label}
                        </a>
                    ) : (
                        <span className="uppercase tracking-widest text-[9px]">{link.label}</span>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;
