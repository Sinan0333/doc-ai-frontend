import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowLeft,
  FileText,
  Calendar,
  Filter,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ReportAnalysisResult from "@/components/ReportAnalysisResult";

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: number;
  address?: string;
  createdAt: string;
}

interface Report {
  _id: string;
  reportName: string;
  reportType: string;
  reportDate: string;
  filePath: string;
  analyzedData: any;
  doctorReview: {
    status: "pending" | "requested" | "reviewed";
    doctorId?: string;
    reviewedDate?: string;
    notes?: string;
  };
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const PatientHistory = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPatientHistory = async (page = 1) => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      if (search) params.append("search", search);
      if (reportType !== "all") params.append("reportType", reportType);

      const response = await api.get(
        `/doctor/patients/${patientId}/history?${params.toString()}`
      );
      
      if (response.data.success) {
        setPatient(response.data.data.patient);
        setReports(response.data.data.reports);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error("Failed to fetch patient history:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch patient history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatientHistory(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, reportType, patientId]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchPatientHistory(newPage);
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      requested: "default",
      reviewed: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="doctor" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/doctor/patients")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Patient List
            </Button>
          </div>

          {/* Patient Info Card */}
          {patient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {patient.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-2xl">{patient.fullName}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      Patient Medical History
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{patient.email}</span>
                  </div>
                  {patient.phone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{patient.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Age/Gender:</span>{" "}
                    <span className="font-medium">
                      {patient.age} / {patient.gender}
                    </span>
                  </div>
                  {patient.address && (
                    <div className="md:col-span-3">
                      <span className="text-muted-foreground">Address:</span>{" "}
                      <span className="font-medium">{patient.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medical Reports ({pagination.total})
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Blood Test">Blood Test</SelectItem>
                    <SelectItem value="X-Ray">X-Ray</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="CT Scan">CT Scan</SelectItem>
                    <SelectItem value="Prescription">Prescription</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Review Status</TableHead>
                    <TableHead>Uploaded On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : reports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <FileText className="h-8 w-8" />
                          <p>No medical reports found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell className="font-medium">
                          {report.reportName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.reportType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(report.reportDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(report.doctorReview.status)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(report)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-end space-x-2 p-4 border-t">
                <div className="text-sm text-muted-foreground mr-4">
                  Page {pagination.page} of {pagination.pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Report Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReport?.reportName}</DialogTitle>
            <DialogDescription>
              Report Date: {selectedReport && new Date(selectedReport.reportDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <Badge variant="outline">{selectedReport.reportType}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Review Status:</span>{" "}
                  {getStatusBadge(selectedReport.doctorReview.status)}
                </div>
              </div>

              <div className="border-t pt-4">
                <ReportAnalysisResult 
                  data={selectedReport.analyzedData} 
                  reportName={selectedReport.reportName}
                  reportType={selectedReport.reportType}
                />
              </div>

              {selectedReport.doctorReview.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Doctor's Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.doctorReview.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientHistory;
