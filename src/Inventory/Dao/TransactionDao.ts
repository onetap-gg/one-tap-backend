import { Dao } from "../../utils/Classes/Dao";
import { Transaction } from "../Types/types";

interface DaoType {
  recordTransaction: (transaction: Transaction) => Promise<any>;
  getTransactionsByUserId: (userId: string) => Promise<any>;
}

class TransactionDao extends Dao implements DaoType {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  recordTransaction: (transaction: Transaction) => Promise<any> = async (
    transaction
  ) => {
    this.logMethodCall("recordTransaction", { transaction });
    try {
      const { data, error } = await this.dbInstance!.from("transactions")
        .insert(transaction)
        .select();

      if (error) {
        console.error("Error recording transaction:", error);
        // Don't throw error, just log it
        return null;
      }

      this.logMethodResult("recordTransaction", data);
      return data;
    } catch (err) {
      console.error("Error in recordTransaction:", err);
      // Don't throw error, just log it
      return null;
    }
  };

  getTransactionsByUserId: (userId: string) => Promise<any> = async (
    userId
  ) => {
    this.logMethodCall("getTransactionsByUserId", { userId });
    const { data, error } = await this.dbInstance!.from("transactions")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) this.throwError(error);
    this.logMethodResult("getTransactionsByUserId", data);
    return data;
  };
}

export const transactionDao = new TransactionDao();
