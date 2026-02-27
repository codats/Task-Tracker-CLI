/**
 * Task Manager Module
 * Handles all task operations with JSON file storage
 */

const fs = require('fs');
const path = require('path');

// Path to the tasks JSON file (stored in the directory where CLI is run)
const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

// Valid task statuses
const VALID_STATUSES = ['todo', 'in-progress', 'done'];

/**
 * Load tasks from JSON file
 * Creates the file if it doesn't exist
 * @returns {Array} Array of task objects
 */
function loadTasks() {
    try {
        if (!fs.existsSync(TASKS_FILE)) {
            fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading tasks: ${error.message}`);
        return [];
    }
}

/**
 * Save tasks to JSON file
 * @param {Array} tasks - Array of task objects
 */
function saveTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error saving tasks: ${error.message}`);
        throw error;
    }
}

/**
 * Generate a unique ID for a new task
 * @param {Array} tasks - Current array of tasks
 * @returns {number} Unique ID
 */
function generateId(tasks) {
    if (tasks.length === 0) return 1;
    const maxId = Math.max(...tasks.map(task => task.id));
    return maxId + 1;
}

/**
 * Get current timestamp in ISO format
 * @returns {string} ISO timestamp
 */
function getTimestamp() {
    return new Date().toISOString();
}

/**
 * Add a new task
 * @param {string} description - Task description
 * @returns {object} Result object with success status and message
 */
function addTask(description) {
    if (!description || description.trim() === '') {
        return { success: false, message: 'Error: Task description cannot be empty' };
    }

    const tasks = loadTasks();
    const newTask = {
        id: generateId(tasks),
        description: description.trim(),
        status: 'todo',
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
    };

    tasks.push(newTask);
    saveTasks(tasks);

    return { success: true, message: `Task added successfully (ID: ${newTask.id})` };
}

/**
 * Update an existing task's description
 * @param {number} id - Task ID
 * @param {string} description - New description
 * @returns {object} Result object with success status and message
 */
function updateTask(id, description) {
    if (!description || description.trim() === '') {
        return { success: false, message: 'Error: Task description cannot be empty' };
    }

    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return { success: false, message: `Error: Task with ID ${id} not found` };
    }

    tasks[taskIndex].description = description.trim();
    tasks[taskIndex].updatedAt = getTimestamp();
    saveTasks(tasks);

    return { success: true, message: `Task ${id} updated successfully` };
}

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {object} Result object with success status and message
 */
function deleteTask(id) {
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return { success: false, message: `Error: Task with ID ${id} not found` };
    }

    tasks.splice(taskIndex, 1);
    saveTasks(tasks);

    return { success: true, message: `Task ${id} deleted successfully` };
}

/**
 * Mark a task with a new status
 * @param {number} id - Task ID
 * @param {string} status - New status (todo, in-progress, done)
 * @returns {object} Result object with success status and message
 */
function markTask(id, status) {
    if (!VALID_STATUSES.includes(status)) {
        return { success: false, message: `Error: Invalid status. Valid statuses are: ${VALID_STATUSES.join(', ')}` };
    }

    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return { success: false, message: `Error: Task with ID ${id} not found` };
    }

    tasks[taskIndex].status = status;
    tasks[taskIndex].updatedAt = getTimestamp();
    saveTasks(tasks);

    return { success: true, message: `Task ${id} marked as ${status}` };
}

/**
 * List tasks, optionally filtered by status
 * @param {string|null} status - Filter by status (optional)
 * @returns {object} Result object with success status, tasks array, and message
 */
function listTasks(status = null) {
    if (status && !VALID_STATUSES.includes(status)) {
        return { success: false, tasks: [], message: `Error: Invalid status. Valid statuses are: ${VALID_STATUSES.join(', ')}` };
    }

    const tasks = loadTasks();
    let filteredTasks = tasks;

    if (status) {
        filteredTasks = tasks.filter(task => task.status === status);
    }

    if (filteredTasks.length === 0) {
        const statusMsg = status ? ` with status '${status}'` : '';
        return { success: true, tasks: [], message: `No tasks found${statusMsg}` };
    }

    return { success: true, tasks: filteredTasks, message: `Found ${filteredTasks.length} task(s)` };
}

/**
 * Format tasks for display
 * @param {Array} tasks - Array of task objects
 * @returns {string} Formatted string representation
 */
function formatTasks(tasks) {
    if (tasks.length === 0) return 'No tasks to display';

    const header = 'ID  | Status      | Description';
    const separator = '-'.repeat(50);
    const rows = tasks.map(task => {
        const id = String(task.id).padEnd(3);
        const status = task.status.padEnd(11);
        return `${id}| ${status}| ${task.description}`;
    });

    return [header, separator, ...rows].join('\n');
}

module.exports = {
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    markTask,
    listTasks,
    formatTasks,
    VALID_STATUSES
};
