export const firstUpperCase = (str: string): string => {
  if (!str) {
    return "";
  }
  return [str.substring(0, 1).toUpperCase(), str.substring(1)].join("");
};

export const toLabelWord = (str: string): string => {
  return str.replace(/\B([A-Z])/g, "-$1").split(/[-|_]/).map((s: string) => firstUpperCase(s)).join(" ");
};
