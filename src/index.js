#!/usr/bin/env node

/**
 * Task Tracker CLI
 * A command line interface for managing tasks
 * 
 * Usage:
 *   node src/index.js add "Task description"
 *   node src/index.js update <id> "New description"
 *   node src/index.js delete <id>
 *   node src/index.js mark-in-progress <id>
 *   node src/index.js mark-done <id>
 *   node src/index.js list [status]
 */

const taskManager = require('./task-manager');

/**
 * Parse command line arguments and execute the appropriate command
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        printUsage();
        process.exit(1);
    }

    const command = args[0].toLowerCase();

    switch (command) {
        case 'add':
            handleAdd(args);
            break;
        case 'update':
            handleUpdate(args);
            break;
        case 'delete':
            handleDelete(args);
            break;
        case 'mark-in-progress':
            handleMarkInProgress(args);
            break;
        case 'mark-done':
            handleMarkDone(args);
            break;
        case 'list':
            handleList(args);
            break;
        case 'help':
        case '-h':
        case '--help':
            printUsage();
            break;
        default:
            console.error(`Error: Unknown command '${command}'`);
            printUsage();
            process.exit(1);
    }
}

/**
 * Handle the 'add' command
 */
function handleAdd(args) {
    if (args.length < 2) {
        console.error('Error: Missing task description');
        console.log('Usage: task-cli add "Task description"');
        process.exit(1);
    }

    const description = args.slice(1).join(' ');
    const result = taskManager.addTask(description);
    
    if (result.success) {
        console.log(result.message);
    } else {
        console.error(result.message);
        process.exit(1);
    }
}

/**
 * Handle the 'update' command
 */
function handleUpdate(args) {
    if (args.length < 3) {
        console.error('Error: Missing task ID or description');
        console.log('Usage: task-cli update <id> "New description"');
        process.exit(1);
    }

    const id = parseInt(args[1], 10);
    
    if (isNaN(id)) {
        console.error('Error: Task ID must be a number');
        process.exit(1);
    }

    const description = args.slice(2).join(' ');
    const result = taskManager.updateTask(id, description);
    
    if (result.success) {
        console.log(result.message);
    } else {
        console.error(result.message);
        process.exit(1);
    }
}

/**
 * Handle the 'delete' command
 */
function handleDelete(args) {
    if (args.length < 2) {
        console.error('Error: Missing task ID');
        console.log('Usage: task-cli delete <id>');
        process.exit(1);
    }

    const id = parseInt(args[1], 10);
    
    if (isNaN(id)) {
        console.error('Error: Task ID must be a number');
        process.exit(1);
    }

    const result = taskManager.deleteTask(id);
    
    if (result.success) {
        console.log(result.message);
    } else {
        console.error(result.message);
        process.exit(1);
    }
}

/**
 * Handle the 'mark-in-progress' command
 */
function handleMarkInProgress(args) {
    if (args.length < 2) {
        console.error('Error: Missing task ID');
        console.log('Usage: task-cli mark-in-progress <id>');
        process.exit(1);
    }

    const id = parseInt(args[1], 10);
    
    if (isNaN(id)) {
        console.error('Error: Task ID must be a number');
        process.exit(1);
    }

    const result = taskManager.markTask(id, 'in-progress');
    
    if (result.success) {
        console.log(result.message);
    } else {
        console.error(result.message);
        process.exit(1);
    }
}

/**
 * Handle the 'mark-done' command
 */
function handleMarkDone(args) {
    if (args.length < 2) {
        console.error('Error: Missing task ID');
        console.log('Usage: task-cli mark-done <id>');
        process.exit(1);
    }

    const id = parseInt(args[1], 10);
    
    if (isNaN(id)) {
        console.error('Error: Task ID must be a number');
        process.exit(1);
    }

    const result = taskManager.markTask(id, 'done');
    
    if (result.success) {
        console.log(result.message);
    } else {
        console.error(result.message);
        process.exit(1);
    }
}

/**
 * Handle the 'list' command
 */
function handleList(args) {
    let status = null;
    
    if (args.length > 1) {
        status = args[1].toLowerCase();
        
        // Map command-line status to internal status
        if (status === 'in-progress') {
            status = 'in-progress';
        } else if (status === 'done' || status === 'todo') {
            // These are valid as-is
        } else {
            console.error(`Error: Invalid status '${status}'. Valid statuses are: todo, in-progress, done`);
            process.exit(1);
        }
    }

    const result = taskManager.listTasks(status);
    
    if (result.success) {
        console.log(taskManager.formatTasks(result.tasks));
    } else {
        console.error(result.message);
        process.exit(1);
    }
}

/**
 * Print usage information
 */
function printUsage() {
    console.log(`
Task Tracker CLI - Manage your tasks from the command line

Usage:
  task-cli <command> [arguments]

Commands:
  add <description>              Add a new task
  update <id> <description>      Update an existing task
  delete <id>                    Delete a task
  mark-in-progress <id>          Mark a task as in-progress
  mark-done <id>                 Mark a task as done
  list [status]                  List all tasks or filter by status
                                 Status options: todo, in-progress, done

Examples:
  task-cli add "Buy groceries"
  task-cli update 1 "Buy groceries and cook dinner"
  task-cli delete 1
  task-cli mark-in-progress 1
  task-cli mark-done 1
  task-cli list
  task-cli list done
  task-cli list todo
  task-cli list in-progress
`);
}

// Run the CLI
main();