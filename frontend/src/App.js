import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './components/CheckoutForm';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51OQ5O7IRWDZKhzHnoQPIkOFnWM7uzhsupRLy70AjRP0dE64AisbMYxJlEXtW9QwKHOcaMv9N96CgCCg3ZJEFBLzn00K0w9f37X')

export default function App() {

  const options = {
    clientSecret: ''
  }


  return (

    // <Elements
    //   stripe={stripePromise}
    //   options={options} >
    //  <CheckoutForm />
    // </Elements>

    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>


  )

}