import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface AdminTableProps {
  type: 'products' | 'orders' | 'coupons' | 'users';
}

const AdminTable = ({ type }: AdminTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getColumns = () => {
    switch (type) {
      case 'products':
        return ['Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'];
      case 'orders':
        return ['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'];
      case 'coupons':
        return ['Code', 'Type', 'Value', 'Usage', 'Expiry', 'Actions'];
      case 'users':
        return ['Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'];
      default:
        return [];
    }
  };

  const getMockData = () => {
    // Mock data for demonstration
    switch (type) {
      case 'products':
        return [
          {
            id: '1',
            name: 'Premium Silk Saree',
            category: 'Sarees',
            price: '₹5,999',
            stock: 25,
            status: 'Active',
          },
        ];
      case 'orders':
        return [
          {
            id: '1',
            orderId: 'ORD001',
            customer: 'John Doe',
            date: '2024-01-15',
            total: '₹8,999',
            status: 'Delivered',
          },
        ];
      case 'coupons':
        return [
          {
            id: '1',
            code: 'WELCOME10',
            type: 'Percentage',
            value: '10%',
            usage: '50/100',
            expiry: '2024-12-31',
          },
        ];
      case 'users':
        return [
          {
            id: '1',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+91 9876543210',
            role: 'Customer',
            status: 'Active',
          },
        ];
      default:
        return [];
    }
  };

  const columns = getColumns();
  const data = getMockData();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="capitalize">{type}</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${type}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    <p className="text-muted-foreground">No {type} found</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row: any) => (
                  <TableRow key={row.id}>
                    {Object.entries(row)
                      .filter(([key]) => key !== 'id')
                      .map(([key, value]) => (
                        <TableCell key={key}>{value as string}</TableCell>
                      ))}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTable;
