![GitHub Release](https://img.shields.io/github/v/release/fbergmann/pyodide-copasi)
 ![GitHub License](https://img.shields.io/github/license/fbergmann/pyodide-copasi)

# pyodide-copasi

This basic website demonstrates using COPASI with Pyodide and Vue3. 
It uses the [sakai template](sakai.primevue.org/#/documentation). For the basic 
setup you'd use: 

```bash
git clone https://github.com/fbergmann/pyodide-copasi
cd pyodide-copasi
npm i 
```

The special version of pyodide (that includes COPASI + basico) can be downloaded from the 
release page. It has to be extracted as `./public/pyodide`. So assuming you are in the
project directory:

```bash
cd public
wget https://github.com/fbergmann/pyodide-copasi/releases/download/v0.0.1/pyodide.zip
unzip pyodide.zip
rm pyodide.zip
cd ..
```

If you want to debug the page you run: 

```bash
npm run dev
```

to build the static HTML + javascript page you'd run: 

```bash
npm run build
```

This creates the `pyodide-copasi` directory with the latest version. This is the version deployed at: 

<https://fbergmann.github.io/pyodide-copasi>

To serve it locally you can just run: 

```bash
wget https://github.com/fbergmann/pyodide-copasi/releases/download/v0.0.1/pyodide-copasi.zip
unzip pyodide-copasi.zip
rm pyodide-copasi.zip
python3 -m http.server
```
 
and access the page at <http://localhost:8000/pyodide-copasi>. 

## Download the pre-built version
You could also just download the latest `pyodide-copasi.zip` file extract it and have it served as installation: 

```bash
python3 -m http.server
```

I leave the automatically generated documentation from the template below: 

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
