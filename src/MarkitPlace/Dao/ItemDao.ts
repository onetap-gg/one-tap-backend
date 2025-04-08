import { Dao } from "../../utils/Classes/Dao";

interface IItem {
  setItem: (item: Item) => Promise<any>;
  deleteItem: (itemId: string) => Promise<any>;
  editItem: (item: Item, id: number) => Promise<any>;
  getItemById: (itemId: string) => Promise<any>;
}

interface Item {
  id?: number;
  itemName: string;
  itemType: string;
  itemValue: number | null;
  extraDetails: string;
  itemImage: string | null;
  gameId: number;
}

class ItemDao extends Dao implements IItem {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  setItem: (item: Item) => Promise<any> = async (item) => {
    this.logMethodCall("setItem", { item });
    const { data, error } = await this.dbInstance!.from("Item")
      .insert({ ...item })
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("setItem", data);
    return data;
  };

  deleteItem: (itemId: string) => Promise<any> = async (itemId) => {
    this.logMethodCall("deleteItem", { itemId });
    const response = await this.dbInstance!.from("Item")
      .delete()
      .eq("id", itemId);
    if (response.status === 204) {
      this.logMethodResult("deleteItem", "Successfully deleted");
      return response;
    } else this.throwError("ITEM NOT FOUND");
  };

  editItem: (item: Item, id: number) => Promise<any> = async (item, id) => {
    this.logMethodCall("editItem", { item, id });
    const { data, error } = await this.dbInstance!.from("Item")
      .update({ ...item })
      .eq("id", id)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("editItem", data);
    return data;
  };

  getItemById: (itemId: string) => Promise<any> = async (itemId) => {
    this.logMethodCall("getItemById", { itemId });
    const { data, error } = await this.dbInstance!.from("Item")
      .select()
      .eq("id", itemId);
    if (error) this.throwError(error);
    this.logMethodResult("getItemById", data);
    return data;
  };
}

export const itemDao = new ItemDao();
