import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { CameraCapture } from '@/components/CameraCapture';
import { saveVisitor } from '@/lib/storage';
import { Visitor } from '@/types/visitor';
import { toast } from 'sonner';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    contact: '',
    purpose: '',
    houseNumber: '',
    residentName: '',
  });
  const [photo, setPhoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photo) {
      toast.error('Please capture visitor photo');
      return;
    }

    setIsSubmitting(true);

    try {
      const visitor: Visitor = {
        id: `VIS${Date.now()}`,
        ...formData,
        photo,
        status: 'checked-in',
        checkInTime: new Date().toISOString(),
        preApproved: false,
      };

      saveVisitor(visitor);
      toast.success('Visitor registered successfully!');
      
      // Navigate to pass page with visitor ID
      navigate(`/pass/${visitor.id}`);
    } catch (error) {
      toast.error('Failed to register visitor');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
          <h1 className="text-3xl font-bold">Register New Visitor</h1>
          <p className="text-muted-foreground">Fill in visitor details and capture photo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter visitor's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC / ID Number *</Label>
                <Input
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 12345-1234567-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 0300-1234567"
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Visit Details</h2>
              
              <div className="space-y-2">
                <Label htmlFor="houseNumber">House / Unit Number *</Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., A-123"
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
                  placeholder="Name of person to visit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Family visit, Delivery, Business meeting"
                  rows={3}
                />
              </div>
            </Card>
          </div>

          <div>
            <CameraCapture
              onCapture={setPhoto}
              capturedImage={photo}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link to="/">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Registering...' : 'Register & Generate Pass'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
