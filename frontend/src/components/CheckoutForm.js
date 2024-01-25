import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios'

const CheckoutForm = () => {

    const stripe = useStripe();
    const elements = useElements();

    const data = {
        userId: '65ae4c2fdc6b8bfc3cc46bf9',
        productId: "659e653c9bc133a77133306a",
        stripeProductId: "prod_PLfY58JEqHTprP",
        amount: 100,
        customerId: "cus_PQBisoZ5vxNunP",
        priceId: "price_1OWyDYIRWDZKhzHn13l7sF6H",
        stripeSubscriptionId: "sub_1ObLWaIRWDZKhzHnioQrtWH0"
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.redirectToCheckout({
           sessionId: 'cs_test_a15qvZ4vIpuRpLcA5ikCaI7vAblnRiF0d1m4RPQOBrHJcQBSweMwmnezwf'
        })

        if (result.error) {
            console.log(result.error)
        } else {
            console.log('payment done')
            // await axios.post('http://localhost:4000/subscriptions/confirm', data)
            //     .then((res) => console.log(res.data))
            //     .catch((err) => console.log(err))
        }
    }

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     if (!stripe || !elements) {
    //         return;
    //     }

    //     const result = await stripe.confirmPayment({
    //         elements,
    //         confirmParams: {
    //         },
    //         redirect: 'if_required'
    //     })

    //     if (result.error) {
    //         console.log(result.error.message);
    //     } else {
    //         await axios.post('http://localhost:4000/subscriptions/confirm', data)
    //             .then((res) => console.log(res.data))
    //             .catch((err) => console.log(err))
    //     }
    // }

    return (

        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button>Submit</button>
        </form>

    )
}

export default CheckoutForm