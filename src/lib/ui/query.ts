export type Range = [min: number, max: number];
export type RangeMap<T> = Record<keyof T, Range>
export type NameMap<T> = Record<keyof T, string>;
