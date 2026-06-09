/**
 * Patient — skincare product catalog.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '@/hooks/usePageTitle';
import productService from '@/services/productService';
import useCartStore from '@/store/cartStore';

const CATEGORIES = ['', 'cleanser', 'serum', 'sunscreen', 'moisturizer', 'treatment'];

export default function PatientStore() {
  usePageTitle('Skincare Store');
  const add = useCartStore((s) => s.add);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    productService
      .list({ search: search || undefined, category: category || undefined })
      .then(setProducts)
      .catch((e) => toast.error(e.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleAdd = (p) => {
    if (p.stock < 1) {
      toast.error('Out of stock');
      return;
    }
    add(
      {
        productId: p._id,
        name: p.name,
        price: p.price,
        image: p.images?.[0] || '',
        stock: p.stock,
      },
      1
    );
    toast.success(`Added ${p.name} to cart`);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Skincare Store" description="Browse dermatologist-recommended products." icon={Package}>
        <Button asChild variant="outline">
          <Link to="/patient/cart">
            <ShoppingCart className="h-4 w-4" /> View cart
          </Link>
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-48">
          <option value="">All categories</option>
          {CATEGORIES.filter(Boolean).map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" description="Try a different search or category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p._id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-32 items-center justify-center rounded-md bg-muted/50 text-4xl">
                  {p.images?.[0] ? (
                    <img
                      src={productService.imageUrl(p.images[0])}
                      alt={p.name}
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    '🧴'
                  )}
                </div>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline">{p.category}</Badge>
                  <span className="text-xs text-muted-foreground">{p.stock} in stock</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-2">
                <span className="font-semibold">PKR {p.price.toLocaleString()}</span>
                <Button size="sm" onClick={() => handleAdd(p)} disabled={p.stock < 1}>
                  Add to cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
