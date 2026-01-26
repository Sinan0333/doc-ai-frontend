import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, User, Calendar, AlertTriangle, Activity } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";

interface ReportDetailModalProps {
  reportId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDetailModal({ reportId, isOpen, onClose }: ReportDetailModalProps) {
  const queryClient = useQueryClient();
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["report", reportId],
    queryFn: async () => {
      if (!reportId) return null;
      const res = await api.get(`/report/${reportId}`);
      return res.data.data;
    },
    enabled: !!reportId && isOpen,
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await api.get("/patient/doctors");
      return res.data.data;
    },
    enabled: isOpen && report?.doctorReview?.status === 'pending',
  });

  const requestReviewMutation = useMutation({
    mutationFn: async (doctorId: string) => {
      await api.post(`/report/${reportId}/review`, { doctorId });
    },
    onSuccess: () => {
      toast.success("Review requested successfully");
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      queryClient.invalidateQueries({ queryKey: ["history"] }); // Refresh history list if needed
    },
    onError: () => {
      toast.error("Failed to request review");
    }
  });

  const handleDownload = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${api.defaults.baseURL}/report/${reportId}/download`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.reportName || 'report'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (e) {
        toast.error("Failed to download report");
    }
  };

  const handleRequestReview = () => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor");
      return;
    }
    requestReviewMutation.mutate(selectedDoctor);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {report?.reportName || "Loading..."}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading details...</div>
        ) : error ? (
            <div className="p-8 text-center text-red-500">Failed to load report.</div>
        ) : report ? (
          <ScrollArea className="flex-1 pr-4 overflow-y-auto">
            <div className="space-y-6 p-1">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block">Type</span>
                  <span className="font-medium">{report.reportType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Date</span>
                  <span className="font-medium">{format(new Date(report.reportDate), "PPP")}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block">Status</span>
                     <Badge variant={report.doctorReview?.status === 'reviewed' ? 'default' : 'secondary'}>
                        {report.doctorReview?.status === 'reviewed' ? 'Reviewed' : 
                         report.doctorReview?.status === 'requested' ? 'Review Requested' : 'Analysis Complete'}
                     </Badge>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-muted/30 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">✨</span> AI Summary
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {report.analyzedData?.summary || "No summary available."}
                </p>
                
                {/* Red Flags */}
                {report.analyzedData?.redFlags && report.analyzedData.redFlags.length > 0 && (
                     <div className="mt-3">
                        <h4 className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Critical Findings
                        </h4>
                        <ul className="text-xs list-disc pl-4 text-red-600/80">
                            {report.analyzedData.redFlags.map((flag: string, i: number) => (
                                <li key={i}>{flag}</li>
                            ))}
                        </ul>
                     </div>
                )}
              </div>

              {/* Detailed Parameters */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" /> Detailed Parameters
                </h3>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="py-2 h-auto text-xs">Parameter</TableHead>
                        <TableHead className="py-2 h-auto text-xs">Value</TableHead>
                        <TableHead className="py-2 h-auto text-xs">Unit</TableHead>
                        <TableHead className="py-2 h-auto text-xs">Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {report.analyzedData?.parameters && report.analyzedData.parameters.length > 0 ? (
                            report.analyzedData.parameters.map((param: any, index: number) => (
                                <TableRow key={index} className="hover:bg-accent/50 transition-colors">
                                    <TableCell className="py-2 font-medium text-xs">{param.name}</TableCell>
                                    <TableCell className="py-2 text-xs">
                                        <span className={report.analyzedData.redFlags?.some((flag: string) => flag.toLowerCase().includes(param.name.toLowerCase())) ? "text-red-600 font-bold" : ""}>
                                            {param.value}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-muted-foreground">{param.unit}</TableCell>
                                    <TableCell className="py-2 text-xs">
                                        <Badge variant="secondary" className="font-normal text-[10px] px-1 py-0 h-4">
                                            {param.category}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-16 text-xs text-muted-foreground">
                                    No detailed parameters extracted.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
              </div>


              {/* Doctor Review Section */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" /> Doctor Review
                </h3>
                
                {report.doctorReview?.status === 'reviewed' ? (
                     <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-start">
                             <div>
                                <span className="font-medium block">{report.doctorReview.doctorId?.fullName || "Doctor"}</span>
                                <span className="text-xs text-muted-foreground">{report.doctorReview.doctorId?.specialist || "Specialist"}</span>
                             </div>
                             {report.doctorReview.reviewedDate && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(report.doctorReview.reviewedDate), "PP")}
                                </span>
                             )}
                        </div>
                        <div className="bg-secondary/20 p-3 rounded text-sm italic">
                            "{report.doctorReview.notes}"
                        </div>
                     </div>
                ) : report.doctorReview?.status === 'requested' ? (
                     <div className="text-center py-4 text-muted-foreground text-sm">
                        Waiting for review from chosen doctor.
                     </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Doctor for Review</Label>
                            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a doctor..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors?.map((doc: any) => (
                                        <SelectItem key={doc._id} value={doc._id}>
                                            {doc.fullName} ({doc.specialist})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button 
                            className="w-full" 
                            onClick={handleRequestReview}
                            disabled={!selectedDoctor || requestReviewMutation.isPending}
                        >
                            {requestReviewMutation.isPending ? "Requesting..." : "Request Review"}
                        </Button>
                    </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : null}

        <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={handleDownload} disabled={!report || isLoading}>
                <Download className="h-4 w-4 mr-2" /> Download Report
            </Button>
            <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
