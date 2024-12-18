import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts', // Entry point
    output: [
        {
            file: 'dist/index.js', // CommonJS output
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js', // ESM output
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        nodeResolve(), // Resolves node_modules imports
        typescript(), // Compiles TypeScript
    ],
};
