"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const envVariables_1 = require("../utils/envVariables");
const { DB_URL, DB_KEY } = envVariables_1.envVariables;
class DB {
    constructor() {
        this.dbInstance = null;
        if (this.dbInstance === null) {
            this.dbInstance = (0, supabase_js_1.createClient)(DB_URL, DB_KEY);
            console.log("connected to DB");
        }
    }
    static getInstance() {
        if (DB.instance === null) {
            DB.instance = new DB();
        }
        return DB.instance;
    }
    connectToDb() {
    }
}
exports.DB = DB;
DB.instance = null;
