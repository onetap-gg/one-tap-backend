import { createClient,SupabaseClient } from "@supabase/supabase-js";
import { envVariables } from "../utils/envVariables";

const {DB_URL ,DB_KEY} = envVariables

export class DB {
    protected dbInstance:SupabaseClient | null= null
    private static instance :DB | null = null

    protected constructor(){
        if(this.dbInstance === null){
            this.dbInstance = createClient(DB_URL ,DB_KEY);
            console.log("connected to DB")
        }
    }

    public static getInstance():DB {
        if(DB.instance === null){
            DB.instance = new DB()
        }
        return DB.instance
    }

    public connectToDb():void{
        
    }

}
