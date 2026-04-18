import { useState, useEffect, useCallback } from 'react';
import { useUpsertSettings, useGetBootstrapSettings } from '../../hooks/queries/useSettings';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import Button from '../../components/ui/Button';

// ─── Type Definitions ───────────────────────────────────────────────

interface HeroButton {
    label: string;
    link: string;
    variant: 'golden' | 'golden-outline' | 'white' | 'ghost' | 'link';
}

interface HeroSlide {
    tagline: string;
    title: string;
    italicTitle: string;
    description: string;
    img: string;
    buttons: HeroButton[];
}

interface ExpertiseSettings {
    title: string;
    italicTitle: string;
    description: string;
}

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

const VARIANT_OPTIONS: HeroButton['variant'][] = ['golden', 'golden-outline', 'white', 'ghost', 'link'];

// ─── Reusable Sub-Components ────────────────────────────────────────

/** Labeled input field */
const Field = ({ label, value, onChange, type = 'text', placeholder = '', className = '' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string;
}) => (
    <div className={className}>
        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-salon-base border border-salon-golden/20 rounded px-3 py-2 text-sm text-salon-primary focus:border-salon-golden/50 outline-none transition-colors"
        />
    </div>
);

/** Labeled textarea */
const TextAreaField = ({ label, value, onChange, rows = 2, className = '' }: {
    label: string; value: string; onChange: (v: string) => void; rows?: number; className?: string;
}) => (
    <div className={className}>
        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">{label}</label>
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            className="w-full bg-salon-base border border-salon-golden/20 rounded px-3 py-2 text-sm text-salon-primary focus:border-salon-golden/50 outline-none transition-colors resize-none"
        />
    </div>
);

/** Section card wrapper with title */
const SectionCard = ({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-sm uppercase tracking-widest text-salon-primary font-bold">{title}</h3>
            {actions}
        </div>
        {children}
    </div>
);

/** Save button */
const SaveButton = ({ onClick, isPending, label }: { onClick: () => void; isPending: boolean; label: string }) => (
    <div className="flex justify-end pt-4 border-t border-salon-golden/10">
        <Button variant="golden" onClick={onClick} disabled={isPending}>
            <Save className="w-4 h-4 mr-2" /> {isPending ? 'Saving...' : label}
        </Button>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────

const AdminSiteSettings = () => {
    const [activeTab, setActiveTab] = useState<'hero' | 'expertise' | 'footer'>('hero');
    const { mutate: upsertSettings, isPending } = useUpsertSettings();

    // Data Hooks
    const { data: bootstrapData } = useGetBootstrapSettings();

    // Local State
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [expertise, setExpertise] = useState<ExpertiseSettings>({ title: '', italicTitle: '', description: '' });
    const [marqueeItems, setMarqueeItems] = useState<string[]>([]);
    const [footer, setFooter] = useState<FooterData>({
        locations: [], navigation: [], connect: [],
        copyrightName: 'SALON SALEH', appStoreUrl: '', playStoreUrl: ''
    });

    // Sync from server
    useEffect(() => {
        if (bootstrapData?.data?.hero_slides) setHeroSlides(bootstrapData.data.hero_slides);
        if (bootstrapData?.data?.expertise_section) setExpertise(bootstrapData.data.expertise_section);
        const mData = bootstrapData?.data?.marquee_items;
        if (mData?.items) {
            setMarqueeItems(mData.items);
        } else if (Array.isArray(mData)) {
            setMarqueeItems(mData);
        }

        const fData = bootstrapData?.data?.footer_data;
        if (fData) {
            // Migrate old string[] format to new {label,url}[] format
            const migrateLinks = (arr: any[]): FooterLink[] =>
                (arr || []).map((item: any) =>
                    typeof item === 'string' ? { label: item, url: '' } : item
                );
            setFooter({
                locations: migrateLinks(fData.locations),
                navigation: migrateLinks(fData.navigation),
                connect: migrateLinks(fData.connect),
                copyrightName: fData.copyrightName || 'SALON SALEH',
                appStoreUrl: fData.appStoreUrl || '',
                playStoreUrl: fData.playStoreUrl || '',
            });
        }
    }, [bootstrapData]);

    // ─── Hero Slide Helpers ──────────────────────────────────────

    const updateSlide = useCallback((index: number, field: keyof HeroSlide, value: any) => {
        setHeroSlides(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const addSlide = () => {
        setHeroSlides(prev => [...prev, {
            tagline: '', title: '', italicTitle: '', description: '', img: '',
            buttons: [{ label: 'Book Now', link: '/booking', variant: 'golden' }]
        }]);
    };

    const removeSlide = (index: number) => {
        setHeroSlides(prev => prev.filter((_, i) => i !== index));
    };

    const addButton = (slideIndex: number) => {
        setHeroSlides(prev => {
            const updated = [...prev];
            updated[slideIndex] = {
                ...updated[slideIndex],
                buttons: [...(updated[slideIndex].buttons || []), { label: '', link: '/', variant: 'golden-outline' }]
            };
            return updated;
        });
    };

    const removeButton = (slideIndex: number, btnIndex: number) => {
        setHeroSlides(prev => {
            const updated = [...prev];
            updated[slideIndex] = {
                ...updated[slideIndex],
                buttons: updated[slideIndex].buttons.filter((_, i) => i !== btnIndex)
            };
            return updated;
        });
    };

    const updateButton = (slideIndex: number, btnIndex: number, field: keyof HeroButton, value: string) => {
        setHeroSlides(prev => {
            const updated = [...prev];
            const buttons = [...updated[slideIndex].buttons];
            buttons[btnIndex] = { ...buttons[btnIndex], [field]: value };
            updated[slideIndex] = { ...updated[slideIndex], buttons };
            return updated;
        });
    };

    // ─── Footer Link Helpers ──────────────────────────────────────

    const updateFooterLink = (section: 'locations' | 'navigation' | 'connect', index: number, field: keyof FooterLink, value: string) => {
        setFooter(prev => {
            const updated = { ...prev };
            const links = [...updated[section]];
            links[index] = { ...links[index], [field]: value };
            updated[section] = links;
            return updated;
        });
    };

    const addFooterLink = (section: 'locations' | 'navigation' | 'connect') => {
        setFooter(prev => ({ ...prev, [section]: [...prev[section], { label: '', url: '' }] }));
    };

    const removeFooterLink = (section: 'locations' | 'navigation' | 'connect', index: number) => {
        setFooter(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };

    // ─── Tabs Config ──────────────────────────────────────────────

    const tabs = [
        { key: 'hero' as const, label: 'Hero Slides' },
        { key: 'expertise' as const, label: 'Expertise & Marquee' },
        { key: 'footer' as const, label: 'Footer' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in max-w-5xl">
            <div className="flex justify-between items-center border-b border-salon-golden/10 pb-4">
                <h2 className="text-2xl font-serif text-salon-primary">Site Content Management</h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-salon-golden/10 pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === tab.key ? 'text-salon-golden border-b-2 border-salon-golden' : 'text-salon-muted hover:text-salon-primary'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">

                {/* ═══════ HERO SLIDES TAB ═══════ */}
                {activeTab === 'hero' && (
                    <SectionCard
                        title="Hero Slides"
                        actions={
                            <Button size="sm" variant="golden-outline" onClick={addSlide}>
                                <Plus className="w-4 h-4 mr-2" /> Add Slide
                            </Button>
                        }
                    >
                        {heroSlides.length === 0 && (
                            <p className="text-sm text-salon-muted italic py-8 text-center">No slides configured. Click "Add Slide" to begin.</p>
                        )}

                        {heroSlides.map((slide, index) => (
                            <div key={index} className="border border-salon-golden/20 p-5 rounded bg-salon-surface relative">
                                {/* Slide Header */}
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-salon-golden/10">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-salon-muted" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-salon-golden">Slide {index + 1}</span>
                                    </div>
                                    <button onClick={() => removeSlide(index)} className="text-red-500 hover:text-red-400 transition-colors p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Slide Content Fields */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <Field label="Tagline" value={slide.tagline} onChange={v => updateSlide(index, 'tagline', v)} placeholder="e.g. The Modern Edge" />
                                    <Field label="Image URL" value={slide.img} onChange={v => updateSlide(index, 'img', v)} placeholder="https://..." />
                                    <Field label="Title" value={slide.title} onChange={v => updateSlide(index, 'title', v)} placeholder="e.g. Meticulous" />
                                    <Field label="Italic Title" value={slide.italicTitle} onChange={v => updateSlide(index, 'italicTitle', v)} placeholder="e.g. Precision." />
                                    <TextAreaField label="Description" value={slide.description} onChange={v => updateSlide(index, 'description', v)} className="col-span-2" />
                                </div>

                                {/* ─── Buttons Sub-Editor ─── */}
                                <div className="border-t border-salon-golden/10 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] uppercase tracking-widest text-salon-muted font-bold">Buttons</span>
                                        <button
                                            onClick={() => addButton(index)}
                                            className="text-[10px] uppercase tracking-widest text-salon-golden hover:text-salon-primary transition-colors flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add Button
                                        </button>
                                    </div>

                                    {(!slide.buttons || slide.buttons.length === 0) && (
                                        <p className="text-xs text-salon-muted italic py-2">No buttons. Click "Add Button" to add one.</p>
                                    )}

                                    <div className="space-y-3">
                                        {(slide.buttons || []).map((btn, btnIdx) => (
                                            <div key={btnIdx} className="flex items-end gap-3 bg-salon-base/50 p-3 rounded border border-salon-golden/10">
                                                <Field label="Label" value={btn.label} onChange={v => updateButton(index, btnIdx, 'label', v)} className="flex-1" placeholder="e.g. Book Now" />
                                                <Field label="Link" value={btn.link} onChange={v => updateButton(index, btnIdx, 'link', v)} className="flex-1" placeholder="e.g. /booking" />
                                                <div className="flex-1">
                                                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Variant</label>
                                                    <select
                                                        value={btn.variant}
                                                        onChange={e => updateButton(index, btnIdx, 'variant', e.target.value)}
                                                        className="w-full bg-salon-base border border-salon-golden/20 rounded px-3 py-2 text-sm text-salon-primary outline-none cursor-pointer"
                                                    >
                                                        {VARIANT_OPTIONS.map(v => (
                                                            <option key={v} value={v}>{v}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button onClick={() => removeButton(index, btnIdx)} className="text-red-500 hover:text-red-400 p-2 mb-0.5">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <SaveButton onClick={() => upsertSettings({ key: 'hero_slides', value: heroSlides })} isPending={isPending} label="Save Hero Slides" />
                    </SectionCard>
                )}

                {/* ═══════ EXPERTISE & MARQUEE TAB ═══════ */}
                {activeTab === 'expertise' && (
                    <div className="space-y-8">
                        {/* Expertise Headline */}
                        <SectionCard title="Expertise Section Headline">
                            <div className="space-y-4 max-w-xl">
                                <Field label="Title" value={expertise.title} onChange={v => setExpertise({ ...expertise, title: v })} placeholder="e.g. Our" />
                                <Field label="Italic Title" value={expertise.italicTitle} onChange={v => setExpertise({ ...expertise, italicTitle: v })} placeholder="e.g. Expertise" />
                                <TextAreaField label="Description" value={expertise.description} onChange={v => setExpertise({ ...expertise, description: v })} rows={3} />
                            </div>
                            <SaveButton onClick={() => upsertSettings({ key: 'expertise_section', value: expertise })} isPending={isPending} label="Save Expertise Info" />
                        </SectionCard>

                        {/* Marquee Text */}
                        <div className="border-t border-salon-golden/10 pt-6">
                            <SectionCard
                                title="Marquee / Scrolling Banner Items"
                                actions={
                                    <button onClick={() => setMarqueeItems([...marqueeItems, ''])} className="text-[10px] uppercase tracking-widest text-salon-golden hover:text-salon-primary transition-colors flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> Add Item
                                    </button>
                                }
                            >
                                <div className="max-w-xl space-y-3">
                                    {marqueeItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={e => {
                                                    const newItems = [...marqueeItems];
                                                    newItems[idx] = e.target.value;
                                                    setMarqueeItems(newItems);
                                                }}
                                                placeholder="e.g. HIGH-END LUXURY SALON"
                                                className="flex-1 bg-salon-base border border-salon-golden/20 rounded px-3 py-2 text-sm text-salon-primary focus:border-salon-golden/50 outline-none transition-colors"
                                            />
                                            <button onClick={() => setMarqueeItems(marqueeItems.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-400 p-2">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {marqueeItems.length === 0 && (
                                        <p className="text-xs text-salon-muted italic py-2">No items. Click "Add Item" to begin.</p>
                                    )}
                                    <p className="text-xs text-salon-muted mt-2">
                                        These items scroll across the landing page between the Expertise and Booking sections.
                                    </p>
                                </div>
                                <SaveButton onClick={() => upsertSettings({ key: 'marquee_items', value: { items: marqueeItems } })} isPending={isPending} label="Save Marquee Items" />
                            </SectionCard>
                        </div>
                    </div>
                )}

                {/* ═══════ FOOTER TAB ═══════ */}
                {activeTab === 'footer' && (
                    <div className="space-y-8">
                        {/* Locations */}
                        <FooterLinkSection
                            title="Locations"
                            links={footer.locations}
                            onUpdate={(i, field, value) => updateFooterLink('locations', i, field, value)}
                            onAdd={() => addFooterLink('locations')}
                            onRemove={(i) => removeFooterLink('locations', i)}
                            urlPlaceholder="Optional URL (e.g. Google Maps link)"
                        />

                        {/* Navigation */}
                        <FooterLinkSection
                            title="Navigation Links"
                            links={footer.navigation}
                            onUpdate={(i, field, value) => updateFooterLink('navigation', i, field, value)}
                            onAdd={() => addFooterLink('navigation')}
                            onRemove={(i) => removeFooterLink('navigation', i)}
                            urlPlaceholder="Page path (e.g. /shop)"
                        />

                        {/* Social / Connect */}
                        <FooterLinkSection
                            title="Social / Connect Links"
                            links={footer.connect}
                            onUpdate={(i, field, value) => updateFooterLink('connect', i, field, value)}
                            onAdd={() => addFooterLink('connect')}
                            onRemove={(i) => removeFooterLink('connect', i)}
                            urlPlaceholder="Full URL (e.g. https://instagram.com/...)"
                        />

                        {/* General Footer Settings */}
                        <div className="border-t border-salon-golden/10 pt-6 space-y-4">
                            <h3 className="text-sm uppercase tracking-widest text-salon-primary font-bold">General</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                                <Field label="Copyright Name" value={footer.copyrightName} onChange={v => setFooter(prev => ({ ...prev, copyrightName: v }))} placeholder="SALON SALEH" />
                                <Field label="App Store URL" value={footer.appStoreUrl} onChange={v => setFooter(prev => ({ ...prev, appStoreUrl: v }))} placeholder="https://apps.apple.com/..." />
                                <Field label="Play Store URL" value={footer.playStoreUrl} onChange={v => setFooter(prev => ({ ...prev, playStoreUrl: v }))} placeholder="https://play.google.com/..." />
                            </div>
                        </div>

                        <SaveButton onClick={() => upsertSettings({ key: 'footer_data', value: footer })} isPending={isPending} label="Save Footer Data" />
                    </div>
                )}

            </div>
        </div>
    );
};

// ─── Footer Link Section Sub-Component ──────────────────────────────

const FooterLinkSection = ({ title, links, onUpdate, onAdd, onRemove, urlPlaceholder }: {
    title: string;
    links: FooterLink[];
    onUpdate: (index: number, field: keyof FooterLink, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    urlPlaceholder: string;
}) => (
    <SectionCard
        title={title}
        actions={
            <button onClick={onAdd} className="text-[10px] uppercase tracking-widest text-salon-golden hover:text-salon-primary transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Item
            </button>
        }
    >
        {links.length === 0 && (
            <p className="text-xs text-salon-muted italic py-2">No items. Click "Add Item" to begin.</p>
        )}
        <div className="space-y-3">
            {links.map((link, index) => (
                <div key={index} className="flex items-end gap-3 bg-salon-base/50 p-3 rounded border border-salon-golden/10">
                    <Field label="Label" value={link.label} onChange={v => onUpdate(index, 'label', v)} className="flex-1" placeholder="Display text" />
                    <Field label="URL" value={link.url} onChange={v => onUpdate(index, 'url', v)} className="flex-1" placeholder={urlPlaceholder} />
                    <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-400 p-2 mb-0.5">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    </SectionCard>
);

export default AdminSiteSettings;
