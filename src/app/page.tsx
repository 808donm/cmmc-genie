import { auth } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo.png"
              alt="CMMC Genie Logo"
              width={250}
              height={250}
              priority
            />
          </div>
          <h1 className="text-6xl font-bold mb-4">
            CMMC Genie
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Your AI-powered companion for CMMC compliance journey
          </p>

          {/* Call to Action */}
          <div className="mb-12">
            {session ? (
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/dashboard">Go to Dashboard →</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/signin">Get Started →</Link>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <h3 className="text-lg font-semibold mb-2">🎯 Project Management</h3>
              <p className="text-sm text-muted-foreground">
                Kanban boards, GANTT charts, and RACI matrices for comprehensive tracking
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <h3 className="text-lg font-semibold mb-2">🤖 AI Agents</h3>
              <p className="text-sm text-muted-foreground">
                14 specialized agents including policy drafting, C3PAO review, and more
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <h3 className="text-lg font-semibold mb-2">📊 Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Real-time compliance posture, progress tracking, and analytics
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <h3 className="text-lg font-semibold mb-2">📅 Meeting Management</h3>
              <p className="text-sm text-muted-foreground">
                Integrated calendar, transcripts, and AI-generated agendas
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <h3 className="text-lg font-semibold mb-2">🔐 Enterprise Auth</h3>
              <p className="text-sm text-muted-foreground">
                SSO with Microsoft, Google, and Zoom integration
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
              <h3 className="text-lg font-semibold mb-2">📁 Evidence Vault</h3>
              <p className="text-sm text-muted-foreground">
                Secure document storage with control mapping and audit trails
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-muted-foreground">
              Built with Next.js 14, TypeScript, Prisma, and OpenAI
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
