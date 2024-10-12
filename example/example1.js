// @ts-check
import { Queue } from "../src/index.js"; // import Queue class

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
