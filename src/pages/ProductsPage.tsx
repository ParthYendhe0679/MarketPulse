import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  TrendingUp, 
  Eye, 
  TrendingDown
} from 'lucide-react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { getMockData, getProductDetails, getProductRanking } from '../services/dataService';
import { CATEGORIES } from '../constants';

export const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rawData = getMockData();

  // Aggregate and rank all products to display
  const productsList = useMemo(() => {
    // Rank all products in database
    let list = getProductRanking(rawData, 100);

    // Apply Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.brand.toLowerCase().includes(lower)
      );
    }

    // Apply Category filter
    if (categoryFilter) {
      list = list.filter(p => p.category === categoryFilter);
    }

    return list;
  }, [rawData, searchTerm, categoryFilter]);

  // Query product details for active modal view
  const activeProductDetails = useMemo(() => {
    if (!selectedProduct) return null;
    return getProductDetails(selectedProduct);
  }, [selectedProduct]);

  const handleOpenDetails = (name: string) => {
    setSelectedProduct(name);
    setIsModalOpen(true);
  };

  // Reusable avatar colors based on Category to make UI look highly customized and premium
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Electronics': return { bg: 'bg-[#4F7DF9]', text: 'text-white' };
      case 'Food & Beverages': return { bg: 'bg-[#FFD54A]', text: 'text-[#111111]' };
      case 'Personal Care': return { bg: 'bg-[#FF9ECF]', text: 'text-[#111111]' };
      case 'Apparel & Fashion': return { bg: 'bg-[#6EE7B7]', text: 'text-[#111111]' };
      default: return { bg: 'bg-[#FFB347]', text: 'text-[#111111]' };
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#111111] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="pink">SKU Matrix</Badge>
            <Badge variant="blue">Brand Performance</Badge>
          </div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-[#111111] m-0">
            Consumer Products
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Drill down into product sales parameters, top regional centers, and organic growth indices.
          </p>
        </div>
      </div>

      {/* Search and Filters Controls */}
      <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5 shadow-[4px_4px_0px_0px_#111111]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            placeholder="Search products, brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5 text-gray-400 stroke-[2.5]" />}
          />

          <Dropdown 
            label=""
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
          />

          <div className="flex items-center justify-end">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Active SKU Count: {productsList.length} items
            </span>
          </div>
        </div>
      </Card>

      {/* Grid of Product Cards */}
      {productsList.length === 0 ? (
        <Card variant="white" hoverable={false} className="p-8 text-center border-3 border-dashed border-[#111111]">
          <ShoppingBag className="w-12 h-12 text-[#FF6B6B] mx-auto mb-4 stroke-[2.5]" />
          <h3 className="text-lg font-bold font-display uppercase">No products match your query</h3>
          <p className="text-xs text-gray-500 font-semibold mt-1">Adjust search parameters to review SKU logs.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsList.map((product) => {
            const themeInfo = getCategoryTheme(product.category);
            const isNegative = product.growth < 0;

            return (
              <Card 
                key={product.name} 
                variant="white"
                className="border-3 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[6px_6px_0px_0px_#111111] flex flex-col justify-between"
              >
                <div>
                  {/* Top visual row */}
                  <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3 mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {product.brand}
                    </span>
                    <Badge variant={product.category === 'Electronics' ? 'blue' : product.category === 'Food & Beverages' ? 'yellow' : product.category === 'Personal Care' ? 'pink' : 'green'}>
                      {product.category.split(' ')[0]}
                    </Badge>
                  </div>

                  {/* Icon + Product title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-12 h-12 rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] flex items-center justify-center font-black text-sm uppercase ${themeInfo.bg} ${themeInfo.text}`}>
                      {product.name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-base font-black font-display uppercase tracking-tight text-[#111111]">
                        {product.name}
                      </h4>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">IN CONSUMPTION DATABASE</span>
                    </div>
                  </div>

                  {/* Stats list */}
                  <div className="space-y-2 border-t border-gray-100 pt-3 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-500 uppercase">REVENUE:</span>
                      <strong className="text-[#111111]">₹{(product.revenue / 100000).toFixed(2)} L</strong>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-500 uppercase">VOLUME:</span>
                      <strong className="text-[#111111]">{product.sales.toLocaleString()} units</strong>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-500 uppercase">ORGANIC GROWTH:</span>
                      <span className={`px-1 rounded flex items-center gap-0.5 ${isNegative ? 'bg-red-100 text-[#FF6B6B]' : 'bg-green-100 text-[#6EE7B7]'}`}>
                        {isNegative ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                        {product.growth}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-dashed border-gray-200">
                  <Button 
                    variant="white" 
                    size="sm" 
                    fullWidth 
                    onClick={() => handleOpenDetails(product.name)}
                    className="text-xs uppercase"
                  >
                    View Drilldown <Eye className="w-4 h-4 ml-1.5 stroke-[2.5]" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeProductDetails ? `${activeProductDetails.name} Analysis` : 'SKU Details'}
      >
        {activeProductDetails ? (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-4">
              <div className="w-14 h-14 bg-[#4F7DF9] text-white border-3 border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] rounded-2xl flex items-center justify-center font-black text-xl uppercase">
                {activeProductDetails.name.slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display uppercase tracking-tight text-[#111111] leading-none mb-1">
                  {activeProductDetails.name}
                </h3>
                <p className="text-xs font-bold text-gray-500 uppercase">
                  {activeProductDetails.brand} &bull; {activeProductDetails.category}
                </p>
              </div>
            </div>

            {/* Core KPIs on Modal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border-2 border-[#111111] rounded-xl bg-gray-50">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">TOTAL REVENUE</span>
                <strong className="text-base font-black">₹{(activeProductDetails.revenue / 100000).toFixed(2)} Lakh</strong>
              </div>
              <div className="p-3 border-2 border-[#111111] rounded-xl bg-gray-50">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">VOLUME SOLD</span>
                <strong className="text-base font-black">{activeProductDetails.sales.toLocaleString()} items</strong>
              </div>
              <div className="p-3 border-2 border-[#111111] rounded-xl bg-gray-50">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">MEAN MARKET SHARE</span>
                <strong className="text-base font-black">{activeProductDetails.marketShare}%</strong>
              </div>
              <div className="p-3 border-2 border-[#111111] rounded-xl bg-gray-50">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">YOY ACCELERATION</span>
                <strong className="text-base font-black text-[#6EE7B7] bg-[#111111] px-1 rounded inline-block mt-0.5">
                  +{activeProductDetails.growth}%
                </strong>
              </div>
            </div>

            {/* Top Regions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Top States */}
              <div className="space-y-3">
                <h4 className="text-xs font-black font-display uppercase tracking-wide text-gray-600 border-b border-gray-200 pb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" /> Top 5 States
                </h4>
                <div className="space-y-2">
                  {activeProductDetails.topStates.map((s, idx) => (
                    <div key={s.name} className="flex justify-between items-center text-xs font-bold p-2 bg-[#FAFAFA] border-2 border-[#111111] rounded-lg">
                      <span className="text-gray-500">{idx + 1}. {s.name}</span>
                      <strong className="text-[#111111]">₹{(s.revenue / 100000).toFixed(1)} L</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Cities */}
              <div className="space-y-3">
                <h4 className="text-xs font-black font-display uppercase tracking-wide text-gray-600 border-b border-gray-200 pb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#4F7DF9]" /> Top 5 Cities
                </h4>
                <div className="space-y-2">
                  {activeProductDetails.topCities.map((c, idx) => (
                    <div key={c.name} className="flex justify-between items-center text-xs font-bold p-2 bg-[#FAFAFA] border-2 border-[#111111] rounded-lg">
                      <span className="text-gray-500">{idx + 1}. {c.name}</span>
                      <strong className="text-[#111111]">₹{(c.revenue / 100000).toFixed(1)} L</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400 font-medium">
            Error retrieving product statistics.
          </div>
        )}
      </Modal>
    </div>
  );
};
export default ProductsPage;
