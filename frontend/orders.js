import { getdeliveryoption } from "./data/deliveryoptions.js"; 
import { cartcounter,loadcart } from "./data/cart.js";
import { checkAuth } from "./auth.js";

await checkAuth();
const cart = await loadcart();
const response = await fetch(`http://localhost:3069/api/orders`,
    {
      credentials: "include"
    });
const rows = await response.json();
cartcounter(cart);
const  orders = {};
 rows.forEach((row)=>{
     if(!orders[row.order_id]){
         orders[row.order_id] = {
             order_id : row.order_id,
             order_date : row.order_date,
             products : [],
             order_total : 0
         };
     }

     orders[row.order_id].products.push({
         productid : row.product_id,
         name : row.name,
         image : row.image,
         price : row.price_cents,
         quantity : row.quantity,
         deliveryoption : row.deliveryoption
     });
     orders[row.order_id].order_total += (row.price_cents * row.quantity);
 });
const ordersarray = Object.values(orders);

let ordergridhtml = '';

ordersarray.forEach((order)=>{
         ordergridhtml += ` <div class="order-container">
          
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${order.order_date}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${(order.order_total / 100).toFixed(2)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.order_id}</div>
            </div>
          </div>

          <div class="order-details-grid">
         
            ${htmlgen(order.products,order.order_date,order.order_id)}
          </div>
        </div>`
});
    document.querySelector('.js-orders-grid').innerHTML = ordergridhtml; 
function htmlgen(products,order_date,orderid){
    let orderhtml = '';
    products.forEach((product) => {
      const deliveryOption = getdeliveryoption(product.deliveryoption);
  console.log(product.deliveryoption);
console.log(deliveryOption);
const deliveryDate = new Date(order_date);

deliveryDate.setDate(
    deliveryDate.getDate() + deliveryOption.deliverydays
);
const datestring = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});
orderhtml +=   `<div class="product-image-container">
                <img src="${product.image}">
                </div>

                <div class="product-details">
                <div class="product-name">
                ${product.name}
                </div>
                <div class="product-delivery-date">
                    Arriving on: ${datestring}
                </div>
                <div class="product-quantity">
                    Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                </button>
                </div>

                <div class="product-actions">
                <a href="tracking.html?orderid=${orderid}&productid=${product.productid}">
                    <button class="track-package-button button-secondary">
                    Track package
                    </button>
                </a>
                </div>`
    });
   return orderhtml;
}


