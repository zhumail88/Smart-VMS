import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { getVisitorById, updateVisitor } from '@/lib/storage';
import { Visitor } from '@/types/visitor';
import { toast } from 'sonner';
import { Search, LogOut, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CheckOut = () => {
  const [passId, setPassId] = useState('');
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = () => {
    if (!passId.trim()) {
      toast.error('Please enter a pass ID');
      return;
    }

    const foundVisitor = getVisitorById(passId.trim());
    if (foundVisitor) {
      if (foundVisitor.status === 'checked-out') {
        toast.error('This visitor has already checked out');
        setVisitor(foundVisitor);
      } else {
        setVisitor(foundVisitor);
      }
    } else {
      toast.error('Visitor not found. Please check the pass ID');
      setVisitor(null);
    }
  };

  const handleCheckOut = () => {
    if (!visitor) return;

    setIsProcessing(true);
    try {
      updateVisitor(visitor.id, {
        status: 'checked-out',
        checkOutTime: new Date().toISOString(),
      });
      toast.success(`${visitor.name} checked out successfully!`);
      setVisitor({ ...visitor, status: 'checked-out', checkOutTime: new Date().toISOString() });
    } catch (error) {
      toast.error('Failed to check out visitor');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSearch = () => {
    setPassId('');
    setVisitor(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Visitor Check-Out</h1>
          <p className="text-muted-foreground">Scan QR code or enter pass ID manually</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passId">Pass ID / QR Code</Label>
            <div className="flex gap-2">
              <Input
                id="passId"
                value={passId}
                onChange={(e) => setPassId(e.target.value)}
                placeholder="Enter or scan pass ID (e.g., VIS1234567890)"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Use a QR code scanner to automatically fill the pass ID</p>
          </div>
        </div>

        {visitor && (
          <div className="border-t pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={visitor.photo}
                  alt={visitor.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-primary"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{visitor.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium">CNIC:</span> {visitor.cnic}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Contact:</span> {visitor.contact}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">House:</span> {visitor.houseNumber}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Purpose:</span> {visitor.purpose}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-in Time:</span>
                  <span className="font-medium">
                    {format(new Date(visitor.checkInTime), 'PPpp')}
                  </span>
                </div>
                {visitor.checkOutTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-out Time:</span>
                    <span className="font-medium">
                      {format(new Date(visitor.checkOutTime), 'PPpp')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium ${
                    visitor.status === 'checked-in' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {visitor.status === 'checked-in' ? 'Inside Society' : 'Checked Out'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {visitor.status === 'checked-in' ? (
                  <Button
                    onClick={handleCheckOut}
                    disabled={isProcessing}
                    className="flex-1 gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Check Out Visitor'}
                  </Button>
                ) : (
                  <div className="flex-1 bg-success/10 text-success rounded-lg p-4 flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Already Checked Out</span>
                  </div>
                )}
                <Button variant="outline" onClick={resetSearch}>
                  New Search
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CheckOut;
