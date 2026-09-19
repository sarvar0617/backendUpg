const cyrillicTransliteration = {
  А: "A", а: "a", Б: "B", б: "b", В: "V", в: "v", Г: "G", г: "g",
  Д: "D", д: "d", Е: "E", е: "e", Ё: "Yo", ё: "yo", Ж: "Zh", ж: "zh",
  З: "Z", з: "z", И: "I", и: "i", Й: "Y", й: "y", К: "K", к: "k",
  Л: "L", л: "l", М: "M", м: "m", Н: "N", н: "n", О: "O", о: "o",
  П: "P", п: "p", Р: "R", р: "r", С: "S", с: "s", Т: "T", т: "t",
  У: "U", у: "u", Ф: "F", ф: "f", Х: "Kh", х: "kh", Ц: "Ts", ц: "ts",
  Ч: "Ch", ч: "ch", Ш: "Sh", ш: "sh", Щ: "Sch", щ: "sch", Ъ: "", ъ: "",
  Ы: "Y", ы: "y", Ь: "", ь: "", Э: "E", э: "e", Ю: "Yu", ю: "yu",
  Я: "Ya", я: "ya", Є: "Ye", є: "ye", І: "I", і: "i", Ї: "Yi", ї: "yi",
  Ґ: "G", ґ: "g",
};

const transliterate = (value) => [...value]
  .map((character) => cyrillicTransliteration[character] ?? character)
  .join("");

export const slugify = (value) => {
  const normalized = transliterate(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized) return normalized;

  const fallback = [...value]
    .map((character) => character.codePointAt(0).toString(16))
    .join("-");
  return `item-${fallback}`;
};

export const productSlug = (name, sku) => `${slugify(name)}-${slugify(sku)}`;
