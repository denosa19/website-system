import Button from "../components/atoms/Button";
export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold mb-6">
        Internet Firma
      </h1>

      <p className="text-xl text-neutral-300 text-center max-w-2xl">
        Das modulare Website-System für moderne Unternehmen.
      </p>

      <div className="mt-12">
        <Button>Projekt starten</Button>
      </div>
    </main>
  );
}