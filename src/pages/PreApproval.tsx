import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getVisitors, saveVisitor } from '@/lib/storage';
import { Visitor } from '@/types/visitor';
import { toast } from 'sonner';
import { ArrowLeft, UserCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const PreApproval = () => {
  const [preApprovedVisitors, setPreApprovedVisitors] = useState<Visitor[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    contact: '',
    houseNumber: '',
    residentName: '',
    approvedBy: '',
  });

  useEffect(() => {
    loadPreApproved();
  }, []);

  const loadPreApproved = () => {
    const visitors = getVisitors();
    const preApproved = visitors.filter(v => v.preApproved && v.status !== 'checked-out');
    setPreApprovedVisitors(preApproved);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const visitor: Visitor = {
        id: `PRE${Date.now()}`,
        ...formData,
        photo: '', // No photo for pre-approval
        purpose: 'Pre-approved visit',
        status: 'pre-approved',
        checkInTime: new Date().toISOString(),
        preApproved: true,
        approvedBy: formData.approvedBy,
      };

      saveVisitor(visitor);
      toast.success('Visitor pre-approved successfully!');
      
      setFormData({
        name: '',
        cnic: '',
        contact: '',
        houseNumber: '',
        residentName: '',
        approvedBy: '',
      });
      
      loadPreApproved();
    } catch (error) {
      toast.error('Failed to pre-approve visitor');
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Pre-Approval System</h1>
          <p className="text-muted-foreground">Allow residents to pre-approve visitors</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Pre-Approve New Visitor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Visitor Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC / ID *</Label>
              <Input
                id="cnic"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                required
                placeholder="12345-1234567-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number *</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="0300-1234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseNumber">House Number *</Label>
              <Input
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                required
                placeholder="A-123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="residentName">Resident Name *</Label>
              <Input
                id="residentName"
                name="residentName"
                value={formData.residentName}
                onChange={handleChange}
                required
                placeholder="Name of resident"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvedBy">Approved By *</Label>
              <Input
                id="approvedBy"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <Button type="submit" className="w-full gap-2">
              <UserCheck className="h-4 w-4" />
              Pre-Approve Visitor
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Pre-Approved Visitors</h2>
            
            {preApprovedVisitors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No pre-approved visitors yet
              </p>
            ) : (
              <div className="space-y-3">
                {preApprovedVisitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="p-4 bg-muted/50 rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{visitor.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          CNIC: {visitor.cnic}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Pre-Approved
                      </Badge>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        <span className="font-medium">House:</span> {visitor.houseNumber}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Resident:</span> {visitor.residentName}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Approved by:</span> {visitor.approvedBy}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Date:</span>{' '}
                        {format(new Date(visitor.checkInTime), 'PPp')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2">Benefits of Pre-Approval</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Faster entry for expected visitors</li>
              <li>• Reduced wait time at the gate</li>
              <li>• Enhanced security verification</li>
              <li>• Better visitor experience</li>
              <li>• Resident convenience</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PreApproval;
