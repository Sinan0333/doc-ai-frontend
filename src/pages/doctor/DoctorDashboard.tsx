import { useAuth } from "@/context/AuthContext";
import { useDoctorDashboard } from "@/hooks/useDoctor";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDoctorDashboard();
  const navigate = useNavigate()

  const recentPatients = dashboardData?.dashboard.recentPatients || [];
  
  // Format monthly stats for the trend chart
  const trendData = dashboardData?.dashboard.monthlyStats?.map((stat: any) => ({
    name: new Date(2000, stat._id.month - 1).toLocaleString('default', { month: 'short' }),
    count: stat.count
  })) || [];

  // Format diagnostic stats for the pie chart
  const diagnosticData = dashboardData?.dashboard.diagnosticStats?.map((stat: any) => ({
    name: stat._id,
    value: stat.count
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="doctor" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}!</h1>
            <p className="text-primary-foreground/90">
              {dashboardData?.dashboard.pendingReports !== undefined
                ? `You have ${dashboardData.dashboard.pendingReports} pending reviews and ${dashboardData.dashboard.abnormalCases} urgent alerts today.`
                : "Your dashboard is ready."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Patients"
                  value={dashboardData?.dashboard.totalPatients?.toString() || "0"}
                  icon={Users}
                  trend="Total in system"
                  trendUp={true}
                />
                <StatCard
                  title="Reports Awaiting"
                  value={dashboardData?.dashboard.pendingReports?.toString() || "0"}
                  icon={FileText}
                  trend="Allocated to you"
                  trendUp={false}
                />
                <StatCard
                  title="Abnormal Cases"
                  value={dashboardData?.dashboard.abnormalCases?.toString() || "0"}
                  icon={AlertTriangle}
                  trend="Needs attention"
                  trendUp={false}
                />
                {/* <StatCard
                  title="Recovery Rate"
                  value="94%"
                  icon={TrendingUp}
                  trend="+3% vs last month"
                  trendUp={true}
                /> */}
              </div>

              {/* Analytics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Patient Visits Trend
                  </h3>
                  <div className="h-64 w-full">
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                            itemStyle={{ color: 'hsl(var(--primary))' }}
                          />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">No trend data available yet</p>
                      </div>
                    )}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Diagnostic Distribution
                  </h3>
                  <div className="h-64 w-full">
                    {diagnosticData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={diagnosticData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {diagnosticData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">No diagnostic data available</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Alerts Section */}
              {dashboardData?.dashboard.priorityAlerts && dashboardData.dashboard.priorityAlerts.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Priority Alerts</h2>
                    {/* <Button variant="ghost" size="sm">View All</Button> */}
                  </div>
                  <div className="space-y-3">
                    {dashboardData.dashboard.priorityAlerts.map((alert: any) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.severity === "high"
                            ? "bg-destructive/10 border-destructive"
                            : "bg-warning/10 border-warning"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{alert.patient}</p>
                            <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                          </div>
                          {/* <Button size="sm" variant="outline">Review</Button> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                  <Button onClick={() => navigate('/doctor/patients')} variant="ghost" size="sm">View All</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Patient Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.length > 0 ? (
                        recentPatients.map((patient) => (
                          <tr key={patient.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-4 px-4">
                              <span className="font-medium text-foreground">{patient.name}</span>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">{patient.lastReport}</td>
                            <td className="py-4 px-4">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/doctor/patients/${patient.id}/history`)}>View Records</Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-muted-foreground">
                            No recent activity
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
