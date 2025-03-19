import { getClassMethods, isPlainObject } from '@noeldemartin/utils';
import { vi } from 'vitest';
import type { Obj } from '@noeldemartin/utils';

export type Mock<T> = T;

export function mock<T extends object>(instance?: T | Obj | object): Mock<T>;
export function mock<T extends object>(methods: string[], instance?: T | Obj | object): Mock<T>;
export function mock<T extends object>(
    methodsOrInstance: string[] | T | Obj | object = [],
    defaultInstance: T | Obj | object = {},
): Mock<T> {
    const instance = (Array.isArray(methodsOrInstance) ? defaultInstance : methodsOrInstance) as T;
    const methods = (Array.isArray(methodsOrInstance) ? methodsOrInstance : []) as Array<keyof T>;
    const properties = isPlainObject(instance) ? Object.getOwnPropertyNames(instance) : getClassMethods(instance);

    for (const property of properties) {
        const value = instance[property as keyof T];

        if (typeof value !== 'function') {
            continue;
        }

        instance[property as keyof T] = vi.fn((...args) => value.call(instance, ...args)) as unknown as T[keyof T];
    }

    for (const method of methods) {
        instance[method] = vi.fn() as unknown as T[keyof T];
    }

    return instance;
}
