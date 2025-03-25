import { extendFacadeMethods, getClassMethods } from '@noeldemartin/utils';
import type { Constructor, Facade, FacadeMethods } from '@noeldemartin/utils';

import { mock } from '@noeldemartin/testing/helpers/mocking';

export function setupFacadeMocks(): void {
    extendFacadeMethods((facadeInstance) => {
        let mockClass: Constructor | null = null;
        let mockFactory: (() => object) | null = null;
        let mockFacade: Facade | null = null;

        function newMockInstance(partialInstance?: Record<string, unknown>): object {
            if (partialInstance) {
                return mock(partialInstance);
            }

            if (mockFacade) {
                return mock(mockFacade.reset());
            }

            if (mockClass) {
                return mock(new mockClass());
            }

            if (mockFactory) {
                return mockFactory();
            }

            return mock(getClassMethods(facadeInstance.requireInstance()));
        }

        Object.assign(facadeInstance, {
            setMockClass: (newMockClass) => (mockClass = newMockClass),
            setMockFactory: (newMockFactory) => (mockFactory = newMockFactory),
            setMockFacade: (newMockFacade) => (mockFacade = newMockFacade),
            mock: (partialInstance) =>
                facadeInstance.setInstance(newMockInstance(partialInstance as Record<string, unknown>)),
        } as Partial<FacadeMethods<object, object>>);
    });
}

declare module '@noeldemartin/utils' {
    export interface FacadeMethods<TInstance, TMock extends TInstance = TInstance> {
        setMockClass(mockClass: Constructor<TMock>): void;
        setMockFactory(mockFactory: () => TMock): void;
        setMockFacade(mockFacade: Facade<TMock>): void;
        mock(partialInstance?: Partial<TInstance>): TMock;
    }
}
