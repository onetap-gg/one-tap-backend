import { DB } from "../../db/DB"

export class Dao extends DB{
    
    constructor(){
        super()
    }

    protected throwError= (error : any)=>{
        if(typeof error === "string")
            throw new Error (error)
        else
            throw new Error (JSON.stringify(error))
    }
}