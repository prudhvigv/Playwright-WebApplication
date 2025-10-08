# 🎭 IntelliSuite Automation Framework with Playwright (TypeScript + POM + Allure)

This repository contains an end-to-end automation framework to automate IntelliSuite functionalities built using [Playwright](https://playwright.dev/), with TypeScript, Page Object Model (POM), ESLint, Prettier, Winston Logs and Allure reporting integration.

---

## ✅ Prerequisites

Make sure the following are installed on your machine:

| Tool                                                                   | Version                             |
| ---------------------------------------------------------------------- | ----------------------------------- |
| [Node.js](https://nodejs.org/)                                         | >= 20.x                             |
| [Git](https://git-scm.com/)                                            | Latest                              |
| [Allure CLI](https://docs.qameta.io/allure/#_installing_a_commandline) | `npm install -g allure-commandline` |

## ✅ Structure of project

INTELLISUITE-E2E/
├── src/
└──config
└──hooks
└──pages/
└──test-data
└──tests/
└──utils
├── allure-report/
├── playwright.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── package.json
├── README.md

## ✅ Create .env file to store details like BASE_URL, USERMAIL and PASSWORD

    - Create a file named with .env in root folder
    - Insert below data and enter valid values in where execution has to be happened

        BASE_URL=https://test-automation-1.qa.intellisuite.internal.mavq.io/
        USERMAIL=userid
        PASSWORD=password
    - Hence this file is being added into .gitignore it won't get committed

## ✅ Install packages related to Automation by following below steps

    - Execute below command in cmd to install all required packages
    - npm install

## ✅ Execute automation suite in head mode

    - In order to execute whole suite "npm run test" can be used.
    - In order to execute a specific scenario "npm run test tests/Metadata_Manager/FileManager/FieldType.spec" can be used.

## ✅ Execute automation suite in headless mode

    - In order to execute whole suite "npm run test --headed=true" can be used alon
    - In order to execute a specific scenario "npm run test tests/Metadata_Manager/FileManager/FieldType.spec --headed=true" can be used.

## ✅ Resources and Best practices

### 🎭 Playwright

    - [Playwright DOCS] (https://playwright.dev/docs/intro)
    - [Test Configuration](https://playwright.dev/docs/test-configuration)

### 🧱 Page Object Model

    - [POM in Playwright] (https://playwright.dev/docs/pom)
