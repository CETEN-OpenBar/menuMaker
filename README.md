# MenuMaker

A SvelteKit-based menu generation tool, designed to easily visualize weekly sandwich menus, and generate email text.

## Features

- **Menu Management**: Configure daily menus with support for two slots per day (Upper/Lower).
- **Sandwich Library**: Pick from a predefined list of sandwiches (`mealList.json`).
- **Visualizations**: Toggle between **Vertical** and **Horizontal** menu layouts.
- **Mail Generator**: Automatic preview of the weekly menu email.
- **Command Palette**: Fully keyboard-driven interface to manage the menu quickly.
- **Export**: Screenshots of the menu for distribution.

## Command Palette Documentation

The application is controlled via a command palette. Type commands to switch views or modify the menu.

### 1. View Commands
Switch between different display modes.

| Command | Alias | Description |
|---------|-------|-------------|
| `view-vertical` | `view-v` | Switch to the vertical list view of the menu. |
| `view-horizontal` | `view-h` | Switch to the horizontal card view of the menu. |
| `view-mail` | `view-m` | Preview the generated email for the current menu. |

### 2. Utility Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `screenshot` | `shot` | Takes a screenshot of the current menu view (Vertical or Horizontal) and downloads it as a PNG. |
| `copymail` | `cp` | Generates and copies the email text to your clipboard. |

### 3. Menu Editing Commands

Commands follow the syntax:  
`[day]-[zone]-[action] [value]`

- **[day]**: `mon`, `tue`, `wed`, `thu`, `fri`, `pub` (or full names mostly supported).
- **[zone]**: 
  - `u`: **Upper** slot (First meal).
  - `l`: **Lower** slot (Second meal).
- **[action]**:
  - `s`: Set **Sandwich** (Matches against available sandwiches).
  - `t`: Set **Text** (Free text).
  - `clear`: Clear the slot (Aliases: `empty`, `reset`).

#### Examples

| Action | Command Syntax | Example | Note |
|--------|---------------|---------|------|
| **Add Sandwich** | `[day]-[zone]-s [name]` | `mon-u-s Alpin` | Searches `mealList.json` for "Alpin". |
| **Add Text** | `[day]-[zone]-t [text]` | `fri-l-t Special Salad` | Sets custom text description. |
| **Clear Slot** | `[day]-[zone]-clear` | `wed-u-clear` | Clears the Wednesday upper slot (and lower slot if it exists). |

> **Note**: You cannot set the **Lower (`l`)** zone if the **Upper (`u`)** zone is empty.

---

## Development Setup

Built with SvelteKit and powered by [`sv`](https://github.com/sveltejs/cli). This project uses **Bun** as the package manager and runtime.

### Installing Dependencies

```sh
bun install
```

### Running in Development

Start a development server:

```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

### Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun run preview`.

## Docker Setup

The project includes a `Dockerfile` optimized for Bun.

1. **Build the image**:

```sh
docker build -t tnbarrefact .
```

2. **Run the container**:

```sh
docker run -p 3000:3000 tnbarrefact
```

The application will be accessible at `http://localhost:3000`.
