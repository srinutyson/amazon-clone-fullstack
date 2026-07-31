export async function addtocart(prodname,quantity){
   
    await fetch(`http://localhost:3069/api/cart`,{
        credentials: "include",
        method : 'POST',
         headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           prodid : prodname,
           quantity : quantity
    })
    });
     return await loadcart();
 }
 

  export function cartcount(cart){
            
    let cartquantity = 0;

   cartquantity = cart.reduce((total,item) =>{
       return total+item.quantity;
   },0);

    const quantityElement =
        document.querySelector('.js-cquantity');

   
        quantityElement.innerHTML = cartquantity;
    

    return cartquantity;
}
  export function cartcounter(cart){
            
    let cartquantity = 0;

   cartquantity = cart.reduce((total,item) =>{
       return total+item.quantity;
   },0);
   console.log("nigga");

    const quantityElement =
        document.querySelector('.cart-quantity');

   
        quantityElement.innerHTML = cartquantity;
    

    
}
 export  async function updatedeliveryoption(prodname,deliveryoptionid){
      await fetch(`http://localhost:3069/api/cart/${prodname}`,
        {
            credentials: "include",
            method : 'PATCH',
            headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            deliveryoption : deliveryoptionid
    })
        }
      )
      return await loadcart();
  } 


  export async function loadcart(){
    let cartbag = [];
    const response  = await fetch(`http://localhost:3069/api/cart`,{
        credentials: "include",
    });
     cartbag = await response.json();
    return cartbag;

  }
  export async function removefromcart(productid){
          await fetch(`http://localhost:3069/api/cart/${productid}`, {
            credentials: "include",
    method: 'DELETE'
});
      
      return  await loadcart();
  }
export async function updateitem(productid,c){
       await fetch(`http://localhost:3069/api/cart/${productid}/quantity`,{
        credentials: "include",
        method : 'PATCH',
          headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
             c : c
    })
       });

       return await loadcart();
}

export async function placeorder(){
     const response =   await fetch(`http://localhost:3069/api/orders`,{
        credentials: "include",
          method : 'POST'
       });

       if (!response.ok) {
        throw new Error('Failed to place order');
    }

    return await response.json();

}