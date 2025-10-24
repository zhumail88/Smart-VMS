import { useEffect, useState } from 'react';
import { getVisitors } from '@/lib/storage';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, TrendingUp, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isToday, isThisWeek, differenceInMinutes, format, parseISO } from 'date-fns';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    weeklyVisitors: 0,
    activeVisitors: 0,
    avgStayTime: 0,
    purposeDistribution: [] as { purpose: string; count: number }[],
    peakHours: [] as { hour: string; count: number }[],
  });

  useEffect(() => {
    const visitors = getVisitors();
    
    const todayVisitors = visitors.filter(v => isToday(new Date(v.checkInTime)));
    const weeklyVisitors = visitors.filter(v => isThisWeek(new Date(v.checkInTime)));
    const activeVisitors = visitors.filter(v => v.status === 'checked-in');

    // Calculate average stay time
    const completedVisits = visitors.filter(v => v.checkOutTime);
    const totalStayMinutes = completedVisits.reduce((sum, v) => {
      const duration = differenceInMinutes(
        new Date(v.checkOutTime!),
        new Date(v.checkInTime)
      );
      return sum + duration;
    }, 0);
    const avgStayTime = completedVisits.length > 0 
      ? Math.round(totalStayMinutes / completedVisits.length) 
      : 0;

    // Purpose distribution
    const purposeMap = new Map<string, number>();
    visitors.forEach(v => {
      purposeMap.set(v.purpose, (purposeMap.get(v.purpose) || 0) + 1);
    });
    const purposeDistribution = Array.from(purposeMap.entries())
      .map(([purpose, count]) => ({ purpose, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Peak hours
    const hourMap = new Map<number, number>();
    visitors.forEach(v => {
      const hour = new Date(v.checkInTime).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });
    const peakHours = Array.from(hourMap.entries())
      .map(([hour, count]) => ({ 
        hour: `${hour.toString().padStart(2, '0')}:00`, 
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalVisitors: visitors.length,
      todayVisitors: todayVisitors.length,
      weeklyVisitors: weeklyVisitors.length,
      activeVisitors: activeVisitors.length,
      avgStayTime,
      purposeDistribution,
      peakHours,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Visitor insights and trends</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Today's Visitors"
          value={stats.todayVisitors}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="This Week"
          value={stats.weeklyVisitors}
          icon={Activity}
          variant="info"
        />
        <StatCard
          title="Currently Inside"
          value={stats.activeVisitors}
          icon={Clock}
          variant="warning"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Average Stay Time</h3>
          <div className="text-center py-8">
            <p className="text-5xl font-bold text-primary mb-2">
              {stats.avgStayTime}
            </p>
            <p className="text-muted-foreground">minutes</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-center">
            <p className="text-muted-foreground">
              Based on {getVisitors().filter(v => v.checkOutTime).length} completed visits
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Peak Hours</h3>
          {stats.peakHours.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No data available yet</p>
          ) : (
            <div className="space-y-3">
              {stats.peakHours.map((item, index) => (
                <div key={item.hour} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{item.hour}</span>
                      <span className="text-sm text-muted-foreground">{item.count} visitors</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.count / stats.peakHours[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Most Common Purposes</h3>
        {stats.purposeDistribution.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No data available yet</p>
        ) : (
          <div className="space-y-4">
            {stats.purposeDistribution.map((item, index) => (
              <div key={item.purpose} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{item.purpose}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} visitors ({Math.round((item.count / stats.totalVisitors) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${(item.count / stats.purposeDistribution[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
