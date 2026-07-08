import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function CustomerForm() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-2xl font-bold">Neuer Kunde</h3>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input placeholder="Firma" />
        <Input placeholder="Ansprechpartner" />
        <Input placeholder="E-Mail" type="email" />
        <Input placeholder="Telefon" />

        <Select>
          <option>Branche wählen</option>
          <option>Handwerk</option>
          <option>Dienstleistung</option>
          <option>Sport / Academy</option>
          <option>Immobilien</option>
          <option>Sonstiges</option>
        </Select>

        <Select>
          <option>Status wählen</option>
          <option>Lead</option>
          <option>Anfrage</option>
          <option>Aktiv</option>
        </Select>
      </div>

      <div className="mt-6 flex justify-end">
        <Button>Kunde anlegen</Button>
      </div>
    </div>
  );
}