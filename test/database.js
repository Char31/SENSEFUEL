const couchbase = require("couchbase");

// We only store 1 doc: 1 cart for 1 user
const key = "document_key"

class Database {
    //TODO handle multiple buckets and multiple collection per bucket
    #cluster
    #bucket;
    #collection;

    constructor() {
        this.init().then(() => {
            console.log("Database initialized");
        }).catch((e) => {
            console.log("Could not init db", e);
        })
    }

    async upsert(doc) {
        try {
            await this.#collection.upsert(key, doc);
            return doc;
        } catch (error) {
            console.error("could not upsert", error);
        }
    }

    async getOne() {
        const res = await this.#collection.get(key)
        return res.content
    }

    // Nevermind, not needed, we'll only store one doc
    async getAll() {
        const query = `
    SELECT * FROM \`cart\`
  `;
        const result = await this.#cluster.query(query);

        let allDocs = [];
        result.rows.forEach((row) => {
            allDocs = allDocs.concat(row);
        })

        return allDocs
    }

    // TODO more robust connection, retry on failure, reconnect
    async init() {
        // TODO create non admin users
        this.#cluster = await couchbase.connect("couchbase://" + process.env.DB_HOST, {
            username: process.env.DB_ADMIN_USER,
            password: process.env.DB_ADMIN_PWD,
        });
         
        //TODO create it programatically if it does not exist
        this.#bucket = this.#cluster.bucket(process.env.COUCHBASE_BUCKET);
        this.#collection = this.#bucket.defaultCollection();
    }
}

// We only want 1 instance of Database, accessible anywhere
class Singleton {

    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Database();
        }
    }

    getInstance() {
        return Singleton.instance;
    }

}

module.exports = Singleton
