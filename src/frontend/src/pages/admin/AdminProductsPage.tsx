import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useAdminProductMutations } from '../../hooks/useAdminProductMutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import { formatMoney } from '../../utils/money';
import { getProductImageUrl } from '../../utils/images';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const { addProduct, deleteProduct } = useAdminProductMutations();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceInCents = Math.round(parseFloat(formData.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    addProduct.mutate(
      {
        name: formData.name,
        price: BigInt(priceInCents),
        image: formData.image,
        description: formData.description,
      },
      {
        onSuccess: () => {
          toast.success('Product added successfully');
          setFormData({ name: '', price: '', image: '', description: '' });
        },
        onError: (error) => {
          toast.error('Failed to add product: ' + error.message);
        },
      }
    );
  };

  const handleDelete = (id: bigint, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct.mutate(id, {
        onSuccess: () => {
          toast.success('Product deleted successfully');
        },
        onError: (error) => {
          toast.error('Failed to delete product: ' + error.message);
        },
      });
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Add Product Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (in dollars) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to use placeholder</p>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={addProduct.isPending}>
                {addProduct.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getProductImageUrl('');
                    }}
                  />
                ) : (
                  <img
                    src={getProductImageUrl('')}
                    alt="Placeholder"
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{formData.name || 'Product Name'}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {formData.description || 'Product description will appear here'}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : '$0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : !products || products.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No products yet. Add your first product above.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id.toString()}>
                      <TableCell>
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = getProductImageUrl('');
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                      <TableCell>{formatMoney(product.price)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleteProduct.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
