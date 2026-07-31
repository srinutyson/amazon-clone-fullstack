
import { checkAuth } from "./auth.js";

await checkAuth();

import {renderpage} from './checkout/ordersummary.js'

console.log("checkout.js loaded");
import { renderpayment } from './checkout/paymentsummary.js'
// // import '../data/cartoops.js';
renderpage();
await renderpayment();