import AttributeChip from "../../TrackList/components/AttributeChip";
import { parseAttributeValues } from "../utils";

export default function AttributeList({ attribute = "", values = [] }) {
  const parsedValues = parseAttributeValues(values);

  if (!parsedValues.length) return null;

  const label = attribute.charAt(0).toUpperCase() + attribute.slice(1);

  return (
    <div className="grid min-w-0 gap-1.5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start sm:gap-3">
      <p className="text-sm font-semibold text-muted-foreground">
        {label}:
      </p>

      <div className="flex min-w-0 flex-wrap gap-2">
        {parsedValues.map((value) => (
          <AttributeChip key={value} attribute={value} />
        ))}
      </div>
    </div>
  );
}
