import { useAuth } from "@/context/AuthContext";
import { usePatientDashboard } from "@/hooks/usePatient";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, Calendar, Upload, History, BarChart3, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PatientDashboard = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = usePatientDashboard();
  const navigate = useNavigate();

  const recentReports = dashboardData?.dashboard.recentReports || [];
  
  // Format health trends for the chart
  const trendData = dashboardData?.dashboard.healthTrends?.map((stat: any) => ({
    name: new Date(2000, stat._id.month - 1).toLocaleString('default', { month: 'short' }),
    count: stat.count
  })) || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="patient" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
            <p className="text-primary-foreground/90">
              Your health dashboard is ready. View your reports and track your medical journey.
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
                  title="Total Reports"
                  value={dashboardData?.dashboard.totalReports?.toString() || "0"}
                  icon={FileText}
                  trend="Uploaded to your account"
                  trendUp={true}
                  infoText="Total number of medical reports you have uploaded to your profile."
                />
                <StatCard
                  title="Risk Alerts"
                  value={dashboardData?.dashboard.riskAlerts?.toString() || "0"}
                  icon={AlertTriangle}
                  trend="Abnormal results"
                  trendUp={false}
                  infoText="Reports identified with abnormal findings or requiring attention."
                />
                <StatCard
                  title="Last Report"
                  value={dashboardData?.dashboard.lastReportDate ? new Date(dashboardData.dashboard.lastReportDate).toLocaleDateString() : "No reports"}
                  icon={Calendar}
                  infoText="Date of your most recently uploaded medical report."
                />
              </div>

              {/* Recent Reports */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Recent Reports</h2>
                  <Button onClick={() => navigate('/patient/history')} variant="ghost" size="sm">View All</Button>
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
                        {/* <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Action
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.length > 0 ? (
                        recentReports.map((report) => (
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
                                    : "bg-destructive/10 text-destructive"
                                }`}
                              >
                                {report.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">{report.doctor}</td>
                            {/* <td className="py-4 px-4">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/patient/report/${report.id}`)}>View</Button>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No recent reports found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Medical Insights */}
              <div className="grid grid-cols-1  gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-foreground">Health Activity</h3>
                    <TooltipProvider>
                      <UiTooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-primary transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[200px] text-xs">Overview of your activity over time based on report uploads and visits.</p>
                        </TooltipContent>
                      </UiTooltip>
                    </TooltipProvider>
                  </div>
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
                        <p className="text-muted-foreground">No activity data available yet</p>
                      </div>
                    )}
                  </div>
                </Card>
                {/* <Card className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Upcoming Appointments</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Follow-up Visit</p>
                        <p className="text-sm text-muted-foreground">Jan 20, 2026 - 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </Card> */}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
