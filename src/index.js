// @ts-check

import { EventEmitter } from "@supercat1337/event-emitter";

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
    #eventEmitter = /** @type {EventEmitter<"add"|"remove"|"empty"|"change">} */ (new EventEmitter);

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

        this.#eventEmitter.emit("change");

        if (this.#size === 0) {
            this.#eventEmitter.emit("empty");
        }
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
     * @returns {Promise<void>}
     */
    waitForLessThan(limit) {

        if (this.#size < limit) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            const unsubscribe = this.#eventEmitter.on("change", () => {

                if (this.#size <= limit) {
                    unsubscribe();
                    resolve();
                }

            });    
        });
    }

    /**
     * Wait until all tasks are completed
     * @returns {Promise<any>}
     */
    waitUntilEmpty() {

        if (this.#size === 0) {
            return Promise.resolve();
        }

        return this.#eventEmitter.waitForEvent("empty");
    }
}
