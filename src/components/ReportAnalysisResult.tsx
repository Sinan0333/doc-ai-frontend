import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, FileText, Activity } from "lucide-react";

interface Parameter {
    name: string;
    value: string;
    unit: string;
    category: string;
}

interface AnalysisData {
    reportDate: string;
    summary: string;
    parameters: Parameter[];
    redFlags: string[];
}

interface ReportAnalysisResultProps {
    data: AnalysisData;
    reportName: string;
    reportType: string;
}

export default function ReportAnalysisResult({ data, reportName, reportType }: ReportAnalysisResultProps) {
    if (!data) return null;

    return (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="h-6 w-6 text-primary" />
                    Analysis Results
                </h2>
                <Badge variant="outline" className="px-3 py-1 text-sm">
                    {reportType}
                </Badge>
            </div>

            {/* Red Flags Alert */}
            {data.redFlags && data.redFlags.length > 0 && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-bold">Critical Findings (Red Flags)</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {data.redFlags.map((flag, index) => (
                                <li key={index} className="text-sm font-medium">{flag}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Summary Card */}
            <Card className="border-none shadow-md bg-gradient-to-br from-background to-accent/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        AI Medical Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                        {data.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <span className="font-semibold text-foreground">Report Date:</span> {data.reportDate}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Parameters Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Detailed Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Parameter</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Category</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.parameters && data.parameters.length > 0 ? (
                                    data.parameters.map((param, index) => (
                                        <TableRow key={index} className="hover:bg-accent/50 transition-colors">
                                            <TableCell className="font-medium">{param.name}</TableCell>
                                            <TableCell>
                                                <span className={data.redFlags.some(flag => flag.toLowerCase().includes(param.name.toLowerCase())) ? "text-destructive font-bold" : ""}>
                                                    {param.value}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{param.unit}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal">
                                                    {param.category}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            No detailed parameters extracted.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground italic px-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                This analysis is generated by AI and should be reviewed by a certified medical professional.
            </div>
        </div>
    );
}
