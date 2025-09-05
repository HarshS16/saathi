import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';

interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  supplier: string;
  batchNumber: string;
}

const InventoryManagementPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      quantity: 150,
      price: 2.50,
      expiryDate: '2025-06-15',
      supplier: 'MedSupply Co.',
      batchNumber: 'PAR001'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotic',
      quantity: 75,
      price: 8.00,
      expiryDate: '2024-12-20',
      supplier: 'PharmaCorp',
      batchNumber: 'AMX002'
    },
    {
      id: '3',
      name: 'Cough Syrup',
      category: 'Respiratory',
      quantity: 25,
      price: 12.00,
      expiryDate: '2024-08-30',
      supplier: 'HealthPlus',
      batchNumber: 'CS003'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({});
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockMedicines = medicines.filter(medicine => medicine.quantity < 50);
  const expiringSoon = medicines.filter(medicine => {
    const expiryDate = new Date(medicine.expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  });

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.quantity || !newMedicine.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name || '',
      category: newMedicine.category || 'General',
      quantity: newMedicine.quantity || 0,
      price: newMedicine.price || 0,
      expiryDate: newMedicine.expiryDate || '',
      supplier: newMedicine.supplier || '',
      batchNumber: newMedicine.batchNumber || ''
    };

    setMedicines([...medicines, medicine]);
    setNewMedicine({});
    setIsAddingMedicine(false);
    toast.success('Medicine added successfully');
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setMedicines(medicines.map(medicine =>
      medicine.id === id ? { ...medicine, quantity: newQuantity } : medicine
    ));
    toast.success('Quantity updated');
  };

  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter(medicine => medicine.id !== id));
    toast.success('Medicine removed from inventory');
  };

  const getStockStatus = (quantity: number) => {
    if (quantity < 20) return { label: 'Critical', color: 'bg-red-100 text-red-800' };
    if (quantity < 50) return { label: 'Low', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Good', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600">Manage your pharmacy inventory and stock levels</p>
            </div>
            <Button onClick={() => setIsAddingMedicine(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{medicines.length}</p>
                    <p className="text-sm text-gray-600">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{lowStockMedicines.length}</p>
                    <p className="text-sm text-gray-600">Low Stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{expiringSoon.length}</p>
                    <p className="text-sm text-gray-600">Expiring Soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹{medicines.reduce((total, med) => total + (med.price * med.quantity), 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Medicines ({medicines.length})</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock ({lowStockMedicines.length})</TabsTrigger>
              <TabsTrigger value="expiring">Expiring Soon ({expiringSoon.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-4">
                {filteredMedicines.map((medicine) => (
                  <Card key={medicine.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{medicine.name}</h3>
                            <p className="text-sm text-gray-600">{medicine.category} • Batch: {medicine.batchNumber}</p>
                            <p className="text-sm text-gray-500">Supplier: {medicine.supplier}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">₹{medicine.price}</p>
                            <p className="text-sm text-gray-600">per unit</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(medicine.id, Math.max(0, medicine.quantity - 1))}
                              >
                                -
                              </Button>
                              <span className="font-semibold w-12 text-center">{medicine.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(medicine.id, medicine.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Badge className={getStockStatus(medicine.quantity).color}>
                              {getStockStatus(medicine.quantity).label}
                            </Badge>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Expires</p>
                            <p className="font-medium">{new Date(medicine.expiryDate).toLocaleDateString()}</p>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMedicine(medicine.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="low-stock">
              <div className="grid gap-4">
                {lowStockMedicines.map((medicine) => (
                  <Card key={medicine.id} className="border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-yellow-100 p-3 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{medicine.name}</h3>
                            <p className="text-sm text-gray-600">{medicine.category}</p>
                            <Badge className="bg-yellow-100 text-yellow-800">Low Stock: {medicine.quantity} units</Badge>
                          </div>
                        </div>
                        <Button>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="expiring">
              <div className="grid gap-4">
                {expiringSoon.map((medicine) => (
                  <Card key={medicine.id} className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-red-100 p-3 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{medicine.name}</h3>
                            <p className="text-sm text-gray-600">{medicine.category}</p>
                            <Badge className="bg-red-100 text-red-800">
                              Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{medicine.quantity} units</p>
                          <p className="text-sm text-gray-600">in stock</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Add Medicine Modal */}
          {isAddingMedicine && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Add New Medicine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Medicine Name"
                    value={newMedicine.name || ''}
                    onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                  />
                  <Input
                    placeholder="Category"
                    value={newMedicine.category || ''}
                    onChange={(e) => setNewMedicine({...newMedicine, category: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={newMedicine.quantity || ''}
                    onChange={(e) => setNewMedicine({...newMedicine, quantity: parseInt(e.target.value)})}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price per unit"
                    value={newMedicine.price || ''}
                    onChange={(e) => setNewMedicine({...newMedicine, price: parseFloat(e.target.value)})}
                  />
                  <Input
                    type="date"
                    placeholder="Expiry Date"
                    value={newMedicine.expiryDate || ''}
                    onChange={(e) => setNewMedicine({...newMedicine, expiryDate: e.target.value})}
                  />
                  <Input
                    placeholder="Supplier"
                    value={newMedicine.supplier || ''}
                    onChange={(e) => setNewMedicine({...newMedicine, supplier: e.target.value})}
                  />
                  <Input
                    placeholder="Batch Number"
                    value={newMedicine.batchNumber || ''}
                    onChange={(e) => setNewMedicine({...newMedicine, batchNumber: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <Button onClick={addMedicine}>Add Medicine</Button>
                    <Button variant="outline" onClick={() => setIsAddingMedicine(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;