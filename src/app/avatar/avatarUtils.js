import {
  AVATAR_COLORS,
  AVATAR_EXPRESSIONS,
  AVATAR_SHAPES,
  GUEST_IDENTITY,
} from "./constants";

const COLOR_VALUES = new Set(AVATAR_COLORS.map(({ value }) => value));
const SHAPE_VALUES = new Set(AVATAR_SHAPES);
const EXPRESSION_VALUES = new Set(AVATAR_EXPRESSIONS);
const MAX_SEED = 36 ** 6 - 1;

function hashString(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function traitIndex(hash, length, offset) {
  return hashString(`${hash}:${offset}`) % length;
}

function avatarKey(avatar) {
  return `${avatar.shape}|${avatar.expression}|${avatar.color}|${avatar.seed}`;
}

export function isValidAvatarConfig(avatar) {
  return Boolean(
    avatar &&
      SHAPE_VALUES.has(avatar.shape) &&
      EXPRESSION_VALUES.has(avatar.expression) &&
      COLOR_VALUES.has(String(avatar.color).toUpperCase()) &&
      /^[0-9a-z]{1,6}$/.test(String(avatar.seed)),
  );
}

export function generateDefaultAvatar(userId, salt = 0) {
  const numericId = Number(userId);
  const stableId = Number.isSafeInteger(numericId) && numericId > 0 ? numericId : 1;
  const hash = hashString(`trackfusionweb-avatar:${stableId}:${salt}`);

  return {
    shape: AVATAR_SHAPES[traitIndex(hash, AVATAR_SHAPES.length, "shape")],
    expression:
      AVATAR_EXPRESSIONS[
        traitIndex(hash, AVATAR_EXPRESSIONS.length, "expression")
      ],
    color: AVATAR_COLORS[traitIndex(hash, AVATAR_COLORS.length, "color")].value,
    seed: ((hash % MAX_SEED) + 1).toString(36),
  };
}

export function resolveUserAvatar({ userId, avatar, isGuest = false }) {
  if (isGuest) return GUEST_IDENTITY.avatar;
  if (!userId) return null;

  if (isValidAvatarConfig(avatar)) {
    return { ...avatar, color: avatar.color.toUpperCase(), seed: String(avatar.seed) };
  }

  return generateDefaultAvatar(userId);
}

export function generateAvatarSuggestions(userId, shuffleRound = 0, count = 6) {
  const original = generateDefaultAvatar(userId);
  const suggestions = [original];
  const used = new Set([avatarKey(original)]);
  let candidate = 0;

  while (suggestions.length < count && candidate < count * 20) {
    candidate += 1;
    const avatar = generateDefaultAvatar(
      userId,
      `shuffle-${shuffleRound}-candidate-${candidate}`,
    );
    const key = avatarKey(avatar);
    if (!used.has(key)) {
      used.add(key);
      suggestions.push(avatar);
    }
  }

  return suggestions;
}

export function sameAvatar(left, right) {
  return Boolean(left && right && avatarKey(left) === avatarKey(right));
}
