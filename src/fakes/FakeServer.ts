import { arrayRemove, facade, toString } from '@noeldemartin/utils';
import { vi } from 'vitest';
import type { GetClosureArgs } from '@noeldemartin/utils';
import type { MockInstance } from 'vitest';

import FakeResponse from './FakeResponse';

export type FetchSpy = (request: FakeServerRequest) => unknown;
export type ResponseHandler = (request: FakeServerRequest) => Response | Promise<Response>;

export interface FakeServerRequest {
    url: string;
    method: string;
    body: string;
    headers: Record<string, string>;
    response?: Response;
}

export interface FakeServerResponse {
    response: Response | ResponseHandler;
    method?: string;
    times?: number;
}

export class FakeServerInstance {

    public readonly fetch: typeof fetch;
    public readonly fetchSpy: MockInstance;
    protected _spy: FetchSpy | null = null;
    protected requests: FakeServerRequest[] = [];
    protected responses: Record<string, FakeServerResponse[]> = {};

    constructor() {
        const getRequest = (...[input, options]: GetClosureArgs<typeof fetch>): FakeServerRequest => {
            if (typeof input === 'string') {
                return {
                    url: input,
                    method: options?.method ?? 'GET',
                    headers: (options?.headers as Record<string, string>) ?? {},
                    body: toString(options?.body ?? ''),
                };
            }

            if ('href' in input) {
                return {
                    url: toString(input),
                    method: options?.method ?? 'GET',
                    headers: (options?.headers as Record<string, string>) ?? {},
                    body: toString(options?.body ?? ''),
                };
            }

            return {
                url: input.url,
                method: input.method,
                headers: (input?.headers as unknown as Record<string, string>) ?? {},
                body: toString(input.body),
            };
        };

        this.fetch = async (input, options) => {
            const request = getRequest(input, options);
            const response = await this.matchResponse(request);

            request.response = response;
            this.requests.push(request);

            this._spy?.(request);

            return response;
        };

        this.fetchSpy = vi.spyOn(this as FakeServerInstance, 'fetch');
    }

    public spy(fetchSpy: FetchSpy): void {
        this._spy = fetchSpy;
    }

    public getRequest(url: string): FakeServerRequest | null;
    public getRequest(method: string, url: string): FakeServerRequest | null;
    public getRequest(methodOrUrl: string, url?: string): FakeServerRequest | null {
        const method = typeof url === 'string' ? methodOrUrl : false;
        url = url ?? methodOrUrl;

        return this.requests.find((request) => request.url === url && (!method || request.method === method)) ?? null;
    }

    public getRequests(url?: string): FakeServerRequest[];
    public getRequests(method: string, url: string): FakeServerRequest[];
    public getRequests(methodOrUrl?: string, url?: string): FakeServerRequest[] {
        if (!methodOrUrl) {
            return this.requests;
        }

        const method = typeof url === 'string' ? methodOrUrl : false;
        url = url ?? methodOrUrl;

        return this.requests.filter((request) => request.url === url && (!method || request.method === method));
    }

    public respond(url: string, response?: Response | FakeServerResponse | string | number): void {
        response ??= FakeResponse.success();

        if (typeof response === 'string') {
            response = FakeResponse.success(response);
        }

        if (typeof response === 'number') {
            response = new FakeResponse(undefined, undefined, response);
        }

        this.responses[url] ??= [];
        this.responses[url]?.push('response' in response ? response : { response });
    }

    public respondWith(url: string, handler: ResponseHandler): void {
        this.responses[url] ??= [];
        this.responses[url]?.push({ response: handler });
    }

    public respondOnce(url: string, response?: Response | string | number): void {
        response ??= FakeResponse.success();

        if (typeof response === 'string') {
            response = FakeResponse.success(response);
        }

        if (typeof response === 'number') {
            response = new FakeResponse(undefined, undefined, response);
        }

        this.respond(url, { response, times: 1 });
    }

    public respondOnceWith(url: string, handler: ResponseHandler): void {
        this.respond(url, { response: handler, times: 1 });
    }

    public reset(): void {
        this.requests = [];
        this.responses = {};
    }

    protected async matchResponse(request: FakeServerRequest): Promise<Response> {
        const responses = this.responses[request.url] ?? this.responses['*'];
        const response = responses?.find((r) => !r.method || r.method === request.method);

        if (!responses || !response) {
            return FakeResponse.notFound();
        }

        if (response.times) {
            response.times--;
            response.times === 0 && arrayRemove(responses, response);
        }

        if (typeof response.response === 'function') {
            return response.response(request);
        }

        return response.response;
    }

}

export default facade(FakeServerInstance);
