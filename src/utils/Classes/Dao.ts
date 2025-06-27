import { DB } from "../../db/DB";

export class Dao extends DB {
  constructor() {
    super();
    console.log("[DAO] Base DAO class initialized");
  }

  protected throwError = (error: any) => {
    console.error("[DAO] Error occurred:", error);
    if (typeof error === "string") throw new Error(error);
    else throw new Error(JSON.stringify(error));
  };

  protected logMethodCall = (methodName: string, params: any = {}) => {
    console.log(`[DAO] Method called: ${methodName}`, params);
  };

  protected logMethodResult = (methodName: string, result: any) => {
    console.log(`[DAO] Method result: ${methodName}`, result);
  };
}
