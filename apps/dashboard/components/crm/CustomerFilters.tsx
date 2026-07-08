import Input from "../ui/Input";
import Select from "../ui/Select";

export default function CustomerFilters() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Input placeholder="Kunden suchen..." className="w-full md:max-w-md" />

      <Select>
        <option>Alle Status</option>
        <option>Lead</option>
        <option>Anfrage</option>
        <option>Aktiv</option>
      </Select>
    </div>
  );
}