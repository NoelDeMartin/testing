import { describe, expect, it } from 'vite-plus/test';

import { fakeContainerUrl, fakeDocumentUrl, fakeResourceUrl } from './faking';

describe('Faking helpers', () => {
    it('Generates unique document urls in the same container', () => {
        const containerUrl = fakeContainerUrl();
        const documentUrls = Array.from({ length: 1000 }, () => fakeDocumentUrl({ containerUrl }));

        expect(new Set(documentUrls).size).toBe(documentUrls.length);
        documentUrls.forEach((documentUrl) => expect(documentUrl.startsWith(containerUrl)).toBe(true));
    });

    it('Generates unique container urls with the same base url', () => {
        const baseUrl = 'https://pod.example.com/';
        const containerUrls = Array.from({ length: 1000 }, () => fakeContainerUrl({ baseUrl }));

        expect(new Set(containerUrls).size).toBe(containerUrls.length);
        containerUrls.forEach((containerUrl) => expect(containerUrl).toMatch(/^https:\/\/pod\.example\.com\/[^/]+\/$/));
    });

    it('Respects explicit names', () => {
        const containerUrl = fakeContainerUrl();

        const firstDocumentUrl = fakeDocumentUrl({ containerUrl, name: 'My Document' });
        const secondDocumentUrl = fakeDocumentUrl({ containerUrl, name: 'My Document' });

        expect(firstDocumentUrl).toEqual(`${containerUrl}my-document`);
        expect(secondDocumentUrl).toEqual(firstDocumentUrl);
        expect(fakeResourceUrl({ containerUrl, name: 'My Document', hash: 'me' })).toEqual(
            `${containerUrl}my-document#me`,
        );
    });
});
