import { InteractionType } from "discord.js";
import path from "path";
import getAllFiles from "../util/get-all-files.js";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
class EventHandler {
    // <eventName, array of [function, dynamic validation functions]>
    _eventCallbacks = new Map();
    _instance;
    _eventsDir;
    _client;
    _events;
    _builtInEvents;
    constructor(instance, events, client) {
        this._instance = instance;
        this._eventsDir = events?.dir;
        this._events = events;
        this._client = client;
        this._builtInEvents = {
            interactionCreate: {
                isButton: (interaction) => interaction.isButton(),
                isCommand: (interaction) => interaction.type === InteractionType.ApplicationCommand,
                isAutocomplete: (interaction) => interaction.type === InteractionType.ApplicationCommandAutocomplete,
            },
            messageCreate: {
                isHuman: (message) => !message.author.bot,
            },
        };
        this.readFiles().then(() => this.registerEvents());
    }
    async readFiles() {
        const defaultEvents = await getAllFiles(path.join(__dirname, "events"), true);
        const folders = this._eventsDir ? await getAllFiles(this._eventsDir, true) : [];
        for (const { filePath: folderPath } of [...defaultEvents, ...folders]) {
            const event = folderPath.split(/[\/\\]/g).pop();
            const files = await getAllFiles(folderPath);
            const functions = this._eventCallbacks.get(event) || [];
            for (const { filePath, fileContents } of files) {
                const isBuiltIn = !folderPath.includes(this._eventsDir);
                const result = [fileContents];
                const split = filePath.split(event)[1].split(/[\/\\]/g);
                const methodName = split[split.length - 2];
                if (isBuiltIn &&
                    this._builtInEvents[event] &&
                    this._builtInEvents[event][methodName]) {
                    result.push(this._builtInEvents[event][methodName]);
                }
                else if (this._events[event] && this._events[event][methodName]) {
                    result.push(this._events[event][methodName]);
                }
                functions.push(result);
            }
            this._eventCallbacks.set(event, functions);
        }
    }
    registerEvents() {
        const instance = this._instance;
        for (const eventName of this._eventCallbacks.keys()) {
            const functions = this._eventCallbacks.get(eventName);
            this._client.on(eventName, async (...params) => {
                for (const [func, dynamicValidation] of functions) {
                    if (dynamicValidation && !(await dynamicValidation(...params))) {
                        continue;
                    }
                    func(...params, this._client, instance);
                }
            });
        }
    }
}
export default EventHandler;
