

**Queue**
================

A JavaScript class for managing tasks in a queue.

**Overview**
------------

Queue is a lightweight JavaScript class that provides a simple way to manage tasks in a queue. It emits events when tasks are added or removed, and provides methods for adding, removing, and waiting for tasks to complete.

**Features**
------------

*   **Task Queue**: Queue allows you to add tasks to a queue and manage their execution.
*   **Event Emission**: Queue emits events when tasks are added or removed from the queue.
*   **Task Management**: Queue provides methods for adding, removing, and waiting for tasks to complete.

**Usage**
-----

### Installation

To use Queue, simply import the class into your JavaScript file:
```javascript
import { Queue } from "@supercat1337/queue";
```
### Creating a Queue Instance

Create a new instance of the Queue class:
```javascript
const queue = new Queue();
```
### Adding Tasks

Add tasks to the queue using the `add` method:
```javascript
let taskId = queue.add('task 1');
let taskId2 = queue.add('task 2');
```
### Removing Tasks

Remove tasks from the queue using the `remove` method:
```javascript
queue.remove(taskId);
```
### Waiting for Tasks to Complete

Wait for tasks to complete using the `waitForQueueLimitIsFree` method:
```javascript
await queue.waitForQueueLimitIsFree(10);
```

Wait for all tasks to complete using the `waitForCompleteAll` method:
```javascript
await queue.waitForCompleteAll();
```

### Event Listening

Listen for events emitted by Queue using the `on` method:
```javascript
queue.on('add', (data, taskId) => {
    console.log(`Task added: ${data} (ID: ${taskId})`);
});

queue.on('remove', (taskId) => {
    console.log(`Task removed: ${taskId}`);
});
```

**Examples**
------------
```javascript
import { Queue } from "@supercat1337/queue"; // import Queue class

/**
 * Simulate a task that takes 1 second to complete.
 * @param {string} data - the task data
 * @returns {Promise<void>}
 */
async function task(data) { // define task function
    console.log(data); // log the task data
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
}

async function init() { 

    const queue = new Queue(); // create Queue instance
    const tasks_limit = 3; // set the limit of tasks in the queue

    queue.on("add", async (data, task_id) => { // subscribe to "add" event
        console.log("add", data, task_id); // log the task data and task ID

        await task(data); // run the task
        queue.remove(task_id); // remove the task
    });
    
    queue.on("remove", (task_id) => { // subscribe to "remove" event
        console.log("remove", task_id); // log the task ID
    });

    let counter = 0; // initialize counter

    while (counter < 10) { // loop until counter is 10
        counter++; // increment counter
        queue.add("task " + counter); // add task to queue
        console.log("queue.size is " + queue.size); // log the size of the queue
        await queue.waitForQueueLimitIsFree(tasks_limit); // wait until the number of tasks in the queue is less than tasks_limit
    }

    await queue.waitForCompleteAll(); // wait until all tasks are completed

}

await init(); // call init function
```

**API Documentation**
--------------------

### Queue Class

### Methods

*   `add(...data)`: Add a task to the queue and return its task ID.
*   `remove(taskId)`: Remove a task from the queue by its task ID.
*   `waitForQueueLimitIsFree(queueLimit, waitTime = 50)`: Wait until the number of tasks in the queue is less than the specified limit.
*   `waitForCompleteAll()`: Wait until all tasks are completed.
*   `on(event, listener)`: Subscribe to events on the Queue instance.

**License**
-------

Queue is licensed under the [MIT License](https://opensource.org/licenses/MIT).

**Contributing**
------------

Contributions are welcome! Please submit a pull request with your changes.