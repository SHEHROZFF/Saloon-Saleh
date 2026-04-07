import { useState } from 'react';
import { useGetProducts, useDeleteProduct } from '../../hooks/queries/useProducts';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminSlideOver from '../../components/admin/AdminSlideOver';
import ProductForm from '../../components/admin/forms/ProductForm';
import { Product } from '../../services/api/productService';

const AdminProducts = () => {
    const { data, isLoading } = useGetProducts();
    const { mutate: deleteProduct } = useDeleteProduct();
    const products = (data?.data as any)?.products || data?.data || [];

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsSlideOverOpen(true);
    };

    const handleEditClick = (p: Product) => {
        setEditingProduct(p);
        setIsSlideOverOpen(true);
    };

    const handleCloseSlideOver = () => {
        setIsSlideOverOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-salon-primary">Products Inventory</h2>
                <button 
                    onClick={handleAddClick}
                    className="px-6 py-2.5 bg-salon-golden text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-salon-golden-muted transition-colors rounded"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>
            
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-salon-golden/20">
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Product</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Category</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Price</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Stock</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={6} className="text-center py-10">Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-salon-muted italic">No products found. Add one to your inventory.</td></tr>
                        ) : products.map((p: any) => (
                            <tr key={p.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                <td className="py-4 text-sm font-medium text-salon-primary">
                                    {p.title} {p.is_featured && <span className="text-xs ml-1" title="Featured Product">⭐</span>}
                                </td>
                                <td className="py-4 text-sm text-salon-muted">{p.category_name || 'Uncategorized'}</td>
                                <td className="py-4 text-sm font-serif">${typeof p.price === 'string' ? parseFloat(p.price).toFixed(2) : p.price}</td>
                                <td className="py-4 text-sm">{p.stock_quantity}</td>
                                <td className="py-4 text-[10px] uppercase tracking-wider">{p.is_active ? 'Active' : 'Inactive'}</td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(p)} className="text-salon-muted hover:text-salon-golden p-1">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => confirm('Are you sure you want to delete this product?') && deleteProduct(p.id)} className="text-salon-muted hover:text-red-500 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminSlideOver 
                isOpen={isSlideOverOpen} 
                onClose={handleCloseSlideOver}
                title={editingProduct ? "Edit Product" : "Add New Product"}
            >
                <ProductForm 
                    initialData={editingProduct} 
                    onClose={handleCloseSlideOver} 
                />
            </AdminSlideOver>
        </div>
    );
};
export default AdminProducts;
