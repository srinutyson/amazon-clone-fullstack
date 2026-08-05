import { addtocart, cartcount, loadcart } from '../data/cart.js';
import { loadProducts, getExtraInfoHTML } from '../data/products.js';
import { checkAuth } from "./auth.js";

await checkAuth();

let cart = await loadcart();

const products = await loadProducts();
renderproducts(products);

async function logout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "include"
    });

    if (response.ok) {
      window.location.href = "login.html";
    } else {
      alert("Logout failed");
    }
  } catch (err) {
    console.error(err);
  }
}

document.querySelector(".logout-link").addEventListener("click", logout);

function renderproducts(products) {
  let productshtml = '';

  products.forEach((product) => {

    productshtml += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${(product.priceCents / 100).toFixed(2)}
        </div>

        <div>
          ${product.name}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector" data-product-id="${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${getExtraInfoHTML(product)}

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button
          class="add-to-cart-button button-primary js-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>`;
  });

  document.querySelector('.js-product-grid').innerHTML = productshtml;

  document.querySelectorAll('.js-cart').forEach((button) => {
    button.addEventListener('click', async () => {

      const prodname = button.dataset.productId;

      const quantity = Number(
        document.querySelector(
          `.js-quantity-selector[data-product-id="${prodname}"]`
        ).value
      );

      cart = await addtocart(prodname, quantity);

      cartcount(cart);
    });
  });
}

document.querySelector('.search-button').addEventListener('click', async () => {
  const search = document.querySelector('.search-bar').value.trim();

  const products = await loadProducts(search);

  renderproducts(products);
});

document.querySelector('.search-bar').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const search = event.target.value.trim();

    const products = await loadProducts(search);

    renderproducts(products);
  }
});

cartcount(cart);