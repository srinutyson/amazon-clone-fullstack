export async function loadProducts(search = '') {
    let response ;

   if(!search)  response = await fetch('/api/products',
    {
      credentials: "include"
    }
   );
    else response = await fetch(`/api/products?search=${encodeURIComponent(search)}`,
    {
      credentials: "include"
    });
    const products = await response.json();

    return products;
}

export function getExtraInfoHTML(product) {
  if (product.type === 'clothing') {
    return `<a href="${product.sizeChartLink}" target="_blank">Size Chart</a>`;
  }

  return '';
}