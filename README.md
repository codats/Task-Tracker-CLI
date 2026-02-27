# Task Tracker CLI

A simple command line interface application to track and manage your tasks. Built with Node.js using only native modules (no external dependencies).

## Overview

This Task Tracker CLI allows you to manage your to-do list from the command line. Tasks are stored in a JSON file in your current working directory, making it easy to track what you need to do, what you're working on, and what you've completed.

## Project Structure

```
task-tracker/
├── src/
│   ├── index.js        # CLI entry point
│   └── task-manager.js # Core task management logic
├── tests/
│   └── test.js         # Test suite
├── package.json        # Project configuration
├── README.md           # This file
└── .gitignore          # Git ignore policy
```

## Installation

1. Clone this repository or download the source files
2. Navigate to the project directory:
   ```bash
   cd task-tracker
   ```

3. (Optional) Install globally to use `task-cli` command anywhere:
   ```bash
   npm link
   ```

## Usage

### Basic Commands

```bash
# Using node directly
node src/index.js <command> [arguments]

# Or if installed globally
task-cli <command> [arguments]
```

### Available Commands

#### Add a Task

```bash
task-cli add "Task description"
# Output: Task added successfully (ID: 1)
```

#### Update a Task

```bash
task-cli update <id> "New description"
# Output: Task <id> updated successfully
```

#### Delete a Task

```bash
task-cli delete <id>
# Output: Task <id> deleted successfully
```

#### Mark Task Status

```bash
# Mark as in-progress
task-cli mark-in-progress <id>
# Output: Task <id> marked as in-progress

# Mark as done
task-cli mark-done <id>
# Output: Task <id> marked as done
```

#### List Tasks

```bash
# List all tasks
task-cli list

# List tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```

#### Help

```bash
task-cli help
task-cli --help
task-cli -h
```

### Example Session

```bash
# Add some tasks
$ task-cli add "Buy groceries"
Task added successfully (ID: 1)

$ task-cli add "Clean the house"
Task added successfully (ID: 2)

$ task-cli add "Finish project report"
Task added successfully (ID: 3)

# List all tasks
$ task-cli list
ID  | Status      | Description
--------------------------------------------------
1   | todo        | Buy groceries
2   | todo        | Clean the house
3   | todo        | Finish project report

# Start working on a task
$ task-cli mark-in-progress 1
Task 1 marked as in-progress

# Complete a task
$ task-cli mark-done 2
Task 2 marked as done

# Update a task description
$ task-cli update 1 "Buy groceries and cook dinner"
Task 1 updated successfully

# Filter tasks by status
$ task-cli list done
ID  | Status      | Description
--------------------------------------------------
2   | done        | Clean the house

$ task-cli list in-progress
ID  | Status      | Description
--------------------------------------------------
1   | in-progress | Buy groceries and cook dinner

# Delete a task
$ task-cli delete 3
Task 3 deleted successfully
```

## Task Properties

Each task has the following properties:

| Property     | Description                                |
|--------------|--------------------------------------------|
| `id`         | Unique identifier (auto-generated)         |
| `description`| Short description of the task              |
| `status`     | Status: `todo`, `in-progress`, or `done`   |
| `createdAt`  | ISO timestamp when the task was created    |
| `updatedAt`  | ISO timestamp when the task was last modified |

## Data Storage

Tasks are stored in a `tasks.json` file in the current working directory. The file is automatically created when you add your first task.

Example `tasks.json`:
```json
[
  {
    "id": 1,
    "description": "Buy groceries",
    "status": "in-progress",
    "createdAt": "2026-02-27T06:15:00.000Z",
    "updatedAt": "2026-02-27T06:20:00.000Z"
  }
]
```

## Running Tests

Run the test suite to verify all functionality:

```bash
npm test
# or
node tests/test.js
```

## Error Handling

The CLI handles various error cases gracefully:

- Empty task descriptions are rejected
- Invalid task IDs are reported
- Invalid status values are rejected
- Missing arguments are caught with helpful usage messages

## License

MIT License

## Credits

Created as part of the [Frontend Developer Roadmap](https://roadmap.sh/projects/task-tracker) learning path.