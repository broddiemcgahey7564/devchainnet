'use strict';

// bundler for react npm package

const esbuild = require('esbuild');
const esbuild_node_external = require('esbuild-node-externals');
const esbuild_css_modules = require('esbuild-css-modules-plugin');

esbuild
  .build({
    entryPoints: ['./src/index.js'],
    outfile: 'dist/index.js',
    bundle: true,
    minify: true,
    treeShaking: true,
    platform: 'node',
    format: 'cjs',
    target: 'node14',
    plugins: [
      esbuild_node_external.nodeExternalsPlugin(),
      esbuild_css_modules({
        // @see https://github.com/indooorsman/esbuild-css-modules-plugin/blob/main/index.d.ts for more details
        force: true,
        emitDeclarationFile: true,
        localsConvention: 'camelCaseOnly',
        namedExports: true,
        inject: false,
      }),
    ],
    loader: { '.js': 'jsx' },
  })
  .catch(() => process.exit(1));
