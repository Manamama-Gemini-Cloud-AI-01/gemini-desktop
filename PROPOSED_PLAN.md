# Proposed Installation and Testing Plan

**Version:** 1.4 (Updated with detailed build report and corrected workflow)

This document outlines an agreed-upon plan to install, build, and test the Gemini Desktop application, taking into account the specific environment.

## Phase 1: Prerequisite Verification

Before proceeding, we will ensure the necessary tools and environment are correctly identified.

**0. System Environment**

Based on the `neofetch` command, the operating environment is:
*   **OS:** Debian GNU/Linux 12 (bookworm) aarch64
*   **Kernel:** 6.2.1-PRoot-Distro
*   This prooted Debian environment runs on an Android host. This context is critical for anticipating potential issues, especially with GUI-related libraries.

**1. Verify Node.js and npm**

Check that Node.js and its package manager, npm, are available.
```bash
node --version && npm --version
```

**2. Verify pnpm**

The project uses `pnpm` for package management. Check if it is installed.
```bash
pnpm --version
```
*Note: If `pnpm` is not installed, it can be installed via `npm install -g pnpm`.*

## Phase 2: Installation

Follow the steps below, adapted from the project's documentation.

**1. Install Dependencies**

Use `pnpm` to install the project dependencies as defined in `pnpm-lock.yaml`. This command should also handle the initial setup.
```bash
pnpm install
```

**2. Run Type Checking**

Execute the frontend type check to ensure there are no TypeScript errors.
```bash
npm run check:frontend
```

## Phase 3: Build Plan

### Plan A: Build Android APK using GitHub Actions

This plan leverages a CI/CD pipeline to build the Android APK in a clean, controlled environment, avoiding the complexities of the local Termux setup.

**1. Create GitHub Actions Workflow File**

Create a new workflow file at `.github/workflows/android-build.yml`.

**2. Configure the Workflow**

The workflow will be configured to:
*   Check out the code.
*   Set up the correct Java and Node.js versions.
*   Cache dependencies to speed up future builds.
*   Install the Android SDK and NDK.
*   Build the Tauri application for Android.
*   Upload the resulting APK as a build artifact.

**3. Push the Workflow to GitHub**

Push the new workflow file to the GitHub repository.

**4. Trigger the Workflow**

The workflow will be triggered automatically on a push to the `main` branch. The resulting APK can be downloaded from the "Actions" tab in the GitHub repository.

### Plan B: Build Android APK directly in Termux

This plan attempts to build the Android APK directly within the Termux environment. This is a more complex and less reliable approach, but it avoids the need for a CI/CD pipeline.

**1. Install Android Build Dependencies**

Install the necessary Android build tools, including the SDK and NDK, and configure the environment variables correctly.

**2. Configure Tauri for Android**

Ensure that `tauri.conf.json` is correctly configured for the Android target.

**3. Build the Android APK**

Use the `pnpm tauri android build` command to build the APK. This may require troubleshooting and installing additional system-level dependencies.

**4. Manual APK Installation**

Once the APK is built, it can be manually installed on an Android device for testing.

## Phase 4: Execution and Functional Testing

This phase is complex due to the environment. We will proceed cautiously.

**1. Initial Tauri Test & Troubleshooting**

*   **Challenge:** Tauri can be problematic in a prooted Debian environment on Termux due to missing system-level dependencies for web rendering and windowing.
*   **Action:** We will first attempt to run the Tauri development server and expect it to fail.
    ```bash
    pnpm tauri dev
    ```
*   **Troubleshooting:** Based on the error messages, we will use `apt` to search for and install required development libraries (e.g., `libwebkit2gtk-4.0-dev`, `build-essential`, etc.). We can use `apt list | grep <keyword>` to find appropriate packages.

**2. Re-test Tauri**

After installing the necessary `-dev` packages, we will retry running the application to see if the issues are resolved.
```bash
pnpm tauri dev
```
*Note: The command may freeze the terminal if it's performing a first-time build or installation in the background. If it hangs, we may need to cancel and re-run it with a verbose flag (`-v`) to diagnose the issue.*

**3. Manual Functional Testing**

*   **Action:** Once the application is running, perform manual tests based on `TESTING_PLAN.md`.
*   **Note:** The `TESTING_PLAN.md` seems comprehensive. I will also check `package.json` for any automated test scripts that could supplement the manual process.
*   **Key Areas to Test:**
    *   Core Functionality: Conversation management.
    *   Tool Call Functionality: All states (Pending, Running, Completed, Failed).
    *   UI Components: Sidebar, input area, message display.
    *   Error Handling: Application's response to errors.

This structured approach ensures that all prerequisites are met and potential issues are handled systematically.

## Build Attempt Report (2025-07-31)

This report details the attempts to build the Android APK, the errors encountered, and the lessons learned.

### Initial Failures and Lessons Learned

The initial attempts to build the Android APK directly in the Termux environment failed with the error `Cannot find module '@tauri-apps/cli-android-arm64'`. This led to the following insights:

*   **Tauri CLI for Android:** The Tauri CLI dynamically loads platform-specific helper packages for different target architectures. In this case, it was looking for a package for Android on ARM64, which was not installed.
*   **NDK Requirement:** The Android NDK (Native Development Kit) is a crucial dependency for building Tauri apps for Android, as it's used to compile the Rust code.
*   **`tauri.conf.json`:** The `tauri.conf.json` file was missing the `android` section, which is required to configure the Android build.

### GitHub Actions Workflow Failures

After pivoting to a GitHub Actions-based build, we encountered a series of failures:

1.  **`actions/upload-artifact@v3` Deprecation:** The initial workflow failed because it used a deprecated version of the `actions/upload-artifact` action. This was resolved by updating to `v4`.
2.  **`pnpm` Not Found:** The workflow then failed because `pnpm` was not installed. This was resolved by adding a step to install `pnpm` globally using `npm`.
3.  **Incorrect `pnpm` Setup:** The workflow continued to fail with the error `ERR_PNPM_NO_PKG_MANIFEST No package.json found`. This was due to an incorrect understanding of how to use the `pnpm/action-setup` and `actions/setup-node` actions together.

### Google Search AI Consultation

After repeated failures, I consulted the Google Search AI with a detailed, natural-language query. The key takeaways from this consultation were:

*   **`working-directory` is Crucial:** The `ERR_PNPM_NO_PKG_MANIFEST` error was caused by the `pnpm install` command being run in the wrong directory. The `actions/checkout` action checks out the repository to a nested directory, and the `working-directory` parameter is required to execute commands in the correct location.
*   **Best-Practice Workflow:** The search results provided a complete, best-practice YAML example for building a Tauri Android app with pnpm, including the correct use of `pnpm/action-setup`, `actions/setup-node`, and `working-directory`.

### Current Status

I am now implementing the best-practice workflow provided by the Google Search AI. I am confident that this approach will resolve the build issues and produce a successful Android APK.

### Corrected Workflow

```yaml
name: Build Tauri Android

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch: # Allows manual triggering

env:
  # Set environment variables for Android SDK and NDK paths
  ANDROID_SDK_ROOT: ${{ github.workspace }}/android-sdk
  ANDROID_NDK_HOME: ${{ github.workspace }}/android-sdk/ndk/25.2.9519653 # Or your preferred NDK version

jobs:
  build-android:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20' # Use an LTS version suitable for Tauri
          cache: 'pnpm' # Enable pnpm caching
          cache-dependency-path: './pnpm-lock.yaml' # Path to your pnpm-lock.yaml

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8
          run_install: false

      - name: Get pnpm store directory
        id: pnpm-cache-dir
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install Frontend Dependencies
        run: pnpm install --frozen-lockfile

      - name: Set up Java Development Kit
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3
        with:
          api-level: 34
          build-tools: 34.0.0

      - name: Setup Android NDK
        uses: nttld/setup-ndk@v1
        with:
          ndk-version: r25c

      - name: Install Rust Toolchain
        uses: dtolnay/rust-toolchain@stable
        with:
          toolchain: stable
          targets: aarch64-linux-android,armv7-linux-androideabi,x86_64-linux-android,i686-linux-android

      - name: Rust Cache
        uses: swatinem/rust-cache@v2
        with:
          key: "${{ runner.os }}-rust-${{ hashFiles('**/Cargo.lock') }}"
          restore-keys: |
            ${{ runner.os }}-rust-

      - name: Build Tauri Android App
        run: pnpm tauri build --target aarch64-linux-android --release

      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: tauri-android-app
          path: src-tauri/target/aarch64-linux-android/release/*.apk
```