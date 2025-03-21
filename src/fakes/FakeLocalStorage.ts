import { facade } from '@noeldemartin/utils';
import { vi } from 'vitest';

export class FakeLocalStorageInstance implements Storage {

    public data: Record<string, string> = {};

    public constructor() {
        vi.spyOn(this as FakeLocalStorageInstance, 'getItem');
        vi.spyOn(this as FakeLocalStorageInstance, 'setItem');
        vi.spyOn(this as FakeLocalStorageInstance, 'removeItem');
        vi.spyOn(this as FakeLocalStorageInstance, 'clear');
        vi.spyOn(this as FakeLocalStorageInstance, 'key');
    }

    public get length(): number {
        return Object.keys(this.data).length;
    }

    public patchGlobal(): void {
        globalThis.localStorage = this;
    }

    public clear(): void {
        this.data = {};
    }

    public getItem(key: string): string | null {
        return key in this.data ? this.data[key] : null;
    }

    public key(index: number): string | null {
        const keys = Object.keys(this.data);
        return index < keys.length ? keys[index] : null;
    }

    public removeItem(key: string): void {
        if (key in this.data) {
            delete this.data[key];
        }
    }

    public setItem(key: string, value: string): void {
        this.data[key] = value;
    }

}

export default facade(FakeLocalStorageInstance);
