import { URL, fileURLToPath } from 'node:url';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            formats: ['es'],
            fileName: 'noeldemartin-testing',
        },
        rollupOptions: {
            external: ['@noeldemartin/faker', '@noeldemartin/utils', 'vitest'],
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            '@noeldemartin/testing': fileURLToPath(new URL('./src/', import.meta.url)),
        },
    },
});
