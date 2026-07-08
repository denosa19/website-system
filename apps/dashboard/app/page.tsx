import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <section className="flex-1 p-10">
            <h2 className="text-4xl font-bold">
              Dashboard
            </h2>

            <p className="mt-3 text-neutral-400">
              Willkommen im Internet Firma OS.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Kunden",
                "Projekte",
                "Angebote",
                "KI-Aufgaben",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-neutral-800 p-6"
                >
                  <h3 className="text-neutral-400">
                    {item}
                  </h3>

                  <p className="mt-3 text-4xl font-bold">
                    0
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}