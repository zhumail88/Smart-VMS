import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getVisitorById } from '@/lib/storage';
import { Visitor } from '@/types/visitor';
import { VisitorPass } from '@/components/VisitorPass';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Home } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

const VisitorPassPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const passRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const foundVisitor = getVisitorById(id);
      if (foundVisitor) {
        setVisitor(foundVisitor);
      } else {
        toast.error('Visitor not found');
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handlePrint = useReactToPrint({
    contentRef: passRef,
    documentTitle: `Visitor Pass - ${visitor?.name}`,
    onAfterPrint: () => toast.success('Pass printed successfully!'),
  });

  if (!visitor) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading visitor pass...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Visitor Pass Generated</h1>
            <p className="text-muted-foreground">Print or save this pass for the visitor</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Pass
          </Button>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-large p-8">
        <VisitorPass ref={passRef} visitor={visitor} />
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-2">Instructions</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Print this pass and give it to the visitor</li>
          <li>The visitor must carry this pass at all times</li>
          <li>Scan the QR code at exit for automatic check-out</li>
          <li>This pass is valid for single entry only</li>
        </ul>
      </div>
    </div>
  );
};

export default VisitorPassPage;
