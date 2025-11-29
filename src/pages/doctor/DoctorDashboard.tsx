import { useAuth } from "@/context/AuthContext";
import { useDoctorDashboard } from "@/hooks/useDoctor";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, TrendingUp } from "lucide-react";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDoctorDashboard();

  const recentPatients = dashboardData?.dashboard.recentPatients || [];

  const alerts = [
    {
      id: 1,
      patient: "Jane Smith",
      message: "Abnormal blood pressure reading detected",
      severity: "high",
    },
    {
      id: 2,
      patient: "Michael Brown",
      message: "Lab results require review",
      severity: "medium",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="doctor" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName || user?.name}!</h1>
            <p className="text-primary-foreground/90">
              {dashboardData?.dashboard.pendingReports 
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Total Patients"
                  value={dashboardData?.dashboard.totalPatients?.toString() || "0"}
                  icon={Users}
                  trend="+12 this month"
                  trendUp={true}
                />
                <StatCard
                  title="Reports Awaiting"
                  value={dashboardData?.dashboard.pendingReports?.toString() || "0"}
                  icon={FileText}
                  trend="5 urgent"
                  trendUp={false}
                />
                <StatCard
                  title="Abnormal Cases"
                  value={dashboardData?.dashboard.abnormalCases?.toString() || "0"}
                  icon={AlertTriangle}
                  trend="Needs attention"
                  trendUp={false}
                />
                <StatCard
                  title="Recovery Rate"
                  value="94%"
                  icon={TrendingUp}
                  trend="+3% vs last month"
                  trendUp={true}
                />
              </div>
            </>
          )}

          {/* Alerts Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Priority Alerts</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
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
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Patients */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Patients</h2>
              <Button variant="ghost" size="sm">View All Patients</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Patient Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Last Report
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
                          <Button variant="ghost" size="sm">View Records</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted-foreground">
                        No recent patients
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Patient Visits Trend
              </h3>
              <div className="h-48 flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Graph visualization placeholder</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Diagnostic Distribution
              </h3>
              <div className="h-48 flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Chart visualization placeholder</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
