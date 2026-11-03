import { describe, expect, it } from "vitest";

import {
  avatarPickerReducer,
  createAvatarPickerState,
} from "./avatarPickerState";

const avatar = {
  shape: "circle",
  expression: "neutral",
  color: "#8B5CF6",
  seed: "42",
};

describe("avatar picker state", () => {
  it("updates each configurable trait without changing the others", () => {
    let state = createAvatarPickerState(avatar);
    state = avatarPickerReducer(state, {
      type: "update-trait",
      trait: "shape",
      value: "ghost",
    });
    state = avatarPickerReducer(state, {
      type: "update-trait",
      trait: "expression",
      value: "happy",
    });
    state = avatarPickerReducer(state, {
      type: "update-trait",
      trait: "color",
      value: "#14B8A6",
    });

    expect(state.selected).toEqual({
      ...avatar,
      shape: "ghost",
      expression: "happy",
      color: "#14B8A6",
    });
  });

  it("keeps unsaved selections when customization is collapsed", () => {
    const changed = avatarPickerReducer(createAvatarPickerState(avatar), {
      type: "update-trait",
      trait: "shape",
      value: "heart",
    });
    const expanded = avatarPickerReducer(changed, { type: "toggle-customizing" });
    const collapsed = avatarPickerReducer(expanded, { type: "toggle-customizing" });

    expect(collapsed.isCustomizing).toBe(false);
    expect(collapsed.selected.shape).toBe("heart");
  });
});
