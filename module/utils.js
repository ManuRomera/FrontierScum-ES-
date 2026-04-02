import { FS } from "./config.js";

export const buildRollFormula = (baseFormula, modifier = 0) => {
  const numericModifier = Number(modifier) || 0;
  if (numericModifier < 0) return `${baseFormula}-${Math.abs(numericModifier)}`;
  if (numericModifier > 0) return `${baseFormula}+${numericModifier}`;
  return baseFormula;
};

export const buildD20Formula = ({ mode = "normal", modifier = 0 } = {}) => {
  const baseFormula =
    mode === "advantage"
      ? "2d20kh"
      : mode === "disadvantage"
        ? "2d20kl"
        : "1d20";
  return buildRollFormula(baseFormula, modifier);
};

export const getAbilityLabel = (ability) => {
  const config = FS.abilities[ability];
  return config ? config.label : ability;
};

export const getActiveD20Result = (roll) => {
  const d20 = roll?.dice?.find((die) => die.faces === 20);
  return d20?.results?.find((result) => result.active)?.result ?? null;
};

export const formatRollResult = (roll) => {
  if (!roll) return "";
  return roll.result.replaceAll("+  -", "-").replaceAll("+ -", "-");
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const numberOr = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

export const optionList = (values, formatter = (value) => value, selected = null) =>
  values
    .map(
      (value) =>
        `<option value="${value}" ${value === selected ? "selected" : ""}>${formatter(value)}</option>`,
    )
    .join("");

export const normalizeRollFormula = (formula = "") =>
  String(formula)
    .trim()
    .replace(/(^|[+\-*/( ])d(\d+)/gi, "$11d$2")
    .replace(/(\d*)d(\d+)\s*!/gi, (_, count, faces) => `${count || 1}d${faces}x=${faces}`);

export const waitForDialog = ({ title, content, okLabel, cancelLabel, parse }) =>
  new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    new Dialog(
      {
        title,
        content: `<div class="fs-dialog-shell">${content}</div>`,
        buttons: {
          ok: {
            label: okLabel ?? "Tirar",
            callback: (html) => finish(parse(html)),
          },
          cancel: {
            label: cancelLabel ?? "Cancelar",
            callback: () => finish(null),
          },
        },
        default: "ok",
        close: () => finish(null),
      },
      {
        classes: ["frontierscum-dialog"],
      },
    ).render(true);
  });

export const createChatFlavor = ({
  title,
  subtitle = "",
  outcome = "",
  details = "",
  footer = "",
}) => `
  <div class="fs-chat-card">
    <div class="fs-chat-title">${title}</div>
    ${subtitle ? `<div class="fs-chat-subtitle">${subtitle}</div>` : ""}
    ${outcome ? `<div class="fs-chat-outcome">${outcome}</div>` : ""}
    ${details ? `<div class="fs-chat-details">${details}</div>` : ""}
    ${footer ? `<div class="fs-chat-footer">${footer}</div>` : ""}
  </div>
`;

export const slotKeys = (prefix, count) =>
  Array.from({ length: count }, (_, index) => `${prefix}${index + 1}`);
