import {
  AVATAR_COLORS,
  AVATAR_EXPRESSIONS,
  AVATAR_SHAPES,
} from "../../avatar/constants";
import BlobAvatarDisplay from "../BlobAvatarDisplay";
import AvatarOptionRow from "./AvatarOptionRow";

export default function AvatarCustomizer({ avatar, onTraitChange }) {
  return (
    <div className="grid gap-4 border-t border-accent/25 pt-4">
      <AvatarOptionRow
        label="Shape"
        options={AVATAR_SHAPES}
        value={avatar.shape}
        onChange={(value) => onTraitChange("shape", value)}
        renderOption={(shape) => (
          <BlobAvatarDisplay
            avatar={{ ...avatar, shape }}
            userId={1}
            className="size-8"
            label={`${shape} shape`}
          />
        )}
      />

      <AvatarOptionRow
        label="Expression"
        options={AVATAR_EXPRESSIONS}
        value={avatar.expression}
        onChange={(value) => onTraitChange("expression", value)}
        renderOption={(expression) => (
          <BlobAvatarDisplay
            avatar={{ ...avatar, expression }}
            userId={1}
            className="size-8"
            label={`${expression} expression`}
          />
        )}
      />

      <AvatarOptionRow
        label="Color"
        options={AVATAR_COLORS}
        value={avatar.color}
        onChange={(value) => onTraitChange("color", value)}
        getValue={({ value }) => value}
        getLabel={({ name }) => name}
        renderOption={({ value }) => (
          <span
            aria-hidden="true"
            className="size-7 rounded-full border border-white/20"
            style={{ backgroundColor: value }}
          />
        )}
      />
    </div>
  );
}
