import { auth } from "@/lib/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const reportTypes = [
    {
      id: "compliance",
      name: "Compliance Status Report",
      description: "Overall compliance status across all CMMC controls",
      icon: BarChart3,
    },
    {
      id: "gap-analysis",
      name: "Gap Analysis Report",
      description: "Identify gaps in your CMMC compliance implementation",
      icon: TrendingUp,
    },
    {
      id: "audit-readiness",
      name: "Audit Readiness Report",
      description: "Assessment of readiness for C3PAO audit",
      icon: FileText,
    },
    {
      id: "evidence",
      name: "Evidence Collection Report",
      description: "Summary of evidence collected for compliance controls",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="mt-2 text-slate-600">
          Generate compliance reports and analytics for your organization
        </p>
      </div>

      {/* Report types */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <report.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <CardDescription className="mt-1">{report.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No reports yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Generate your first report to get started with compliance analytics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
