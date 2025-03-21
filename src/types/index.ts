import { expect } from 'vitest';

// Inspired by https://github.com/type-challenges/type-challenges/blob/master/utils/index.d.ts
export type Assert<T> = T extends undefined ? never : T;
export type Expect<T extends true> = T;
export type Not<X> = X extends true ? false : true;
export type Extends<X, Y> = Y extends X ? true : false;
export type HasKey<T, K extends string> = K extends keyof T ? true : false;

// eslint-disable-next-line
export const tt: <T>() => () => any = () => () => expect(true).toBe(true);
