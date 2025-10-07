import Datastore from "nedb-promises";
import path from "path";

const log = (...args) => console.log("[nedbInstance]", ...args);

export default class mongoInstance {
  constructor(collectionName) {
    this.dbName = collectionName;
    this.collectionName = collectionName;

    if (!global.mongoDir) {
      throw new Error("global.mongoDir is not defined");
    }

    const dbPath = path.resolve(global.mongoDir, `${this.dbName}.db`);
    this.db = Datastore.create({ filename: dbPath });

    log(`Database ready: ${dbPath}`);
  }

  // Helper to ensure DB is loaded before any operation
  async _reload() {
    await this.db.loadDatabase();
  }

  async insertData(data) {
    try {
      await this._reload();
      const newDoc = await this.db.insert(data);
      log(`Inserted into ${this.collectionName}:`, newDoc);
      return { success: true, doc: newDoc };
    } catch (err) {
      log("Insert error:", err);
      return { success: false, error: err.message };
    }
  }

  async findData(query) {
    try {
      await this._reload();
      const docs = await this.db.find(query);
      return docs;
    } catch (err) {
      log("Find error:", err);
      return [];
    }
  }

  async findAllData() {
    try {
      await this._reload();
      const docs = await this.db.find({});
      return docs;
    } catch (err) {
      log("FindAll error:", err);
      return [];
    }
  }

  async pushToArray(query, field, value) {
    await this._reload();
    const doc = await this.db.findOne(query);
    if (!doc) return { error: "Document not found" };

    // Ensure array exists
    if (!Array.isArray(doc[field])) doc[field] = [];

    // Push new data
    doc[field].push(value);

    // Update full doc
    const numUpdated = await this.db.update({ _id: doc._id }, doc);
    return { updated: numUpdated };
  }


  async updateData(query, updates) {
    try {
      await this._reload();

      // Ensure the updated doc retains its _id if it's a full replace
      if (!updates._id && query._id) {
        updates._id = query._id;
      }

      // Perform full replacement, not a $set
      const numUpdated = await this.db.update(
        query,
        updates,
        { multi: false, upsert: false } // prevent new docs
      );

      log(`Fully replaced ${numUpdated} record(s) in ${this.collectionName}`);
      return { updated: numUpdated };
    } catch (err) {
      log("Update error:", err);
      return { error: err.message };
    }
  }


  async deleteData(query) {
    try {
      await this._reload();
      const numRemoved = await this.db.remove(query, { multi: true });
      log(`Deleted ${numRemoved} record(s) from ${this.collectionName}`);
      return { deleted: numRemoved };
    } catch (err) {
      log("Delete error:", err);
      return { error: err.message };
    }
  }

  async close() {
    // nedb-promises auto-saves, so no compact needed
    log("Database closed (auto-saved by nedb-promises).");
    return { success: true };
  }
}
