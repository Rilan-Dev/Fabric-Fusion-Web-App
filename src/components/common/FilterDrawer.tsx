import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterDrawerProps {
  filters: {
    priceRange: [number, number];
    colors: string[];
    sizes: string[];
    materials: string[];
    inStock: boolean;
  };
  onFilterChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const colors = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const materials = ['Cotton', 'Silk', 'Linen', 'Polyester', 'Wool', 'Viscose'];

const FilterDrawer = ({ filters, onFilterChange, isOpen, onClose, isMobile }: FilterDrawerProps) => {
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={filters.priceRange}
            onValueChange={(value: any) => onFilterChange({ priceRange: value })}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color) => (
              <div key={color.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color.name}`}
                  checked={filters.colors.includes(color.name)}
                  onCheckedChange={(checked) => {
                    const newColors = checked
                      ? [...filters.colors, color.name]
                      : filters.colors.filter((c) => c !== color.name);
                    onFilterChange({ colors: newColors });
                  }}
                />
                <Label
                  htmlFor={`color-${color.name}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm">{color.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={filters.sizes.includes(size) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const newSizes = filters.sizes.includes(size)
                    ? filters.sizes.filter((s) => s !== size)
                    : [...filters.sizes, size];
                  onFilterChange({ sizes: newSizes });
                }}
              >
                {size}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {materials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.materials.includes(material)}
                  onCheckedChange={(checked) => {
                    const newMaterials = checked
                      ? [...filters.materials, material]
                      : filters.materials.filter((m) => m !== material);
                    onFilterChange({ materials: newMaterials });
                  }}
                />
                <Label htmlFor={`material-${material}`} className="cursor-pointer">
                  {material}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* In Stock */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => onFilterChange({ inStock: checked })}
            />
            <Label htmlFor="in-stock" className="cursor-pointer">
              Show only in stock items
            </Label>
          </div>
        </CardContent>
      </Card>

      {isMobile && (
        <Button className="w-full" onClick={onClose}>
          Apply Filters
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <FilterContent />;
};

export default FilterDrawer;
