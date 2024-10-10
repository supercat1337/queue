// @ts-check
import { Queue } from "../src/index.js"; // import Queue class

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
