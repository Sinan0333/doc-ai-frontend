import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeftRight, FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Report {
  _id: string;
  reportName: string;
  reportType: string;
  reportDate: string;
}

const ReportComparison = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [comparing, setComparing] = useState(false);
  
  const [reportId1, setReportId1] = useState<string>("");
  const [reportId2, setReportId2] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await api.get("/report/history?limit=100");
      setReports(response.data.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load your reports");
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCompare = async () => {
    if (!reportId1 || !reportId2) {
      toast.error("Please select two different reports to compare");
      return;
    }

    if (reportId1 === reportId2) {
      toast.error("Please select two different reports");
      return;
    }

    setComparing(true);
    setComparisonResult(null);
    try {
      const response = await api.post("/report/compare", {
        reportId1,
        reportId2,
      });
      if (response.data.success) {
        setComparisonResult(response.data.data.comparison);
        toast.success("Comparison generated successfully");
      }
    } catch (error: any) {
      console.error("Comparison Error:", error);
      toast.error(error.response?.data?.message || "Failed to generate comparison");
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="patient" />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ArrowLeftRight className="h-8 w-8 text-primary" />
              Report Comparison
            </h1>
            <p className="text-muted-foreground">
              Select two reports to see how your health parameters have changed over time with AI analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selection 1 */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  First Report
                </CardTitle>
                <CardDescription>Select the earlier report</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={reportId1} onValueChange={setReportId1}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a report" />
                  </SelectTrigger>
                  <SelectContent>
                    {reports.map((report) => (
                      <SelectItem key={report._id} value={report._id}>
                        {report.reportName} ({format(new Date(report.reportDate), "MMM dd, yyyy")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Selection 2 */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Second Report
                </CardTitle>
                <CardDescription>Select the more recent report</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={reportId2} onValueChange={setReportId2}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a report" />
                  </SelectTrigger>
                  <SelectContent>
                    {reports.map((report) => (
                      <SelectItem key={report._id} value={report._id}>
                        {report.reportName} ({format(new Date(report.reportDate), "MMM dd, yyyy")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleCompare} 
              disabled={comparing || !reportId1 || !reportId2}
              className="px-12 gap-2"
            >
              {comparing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {comparing ? "Analyzing Highlights..." : "Generate AI Comparison"}
            </Button>
          </div>

          {/* Result Section */}
          <div className="pt-4">
            {comparisonResult ? (
              <Card className="border-primary/30 shadow-lg shadow-primary/5 overflow-hidden">
                <CardHeader className="bg-primary/10 border-b border-primary/20">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-6 w-6" />
                    Comparative AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 prose prose-slate max-w-none dark:prose-invert">
                  <ReactMarkdown>{comparisonResult}</ReactMarkdown>
                </CardContent>
              </Card>
            ) : comparing ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-16 w-16 relative">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Comparing Your Health Trends</h3>
                  <p className="text-muted-foreground italic">Our AI is meticulously analyzing key parameter changes...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-3xl opacity-50">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-center">Select two reports above to begin the AI comparison</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportComparison;
