import { Ticket } from "../DAL/daos/MongoDB/ticketManager.mongo.js";
import config from "../config/config.js";
import Stripe from "stripe";

const key = config.stripe_secret_key;
const StripeInstance = new Stripe(key);

export const createPaymentStripe = async () => {
    const ticket = req.cookies.ticketId;
    const ticketDecod = Ticket.findById(ticket);
    console.log(ticketDecod, "vama");
    const requestBody = {
        amount: ticketDecod.amount,
        currency: 'usd'
    }
    const response = await StripeInstance.PaymentIntent.create(requestBody);
    console.log(response, "ultimo");
}