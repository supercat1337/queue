

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
------------
```javascript
import { Queue } from "@supercat1337/queue"; // import Queue class

/**
 * Simulate a task that takes 1 second to complete.
 * @param {string} data - the task data
 */
async function task(data) { // define task function
    console.log(data); // log the task data
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
}

async function init() { 

    const queue = new Queue(); // create Queue instance
    const tasks_limit = 3; // set the limit of tasks in the queue

    let counter = 0; // initialize counter

    while (counter < 10) { // loop until counter is 10
        counter++; // increment counter

        queue.addTaskAndRun(async () => { // add task to queue and run it
            return task("task " + counter); // run the task
        });

        console.log("queue.size is " + queue.size); // log the size of the queue
        await queue.waitForLessThan(tasks_limit); // wait until the number of tasks in the queue is less than tasks_limit
    }

    await queue.waitUntilEmpty(); // wait until all tasks are completed
}

await init(); // call init function
```

**API Documentation**
--------------------

### Queue Class

### Methods
*   `addTaskAndRun(task)`: Add a task to the queue and run it. If the task resolves, it is removed from the queue. If the task rejects, the error is logged to the console and the task is removed from the queue.
*   `waitForLessThan(limit, wait_time=50)`: Wait until the number of tasks in the queue is less than the specified limit.
*   `waitUntilEmpty()`: Wait until all tasks are completed.
*   `add(...data)`: Add a task to the queue and return its task ID.
*   `remove(taskId)`: Remove a task from the queue by its task ID.
*   `on(event, listener)`: Subscribe to events on the Queue instance.

### Properties
*   `size`: The number of tasks in the queue.   

### Events
*   `add`: Emitted when a task is added to the queue.
*   `remove`: Emitted when a task is removed from the queue.

**License**
-------

Queue is licensed under the [MIT License](https://opensource.org/licenses/MIT).

**Contributing**
------------

Contributions are welcome! Please submit a pull request with your changes.