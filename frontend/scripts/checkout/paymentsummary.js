import {getdeliveryoption} from '../../data/deliveryoptions.js'
import {placeorder,loadcart} from '../../data/cart.js'
let cart =[];

export async function renderpayment(){
    
    cart = await loadcart();
   let  productpricecents = 0;
   let shippingcost = 0;
    cart.forEach((cartitem)=>{
       productpricecents += cartitem.price_cents * cartitem.quantity;
       console.log(cartitem.deliveryoption, typeof cartitem.deliveryoption);
       const deliveryoption =  getdeliveryoption(cartitem.deliveryoption);
   shippingcost += deliveryoption.pricecents;
    });
   
    let totalbeforetax = productpricecents+shippingcost;
    let taxcents = totalbeforetax * 0.1;
    const totalcents = totalbeforetax+taxcents;
    const paymenthtml =
        `<div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
        <div>Items (${cart.length}):</div>
        <div class="payment-summary-money">$${(productpricecents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${(shippingcost/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${(totalbeforetax/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${(taxcents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${(totalcents/100).toFixed(2)}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>`;

 document.querySelector('.js-payment-summary')
 .innerHTML = paymenthtml;
 document.querySelector('.place-order-button').addEventListener('click',async () =>{
      const order =    await placeorder();
      console.log(order);
      window.location.href = 'orders.html'
 });
}
