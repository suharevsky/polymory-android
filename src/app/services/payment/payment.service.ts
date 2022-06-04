import { Injectable } from '@angular/core';
import { IAPProduct, InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { AlertController } from '@ionic/angular';
import { UserService } from '../user/user.service';

const PRODUCT_1MONTH = 'product_1month';
const PRODUCT_3MONTHS = 'product_3months';
const PRODUCT_1YEAR = 'product_1year';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public products = [];
  public paying = false;
  public choosedProduct: IAPProduct;

  constructor(
    public alertController: AlertController, 
    public store: InAppPurchase2,
    public userService: UserService
  ) { }

  init() {
    this.store.verbosity = this.store.DEBUG;

    this.store.register({
        id: PRODUCT_1MONTH,
        type: this.store.PAID_SUBSCRIPTION
    });
    this.store.register({
        id: PRODUCT_3MONTHS,
        type: this.store.PAID_SUBSCRIPTION
    })
    this.store.register({
        id: PRODUCT_1YEAR,
        type: this.store.PAID_SUBSCRIPTION
    })

    this.store.ready(() =>  {
      
        this.store.when("product")
        .approved(p => p.verify())
        .verified(p => p.finish())
        //.owned(p =>{this.userService.setPayed(p.owned)})
        .updated(p => this.userService.setPayed(p.owned));
    });


      // After platform ready
    this.setupListeners();

    // Run some code only when the store is ready to be used
    this.addProperties()
    this.store.refresh();
  }

  public purchase(product: IAPProduct,i) {
    const prevActive = this.products.filter(p => p.isActive === true)[0];
    this.choosedProduct = this.store.products[i];

    if(prevActive.id === this.products[i].id) {
      //alert(JSON.stringify(product));
      this.store.order(product).then(e => this.presentAlert('Failed', `Failed to purchase: ${e}`))
    }else {
      this.products.map(p => p.isActive = false);
      this.products[i].isActive = true;
    }
  }

  async presentAlert(header,message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    })
  
  }

  addProperties() {
    this.store.ready(() =>  {
      this.products = this.store.products;

      this.products.map((product: any) => {
          if (product.id === PRODUCT_1MONTH) {
            product.description = "<div class='number-big'>1</div><div class='num-months'><strong>חודש</strong></div><div><strong>75₪/חודש</strong></div>";
            product.isActive = false;
          }

          if (product.id === PRODUCT_3MONTHS) {
            product.description = "<div class='number-big'>3</div><div class='num-months'><strong>חודשים</strong></div><div><strong>55₪/חודש</strong></div>";
            product.isActive = false;
          }
          if (product.id === PRODUCT_1YEAR) {
            product.description = "<div class='number-big'>12</div><div class='num-months'><strong>חודשים</strong></div><div><strong>25₪/חודש</strong></div>";
            product.label = 'מחיר השקה';
            product.isActive = true;
          }
        })
        this.choosedProduct = this.store.products[this.products.length - 1];

      //this.ref.detectChanges();
      this.store.refresh();
    });
  }

  setupListeners() {

    // Track all store errors
 this.store.error( (err) => {
   this.presentAlert('Store Error ',  JSON.stringify(err));
 });

 this.store.when('product')
     .approved(  (p: IAPProduct) => {
       //this.ref.detectChanges();
       return p.verify();
     })
     .verified( async (p: IAPProduct) => { 
       await this.userService.setBillingData(p);
       return p.finish()
     }).owned(p => this.userService.setPayed(p.owned));
 } 

 choose() {
  this.store.order(this.choosedProduct).then(e => this.presentAlert('Failed', `Failed to purchase: ${e}`))
  }
}
