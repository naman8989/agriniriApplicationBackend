#!/usr/bin/env node
import { globSync } from "fs";
import loki from "lokijs";

const log = (...args) => console.log("[mongoInstance]", ...args);

export default class mongoInstance {
  constructor(collectionName) {
    this.dbName = collectionName ;
    this.collectionName = collectionName;
    this.dbReady = false;

    this.db = new loki(global.mongoDir+`${this.dbName}.json`, {
      autoload: true,
      autoloadCallback: () => {
        this.initializeCollection();
        this.dbReady = true;
      },
      autosave: true,
      autosaveInterval: 4000,
    });
  }

  initializeCollection() {
    this.currentCollection = this.db.getCollection(this.collectionName);
    if (!this.currentCollection) {
      this.currentCollection = this.db.addCollection(this.collectionName, { unique: ["id"] });
    }
    log(`Collection ready: ${this.collectionName}`);
  }

  async waitForReady() {
    if (this.dbReady && this.currentCollection) return;
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.dbReady && this.currentCollection) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  async insertData(data) {
    await this.waitForReady();
    try {
      this.currentCollection.insert(data);
      log(`Inserted into ${this.collectionName}:`, data);
      return { success: true };
    } catch (err) {
      log("Insert error:", err);
      return { success: false, error: err.message };
    }
  }

  async findData(query) {
    await this.waitForReady();
    try {
      const results = this.currentCollection.find(query);
      return results;
    } catch (err) {
      log("Find error:", err);
      return [];
    }
  }

  async findAllData() {
    await this.waitForReady();
    try {
      const results = this.currentCollection.find();
      return results;
    } catch (err) {
      log("FindAll error:", err);
      return [];
    }
  }

  async updateData(query, updates) {
    await this.waitForReady();
    try {
      const docs = this.currentCollection.find(query);
      if (docs.length === 0) return { updated: 0 };

      docs.forEach((doc) => {
        Object.assign(doc, updates);
        this.currentCollection.update(doc);
      });
      log(`Updated ${docs.length} record(s)`);
      return { updated: docs.length };
    } catch (err) {
      log("Update error:", err);
      return { error: err.message };
    }
  }

  async deleteData(query) {
    await this.waitForReady();
    try {
      const docs = this.currentCollection.find(query);
      if (docs.length === 0) return { deleted: 0 };

      docs.forEach((doc) => this.currentCollection.remove(doc));
      log(`Deleted ${docs.length} record(s)`);
      return { deleted: docs.length };
    } catch (err) {
      log("Delete error:", err);
      return { error: err.message };
    }
  }

  async close() {
    await this.waitForReady();
    return new Promise((resolve, reject) => {
      this.db.saveDatabase((err) => {
        if (err) return reject(err);
        this.currentCollection = null;
        this.db = null;
        log("Database closed.");
        resolve({ success: true });
      });
    });
  }
}

/* -------------------------
   🧠 Command-Line Interface
   ------------------------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, collection, action, ...args] = process.argv;

  if (!collection || !action) {
    console.log(`
Usage:
  node mongoDatabase.mjs <collectionName> <action> [jsonArgs]

Actions:
  insert   <json>              Insert a record
  find     <json>              Find with query
  findAll                     Get all records
  update   <queryJSON> <updateJSON>  Update records
  delete   <queryJSON>         Delete records

Examples:
  node mongoDatabase.mjs users insert '{"name": "Naman", "email": "test@example.com"}'
  node mongoDatabase.mjs users find '{"name": "Naman"}'
  node mongoDatabase.mjs users findAll
  node mongoDatabase.mjs users update '{"name": "Naman"}' '{"email": "new@example.com"}'
  node mongoDatabase.mjs users delete '{"name": "Naman"}'
`);
    process.exit(1);
  }

  const instance = new mongoInstance(collection, "./usersAppDetails.json");

  (async () => {
    await instance.waitForReady();

    try {
      if (action === "insert") {
        const data = JSON.parse(args[0] || "{}");
        await instance.insertData(data);

      } else if (action === "find") {
        let query = {};
        try {
          query = args[0] ? JSON.parse(args[0]) : {};
        } catch {
          console.warn("⚠️ Invalid JSON — using {}");
        }
        const res = await instance.findData(query);
        console.log("\n🟢 Query Results:");
        console.log(JSON.stringify(res, null, 2));

      } else if (action === "findAll") {
        const res = await instance.findAllData();
        console.log("\n📦 All Documents:");
        console.log(JSON.stringify(res, null, 2));

      } else if (action === "update") {
        const query = JSON.parse(args[0] || "{}");
        const updates = JSON.parse(args[1] || "{}");
        const res = await instance.updateData(query, updates);
        console.log("\n✏️ Update Result:", res);

      } else if (action === "delete") {
        const query = JSON.parse(args[0] || "{}");
        const res = await instance.deleteData(query);
        console.log("\n🗑️ Delete Result:", res);

      } else {
        console.log("Unknown action:", action);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    } finally {
      await instance.close();
    }
  })();
}
