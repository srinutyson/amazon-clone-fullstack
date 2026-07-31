

const cart = {
    cartitems : undefined,
    loadfromstorage() {
       this.cartitems = JSON.parse(localStorage.getItem('cart-oop'));

 
        if(!this.cartitems){
                    this.cartitems = [{
                    prodname : 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                    quantity : 3,
                    deliveryoptionid : '1'
                },
                {
                    prodname : '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                    quantity : 3,
                    deliveryoptionid : '2'
                }];
                }
            },
    savetostorage () {
    localStorage.setItem('cart-oop',JSON.stringify(this.cartitems));
  },
    addtocart(prodname){
    let match;
            this.cartitems.forEach((item) =>{
                if(prodname === item.prodname){
                    match = item;
                }
            });
            if(match){
                match.quantity += 1;

            }
            else {
                this.cartitems.push({
                    prodname : prodname,
                    quantity : 1,
                    deliveryoptionid : '1'
                })
            }
            this.savetostorage();
 },
       cartcount(){
            let cartquantity = 0;

            this.cartitems.forEach((item) =>{
            cartquantity += item.quantity;
            });

            const quantityElement =
                document.querySelector('.js-cquantity');

            if(quantityElement){
                quantityElement.innerHTML = cartquantity;
            }

            return cartquantity;
        },
       cartlog(){
     let cartquantity = 0;
        this.cartitems.forEach((item) =>{
           cartquantity+= item.quantity;
        })
        return cartquantity;
  },
     removefromcart(prodid){
     const newcart = [];
     this.cartitems.forEach((item) =>{
        if(item.prodname !== prodid) newcart.push(item)
     })
    this.cartitems = newcart;
    this.cartcount();
    this.savetostorage();
  },
   
    updatedeliveryoption(prodname,deliveryoptionid){
    let match;
            this.cartitems.forEach((item) =>{
                if(prodname === item.prodname){
                    match = item;
                }
            });
    match.deliveryoptionid = deliveryoptionid;
     this.savetostorage();
  } 
  

};

cart.loadfromstorage();

cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');
cart.addtocart('15b6fc6f-327a-4ec4-896f-486349e85a3d');



console.log(cart); 



  
  
  
  
  
 