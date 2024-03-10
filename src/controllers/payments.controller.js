import { createPaymentStripe} from '../service/payments.service.js'
 
export const createdPayment = async (req,res) => {
    // const { id } = req.query;
    try {
        console.log("hola");
        const payment = await createPaymentStripe();
        console.log(payment, "pleeee");
        res.json({message: "payment", payload: payment})
    } catch (error) {
        res.json({message: error})
    }
}