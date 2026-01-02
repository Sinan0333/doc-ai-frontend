import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, UserCircle, Stethoscope, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Activity className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Welcome to DocAI
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              AI-Powered Medical Document & Diagnostic Comparison System
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Revolutionizing healthcare with intelligent document analysis, real-time diagnostics,
              and seamless collaboration between patients and doctors.
            </p>
          </div>
        </div>
      </div>

      {/* Portal Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Portal</h2>
          <p className="text-lg text-muted-foreground">
            Select your role to access the appropriate dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Patient Portal */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                  <UserCircle className="h-20 w-20 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Patient Portal</h3>
                <p className="text-muted-foreground mb-6">
                  Access your medical records, upload reports, and track your health journey
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/patient/register" className="block">
                  <Button className="w-full" size="lg">
                    Register as Patient
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/patient/login" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    Patient Login
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Doctor Portal */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-300 group">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 bg-secondary/10 rounded-2xl group-hover:bg-secondary/20 transition-colors">
                  <Stethoscope className="h-20 w-20 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Doctor Portal</h3>
                <p className="text-muted-foreground mb-6">
                  Review patient records, analyze diagnostics, and manage critical alerts
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/doctor/login" className="block">
                  <Button className="w-full" size="lg">
                    Doctor Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools for modern healthcare management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Advanced algorithms analyze medical documents and provide intelligent insights
              </p>
            </Card>

            <Card className="p-6">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Secure Storage</h3>
              <p className="text-muted-foreground">
                Your medical records are encrypted and stored with enterprise-grade security
              </p>
            </Card>

            <Card className="p-6">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Real-Time Collaboration</h3>
              <p className="text-muted-foreground">
                Seamless communication between patients and healthcare providers
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2026 DocAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
