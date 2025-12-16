import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { ComplianceControlList } from "@/components/compliance/compliance-control-list";

export default async function CompliancePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";
  const organizationId = session?.user.activeOrganization;

  // Super admins see all controls, regular users see their organization's controls
  const orgFilter = isSuperAdmin ? {} : { organizationId: organizationId || "" };

  // Get all 110 CMMC controls organized by domain
  const allControls = await prisma.cMMCControl.findMany({
    orderBy: [
      { domain: "asc" },
      { id: "asc" },
    ],
  });

  // Group controls by domain
  type Control = typeof allControls[number];
  const controlsByDomain = allControls.reduce((acc: Record<string, Control[]>, control: Control) => {
    if (!acc[control.domain]) {
      acc[control.domain] = [];
    }
    acc[control.domain].push(control);
    return acc;
  }, {} as Record<string, Control[]>);

  // Get all control instances for the organization
  const controlInstances = await prisma.controlInstance.findMany({
    where: {
      project: orgFilter,
    },
    include: {
      control: true,
      evidence: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Create a map of control instances by control ID
  type ControlInstance = typeof controlInstances[number];
  const controlInstanceMap = new Map<string, ControlInstance[]>();
  controlInstances.forEach((instance: ControlInstance) => {
    if (!controlInstanceMap.has(instance.controlId)) {
      controlInstanceMap.set(instance.controlId, []);
    }
    controlInstanceMap.get(instance.controlId)!.push(instance);
  });

  // Calculate overall stats
  const totalControls = allControls.length;
  const compliantControls = Array.from(controlInstanceMap.values()).filter((instances) =>
    instances.some((inst: any) => inst.status === "COMPLIANT")
  ).length;
  const inProgressControls = Array.from(controlInstanceMap.values()).filter((instances) =>
    instances.some((inst: any) => inst.status === "IN_PROGRESS" || inst.status === "IMPLEMENTED" || inst.status === "TESTING")
  ).length;
  const notStartedControls = totalControls - compliantControls - inProgressControls;

  const complianceRate = totalControls > 0 ? (compliantControls / totalControls) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">CMMC Compliance Tracking</h1>
        <p className="mt-2 text-slate-600">
          Track all 110 CMMC controls with evidence submission and approval workflow
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-600">
              {compliantControls} of {totalControls} controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compliantControls}</div>
            <p className="text-xs text-slate-600">Controls fully implemented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressControls}</div>
            <p className="text-xs text-slate-600">Controls being implemented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedControls}</div>
            <p className="text-xs text-slate-600">Controls pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls by domain */}
      <ComplianceControlList
        controlsByDomain={controlsByDomain}
        controlInstanceMap={Object.fromEntries(controlInstanceMap)}
        organizationId={organizationId || ""}
      />
    </div>
  );
}
