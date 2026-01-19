import Sidebar from "@/components/Sidebar";
import ReportUpload from "@/components/ReportUpload";
import { useAuth } from "@/context/AuthContext";

const UploadReport = () => {
    const { user } = useAuth();
    
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar role="patient" />
            
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-primary-foreground">
                        <h1 className="text-3xl font-bold mb-2">Upload Report</h1>
                        <p className="text-primary-foreground/90">
                            Upload your medical documents for AI analysis.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <ReportUpload />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UploadReport;
