# Agent Orchestrator

Agent Orchestrator is a Next.js-based platform for managing and monitoring AI coding agents. It allows you to create projects, spawn agents to perform tasks, and view their logs and status in real-time.

## Features

- **Project Management**: Create and manage projects with unique identifiers.
- **Agent Spawning**: Spawn AI agents with custom system prompts and work directories.
- **Real-time Monitoring**: View agent logs and status as they execute.
- **Webhook Integration**: Process GitHub issue comments to trigger agent actions.
- **Secure Authentication**: Basic authentication to protect your projects.

## Prerequisites

- Bun
- SQLite (for database)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/07prajwal2000/agent-orchestrator.git
   cd agent-orchestrator
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Setup .env file

   ```env
   SQLITE_PATH=
   API_SECRET=
   ```

4. Initialize the database:

   ```bash
   bun x drizzle-kit generate
   bun x drizzle-kit push
   ```

5. Run the development server:
   ```bash
   bun run dev
   ```

## Usage

### Creating a Project

1. Navigate to the home page (`/`).
2. Click "Create Project".
3. Fill in the project details (Name, Description, Work Directory, Coding Agent CLI).
4. Click "Create Project".

### Spawning an Agent

1. Go to a project's dashboard.
2. Click "Spawn Agent".
3. Enter the task title, description, and work directory.
4. Click "Spawn Agent".

### Viewing Logs

1. On the project dashboard, click on an agent's "View Logs" button.
2. You will see a real-time log stream of the agent's execution.

## Webhook Configuration

To enable GitHub issue comment processing:

1. Go to your project settings.
2. Copy the Webhook URL.
3. In your GitHub repository settings, add a new webhook pointing to this URL.
4. Ensure the webhook is configured to listen for "Issue & its comments" events.

## Project Structure

- `app/`: Next.js application pages and API routes.
- `app/lib/`: Core logic including database models, prompt builders, and agent workers.
- `drizzle/`: Database schema and migration files.

## License

MIT
