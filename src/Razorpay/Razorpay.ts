import Razorpay from "razorpay";
import { envVariables } from "../utils/envVariables";

export class RazorpayClient {
    protected razorpayInstance: Razorpay | null = null;
    private static instance: RazorpayClient | null = null;

    protected constructor() {
        if (this.razorpayInstance === null) {
            this.razorpayInstance = new Razorpay({
                key_id: envVariables.RAZORPAY_KEY,
                key_secret: envVariables.RAZORPAY_SECRET,
            });
            console.log("Razorpay client initialized");
        }
    }

    public static getInstance(): RazorpayClient {
        if (RazorpayClient.instance === null) {
            RazorpayClient.instance = new RazorpayClient();
        }
        return RazorpayClient.instance;
    }

    public getClient(): Razorpay {
        if (!this.razorpayInstance) {
            throw new Error("Razorpay client not initialized");
        }
        return this.razorpayInstance;
    }

    // Optional: Add specific Razorpay methods you commonly use
    public async createOrder(options: any) {
        return this.getClient().orders.create(options);
    }

    public async verifyPayment(paymentId: string, orderId: string, signature: string) {
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', envVariables.RAZORPAY_SECRET);
        hmac.update(orderId + '|' + paymentId);
        const generatedSignature = hmac.digest('hex');
        return generatedSignature === signature;
    }
}