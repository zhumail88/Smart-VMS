import { useEffect, useState } from 'react';
import { getVisitors } from '@/lib/storage';
import { Visitor } from '@/types/visitor';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const VisitorLog = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked-in' | 'checked-out'>('all');

  useEffect(() => {
    const allVisitors = getVisitors();
    setVisitors(allVisitors.reverse()); // Most recent first
  }, []);

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.cnic.includes(searchTerm) ||
      visitor.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Pass ID', 'Name', 'CNIC', 'Contact', 'House', 'Purpose', 'Check-in', 'Check-out', 'Status'];
    const rows = filteredVisitors.map(v => [
      v.id,
      v.name,
      v.cnic,
      v.contact,
      v.houseNumber,
      v.purpose,
      format(new Date(v.checkInTime), 'PPpp'),
      v.checkOutTime ? format(new Date(v.checkOutTime), 'PPpp') : 'N/A',
      v.status,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Visitor Log</h1>
          <p className="text-muted-foreground">Complete history of all visitors</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, CNIC, house, or pass ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'checked-in' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('checked-in')}
            >
              Inside
            </Button>
            <Button
              variant={statusFilter === 'checked-out' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('checked-out')}
            >
              Checked Out
            </Button>
          </div>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredVisitors.length} of {visitors.length} visitors
      </div>

      {filteredVisitors.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {visitors.length === 0
                ? 'No visitors registered yet'
                : 'No visitors match your search criteria'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredVisitors.map((visitor) => (
            <Card key={visitor.id} className="p-6 hover:shadow-medium transition-shadow">
              <div className="flex items-start gap-4">
                <img
                  src={visitor.photo}
                  alt={visitor.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{visitor.name}</h3>
                      <p className="text-sm text-muted-foreground">Pass ID: {visitor.id}</p>
                    </div>
                    <Badge
                      variant={visitor.status === 'checked-in' ? 'default' : 'secondary'}
                    >
                      {visitor.status === 'checked-in' ? 'Inside' : 'Checked Out'}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">CNIC:</span>{' '}
                      <span className="font-medium">{visitor.cnic}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contact:</span>{' '}
                      <span className="font-medium">{visitor.contact}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">House:</span>{' '}
                      <span className="font-medium">{visitor.houseNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resident:</span>{' '}
                      <span className="font-medium">{visitor.residentName}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Purpose:</span>{' '}
                      <span className="font-medium">{visitor.purpose}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Check-in:</span>{' '}
                      <span className="font-medium">
                        {format(new Date(visitor.checkInTime), 'PPp')}
                      </span>
                    </div>
                    {visitor.checkOutTime && (
                      <div>
                        <span className="text-muted-foreground">Check-out:</span>{' '}
                        <span className="font-medium">
                          {format(new Date(visitor.checkOutTime), 'PPp')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitorLog;
