import { ReactChild } from "react";

interface DateOptions extends Intl.DateTimeFormatOptions {
  showTime?: boolean;
  formatBy?:
    | void
    | ((obj: {
        date: string;
        month: string;
        year: string;
        sup: string;
        time: string;
      }) => string | ReactChild);
  addnth?: boolean;
  onError?: (error: string) => string;
}

export const formatLink = (link: string) =>
  link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `https://${link}`;

export const formatPossesiveName = (name: string) =>
  `${name}'${name.endsWith("s") ? "" : "s"}`;

const timeDefaults: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

interface RelativeDateOptions {
  formatBy: (p: {
    desc: { days: string; mins: string };
    diff: { days: number; mins: number };
  }) => string | ReactChild;
}
export const formatRelativeDate = (
  dateObj: Date | string | number,
  options: RelativeDateOptions
): string | ReactChild => {
  if (dateObj === 0) return "NA";
  if (typeof dateObj === "string" || typeof dateObj === "number")
    return formatRelativeDate(new Date(dateObj), options);

  const { formatBy } = options;

  const milliDiff = new Date().getTime() - dateObj.getTime();
  const diff = {
    days: -Math.floor(milliDiff / 1000 / 60 / 60 / 24),
    mins: -Math.floor(milliDiff / 1000 / 60),
  };

  const desc = {
    // prettier-ignore
    days: diff.days === 0 ? 'Today' : diff.days === -1 ? 'Yesterday' : diff.days === 1 ? 'Tomorrow' : `${Math.abs(diff.days)} days ${diff.days > 0 ? 'left' : 'ago'}`,
    mins: `${Math.abs(diff.mins)} mins ${diff.days > 0 ? "left" : "ago"}`,
  };
  return formatBy({ desc, diff });
};

export const formatDate = (
  dateObj: Date | string | number,
  {
    showTime,
    formatBy = ({ date, month, year, time }) =>
      `${date} ${month} ${year}${time && ", "}${time}`,
    addnth,
    onError,
    ...options
  }: DateOptions = {}
): string | ReactChild => {
  if (dateObj === 0) return "NA";
  if (typeof dateObj === "string" || typeof dateObj === "number")
    return formatDate(new Date(dateObj), {
      showTime,
      formatBy,
      addnth,
      onError,
      ...options,
    });

  const opt: DateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(showTime ? timeDefaults : {}),
    ...options,
  };

  const dateString = dateObj.toLocaleDateString("en-IN", opt);

  if (dateString === "Invalid Date") return onError?.(dateString) || dateString;
  const time = dateString.split(", ")[1];

  if (!formatBy) return dateString;

  const [date, month, year] = dateString
    .split(" ")
    .map((i) => i.split("/"))
    .flat();

  const n = getInt(date);

  const nth =
    addnth && n !== null
      ? n === 1 || n === 21 || n === 31
        ? "st"
        : n === 22
        ? "nd"
        : n === 3 || n === 23
        ? "rd"
        : "th"
      : "";

  return formatBy({
    date,
    month,
    year: year.replace(",", ""),
    sup: nth,
    time: time || "",
  });
};

export interface NumberOptions {
  decimals?: number;
  alpha?: boolean;
  forceDecimals?: boolean;
  addnth?: boolean;
}

const alphaValues = [
  { above: 1000, letter: "K" },
  { above: 1000000, letter: "M" },
  { above: 1000000000, letter: "B" },
];

export const formatNumber = (
  n: number,
  {
    decimals,
    alpha = false,
    forceDecimals = false,
    addnth = false,
  }: NumberOptions = {}
) => {
  var [num, suffix] = alpha
    ? alphaValues.reduce(
        ([num, suff], { above, letter }) => [
          Math.abs(n) >= above ? n / above : num,
          Math.abs(n) >= above ? letter : suff,
        ],
        [n, ""]
      )
    : [n, ""];

  const nth = addnth
    ? n === 1
      ? "st"
      : n === 2
      ? "nd"
      : n === 3
      ? "rd"
      : "th"
    : "";

  const ret = Intl.NumberFormat("en", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: forceDecimals ? decimals : 0,
  }).format(num);
  return ret + suffix + nth;
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const replaceMultiple = (
  str: string,
  translator: Record<string, string>
) =>
  Object.entries(translator).reduce(
    (acc, [from, to]) => acc.replace(from, to),
    str
  );

export const sentencize = (
  str: string = "",
  {
    splitter,
    joiner,
    translator = {},
  }: {
    splitter?: string;
    joiner?: string;
    translator?: Record<string, string>;
  } = {}
): string =>
  replaceMultiple(str, translator)
    .split(splitter || "_")
    .map((word) => {
      const capitalised = word === "id" ? "ID" : capitalize(word);
      return capitalised.includes(".")
        ? sentencize(capitalised, { splitter: ".", joiner: "." })
        : capitalised.includes('"')
        ? sentencize(capitalised, { splitter: '"', joiner: '"' })
        : capitalised;
    })
    .join(joiner || " ");

const getInt = (num: string) => {
  try {
    return parseInt(num);
  } catch (error) {
    return null;
  }
};

export const getFloat = (str?: string) => {
  try {
    return parseFloat(str || "0") || 0;
  } catch (error) {
    return 0;
  }
};
