import { URL, fileURLToPath } from 'node:url';

import { fmt, lint } from '@noeldemartin/vite-plus-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    pack: {
        entry: { 'noeldemartin-testing': 'src/index.ts' },
        sourcemap: true,
        dts: true,
        fixedExtension: false,
        publint: true,
        attw: { profile: 'esm-only' },
    },
    resolve: {
        alias: {
            '@noeldemartin/testing': fileURLToPath(new URL('./src/', import.meta.url)),
        },
    },
    fmt,
    lint: { extends: [lint] },
});
