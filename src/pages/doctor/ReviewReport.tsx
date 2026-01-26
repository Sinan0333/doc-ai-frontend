import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  FileText,
  Download,
  Sparkles,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Send,
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
}

interface Report {
  _id: string;
  reportName: string;
  reportType: string;
  reportDate: string;
  filePath: string;
  analyzedData: any;
  patientId: Patient;
  doctorReview: {
    status: string;
    doctorId?: string;
    reviewedDate?: string;
    notes?: string;
  };
  createdAt: string;
}

const ReviewReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [reportId]);

  const fetchReportDetails = async () => {
    if (!reportId) return;
    
    setLoading(true);
    try {
      // Fetch from review requests list
      const response = await api.get(`/doctor/review-requests?page=1&limit=100`);
      
      if (response.data.success) {
        const foundReport = response.data.data.find((r: Report) => r._id === reportId);
        if (foundReport) {
          setReport(foundReport);
        } else {
          toast({
            title: "Error",
            description: "Report not found",
            variant: "destructive",
          });
          navigate("/doctor/review-requests");
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch report:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch report details",
        variant: "destructive",
      });
      navigate("/doctor/review-requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3009'}/${report.filePath}`;
    link.download = `${report.reportName}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your report is being downloaded",
    });
  };

  const handleSubmitReview = async () => {
    if (!reportId) return;
    
    if (!notes.trim()) {
      toast({
        title: "Review Notes Required",
        description: "Please add your review notes before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/doctor/review-requests/${reportId}/submit`, {
        notes: notes.trim()
      });

      if (response.data.success) {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted successfully",
        });
        navigate("/doctor/review-requests");
      }
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="doctor" />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="doctor" />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/doctor/review-requests")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Review Requests
            </Button>
          </div>

          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold">Review Report</h1>
            <p className="text-muted-foreground">Complete your review for this patient report</p>
          </div>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {report.patientId?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{report.patientId?.fullName}</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {report.patientId?.email}
                      </div>
                      {report.patientId?.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {report.patientId.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {report.patientId?.age && report.patientId?.gender && (
                      <div>
                        <span className="text-muted-foreground">Age / Gender:</span>{" "}
                        <span className="font-medium">
                          {report.patientId.age} / {report.patientId.gender}
                        </span>
                      </div>
                    )}
                    {report.patientId?.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{report.patientId.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground text-sm">Report Name:</span>{" "}
                  <span className="font-semibold">{report.reportName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Type:</span>{" "}
                  <Badge variant="outline" className="ml-2">{report.reportType}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Report Date:</span>{" "}
                  <span className="font-medium">{new Date(report.reportDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Report PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportAnalysisResult 
                data={report.analyzedData} 
                reportName={report.reportName}
                reportType={report.reportType}
              />
            </CardContent>
          </Card>

          {/* Review Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Your Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Review Notes <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Enter your professional review notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Provide your professional assessment, recommendations, and any important observations.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/doctor/review-requests")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={submitting || !notes.trim()}
                  className="gap-2"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReviewReport;
