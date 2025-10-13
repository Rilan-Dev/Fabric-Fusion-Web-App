import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminTable from '@/components/common/AdminTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart, Tag, Users } from 'lucide-react';

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Simple admin check - replace with proper role-based auth
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page</p>
          <button onClick={() => navigate('/')} className="text-primary">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">
              <Package className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="coupons">
              <Tag className="mr-2 h-4 w-4" />
              Coupons
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <AdminTable type="products" />
          </TabsContent>

          <TabsContent value="orders">
            <AdminTable type="orders" />
          </TabsContent>

          <TabsContent value="coupons">
            <AdminTable type="coupons" />
          </TabsContent>

          <TabsContent value="users">
            <AdminTable type="users" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
