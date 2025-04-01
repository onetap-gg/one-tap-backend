import { Dao } from "../../utils/Classes/Dao";
import { Subscription } from "../Types/types";

interface SubscriptionsType {
  getSubscriptions: () => Promise<any>;
  setSubscription: (subscription: Subscription) => Promise<any>;
  deleteSubscription: (subscription: any) => Promise<any>;
  editSubscription: (subscription: Subscription, id: number) => Promise<any>;
}

class Subscriptions extends Dao implements SubscriptionsType {
  constructor() {
    super();
    if (this.dbInstance === null) this.throwError("DB instance is not present");
  }

  getSubscriptions: () => Promise<any> = async () => {
    this.logMethodCall("getSubscriptions");
    const { data, error } = await this.dbInstance!.from("subscriptions")
      .select()
      .eq("active", true);
    if (error) this.throwError(error);
    this.logMethodResult("getSubscriptions", data);
    return data;
  };

  deleteSubscription: (subscriptionId: number) => Promise<any> = async (
    subscriptionId
  ) => {
    this.logMethodCall("deleteSubscription", { subscriptionId });
    const response = await this.dbInstance!.from("subscriptions")
      .delete()
      .eq("id", subscriptionId);
    if (response.status === 204) {
      this.logMethodResult("deleteSubscription", "Successfully deleted");
      return response;
    } else this.throwError("SUBSCRIPTION NOT FOUND");
  };

  setSubscription: (subscription: Subscription) => Promise<any> = async (
    subscription
  ) => {
    this.logMethodCall("setSubscription", { subscription });
    const { data, error } = await this.dbInstance!.from("subscriptions")
      .insert({ ...subscription })
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("setSubscription", data);
    return data;
  };

  editSubscription: (subscription: Subscription, id: number) => Promise<any> =
    async (subscription, id) => {
      this.logMethodCall("editSubscription", { subscription, id });
      const { data, error } = await this.dbInstance!.from("subscriptions")
        .update({ ...subscription })
        .eq("id", id)
        .select();
      if (error) this.throwError(error);
      this.logMethodResult("editSubscription", data);
      return data;
    };

  updateExpiredSubscriptions: () => Promise<any> = async () => {
    this.logMethodCall("updateExpiredSubscriptions");
    const currentTime = new Date().toISOString();
    const { data, error } = await this.dbInstance!.from("subscriptions")
      .update({ active: false })
      .not("endTime", "is", null)
      .lt("endTime", currentTime)
      .eq("active", true)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("updateExpiredSubscriptions", data);
    return data;
  };

  deactivate: (subscriptionId: number) => Promise<any> = async (
    subscriptionId
  ) => {
    this.logMethodCall("deactivate", { subscriptionId });
    const { data, error } = await this.dbInstance!.from("subscriptions")
      .update({ active: false })
      .eq("id", subscriptionId)
      .select();
    if (error) this.throwError(error);
    this.logMethodResult("deactivate", data);
    return data;
  };
}

export const SubscriptionDao = new Subscriptions();
