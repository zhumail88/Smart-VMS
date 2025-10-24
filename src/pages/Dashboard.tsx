import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVisitors } from '@/lib/storage';
import { Visitor } from '@/types/visitor';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserPlus, Users, Clock, TrendingUp, ArrowRight, Shield } from 'lucide-react';
import { format, isToday } from 'date-fns';

const Dashboard = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    setVisitors(getVisitors());
  }, []);

  const todayVisitors = visitors.filter(v => isToday(new Date(v.checkInTime)));
  const activeVisitors = visitors.filter(v => v.status === 'checked-in');
  const preApproved = visitors.filter(v => v.preApproved && v.status !== 'checked-out');

  const recentVisitors = visitors
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-primary rounded-xl p-8 text-primary-foreground shadow-large">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome to Smart VMS
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Manage your society's visitors efficiently and securely
            </p>
          </div>
          <Shield className="h-20 w-20 opacity-20 hidden md:block" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/register">
          <Button className="w-full h-20 text-lg gap-3 shadow-soft hover:shadow-medium transition-all">
            <UserPlus className="h-6 w-6" />
            Register New Visitor
          </Button>
        </Link>
        <Link to="/checkout">
          <Button variant="secondary" className="w-full h-20 text-lg gap-3 shadow-soft hover:shadow-medium transition-all">
            <Clock className="h-6 w-6" />
            Check Out Visitor
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={visitors.length}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Today's Check-ins"
          value={todayVisitors.length}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Currently Inside"
          value={activeVisitors.length}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Pre-Approved"
          value={preApproved.length}
          icon={Shield}
          variant="info"
        />
      </div>

      {/* Recent Visitors */}
      <Card className="shadow-soft">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Visitors</h2>
            <Link to="/visitors">
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {recentVisitors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No visitors yet. Register your first visitor to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {recentVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={visitor.photo}
                      alt={visitor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <p className="font-semibold">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        House {visitor.houseNumber} • {visitor.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      visitor.status === 'checked-in'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {visitor.status === 'checked-in' ? 'Inside' : 'Checked Out'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(visitor.checkInTime), 'p')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
