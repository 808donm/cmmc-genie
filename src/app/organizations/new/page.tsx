import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { NewOrganizationForm } from "./new-organization-form";
import { getMspOrganization } from "@/lib/msp/utils";

export default async function NewOrganizationPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get MSP organization for parent relationship
  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    return <div>No MSP organization found. Only MSP users can create client organizations.</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Add New Client Organization</h1>
        <p className="mt-2 text-slate-600">
          Create a new client organization to manage their CMMC compliance journey
        </p>
      </div>

      <NewOrganizationForm mspOrganizationId={mspOrg.id} />
    </div>
  );
}
