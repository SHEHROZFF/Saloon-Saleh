import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService, Staff } from '../../services/api/staffService';
import { Loader2, Save, Sparkles, User, Instagram, Linkedin, Briefcase, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';

const StaffProfile = () => {
    const queryClient = useQueryClient();
    const { data: profileData, isLoading } = useQuery({
        queryKey: ['staff', 'me'],
        queryFn: () => staffService.getMyProfile()
    });

    const [formData, setFormData] = useState<Partial<Staff>>({
        bio: '',
        specialties: [],
        experience_years: '',
        instagram_url: '',
        linkedin_url: '',
        avatar_url: ''
    });

    const staff = profileData?.data?.staff;

    useEffect(() => {
        if (staff) {
            setFormData({
                bio: staff.bio || '',
                specialties: staff.specialties || [],
                experience_years: staff.experience_years || '',
                instagram_url: staff.instagram_url || '',
                linkedin_url: staff.linkedin_url || '',
                avatar_url: staff.avatar_url || ''
            });
        }
    }, [staff]);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<Staff>) => staffService.updateMyProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff', 'me'] });
            alert('Profile updated successfully!');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-salon-golden" /></div>;

    return (
        <div className="max-w-5xl space-y-10 animate-in fade-in duration-500 pb-24">
            <div className="border-b border-salon-golden/10 pb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-salon-primary">My Professional Profile</h2>
                    <p className="text-sm text-salon-muted mt-2 uppercase tracking-widest">Manage your public presence and account details.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-salon-golden/5 border border-salon-golden/10 rounded-sm">
                    <ShieldCheck className="w-4 h-4 text-salon-golden" />
                    <span className="text-[10px] uppercase tracking-widest text-salon-golden font-bold">Verified Artisan</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* 1. Restricted Account Details (Read-Only) */}
                <div className="bg-salon-surface/50 border border-salon-golden/10 rounded-sm p-8 space-y-8">
                    <div className="flex items-center gap-3 border-b border-salon-golden/5 pb-4">
                        <Lock className="w-4 h-4 text-salon-muted" />
                        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-salon-primary">Restricted Account Details</h3>
                        <span className="text-[9px] text-salon-muted ml-auto italic">Contact Admin to modify these fields</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted font-bold">Full Name</label>
                            <div className="w-full bg-salon-base/50 border border-salon-golden/5 px-6 py-4 text-sm text-salon-muted cursor-not-allowed rounded-sm">
                                {staff?.name}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted font-bold">Professional Role</label>
                            <div className="w-full bg-salon-base/50 border border-salon-golden/5 px-6 py-4 text-sm text-salon-muted cursor-not-allowed rounded-sm">
                                {staff?.role}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted font-bold flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Business Email
                            </label>
                            <div className="w-full bg-salon-base/50 border border-salon-golden/5 px-6 py-4 text-sm text-salon-muted cursor-not-allowed rounded-sm">
                                {staff?.email}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted font-bold flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Phone Number
                            </label>
                            <div className="w-full bg-salon-base/50 border border-salon-golden/5 px-6 py-4 text-sm text-salon-muted cursor-not-allowed rounded-sm">
                                {staff?.phone || 'Not provided'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Visual & Portfolio (Editable) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-salon-golden flex items-center gap-2">
                            <User className="w-3 h-3" /> Visual Identity
                        </h3>
                        <div className="aspect-[4/5] bg-salon-surface border border-salon-golden/20 rounded-sm overflow-hidden relative group">
                            <img 
                                src={formData.avatar_url || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a"} 
                                alt={staff?.name} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold mb-2">Artisan Portrait</span>
                                <span className="text-[9px] text-salon-golden-muted">Update via Admin Dashboard</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2 font-bold">Years of Excellence</label>
                            <input 
                                type="text"
                                value={formData.experience_years}
                                onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                                placeholder="e.g. 10+ Years Master"
                                className="w-full bg-salon-surface border border-salon-golden/20 px-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all rounded-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2 font-bold">Professional Biography</label>
                            <textarea 
                                rows={8}
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                placeholder="Describe your philosophy, technique, and vision..."
                                className="w-full bg-salon-surface border border-salon-golden/20 px-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all resize-none rounded-sm leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Expertise & Social */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                    <div className="space-y-6">
                        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-salon-golden flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Core Specialties
                        </h3>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {formData.specialties?.map((spec, i) => (
                                    <span key={i} className="px-4 py-2 border border-salon-golden/20 bg-salon-golden/5 text-[10px] uppercase tracking-widest text-salon-golden rounded-sm flex items-center gap-2">
                                        {spec}
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({...formData, specialties: formData.specialties?.filter((_, index) => index !== i)})}
                                            className="hover:text-white transition-colors"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    id="add-specialty"
                                    placeholder="Add specialty (e.g. Skin Fade)"
                                    className="flex-1 bg-salon-surface border border-salon-golden/10 px-4 py-2 text-xs focus:outline-none focus:border-salon-golden transition-all rounded-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = (e.target as HTMLInputElement).value.trim();
                                            if (val && !formData.specialties?.includes(val)) {
                                                setFormData({...formData, specialties: [...(formData.specialties || []), val]});
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }
                                    }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById('add-specialty') as HTMLInputElement;
                                        const val = input.value.trim();
                                        if (val && !formData.specialties?.includes(val)) {
                                            setFormData({...formData, specialties: [...(formData.specialties || []), val]});
                                            input.value = '';
                                        }
                                    }}
                                    className="px-4 py-2 bg-salon-golden/10 border border-salon-golden/20 text-salon-golden text-[10px] uppercase font-bold hover:bg-salon-golden hover:text-black transition-all rounded-sm"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-salon-golden flex items-center gap-2">
                            <Briefcase className="w-3 h-3" /> Digital Presence
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                                <input 
                                    type="url"
                                    value={formData.instagram_url}
                                    onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                                    placeholder="Instagram Professional Profile URL"
                                    className="w-full bg-salon-surface border border-salon-golden/10 pl-14 pr-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all rounded-sm"
                                />
                            </div>
                            <div className="relative">
                                <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                                <input 
                                    type="url"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                    placeholder="LinkedIn Professional Profile URL"
                                    className="w-full bg-salon-surface border border-salon-golden/10 pl-14 pr-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all rounded-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-salon-golden/10 flex items-center justify-between">
                    <p className="text-xs text-salon-muted italic max-w-md">Your portfolio details are visible on your public expert profile and alongside your professional blogs.</p>
                    <button 
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="px-12 py-5 bg-salon-golden text-black text-xs font-bold tracking-[0.4em] uppercase hover:bg-salon-golden-muted transition-all rounded-sm shadow-2xl flex items-center gap-4 disabled:opacity-50"
                    >
                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Profile Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StaffProfile;
