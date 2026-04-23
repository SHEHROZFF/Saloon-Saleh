import React, { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct, useGetProductCategories } from '../../../hooks/queries/useProducts';
import { Product } from '../../../services/api/productService';
import { toast } from '../../ui/Toast';

interface ProductFormProps {
    initialData?: Product | null;
    onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onClose }) => {
    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const { data: categoriesData } = useGetProductCategories();

    const categories = (categoriesData?.data as any)?.categories || categoriesData?.data || [];

    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        brand: 'Salon Saleh',
        price: '',
        image_url: '',
        category_id: '',
        description: '',
        details: '',
        usage_instructions: '',
        is_active: true,
        is_featured: false,
        stock_quantity: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                brand: initialData.brand || 'Salon Saleh',
                price: initialData.price || '',
                image_url: initialData.image_url || '',
                category_id: initialData.category_id || '',
                description: initialData.description || '',
                details: initialData.details || '',
                usage_instructions: initialData.usage_instructions || '',
                is_active: initialData.is_active !== false,
                is_featured: initialData.is_featured || false,
                stock_quantity: initialData.stock_quantity || 0
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            updateProduct({ id: initialData.id, data: formData }, {
                onSuccess: () => { toast.success('Product updated.'); onClose(); }
            });
        } else {
            createProduct(formData, {
                onSuccess: () => { toast.success('Product created.'); onClose(); }
            });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 text-salon-primary">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Product Title</label>
                    <input
                        required
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        placeholder="e.g. Argan Oil Hair Serum"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Brand</label>
                        <input
                            required
                            type="text"
                            value={formData.brand || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Category</label>
                        <select
                            required
                            value={formData.category_id || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Price (DH)</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Stock</label>
                        <input
                            required
                            type="number"
                            min="0"
                            value={formData.stock_quantity || 0}
                            onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Image URL</label>
                    <input
                        type="url"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Description</label>
                    <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors resize-none"
                    />
                </div>

                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            className="accent-salon-golden w-4 h-4"
                        />
                        <label htmlFor="is_active" className="text-sm cursor-pointer">Product is Active</label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                            className="accent-salon-golden w-4 h-4"
                        />
                        <label htmlFor="is_featured" className="text-sm cursor-pointer hover:text-salon-golden transition-colors">Featured ⭐</label>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-salon-golden/10">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-semibold tracking-wider uppercase text-salon-muted hover:text-salon-primary transition-colors bg-salon-surface/50 border border-salon-golden/10 rounded-md hover:border-salon-golden/30"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-3 text-sm font-bold tracking-wider uppercase text-black bg-salon-golden hover:bg-salon-golden-muted transition-colors rounded-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isPending ? 'Saving...' : (initialData ? 'Update Product' : 'Add Product')}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
