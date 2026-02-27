/**
 * Test suite for Task Tracker CLI
 */

const fs = require('fs');
const path = require('path');
const taskManager = require('../src/task-manager');

// Test file path
const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

// Track test results
let passed = 0;
let failed = 0;

/**
 * Simple test runner
 */
function test(description, fn) {
    try {
        fn();
        console.log(`✓ ${description}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${description}`);
        console.log(`  Error: ${error.message}`);
        failed++;
    }
}

/**
 * Assert helper
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

/**
 * Setup - clean tasks file before each test
 */
function setup() {
    if (fs.existsSync(TASKS_FILE)) {
        fs.unlinkSync(TASKS_FILE);
    }
}

// Run tests
console.log('Running Task Tracker Tests\n');

// Test: loadTasks creates empty array if no file exists
test('loadTasks creates empty array if no file exists', () => {
    setup();
    const tasks = taskManager.loadTasks();
    assert(Array.isArray(tasks), 'Tasks should be an array');
    assert(tasks.length === 0, 'Tasks should be empty');
});

// Test: addTask creates a new task
test('addTask creates a new task with correct properties', () => {
    setup();
    const result = taskManager.addTask('Test task 1');
    assert(result.success, 'addTask should succeed');
    assert(result.message.includes('ID: 1'), 'Should include ID 1');
    
    const tasks = taskManager.loadTasks();
    assert(tasks.length === 1, 'Should have 1 task');
    assert(tasks[0].description === 'Test task 1', 'Description should match');
    assert(tasks[0].status === 'todo', 'Status should be todo');
    assert(tasks[0].id === 1, 'ID should be 1');
});

// Test: addTask increments ID
test('addTask increments ID for each new task', () => {
    setup();
    taskManager.addTask('Task 1');
    taskManager.addTask('Task 2');
    taskManager.addTask('Task 3');
    
    const tasks = taskManager.loadTasks();
    assert(tasks.length === 3, 'Should have 3 tasks');
    assert(tasks[0].id === 1, 'First task ID should be 1');
    assert(tasks[1].id === 2, 'Second task ID should be 2');
    assert(tasks[2].id === 3, 'Third task ID should be 3');
});

// Test: addTask rejects empty description
test('addTask rejects empty description', () => {
    setup();
    const result = taskManager.addTask('');
    assert(!result.success, 'Should fail for empty description');
});

// Test: updateTask updates description
test('updateTask updates task description', () => {
    setup();
    taskManager.addTask('Original description');
    const result = taskManager.updateTask(1, 'Updated description');
    assert(result.success, 'updateTask should succeed');
    
    const tasks = taskManager.loadTasks();
    assert(tasks[0].description === 'Updated description', 'Description should be updated');
});

// Test: updateTask fails for non-existent task
test('updateTask fails for non-existent task', () => {
    setup();
    const result = taskManager.updateTask(999, 'New description');
    assert(!result.success, 'Should fail for non-existent task');
});

// Test: deleteTask removes task
test('deleteTask removes task', () => {
    setup();
    taskManager.addTask('Task 1');
    taskManager.addTask('Task 2');
    
    const result = taskManager.deleteTask(1);
    assert(result.success, 'deleteTask should succeed');
    
    const tasks = taskManager.loadTasks();
    assert(tasks.length === 1, 'Should have 1 task');
    assert(tasks[0].id === 2, 'Remaining task should have ID 2');
});

// Test: markTask changes status
test('markTask changes task status', () => {
    setup();
    taskManager.addTask('Task 1');
    
    let result = taskManager.markTask(1, 'in-progress');
    assert(result.success, 'markTask to in-progress should succeed');
    
    let tasks = taskManager.loadTasks();
    assert(tasks[0].status === 'in-progress', 'Status should be in-progress');
    
    result = taskManager.markTask(1, 'done');
    assert(result.success, 'markTask to done should succeed');
    
    tasks = taskManager.loadTasks();
    assert(tasks[0].status === 'done', 'Status should be done');
});

// Test: listTasks returns all tasks
test('listTasks returns all tasks', () => {
    setup();
    taskManager.addTask('Task 1');
    taskManager.addTask('Task 2');
    taskManager.addTask('Task 3');
    
    const result = taskManager.listTasks();
    assert(result.success, 'listTasks should succeed');
    assert(result.tasks.length === 3, 'Should return 3 tasks');
});

// Test: listTasks filters by status
test('listTasks filters by status', () => {
    setup();
    taskManager.addTask('Task 1');
    taskManager.addTask('Task 2');
    taskManager.markTask(1, 'done');
    
    const resultDone = taskManager.listTasks('done');
    assert(resultDone.success, 'listTasks done should succeed');
    assert(resultDone.tasks.length === 1, 'Should return 1 done task');
    
    const resultTodo = taskManager.listTasks('todo');
    assert(resultTodo.success, 'listTasks todo should succeed');
    assert(resultTodo.tasks.length === 1, 'Should return 1 todo task');
});

// Test: formatTasks formats tasks correctly
test('formatTasks formats tasks for display', () => {
    setup();
    taskManager.addTask('Test task');
    const result = taskManager.listTasks();
    const formatted = taskManager.formatTasks(result.tasks);
    
    assert(formatted.includes('ID'), 'Should include ID header');
    assert(formatted.includes('Status'), 'Should include Status header');
    assert(formatted.includes('Test task'), 'Should include task description');
});

// Cleanup
setup();

// Print results
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

// Exit with appropriate code
process.exit(failed > 0 ? 1 : 0);