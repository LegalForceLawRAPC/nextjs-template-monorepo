import { formatDate, formatNumber } from "./format";
import { useRouter } from "next/router";

export const getBool = (str: string): boolean => {
  try {
    return !!JSON.parse(str);
  } catch (error) {
    return false;
  }
};

export const getInt = (str: string) => {
  try {
    return parseInt(str) || 0;
  } catch (error) {
    return 0;
  }
};

export const dateKeys: (string | RegExp)[] = [
  "updated_on",
  "payed_on",
  "created_at",
  "created_on",
  /question_(.*)_date/,
  "date",
];

export const dollarKeys: (string | RegExp)[] = [
  /amount/,
  /^(?!.*matters).*total.*/,
];

export const toEpoch = (d: string | number) =>
  Math.floor(new Date(d).getTime() / 1000);

export const fromEpoch = (d: number) =>
  new Date(d * 1000).toISOString().split("T")[0];

export const getNestedValues = (data: any): string[] =>
  data
    ? Object.values(data)
        .map((item: any) =>
          typeof item === "object"
            ? getNestedValues(item).flat()
            : item?.toString()
        )
        .flat()
    : [];

export const getAllkeys = <Item extends Object>(data: Item[]): (keyof Item)[] =>
  data.reduce(
    (acc, curr) => [
      ...acc,
      ...(Object.keys(curr) as (keyof Item)[]).filter(
        (key) => !acc.includes(key) && curr[key] !== undefined
      ),
    ],
    [] as (keyof Item)[]
  );

export const testRegexString = (value: string, keys: (string | RegExp)[]) =>
  keys.find((k) => (typeof k === "string" ? k === value : k.test(value)));

export const stringify = (key: string, value: any): string => {
  if (testRegexString(key, dateKeys)) {
    return formatDate(
      typeof value === "number" ? Number(value) * 1000 : value
    ) as string;
  }
  if (value instanceof Array)
    return value.map((item) => JSON.stringify(item, null, 2)).join("\n");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (key.includes("amount"))
    return `$${formatNumber(value, { decimals: 2, forceDecimals: true })}`;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

export const flattenObject = <Item>(
  data: Item,
  { prefix, isArray }: { prefix?: any; isArray?: boolean } = {}
): Record<any, any> =>
  Object.entries(data ?? {}).reduce((acc, [key, value]: [string, any]) => {
    if (testRegexString(key, dateKeys)) {
      return {
        ...acc,
        [key]: formatDate(Number(value) * 1000, {
          month: "short",
          formatBy: ({ date, month, year, sup }) =>
            `${date}${sup} ${month}, ${year}`,
        }),
      };
    }
    if (value instanceof Array) {
      return {
        ...acc,
        [key]: value.map((item) => JSON.stringify(item, null, 2)).join("\n"),
      };
    }
    if (typeof value === "boolean")
      return {
        ...acc,
        [key]: value ? "Yes" : "No",
      };
    if (typeof value === "object")
      return {
        ...acc,
        ...flattenObject(value, {
          prefix: key,
          isArray: value instanceof Array,
        }),
      };
    return {
      ...acc,
      [prefix ? `${prefix}.${key}` : key]: value,
    };
  }, {} as Record<any, any>);

export const getRoute = ({
  pathname,
  query,
}: Pick<ReturnType<typeof useRouter>, "pathname" | "query">) =>
  Object.entries(query ?? {}).reduce(
    (acc, [key, value]) => acc.replaceAll(`[${key}]`, value?.toString() || ""),
    pathname
  );

export const getLastItem = <T>(arr: T[]): T => arr[arr.length - 1];

export interface Facet {
  count: number;
  value: string;
}

export const parseFacet = (facet?: (string | number)[]): Facet[] | undefined =>
  facet?.reduce(
    (acc, curr) =>
      typeof curr === "string"
        ? { ...acc, prevKey: curr }
        : curr
        ? {
            ...acc,
            record: [
              ...acc.record,
              {
                count: curr,
                value: acc.prevKey,
              },
            ],
          }
        : acc,
    {
      prevKey: "",
      record: [] as Facet[],
    }
  )?.record;
