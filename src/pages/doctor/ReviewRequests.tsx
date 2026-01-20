import { useState, useEffect } from "react";
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
  FileText,
  Calendar,
  Filter,
  ClipboardList,
  User,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: number;
}

interface ReviewRequest {
  _id: string;
  reportName: string;
  reportType: string;
  reportDate: string;
  filePath: string;
  analyzedData: any;
  patientId: Patient;
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

const ReviewRequests = () => {
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReviewRequests = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      if (reportType !== "all") params.append("reportType", reportType);

      const response = await api.get(`/doctor/review-requests?${params.toString()}`);
      
      if (response.data.success) {
        setRequests(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error("Failed to fetch review requests:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch review requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewRequests(1);
  }, [reportType]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchReviewRequests(newPage);
    }
  };

  const handleViewDetails = (request: ReviewRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="doctor" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Review Requests</h1>
            </div>
          </div>

          {/* Review Requests Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pending Reviews ({pagination.total})
              </CardTitle>
              <div className="flex gap-2">
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
                    <TableHead>Patient</TableHead>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Requested On</TableHead>
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
                  ) : requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <ClipboardList className="h-8 w-8" />
                          <p>No review requests found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {request.patientId?.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold">{request.patientId?.fullName}</div>
                              <div className="text-xs text-muted-foreground">
                                {request.patientId?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{request.reportName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.reportType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(request.reportDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
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

      {/* Request Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.reportName}</DialogTitle>
            <DialogDescription>
              Report Date: {selectedRequest && new Date(selectedRequest.reportDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* Patient Information */}
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">{selectedRequest.patientId?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{selectedRequest.patientId?.email}</span>
                  </div>
                  {selectedRequest.patientId?.phone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{selectedRequest.patientId.phone}</span>
                    </div>
                  )}
                  {selectedRequest.patientId?.age && selectedRequest.patientId?.gender && (
                    <div>
                      <span className="text-muted-foreground">Age/Gender:</span>{" "}
                      <span className="font-medium">
                        {selectedRequest.patientId.age} / {selectedRequest.patientId.gender}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Report Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <Badge variant="outline">{selectedRequest.reportType}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Requested On:</span>{" "}
                  <span className="font-medium">
                    {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* AI Analysis Results */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">AI Analysis Results</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {JSON.stringify(selectedRequest.analyzedData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewRequests;
