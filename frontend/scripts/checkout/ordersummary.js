
import {removefromcart,updatedeliveryoption,updateitem,loadcart} from '../../data/cart.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import {deliveryoptions} from '../../data/deliveryoptions.js'
import { renderpayment } from './paymentsummary.js'

let cart =[];
cart = await loadcart();

console.log("order loaded")
   
export function renderpage(){
       
    let cartsummaryhtml = '';
    cart.forEach((cartitem)=>{
        const did = cartitem.deliveryoption;
        let doption;
        deliveryoptions.forEach((option) =>{
            if(option.id === did){
                doption = option;
            }
        });

      console.log("did:", did);
console.log("deliveryoptions:", deliveryoptions);
console.log("doption:", doption);
            const t = dayjs();
                    console.log("45");
            const ddate = t.add(doption.deliverydays,'days');
                console.log("m");
            const dstring = ddate.format('dddd, MMMM D');
            
       
                
            cartsummaryhtml += 
            `<div class="cart-item-container js-item-${cartitem.id}">
                <div class="delivery-date">
                Delivery date: ${dstring}
                </div>
                    
                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${cartitem.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                    ${cartitem.name}
                    </div>
                    <div class="product-price">
                    $${(cartitem.price_cents/100).toFixed(2)}
                    </div>
                    <div class="product-quantity">
                   <span>Quantity:</span>

                    <div class="quantity-controls">
                        <button
                            class="js-decrease-quantity"
                            data-product-id="${cartitem.id}">
                            -
                        </button>

                        <span class="quantity-label">
                            ${cartitem.quantity}
                        </span>

                        <button
                            class="js-increase-quantity"
                            data-product-id="${cartitem.id}">
                            +
                        </button>
                    </div>
                       <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${cartitem.id}">
                        Delete
                    </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                    ${deliveryhtml(cartitem)}
                </div>
                </div>
            </div>`
            
    });
       
      const countc = cart.reduce((sum, item) => sum + item.quantity, 0);
     let headhtml = `Checkout (<a class="return-to-home-link"
     href="amazon.html">${countc} items</a>)`;
    document.querySelector('.js-checkhead').innerHTML = headhtml;
        
    function deliveryhtml(cartitem) {
        let html = '';
        deliveryoptions.forEach((deliveryoption) =>{
            const today = dayjs();
            const deliverydate = today.add(deliveryoption.deliverydays,'days');
            const datestring = deliverydate.format('dddd, MMMM D');
            const pricestring = deliveryoption.pricecents === 0 ? 'FREE' : `$${(deliveryoption.pricecents/100).toFixed(2)}`;  
        const ischecked = deliveryoption.id === cartitem.deliveryoption; 
        html +=    `<div class="delivery-option js-doption"
                data-product-id = "${cartitem.id}"
                data-delivery-option-id = "${deliveryoption.id}"
        >
                    <input type="radio"
                    ${ischecked ? 'checked' : ''}
                        class="delivery-option-input"
                        name="delivery-option-${cartitem.id}">
                    <div>
                        <div class="delivery-option-date">
                        ${datestring}
                        </div>
                        <div class="delivery-option-price">
                        ${pricestring}- Shipping
                        </div>
                    </div>
                    </div>`
        });
        return html;
    }

    document.querySelector('.js-osummary').innerHTML = cartsummaryhtml;
    console.log("fire is ass");
    document.querySelectorAll('.js-delete-link').forEach((link)=>{
        link.addEventListener('click',async () =>{
        const prodid = link.dataset.productId;
      
        cart = await  removefromcart(prodid);
        await renderpayment();
        renderpage();
    });
    });

    document.querySelectorAll('.js-doption').forEach((element)=>{
        element.addEventListener('click',async () =>{
            const {productId, deliveryOptionId} = element.dataset;
      cart = await   updatedeliveryoption(productId,deliveryOptionId);
        renderpage();
        await  renderpayment();
        });
    });
    document.querySelectorAll('.js-increase-quantity').forEach((element) =>{
        element.addEventListener('click',async () =>{
            const {productId} = element.dataset;
            cart = await updateitem(productId,1);
             renderpage();
        await  renderpayment();
        });
    });
    document.querySelectorAll('.js-decrease-quantity').forEach((element) =>{
        element.addEventListener('click',async () =>{
            const {productId} = element.dataset;
            cart = await updateitem(productId,-1);
             renderpage();
        await  renderpayment();
        });
    });
}
renderpage();
await renderpayment();

