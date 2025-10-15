# Welcome to your calorie-tracker-webapp project

## Project info

**URL**: (removed third-party preview link)

## How can I edit this code?

There are several ways of editing your application.

Local development

Work locally using your preferred IDE. The project is a Vite + React + TypeScript frontend with Supabase functions. Changes are committed via Git.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Follow your usual deployment workflow (Vercel, Netlify, or other static hosts) or deploy the frontend and Supabase functions separately. This repository contains a frontend (Vite + React) and serverless functions under `supabase/functions`.

## Can I connect a custom domain to my deployment?

Yes — configure your hosting provider's domain settings or the platform where you deploy the frontend. If you use a managed backend or preview service, follow that platform's docs for custom domains.

## Java backend (local build with Java 21)

This repository contains a small Spring Boot backend in `java-backend`. The project now targets Java 21 (LTS). To build and run the backend locally you need JDK 21 installed and available to Maven.

Quick install (Linux - Debian/Ubuntu):

```sh
# Install OpenJDK 21 (Debian/Ubuntu)
sudo apt update
sudo apt install -y wget unzip
wget https://github.com/adoptium/temurin21-binaries/releases/latest/download/OpenJDK21U-jdk_x64_linux_hotspot_21_latest.tar.gz
sudo tar -xzf OpenJDK21U-jdk_x64_linux_hotspot_21_latest.tar.gz -C /usr/lib/jvm/
# adjust path if necessary
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk-21/bin/java 1
sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/jdk-21/bin/javac 1
```

Fedora/CentOS and macOS users should use their package manager or adopt Temurin/Oracle distributions.

If you have multiple JDKs, add or update `java-backend/.mvn/toolchains.xml` so Maven can pick the JDK 21 installation. Example `jdkHome` in that file should point to the JDK 21 install location.

Build the backend:

```sh
cd java-backend
mvn -DskipTests package
```

If the build fails with "release version 21 not supported", ensure your `java -version` reports a Java 21 runtime and that Maven is using JDK 21 (not just a Java 17 runtime).
