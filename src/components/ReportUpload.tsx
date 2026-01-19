import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from '@/lib/api';

export default function ReportUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [reportName, setReportName] = useState("");
    const [reportType, setReportType] = useState("");
    const [reportDate, setReportDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !reportName || !reportType || !reportDate) {
            toast.error("Please fill in all fields and select a file");
            return;
        }

        const formData = new FormData();
        formData.append('report', file);
        formData.append('reportName', reportName);
        formData.append('reportType', reportType);
        formData.append('reportDate', reportDate);

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/report/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setResult(response.data);
            toast.success("File uploaded and analyzed!");
        } catch (error) {
            console.error(error);
            toast.error("Upload failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mt-10">
            <CardHeader>
                <CardTitle>Upload Medical Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input 
                        id="reportName" 
                        placeholder="e.g. Annual Checkup 2024" 
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="reportType">Report Type</Label>
                        <Select onValueChange={setReportType} value={reportType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Blood Test">Blood Test</SelectItem>
                                <SelectItem value="X-Ray">X-Ray</SelectItem>
                                <SelectItem value="MRI">MRI</SelectItem>
                                <SelectItem value="CT Scan">CT Scan</SelectItem>
                                <SelectItem value="Prescription">Prescription</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reportDate">Report Date</Label>
                        <Input 
                            id="reportDate" 
                            type="date" 
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="picture">Report PDF</Label>
                    <Input id="picture" type="file" accept="application/pdf" onChange={handleFileChange} />
                </div>
                
                <Button onClick={handleUpload} disabled={isLoading} className="w-full">
                    {isLoading ? "Analyzing..." : "Upload & Analyze"}
                </Button>

                {result && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                        <h3 className="font-bold mb-2">Analysis Result:</h3>
                        <pre className="text-xs overflow-auto max-h-96">
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
