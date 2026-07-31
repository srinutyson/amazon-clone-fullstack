export const deliveryoptions = [{
    id : 1,
    deliverydays : 7,
    pricecents : 0

},
{
    id : 2,
    deliverydays : 3,
    pricecents : 499

},
{
    id : 3,
    deliverydays : 1,
    pricecents : 999

}];

export function getdeliveryoption(did){
     let doption;
        deliveryoptions.forEach((option) =>{
            if(option.id === did){
                doption = option;
            }
        });
        return doption;
}