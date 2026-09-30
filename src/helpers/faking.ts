import { faker } from '@noeldemartin/faker';
import { stringToSlug } from '@noeldemartin/utils';

export interface ContainerOptions {
    baseUrl: string;
}

export interface DocumentOptions extends ContainerOptions {
    containerUrl: string;
    name: string;
}

export interface ResourceOptions extends DocumentOptions {
    documentUrl: string;
    hash: string;
}

const fakeUrls: Record<string, string> = {};

function claimFakeUrl(url: string): string {
    fakeUrls[url] = url;

    return url;
}

function fakeUniqueUrl(prefix: string, suffix: string = ''): string {
    return faker.helpers.unique(() => prefix + stringToSlug(faker.random.word()) + suffix, [], { store: fakeUrls });
}

export function fakeContainerUrl(options: Partial<ContainerOptions> = {}): string {
    const baseUrl = options.baseUrl ?? faker.internet.url();
    const parentContainerUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

    return fakeUniqueUrl(parentContainerUrl, '/');
}

export function fakeDocumentUrl(options: Partial<DocumentOptions> = {}): string {
    const containerUrl = options.containerUrl ?? fakeContainerUrl(options);

    return options.name !== undefined
        ? claimFakeUrl(containerUrl + stringToSlug(options.name))
        : fakeUniqueUrl(containerUrl);
}

export function fakeResourceUrl(options: Partial<ResourceOptions> = {}): string {
    const documentUrl = options.documentUrl ?? fakeDocumentUrl(options);
    const hash = options.hash ?? 'it';

    return documentUrl + '#' + hash;
}
