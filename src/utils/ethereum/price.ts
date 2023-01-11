import type { Decimal } from "@prisma/client/runtime";

export const formatVal = (v?: string | Decimal) => {
  if (!v) return "0"
  const actual = new Number(v);
  return actual > 1e9
    ? `${actual.toExponential(3).toLocaleUpperCase("en-US")}`
    : actual > 1e6
    ? `${new Number(actual.valueOf()/1e6).toLocaleString("en-US", {maximumSignificantDigits: 4})} M`
    : actual > 1e3
    ? `${actual.toLocaleString("en-US", {maximumSignificantDigits: 5})}`
    : actual.toLocaleString("en-US", {maximumFractionDigits: 3})
}

export const formatFloor = (floor?: Decimal | null) => {
  if (floor === null) return "0"
  const flr = new Number(floor);
  return flr < 1e-6
    ? flr.toExponential(2)
    : flr.toLocaleString("en-US", {maximumFractionDigits: 3})
}