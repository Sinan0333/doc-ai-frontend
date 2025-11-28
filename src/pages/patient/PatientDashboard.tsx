import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, Calendar, Upload, History, BarChart3 } from "lucide-react";

const PatientDashboard = () => {
  const { user } = useAuth();

  const recentReports = [
    {
      id: 1,
      name: "Blood Test Report",
      date: "2024-01-15",
      status: "Normal",
      doctor: "Dr. Sarah Smith",
    },
    {
      id: 2,
      name: "X-Ray Chest",
      date: "2024-01-10",
      status: "Review Required",
      doctor: "Dr. Michael Brown",
    },
    {
      id: 3,
      name: "MRI Scan",
      date: "2024-01-05",
      status: "Normal",
      doctor: "Dr. Emily Davis",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="patient" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-primary-foreground/90">
              Your health dashboard is ready. View your reports and track your medical journey.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Reports"
              value="12"
              icon={FileText}
              trend="+2 this month"
              trendUp={true}
            />
            <StatCard
              title="Risk Alerts"
              value="2"
              icon={AlertTriangle}
              trend="Needs attention"
              trendUp={false}
            />
            <StatCard
              title="Last Report"
              value="5 days ago"
              icon={Calendar}
            />
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <Upload className="h-8 w-8 text-primary" />
                <span className="font-semibold">Upload New Report</span>
                <span className="text-xs text-muted-foreground">
                  Add medical documents
                </span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <History className="h-8 w-8 text-primary" />
                <span className="font-semibold">View Medical History</span>
                <span className="text-xs text-muted-foreground">
                  Access past reports
                </span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <span className="font-semibold">Compare Reports</span>
                <span className="text-xs text-muted-foreground">
                  Analyze trends
                </span>
              </Button>
            </div>
          </Card>

          {/* Recent Reports */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Reports</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Report Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{report.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{report.date}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.status === "Normal"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{report.doctor}</td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Medical Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Health Trends</h3>
              <div className="h-48 flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Chart visualization placeholder</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Follow-up Visit</p>
                    <p className="text-sm text-muted-foreground">Jan 20, 2024 - 10:00 AM</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
