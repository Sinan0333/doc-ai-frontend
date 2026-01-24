import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDoctorActivity } from "@/hooks/useAdmin";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Stethoscope, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DoctorActivity = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDoctorActivity(doctorId || "", page);

  const doctor = data?.data?.doctor;
  const reports = data?.data?.reports || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/doctors")}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="h-5 w-5 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Doctor Activity</h1>
              </div>
              <p className="text-muted-foreground">
                Viewing activity for <span className="text-foreground font-semibold">{doctor?.fullName || "Doctor"}</span>
              </p>
            </div>
          </div>

          {/* Activity Table */}
          <Card className="overflow-hidden border-border bg-card/50">
            <div className="p-6 border-b border-border bg-muted/20">
              <h2 className="text-xl font-bold text-foreground">Handled Reports</h2>
              <p className="text-sm text-muted-foreground">Total of {pagination.total} reports processed</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Report Info</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Patient</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Review Date</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Alerts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="py-8 px-6">
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                        </td>
                      </tr>
                    ))
                  ) : reports.length > 0 ? (
                    reports.map((report: any) => (
                      <tr key={report._id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/5">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{report.reportName}</p>
                              <p className="text-xs text-muted-foreground">{report.reportType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <div className="text-sm">
                              <p className="font-medium text-foreground">{report.patientId?.fullName}</p>
                              <p className="text-xs text-muted-foreground">{report.patientId?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {report.doctorReview?.status === 'reviewed' ? (
                              <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                                <CheckCircle2 className="h-3 w-3" /> Reviewed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/20 bg-amber-500/5">
                                <Clock className="h-3 w-3" /> Pending
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {report.doctorReview?.reviewedDate 
                              ? new Date(report.doctorReview.reviewedDate).toLocaleDateString()
                              : "N/A"
                            }
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {report.isAbnormal && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" /> Abnormal
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                        No report activity found for this doctor
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground mx-4">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorActivity;
