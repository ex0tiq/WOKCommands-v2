"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guild_prefix_schema_1 = __importDefault(require("../models/guild-prefix-schema"));
class PrefixHandler {
    // <guildId: prefix>
    _prefixes = new Map();
    _instance;
    constructor(instance) {
        this._instance = instance;
        // Skip prefix loading, handled by custom bot
        // this.loadPrefixes();
    }
    async loadPrefixes() {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const results = await guild_prefix_schema_1.default.find({});
        for (const result of results) {
            this._prefixes.set(result._id, result.prefix);
        }
    }
    get defaultPrefix() {
        return this._instance.defaultPrefix;
    }
    get(guildId) {
        if (!guildId) {
            return this.defaultPrefix;
        }
        return this._prefixes.get(guildId) || this.defaultPrefix;
    }
    async set(guildId, prefix) {
        /*
        if (!this._instance.isConnectedToDB) {
          return;
        }
        */
        this._prefixes.set(guildId, prefix);
        /*
        await guildPrefixSchema.findOneAndUpdate(
          {
            _id: guildId,
          },
          {
            _id: guildId,
            prefix,
          },
          {
            upsert: true,
          }
        );
         */
    }
}
exports.default = PrefixHandler;
