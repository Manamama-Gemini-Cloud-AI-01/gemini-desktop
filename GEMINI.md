# Gemini Desktop

This is a desktop and web UI for the Gemini CLI, built with Tauri and web technologies.

## Environment

*   **OS:** android
*   **Architecture:** aarch64 (assumed from Termux environment)
*   **Working Directory:** /data/data/com.termux/files/home/downloads/GitHub/gemini-desktop

## Error

When running `just deps dev`, the following error occurs:

```
Error: Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
    at Object.<anonymous> (/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js:389:11)
    at Module._compile (node:internal/modules/cjs/loader:1738:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1871:10)
    at Module.load (node:internal/modules/cjs/loader:1470:32)
    at Module._load (node:internal/modules/cjs/loader:1290:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:238:24)
    at Module.require (node:internal/modules/cjs/loader:1493:12)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/main.js:5:27) {
  [cause]: [
    Error: Cannot find module './cli.android-arm64.node'
    Require stack:
    - /data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js
        at Module._resolveFilename (node:internal/modules/cjs/loader:1410:15)
        at defaultResolveImpl (node:internal/modules/cjs/loader:1051:19)
        at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1056:22)
        at Module._load (node:internal/modules/cjs/loader:1219:37)
        at TracingChannel.traceSync (node:diagnostics_channel:322:14)
        at wrapModuleLoad (node:internal/modules/cjs/loader:238:24)
        at Module.require (node:internal/modules/cjs/loader:1493:12)
        at require (node:internal/modules/helpers:152:16)
        at requireNative (/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js:80:16)
        at Object.<anonymous> (/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js:366:17) {
      code: 'MODULE_NOT_FOUND',
      requireStack: [
        '/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js'
      ]
    },
    Error: Cannot find module '@tauri-apps/cli-android-arm64'
    Require stack:
    - /data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js
        at Module._resolveFilename (node:internal/modules/cjs/loader:1410:15)
        at defaultResolveImpl (node:internal/modules/cjs/loader:1051:19)
        at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1056:22)
        at Module._load (node:internal/modules/cjs/loader:1219:37)
        at TracingChannel.traceSync (node:diagnostics_channel:322:14)
        at wrapModuleLoad (node:internal/modules/cjs/loader:238:24)
        at Module.require (node:internal/modules/cjs/loader:1493:12)
        at require (node:internal/modules/helpers:152:16)
        at requireNative (/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js:85:16)
        at Object.<anonymous> (/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js:366:17) {
      code: 'MODULE_NOT_FOUND',
      requireStack: [
        '/data/data/com.termux/files/home/downloads/GitHub/gemini-desktop/frontend/node_modules/.pnpm/@tauri-apps+cli@2.7.1/node_modules/@tauri-apps/cli/index.js'
      ]
    }
  ]
}
```
The error indicates that the `@tauri-apps/cli` package is missing the native binding for `android-arm64`.

## Debugging Attempts

1.  **Re-install dependencies:** A clean reinstall of `node_modules` and `pnpm-lock.yaml` was attempted, but the error persisted.
2.  **Directly install missing package:** Attempted to install `@tauri-apps/cli-android-arm64` directly, but the package was not found in the npm registry.
3.  **Update Tauri CLI:** Upgraded `@tauri-apps/cli` from `2.6.2` to `2.7.1`. The error changed slightly but remained a "Cannot find native binding" issue.
4.  **Downgrade Tauri CLI:** Considered downgrading, but this was deemed illogical as both newer and older versions failed.
5.  **Rebuild native dependencies:** Used `pnpm rebuild @tauri-apps/cli`, but the error persisted.
6.  **Switch package manager:** Considered switching from `pnpm` to `npm`, but this was not attempted at the user's request.
7.  **Web Search:** Searched for the error online, which led to the conclusion that this is a fundamental incompatibility.

## Conclusion

Tauri does not officially support on-device development in Termux. The Termux environment uses a different `libc` than standard Linux distributions, which prevents the correct installation of the required native modules for the `android-arm64` architecture.

The recommended solution is to switch to a desktop operating system (Linux, macOS, or Windows) for development and cross-compile for Android from there.  


Error:

Solved by:

`RUSTUP_USE_RUSTLS=0 

`thread 'main' panicked at /cargo/registry/src/index.crates.io-1949cf8c6b5b557f/rustls-platform-verifier-0.5.2/src/android.rs:87:10:
Expect rustls-platform-verifier to be initialized
