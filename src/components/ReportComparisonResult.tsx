import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    AlertTriangle, 
    CheckCircle2, 
    ArrowUpRight, 
    ArrowDownRight, 
    Minus, 
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Activity
} from "lucide-react";

interface ParameterChange {
    name: string;
    prevValue: string;
    newValue: string;
    unit: string;
    changeType: 'improvement' | 'deterioration' | 'stable' | 'new';
    insight: string;
}

interface ComparisonData {
    summary: string;
    parameterChanges: ParameterChange[];
    redFlagsStatus: {
        resolved: string[];
        persisting: string[];
        new: string[];
    };
    recommendations: string[];
}

interface ReportComparisonResultProps {
    data: ComparisonData;
    report1Name: string;
    report2Name: string;
}

export default function ReportComparisonResult({ data, report1Name, report2Name }: ReportComparisonResultProps) {
    if (!data) return null;

    const getChangeIcon = (type: string) => {
        switch (type) {
            case 'improvement': return <TrendingUp className="h-4 w-4 text-green-500" />;
            case 'deterioration': return <TrendingDown className="h-4 w-4 text-destructive" />;
            case 'stable': return <Minus className="h-4 w-4 text-blue-500" />;
            case 'new': return <Activity className="h-4 w-4 text-purple-500" />;
            default: return null;
        }
    };

    const getChangeBadge = (type: string) => {
        switch (type) {
            case 'improvement': return <Badge className="bg-green-500/10 text-green-600 border-green-200">Improvement</Badge>;
            case 'deterioration': return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Deterioration</Badge>;
            case 'stable': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200">Stable</Badge>;
            case 'new': return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">New Parameter</Badge>;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Executive Summary */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        AI Analysis Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-muted-foreground leading-relaxed italic">
                        "{data.summary}"
                    </p>
                </CardContent>
            </Card>

            {/* Parameter Comparison Table */}
            <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Key Parameter Trends
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10">
                                <TableHead className="w-[200px]">Parameter</TableHead>
                                <TableHead className="text-center">{report1Name}</TableHead>
                                <TableHead className="text-center">{report2Name}</TableHead>
                                <TableHead className="text-center">Trend</TableHead>
                                <TableHead className="hidden md:table-cell">Insight</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.parameterChanges.map((change, index) => (
                                <TableRow key={index} className="hover:bg-accent/30 transition-colors">
                                    <TableCell className="font-semibold">{change.name}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{change.prevValue} {change.unit}</TableCell>
                                    <TableCell className="text-center font-medium">{change.newValue} {change.unit}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            {getChangeIcon(change.changeType)}
                                            <span className="text-[10px] uppercase font-bold tracking-tight">
                                                {change.changeType}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs">
                                        {change.insight}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Red Flags Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-green-100 bg-green-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-green-700 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Resolved Concerns
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.redFlagsStatus.resolved.length > 0 ? (
                            <ul className="space-y-1">
                                {data.redFlagsStatus.resolved.map((item, i) => (
                                    <li key={i} className="text-sm text-green-600/80 flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-green-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground italic">None identified</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-yellow-100 bg-yellow-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-yellow-700 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Persisting Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.redFlagsStatus.persisting.length > 0 ? (
                            <ul className="space-y-1">
                                {data.redFlagsStatus.persisting.map((item, i) => (
                                    <li key={i} className="text-sm text-yellow-600/80 flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-yellow-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground italic">None identified</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-destructive/10 bg-destructive/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> New Red Flags
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.redFlagsStatus.new.length > 0 ? (
                            <ul className="space-y-1">
                                {data.redFlagsStatus.new.map((item, i) => (
                                    <li key={i} className="text-sm text-destructive/80 flex items-center gap-2 font-semibold">
                                        <span className="h-1 w-1 rounded-full bg-destructive" /> {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground italic">None identified</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations Section */}
            <Card className="border-none shadow-md bg-accent/10">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        AI Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-3 p-4 bg-background rounded-xl border-accent/20 border shadow-sm">
                                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                    {i + 1}
                                </span>
                                <p className="text-sm text-foreground/80 leading-snug">{rec}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-xs text-muted-foreground italic justify-center pt-4">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                This trend analysis is powered by AI and should be verified by your healthcare provider.
            </div>
        </div>
    );
}
