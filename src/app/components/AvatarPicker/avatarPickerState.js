export function createAvatarPickerState(selected) {
  return {
    selected,
    isCustomizing: false,
    shuffleRound: 0,
  };
}

export function avatarPickerReducer(state, action) {
  switch (action.type) {
    case "toggle-customizing":
      return { ...state, isCustomizing: !state.isCustomizing };
    case "select-avatar":
      return { ...state, selected: action.avatar };
    case "update-trait":
      return {
        ...state,
        selected: { ...state.selected, [action.trait]: action.value },
      };
    case "shuffle":
      return { ...state, shuffleRound: state.shuffleRound + 1 };
    default:
      return state;
  }
}
