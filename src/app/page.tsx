export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            CMMC Genie 🧞
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Your AI-powered companion for CMMC compliance journey
          </p>

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
              Currently in development. Check out the{" "}
              <a href="https://github.com/yourusername/cmmc-genie" className="text-primary hover:underline">
                GitHub repository
              </a>
              {" "}for updates.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
