# Project Structure Documentation

This document provides an overview of the file and directory structure of the MenuMaker project, which is a SvelteKit application designed to manage and display weekly menus (vertical, horizontal, and mail formats).

## Root Directory

- **`Dockerfile`**: Configuration for building the application container using Bun.
- **`package.json`**: Defines project dependencies, scripts (dev, build, check), and metadata.
- **`svelte.config.js`**: SvelteKit configuration, using `@sveltejs/adapter-node` for the build adapter.
- **`vite.config.ts`**: Vite configuration for the project.
- **`tsconfig.json`**: TypeScript configuration.
- **`static/`**: Contains static assets that are served directly.
  - `mailTemplate.txt`: Template used for generating email text.
  - `style.json`: Style configurations (possibly for map styles or themes).
  - `Sandwichlogo/`: Directory containing logo images.

## Source Directory (`src/`)

The core application code lives here.

- **`app.html`**: The HTML shell for the application.
- **`app.d.ts`**: TypeScript type definitions for global app properties.

### Library (`src/lib/`)

Contains logic, state management, and reusable components.

#### Core Logic
- **`commandExecute.ts`**: Handles the execution of commands typed into the command palette (updating state, generating screenshots, etc.).
- **`commandSuggestion.ts`**: Provides autocomplete suggestions for the command palette based on available aliases and commands.
- **`constants.ts`**: Defines application-wide constants, such as `FrontState` (Vertical, Horizontal, Mail) and day aliases.
- **`mailGenerator.ts`**: Logic for generating the text representation of the menu for emails.
- **`MealManager.ts`**: Singleton class responsible for managing the state of the weekly menu (loading, saving, updating meals).

#### Assets (`src/lib/assets/`)
- **`ingredients.json`**: Data file containing available ingredients.
- **`mealList.json`**: Data file defining the list of available sandwiches/meals.

#### Components (`src/lib/components/`)
UI components used to build the application pages.

- **Menu Views**:
  - `MenuVertical.svelte`: The vertical representation of the weekly menu.
  - `MenuHorizontal.svelte`: The horizontal representation of the weekly menu.
  - `MailPreview.svelte`: A view that shows the generated text for emails.

- **Menu Parts**:
  - `MenuHeader.svelte`, `MenuHeaderHor.svelte`: Header components for the respective menu layouts.
  - `MenuBody.svelte`, `MenuBodyHor.svelte`: Body components containing the daily slots.
  - `SandwichZone.svelte`: Represents a specific meal slot (upper or lower) for a day.

- **Tools**:
  - `CommandPalette.svelte`: The floating command interface (Ctrl+K) for controlling the app without mouse interaction.

### Routes (`src/routes/`)

Defines the pages and routing of the application (SvelteKit file-based routing).

- **`+layout.svelte`**: The root layout component that wraps every page.
- **`+page.svelte`**: The main entry point of the application. It handles the state switching between Vertical, Horizontal, and Mail views and mounts the `CommandPalette`.
- **`layout.css`**: Global styles applied to the layout.
