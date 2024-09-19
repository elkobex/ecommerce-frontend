import { Component, Input, OnDestroy, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICartItem } from '../../../container/interfaces/cardItem.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { ToastService } from '../../../core/services/toast.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { OverlayService } from '../../../core/services/overlay.service';
import { Subject } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: ` <button
    type="button"
    class="relative inline-flex p-2 bg-transparent rounded-full hover:bg-gray-300 focus:outline-none transition-all duration-300 ease-in-out"
  >
    <svg
      class="z-10"
      alt=""
      aria-label=""
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 1024 1024"
      width="1.7em"
      height="1.7em"
      role="img"
    >
      <path
        d="M373.3 916.1c32.8 0 59.4-26.6 59.5-59.4 0-32.8-26.6-59.4-59.5-59.4-32.8 0-59.4 26.6-59.4 59.4 0 32.8 26.6 59.4 59.4 59.4z m396.2 0c32.8 0 59.4-26.6 59.5-59.4 0-32.8-26.6-59.4-59.5-59.4-32.8 0-59.4 26.6-59.4 59.4 0 32.8 26.6 59.4 59.4 59.4z m-684.2-815.1l90.3 17.4c49.9 9.6 88.7 49.2 97.2 99.4l2.3 13.8 486.2 0c91.4 0 165.5 74.1 165.5 165.5 0 8.8-0.7 17.6-2.1 26.3l-28.9 179.1c-12.6 78.3-80.2 135.8-159.4 135.8l-335.9 0c-80.8 0-149.1-59.7-160-139.6l-43-314.8-0.5-2.3-8.4-49.6c-2.5-15-14.2-26.9-29.1-29.8l-90.3-17.4c-23.1-4.4-38.3-26.8-33.9-49.9 4.4-23.1 26.8-38.3 50-33.9z m676 216l-473.2 0 36.9 270.1c5.2 37.7 37.4 65.9 75.5 65.9l335.9 0c37.4 0 69.3-27.1 75.2-64.1l28.9-179c0.7-4.2 1-8.5 1-12.8 0-44.3-35.9-80.2-80.2-80.1z"
      ></path>
    </svg>

    @if (userData) {
      <div
        class="absolute inline-flex group-hover:hidden items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full -top-0 -end-0 z-10"
      >
        <span class="rounded-full">{{ totalItemsCardQuanty() }}</span>
      </div>

      <!-- MODAL -->
      <!-- fade-in absolute z-50 hidden group-hover:block inset-x-0 top-full w-screen max-w-sm h-screen shadow-lg transform md:-translate-x-[50%] 2xl:-translate-x-1/2 2xl:left-1/2 -->
      <div
        class="fade-in absolute z-50 hidden group-hover:block inset-x-0 top-full w-screen max-w-sm h-auto shadow-lg transform md:-translate-x-[50%] 2xl:-translate-x-1/2 2xl:left-1/2"
      >
        <div class="bg-transparent h-1"></div>

        @if (totalItemsCardQuanty()) {
          <div class="bg-white h-full pt-2 pb-6 rounded-b-lg px-2">
            <div
              class="space-y-3 bg-white "
              [ngClass]="{ 'opacity-80': modalLoading() }"
            >
              <!-- <ul
                class="space-y-2 relative"
                style="max-height: 60vh; overflow-y: auto;"
              >
                @for (item of itemsCard; track item.product.id) {
                <div class="group hover:bg-gray-200 rounded">
                  <a (click)="goToDetailPage(item)" href="javascript:void()">
                    <li class="flex items-center gap-4 p-2">
                      <img
                        src="{{ serverUrl }}/{{ item.product.color?.imagen }}"
                        alt=""
                        class="size-16 rounded object-cover"
                      />
      
                      <div class="flex flex-col justify-start items-start space-y-1">
                        <h3
                          class="text-gray-900 text-start"
                          [title]="item.product.name"
                        >
                          {{
                            item.product.name.length > 17
                              ? item.product.name.substring(0, 17) + '...'
                              : item.product.name
                          }}
                        </h3>
      
                        <div class="space-x-1 text-xs text-gray-600">
                          <dt class="inline">Size:</dt>
                          <dd class="inline">{{ item.product.size }}</dd>
                          <dt class="inline">*</dt>
                        </div>
      
                        <div class="space-x-1 text-xs text-gray-600">
                          <dd class="inline">Precio:</dd>
                          <dt class="inline font-semibold">
                            {{item.product.price * item.quantity | currency : 'MXN'}}
                          </dt>
                        </div>
                      </div>
      
                      <div class="flex flex-1 items-center justify-end gap-2">
                        <select
                          #quantity
                          [value]="item.quantity"
                          (change)="itemQuantyChange(item, quantity.value)"
                          id="Line1Qty"
                          [disabled]="modalLoading()"
                          class="h-8 w-12 rounded border border-slate-300 bg-gray-50 p-0 text-center text-xs text-gray-600 focus:outline-none"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
      
                        <button
                          (click)="deleteItemCart(item)"
                          class="text-gray-600 transition hover:text-red-600"
                          [disabled]="modalLoading()"
                        >
                          <span class="sr-only">Remove item</span>
      
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="h-4 w-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  </a>
                </div>
                }
                
                @if(modalLoading()){
                <div
                  class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                >
                  <svg
                    aria-hidden="true"
                    class="w-14 h-14 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
                }
              </ul> -->

              <ul
                role="list"
                class="divide-y divide-gray-200 relative"
                style="max-height: 60vh; overflow-y: auto"
              >
                @for (item of itemsCard; track item.product.id) {
                  <li
                    class="flex py-6 px-2 rounded-md hover:bg-gray-100"
                  >
                    <div
                      class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                    >
                      <img
                        (click)="goToDetailPage(item)"
                        src="{{ serverUrl }}/{{ item.product.color?.imagen }}"
                        [alt]="item.product.name"
                        class="h-full w-full object-cover object-center"
                      />
                    </div>
  
                    <div class="ml-4 flex flex-1 flex-col space-y-1 -mt-1.5">
                      <div class="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a (click)="goToDetailPage(item)" href="javascript:void()">
                              {{
                                item.product.name.length > 14
                                  ? item.product.name.substring(0, 14) + '...'
                                  : item.product.name
                              }}
                            </a>
                          </h3>
                          <p class="ml-4">
                            {{item.product.price * item.quantity | currency : 'MXN'}}
                          </p>
                      </div>

                      <div class="flex justify-start text-sm text-gray-500 space-x-1">
                        <span>Size:</span>
                        <span>{{item.product.size}}</span>
                      </div>
  
                      <div
                        class="flex flex-1 items-end justify-between text-sm"
                      >
                        <select
                          #quantity
                          [value]="item.quantity"
                          (change)="itemQuantyChange(item, quantity.value)"
                          id="Line1Qty"
                          [disabled]="modalLoading()"
                          class="h-8 w-12 rounded border border-slate-300 bg-gray-50 p-0 text-center text-xs text-gray-600 focus:outline-none"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
  
                        <div
                          class="flex"
                        >
                          <button
                            (click)="deleteItemCart(item)"
                            type="button"
                            class="font-medium rounded-md text-red-500 p-2 hover:text-red-500 hover:bg-red-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  </li>
                }

                @if(modalLoading()){
                <div
                  class="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                >
                  <svg
                    aria-hidden="true"
                    class="w-14 h-14 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
                }
              </ul>

              <div class="text-center space-y-3">
                <div
                  class="flex justify-end space-x-1 font-semibold text-slate-900"
                >
                  <span>Total:</span>
                  <span>{{ totalItemsCardPrice() | currency: 'MXN' }}</span>
                </div>
                <button
                  class="rounded w-full bg-[#051C2C] px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-800"
                  (click)="goToCart()"
                  [disabled]="modalLoading()"
                >
                  Ver Carrito ({{ totalItemsCardQuanty() }})
                </button>
              </div>
            </div>
          </div>
        } @else {
          <div
            class="bg-white flex flex-col items-center justify-center h-full space-x-2 pt-2 pb-8 rounded-b-lg"
          >
            <svg
              class="fill-current text-gray-400"
              width="7em"
              height="7em"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
            >
              <path
                d="M356.7 726.2c-30.6 0-55.5 24.8-55.5 55.5 0 30.6 24.8 55.5 55.5 55.4 30.6 0 55.5-24.8 55.5-55.4 0-30.6-24.8-55.5-55.5-55.5z m0 17.1c21.2 0 38.4 17.2 38.4 38.4 0 21.2-17.2 38.4-38.4 38.4-21.2 0-38.4-17.2-38.4-38.4 0-21.2 17.2-38.4 38.4-38.4z m319.1-17.1c-30.6 0-55.5 24.8-55.4 55.5 0 30.6 24.8 55.5 55.4 55.4 30.6 0 55.5-24.8 55.5-55.4 0-30.6-24.8-55.5-55.5-55.5z m0 17.1c21.2 0 38.4 17.2 38.4 38.4 0 21.2-17.2 38.4-38.4 38.4-21.2 0-38.4-17.2-38.4-38.4 0-21.2 17.2-38.4 38.4-38.4z m-552.8-486.9c4.8 0 9.3 0.3 15.4 1.4 9.3 1.6 18.4 4.6 27 9.4 15.4 8.6 27.5 22 35 40.7l1 2.9 0.4 1.3 8.3 45.7 11.1 63.9 24.8 144.8 7.2 42.8c6.1 34.3 38 60 76 61l2.4 0 358.2 0c38.4 0 71-25.1 78.1-59.4l0.4-2.1 50.1-248.1c0.9-4.6 5.4-7.6 10.1-6.7 4.3 0.9 7.2 4.8 6.8 9.1l-0.1 1-50.2 247.8c-7.4 42.8-46.6 74.3-92.7 75.4l-2.5 0.1-358.2 0c-47.1 0-87.5-31.7-95.2-75.2l-24.4-143.5-15.4-88.8-9-50.4-2.4-13.5-0.9-2.2c-5.6-13.9-14.2-23.7-25-30.4l-2.2-1.3c-6.8-3.8-14.2-6.2-21.7-7.5-4.1-0.7-7.3-1-10.4-1.1l-2 0-87.9 0c-4.7 0-8.5-3.8-8.6-8.5 0-4.4 3.3-8 7.6-8.5l1-0.1 87.9 0z m283.6 265.2l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58.1 0 0-17.1 58.1 0z m92.1 0l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58 0 0-17.1 58 0z m-329.8-155.8l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58 0 0-17.1 58 0z m92.1 0l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58.1 0 0-17.1 58.1 0z"
              ></path>
            </svg>

            <div class="text-center px-1">
              El carrito de compras está vacío.
            </div>
          </div>
        }
      </div>
    }
  </button>`,
  styles: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .fade-in {
      animation: fadeIn 0.6s ease forwards;
    }
  `,
})
export class CartModalComponent implements OnDestroy {
  modalLoading = signal(false);

  @Input() isLoggedIn!: boolean;
  @Input() userData!: IUser | null;

  serverUrl = `${environment.serverUrl}/images`;

  itemsCard!: ICartItem[];
  totalItemsCardQuanty = signal(0);
  totalItemsCardPrice = signal(0);

  private destroy$ = new Subject<void>();
  private globalDateNow: number = 0;

  constructor(
    private toastSrv: ToastService,
    private overlaySrv: OverlayService,
    private cartSrv: CartService,
    private router: Router,
    private navigationService: NavigationService,
    private modalSrv: ModalService
  ) {

  }

  ngOnInit(): void {
    this.globalDateNow = Date.now();
    this.getItemsCard(this.globalDateNow);

    this.cartSrv.getCartStatus().subscribe((items: ICartItem[]) => {
      if (!items || !items.length) return;
      this.setCartData(items);
    });
  }

  getItemsCard(dateNow: number) {
    try {
      if (!this.userData) return;
      // console.log("USER DATA => ", this.userData._id);
      this.cartSrv.showItems(this.userData._id, dateNow).subscribe(
        (data: {items: ICartItem[], dateNow: number}) => {
          if(data.dateNow.toString() === this.globalDateNow.toString()){
            this.setCartData(data.items);
            this.cartSrv.notifyCart(data.items);
          }
        },
        (err) => {
          const { statusCode, message } = err.error;
          this.totalItemsCardQuanty.set(0);
        },
      );
    } catch (error) {
      this.totalItemsCardQuanty.set(0);
    }
  }

  setCartData(items: ICartItem[]) {
    this.totalItemsCardQuanty.set(this.getTotalQuantity(items));

    this.totalItemsCardPrice.set(this.getTotalPrice(items));

    this.itemsCard = items;
    this.cartSrv.saveLocalItems(items);
  }

  goToDetailPage(item: ICartItem) {
    this.overlaySrv.hideOverlay();
    this.navigationService.navigate(
      `/detail/${item.product.identifier}?colorid=${item.product.color?.id}`,
    );
  }

  deleteItemCart(item: ICartItem) {
    try {
      if (!this.userData) return;

      let updateUI = false;
      const remainingItems = this.cartSrv.deleteLocalItemFromCart(item);

      if (remainingItems) {
        updateUI = true;
        this.setCartData(remainingItems);
      }

      this.modalLoading.set(true);
      // hacer la request al servidor
      this.cartSrv
        .deleteItem(this.userData._id, item.product.identifier)
        .subscribe(
          (items: ICartItem[]) => {
            if (!updateUI) {
              this.setCartData(items);
            }
            this.cartSrv.notifyCart(items);
            this.modalLoading.set(false);
          },
          (err) => {
            const { statusCode, message } = err.error;
            this.modalLoading.set(false);
          },
        );
    } catch (error) {}
  }

  getTotalQuantity(items: ICartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(items: ICartItem[]): number {
    return items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  // calculatePriceXitem(item: ICartItem): number {
  //   const totalPrice = item.product.price * item.quantity;
  //   return parseFloat(totalPrice.toFixed(2))
  // }

  itemQuantyChange(item: ICartItem, quantity: string) {
    if (!this.userData) return;

    this.modalLoading.set(true);
    item.quantity = parseInt(quantity);
    this.cartSrv.updateItem(this.userData._id, item).subscribe(
      (items: ICartItem[]) => {
        this.cartSrv.notifyCart(items);
        this.setCartData(items);
        this.modalLoading.set(false);
      },
      (err) => {
        const { statusCode, message } = err.error;
        this.toastSrv.showToast(
          'Ups! no se pudo actualizar el carrito!',
          'red-500',
        );

        this.modalLoading.set(false);
      },
    );
  }

  goToCart(){
    if(!this.userData || !this.userData._id){
      this.modalSrv.showModal();
    }else{
      this.overlaySrv.hideOverlay();
      this.router.navigate(['/cart']);
    }
  }

  ngOnDestroy(): void {
    // this.destroy$.next();
    // this.destroy$.complete();

    // this.cartSrv.resetService();
  }
}
