// @ts-check

import { EventEmitter } from "@supercat1337/event-emitter";

/**
 * @param {number} ms 
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
Queue Methods:
 - add - add a task to the queue and return its task ID. This method emits an "add" event with the data and the task ID.
 - remove - remove a task from the queue. This method emits a "remove" event with the task ID.
 - waitUntilEmpty - wait until the number of task id's in the queue is less than queue_limit. 
 - on - subscribe to events on the Queue. This method is a direct passthrough to the EventEmitter's on method. 

Queue Properties:
 - size - the number of tasks in the queue

Queue Events:
 - add - (data, task_id) - emitted when a new task is added to the queue. data is the data passed to the add method, and task_id is the task ID.
 - remove - (task_id) - emitted when a task is removed from the queue. task_id is the task ID.


Example usage:

import { Queue } from "./queue.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function task(data) {
    console.log(data);
    await sleep(1000);
}

async function init() {
    
    const queue = new Queue();
    const tasks_limit = 10;

    queue.on("add", async (task_id, data) => {
        console.log("add", task_id, data);

        await task(data);
        queue.remove(task_id);
    });
    
    queue.on("remove", (task_id) => {
        console.log("remove", task_id);
    });

    let counter = 0;

    while (counter < 100) {
        counter++;
        queue.add("task " + counter);
        console.log("queue.size is " + queue.size);
        await queue.waitUntilEmpty(tasks_limit);
    }

}

init();

 */

/**
 * Queue class. This class is used to manage the tasks in the queue. 
 * It emits events when tasks are added or removed. 
 */
export class Queue {
    #last_task_id = 0

    /**
     * Set of task id's
     * @type {Set<number>}
     */
    #data = new Set;
    /**
     * Number of task id's in the queue
     */
    #size = 0
    /**
     * EventEmitter to emit events on add/remove operations
     */
    #eventEmitter = /** @type {EventEmitter<"add"|"remove">} */ (new EventEmitter);

    /**
     * Subscribe to events on the Queue. This method is a direct passthrough to the EventEmitter's on method.
     * @param {"add"|"remove"} event - name of the event to listen to
     * @param {Function} listener - function that will be called when the event is emitted
     * @returns {Function} unsubscriber function that can be used to unsubscribe from the event
     */
    on(event, listener) {
        return this.#eventEmitter.on(event, listener);
    }

    /**
     * Add a task to the queue and return its task ID. This method emits an "add" event with the data and the task ID.
     * @param {...any} data
     * @returns {number} task ID
     */
    add(...data) {
        this.#last_task_id++;

        let task_id = this.#last_task_id;

        this.#data.add(task_id);
        this.#size++;
        this.#eventEmitter.emit("add", task_id, data);
        return task_id;
    }

    /**
     * Remove a task from the queue by its task ID. This method emits a "remove" event with the task ID.
     * @param {number} task_id
     */
    remove(task_id) {
        if (!this.#data.has(task_id)) return;

        this.#data.delete(task_id);
        this.#size--;
        this.#eventEmitter.emit("remove", task_id);
    }

    /**
     * Add a task to the queue and run it. If the task resolves, it is removed from the queue. If the task rejects, the error is logged to the console and the task is removed from the queue.
     * @template {Function} T
     * @param {T} task - the task to be added and run
     * @returns {Promise<null|ReturnType<task>>} - the result of the task
     */
    async addTaskAndRun(task) {
        const task_id = this.add(task);
        let result = null;
        try {
            result = await task();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            this.remove(task_id);
        }

        return result;
    }

    /**
     * The number of tasks in the queue
     * @type {number}
     * @readonly
     */
    get size() {
        return this.#size;
    }


    /**
     * Wait until the number of task id's in the queue is less than limit
     * @param {number} limit - sets the limit of the number of tasks in the queue
     * @param {number} [wait_time=50] - sets the time to wait until the number of tasks in the queue is less than limit
     * @returns {Promise<void>}
     */
    async waitForLessThan(limit, wait_time = 50) {
        while (this.size >= limit) {
            await sleep(wait_time);
        }
    }

    /**
     * Wait until all tasks are completed
     * @returns {Promise<void>}
     */
    async waitUntilEmpty() {
        while (this.size > 0) {
            await sleep(50);
        }
    }
}
