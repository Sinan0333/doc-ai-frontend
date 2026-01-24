import { useState } from "react";
import { useAdminPatients } from "@/hooks/useAdmin";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Mail, Phone, Calendar, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminPatients(page, 10, search);

  const patients = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
              <p className="text-muted-foreground mt-1">Monitor and manage all registered patients</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>

          <Card className="overflow-hidden border-border bg-card/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Patient Name</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Contact Info</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Personal Info</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Joined Date</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="py-8 px-6">
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                        </td>
                      </tr>
                    ))
                  ) : patients.length > 0 ? (
                    patients.map((patient: any) => (
                      <tr key={patient._id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-6 text-left">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-semibold text-foreground">{patient.fullName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-left">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" />
                              {patient.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              {patient.phone || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-left">
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="capitalize">
                              {patient.gender || "N/A"} • {patient.age ? `${patient.age} years` : "N/A"}
                            </p>
                            {patient.address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{patient.address}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-left">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(patient.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/admin/patients/${patient._id}/history`)}
                          >
                            View History
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                        No patients found matching your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(pagination.page * 10, pagination.total)}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span> patients
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "ghost"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientList;
