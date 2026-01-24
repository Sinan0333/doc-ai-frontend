import { useAuth } from "@/context/AuthContext";
import { useAdminDashboard } from "@/hooks/useAdmin";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, FileText, Stethoscope, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useAdminDashboard();
  const navigate = useNavigate();

  const stats = dashboardData?.data?.stats || { totalDoctors: 0, totalPatients: 0, totalReports: 0 };
  const recentDoctors = dashboardData?.data?.recentDoctors || [];
  
  const trendData = dashboardData?.data?.reportTrends?.map((stat: any) => ({
    name: new Date(2000, stat._id.month - 1).toLocaleString('default', { month: 'short' }),
    count: stat.count
  })) || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-primary/20">
            <h1 className="text-3xl font-bold mb-2">System Administration</h1>
            <p className="text-white/90">
              Welcome back, {user?.fullName}. Here's an overview of the DocAI system performance.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Total Doctors"
                  value={stats.totalDoctors.toString()}
                  icon={Stethoscope}
                  trend="Medical staff"
                  trendUp={true}
                />
                <StatCard
                  title="Total Patients"
                  value={stats.totalPatients.toString()}
                  icon={Users}
                  trend="Registered users"
                  trendUp={true}
                />
                <StatCard
                  title="Total Reports"
                  value={stats.totalReports.toString()}
                  icon={FileText}
                  trend="Processed by AI"
                  trendUp={true}
                />
                <StatCard
                  title="System Growth"
                  value="12%"
                  icon={TrendingUp}
                  trend="+2% this month"
                  trendUp={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Analytics Section */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Report Generation Trend
                  </h3>
                  <div className="h-64 w-full">
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" tick={{fill: 'hsl(var(--muted-foreground))'}} />
                          <YAxis allowDecimals={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                            itemStyle={{ color: 'hsl(var(--primary))' }}
                          />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">No trend data available yet</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Recent Doctors List */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Recent Doctors Joined</h2>
                    <Button onClick={() => navigate('/admin/doctors')} variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {recentDoctors.length > 0 ? (
                      recentDoctors.map((doctor: any) => (
                        <div key={doctor._id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Stethoscope className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{doctor.fullName}</p>
                              <p className="text-xs text-muted-foreground">{doctor.email}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doctor.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent doctors found
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
