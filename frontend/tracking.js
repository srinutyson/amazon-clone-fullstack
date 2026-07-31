import { getdeliveryoption } from "./data/deliveryoptions.js";
import { loadcart , cartcounter } from "./data/cart.js";
import { checkAuth } from "./auth.js";

await checkAuth();
const cart = await loadcart();
cartcounter(cart);
const params = new URLSearchParams(window.location.search);
const orderid = params.get("orderid");
const productid = params.get("productid");

const response  = await fetch(`https://amazon-clone-fullstack-production-5e4c.up.railway.app/api/orders/${orderid}/products/${productid}`,
    {
      credentials: "include"
    });

const product = await response.json();
const deliveryOption = getdeliveryoption(product.deliveryoption);
const orderDate = new Date(product.order_date);

const deliveryDate = new Date(product.order_date);
deliveryDate.setDate(
    deliveryDate.getDate() + deliveryOption.deliverydays
);

const today = new Date();
 const totaltime = deliveryDate-orderDate;
 const  timespent = today-orderDate;
 let progress = (timespent/totaltime) * 100;
   progress = Math.max(0,Math.min(100,progress));
    const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});
let preparing = "";
let shipped = "";
let delivered = "";

if (progress < 50) {
    preparing = "current-status";
} else if (progress < 100) {
    shipped = "current-status";
} else {
    delivered = "current-status";
}
let trackhtml = ` <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${formattedDate}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${product.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${preparing}">
            Preparing
          </div>
          <div class="progress-label ${shipped}">
            Shipped
          </div>
          <div class="progress-label ${delivered}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style = "width : ${progress}%"></div>
        </div>
      </div>`;
document.querySelector('.js-main').innerHTML = trackhtml;