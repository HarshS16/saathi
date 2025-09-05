import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Package, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Pill
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';

interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  pharmacyName: string;
  available: boolean;
}

const MedsAvailabilityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMedicines = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a medicine name');
      return;
    }

    setIsSearching(true);
    try {
      // Mock API call - replace with actual backend call
      setTimeout(() => {
        const mockResults: Medicine[] = [
          {
            id: '1',
            name: 'Paracetamol 500mg',
            category: 'Pain Relief',
            quantity: 150,
            price: 2.50,
            pharmacyName: 'City Pharmacy',
            available: true
          },
          {
            id: '2',
            name: 'Paracetamol 650mg',
            category: 'Pain Relief',
            quantity: 0,
            price: 3.00,
            pharmacyName: 'Health Plus Pharmacy',
            available: false
          },
          {
            id: '3',
            name: 'Paracetamol Syrup',
            category: 'Pain Relief',
            quantity: 25,
            price: 5.00,
            pharmacyName: 'MedSupply Co.',
            available: true
          }
        ].filter(med => 
          med.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(mockResults);
        setIsSearching(false);
        toast.success(`Found ${mockResults.length} results`);
      }, 1000);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search medicines');
      setIsSearching(false);
    }
  };

  const requestMedicine = async (medicineId: string, pharmacyName: string) => {
    try {
      // Mock API call to notify pharmacist
      toast.success(`Request sent to ${pharmacyName} for restocking`);
    } catch (error) {
      toast.error('Failed to send request');
    }
  };

  const getAvailabilityBadge = (medicine: Medicine) => {
    if (medicine.available && medicine.quantity > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Available ({medicine.quantity})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Out of Stock
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Availability</h1>
            <p className="text-gray-600">Search for medicines and check availability across pharmacies</p>
          </div>

          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Medicines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter medicine name (e.g., Paracetamol)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchMedicines()}
                  className="flex-1"
                />
                <Button 
                  onClick={searchMedicines}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((medicine) => (
                    <div key={medicine.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Pill className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{medicine.name}</h3>
                            <p className="text-sm text-gray-600">{medicine.category}</p>
                            <p className="text-sm text-gray-500">Available at: {medicine.pharmacyName}</p>
                          </div>
                        </div>
                        {getAvailabilityBadge(medicine)}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-semibold text-green-600">₹{medicine.price}</span>
                          <span className="text-sm text-gray-600 ml-1">per unit</span>
                        </div>

                        {!medicine.available || medicine.quantity === 0 ? (
                          <Button
                            onClick={() => requestMedicine(medicine.id, medicine.pharmacyName)}
                            variant="outline"
                            size="sm"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Request Restock
                          </Button>
                        ) : (
                          <Button size="sm">
                            <Package className="h-4 w-4 mr-2" />
                            Contact Pharmacy
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {searchResults.length === 0 && searchTerm && !isSearching && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No medicines found for "{searchTerm}"</p>
                <p className="text-sm text-gray-500 mt-2">Try searching with a different name or check spelling</p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">How it works</p>
                  <ul className="space-y-1">
                    <li>• Search for any medicine by name</li>
                    <li>• Check real-time availability across pharmacies</li>
                    <li>• Request restocking if medicine is unavailable</li>
                    <li>• Contact pharmacy directly for available medicines</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedsAvailabilityPage;