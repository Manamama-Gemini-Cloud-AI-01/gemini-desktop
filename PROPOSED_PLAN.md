# Proposed Installation and Testing Plan

**Version:** 1.2 (Updated to include GitHub Actions build plan)

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