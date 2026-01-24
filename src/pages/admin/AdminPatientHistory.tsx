import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminPatientHistory } from "@/hooks/useAdmin";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const AdminPatientHistory = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useAdminPatientHistory(patientId || "", page);

  const patient = data?.data?.patient;
  const reports = data?.data?.reports || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "outline", className: "text-amber-500 bg-amber-500/5", icon: Clock },
      requested: { variant: "secondary", icon: AlertCircle },
      reviewed: { variant: "secondary", className: "text-green-500 bg-green-500/5", icon: CheckCircle2 },
    };
    const config = variants[status] || { variant: "default", icon: FileText };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
              onClick={() => navigate("/admin/patients")}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient History</h1>
              <p className="text-muted-foreground">Comprehensive medical record overview</p>
            </div>
          </div>

          {/* Patient Info Card */}
          {patient && (
            <Card className="border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                    {patient.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{patient.fullName}</div>
                    <div className="text-sm text-muted-foreground font-normal">Registered Patient Account</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Email Address</p>
                      <p className="font-medium">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Phone Number</p>
                      <p className="font-medium">{patient.phone || "Not Provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Personal Specs</p>
                      <p className="font-medium capitalize">{patient.gender || "N/A"} • {patient.age ? `${patient.age} years` : "N/A"}</p>
                    </div>
                  </div>
                  {patient.address && (
                    <div className="md:col-span-3 flex items-start gap-2 pt-2 border-t">
                      <MapPin className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Current Address</p>
                        <p className="font-medium">{patient.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Table */}
          <Card className="overflow-hidden border-border bg-card/50">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Medical Reports</h2>
                <p className="text-sm text-muted-foreground italic">Total of {pagination.total} reports uploaded</p>
              </div>
            </div>
            
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10">
                    <TableHead className="px-6">Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Review Status</TableHead>
                    <TableHead className="text-right px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell colSpan={5} className="py-6 px-6">
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : reports.length > 0 ? (
                    reports.map((report: any) => (
                      <TableRow key={report._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/5">
                              <FileText className="h-5 w-5 text-blue-500" />
                            </div>
                            <span className="font-semibold text-foreground">{report.reportName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">{report.reportType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(report.reportDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(report.doctorReview.status)}
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setDialogOpen(true);
                            }}
                          >
                            View Analysis
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-muted-foreground italic">
                        No medical reports found for this patient
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground mx-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Report Info Dialog (Similar to Patient's view) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedReport?.reportName}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Report Date: {selectedReport && new Date(selectedReport.reportDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Report Details</p>
                  <div className="space-y-2">
                    <p className="text-sm flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-semibold">{selectedReport.reportType}</span>
                    </p>
                    <p className="text-sm flex justify-between">
                      <span className="text-muted-foreground">Review Status:</span>
                      {getStatusBadge(selectedReport.doctorReview.status)}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Assigned Doctor</p>
                  <div className="space-y-2">
                    <p className="text-sm flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-semibold">{selectedReport.doctorReview?.doctorId?.fullName || "Not Assigned"}</span>
                    </p>
                    <p className="text-sm flex justify-between">
                      <span className="text-muted-foreground">Reviewed On:</span>
                      <span className="font-semibold">
                        {selectedReport.doctorReview?.reviewedDate 
                          ? new Date(selectedReport.doctorReview.reviewedDate).toLocaleDateString()
                          : "Pending Review"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <AlertCircle className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">AI-Extracted Data Highlights</h4>
                </div>
                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-muted/50 border-b">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${selectedReport.isAbnormal ? 'bg-destructive' : 'bg-green-500'}`} />
                      <span className="text-sm font-semibold">{selectedReport.isAbnormal ? 'Abnormal Findings Detected' : 'Normal Results'}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed max-h-[300px] overflow-y-auto">
                      {JSON.stringify(selectedReport.analyzedData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {selectedReport.doctorReview?.notes && (
                <div className="border-t pt-6">
                  <h4 className="font-bold text-lg mb-3">Doctor's Official Notes</h4>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 italic text-muted-foreground leading-relaxed">
                    "{selectedReport.doctorReview.notes}"
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPatientHistory;
