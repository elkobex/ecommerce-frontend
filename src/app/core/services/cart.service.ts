import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ICartItem } from '../../container/interfaces/cardItem.interface';
import { HeaderVisibilityService } from './header-visible.service';
import { IColor, IProduct } from '../../container/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private userURL = environment.serverUrl + '/user';
  private unsubscribe$ = new Subject<void>();

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
  });

  private itemSubject = new BehaviorSubject<ICartItem[]>([]);
  private notifyNewItem = new BehaviorSubject<ICartItem | null>(null);
  
  constructor(private http: HttpClient, private headerVisibilityService: HeaderVisibilityService) { }

  getCartStatus() {
    return this.itemSubject.asObservable();
  }

  getCartNotifyNewItem(){
    return this.notifyNewItem.asObservable();
  }

  // updateModifyCartItems(items: ICartItem[]){
  //   this.itemSubject.next(items);
  // }

  notifyCart(items: ICartItem[]) {
    this.itemSubject.next(items);
  }

  addItemToCart(item: ICartItem) {
    this.notifyNewItem.next(item);

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if(currentScroll >= 64){
      this.headerVisibilityService.showHeader(true, currentScroll);
    }
  }

  hideNotifyNewItem(){
    this.notifyNewItem.next(null);
  }

  // showItems(id: string, dateNow: number): Observable<ICartItem[]>{
  //   return this.http.get<ICartItem[]>(`${this.userURL}/show-items-in-cart/${id}?datenow=${dateNow}`, {headers : this.headers}).pipe(takeUntil(this.unsubscribe$));
  // }

  showItems(id: string, dateNow: number): Observable<{items: ICartItem[], dateNow: number}> {
    // console.log("ID => ", id);
    return this.http.get<{items: ICartItem[], dateNow: number}>(`${this.userURL}/show-items-in-cart/${id}?datenow=${dateNow}`, {headers : this.headers});
  }

  addItem(id: string, product: ICartItem): Observable<ICartItem[]> {
    return this.http.post<ICartItem[]>(`${this.userURL}/add-item-to-cart/${id}`, product, {headers : this.headers});
  }
  
  updateItem(id: string, product: ICartItem): Observable<ICartItem[]> {
    return this.http.put<ICartItem[]>(`${this.userURL}/modify-item-in-cart/${id}`, product, {headers : this.headers});
  }

  deleteItem(id: string, productId: string): Observable<ICartItem[]> {
    return this.http.delete<ICartItem[]>(`${this.userURL}/delete-item-from-cart/${id}/${productId}`, {headers : this.headers});
  }

  saveLocalItems(items: ICartItem[]): void {
    try {
      const serializedItems = JSON.stringify(items);
      localStorage.setItem('cartItems', serializedItems);
    } catch (error) {
      console.error('Error al guardar los items en el localStorage:', error);
    }
  }

  deleteLocalItems(){
    localStorage.removeItem('cartItems');
  }

  getILocaltems(): ICartItem[] | null {
    try {
      const serializedItems = localStorage.getItem('cartItems');
      if (serializedItems) {
        return JSON.parse(serializedItems);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener los items desde el localStorage:', error);
      return null;
    }
  }

  // addLocalItemToCart(newItem: ICartItem): ICartItem[] | null {
  //   try {
  //     const storedItems = this.getILocaltems();
  //     if (storedItems) {
  //       // Verifica si el artículo ya existe en el carrito
  //       const existingItemIndex = storedItems.findIndex((item) => item.product.identifier === newItem.product.identifier);
  //       if (existingItemIndex !== -1) {
  //         // Si existe, actualiza la cantidad
  //         storedItems[existingItemIndex].quantity += newItem.quantity;
  //       } else {
  //         // Si no existe, agrega el nuevo artículo al carrito
  //         storedItems.push(newItem);
  //       }
  //       this.saveLocalItems(storedItems);
  //       return storedItems; // Devuelve el array actualizado
  //     }
  //     return null; // Si no hay items almacenados, devuelve null
  //   } catch (error) {
  //     console.error('Error al agregar el item al localStorage:', error);
  //     return null;
  //   }
  // }

  deleteAllItemsFromCart(userId: string): Observable<any> {
    const url = `${this.userURL}/delete-all-items-from-cart/${userId}`;
    return this.http.delete(url, {headers: this.headers});
  }

  addLocalItemToCart(newItem: ICartItem): ICartItem[] | null {
    try {
      const storedItems = this.getILocaltems();
      if (storedItems) {
        // Verifica si el artículo ya existe en el carrito
        // const existingItem = storedItems.find((item) => item.product.identifier === newItem.product.identifier && item.product.size === newItem.product.size);
        const existingItem = storedItems.find((item) => {
          if(item.product.identifier === newItem.product.identifier && 
            item.product.size === newItem.product.size && 
            item.product.color?.id === newItem.product.color?.id
          ){
            return item;
          }else{
            return null;
          }
        });

        if (existingItem) {
          // Si existe, verifica si el tamaño es diferente
           // Si no es diferente, actualiza la cantidad si no supera el límite de 9
           const totalQuantity = existingItem.quantity + newItem.quantity;
           if (totalQuantity <= 9) {
             existingItem.quantity = totalQuantity;
           }else{
            existingItem.quantity = 9;
           }

        } else {
          // Si no existe, agrega el nuevo artículo al carrito
          storedItems.push(newItem);
        }
        this.saveLocalItems(storedItems);
        return storedItems; // Devuelve el array actualizado
      }
      return null; // Si no hay items almacenados, devuelve null
    } catch (error) {
      console.error('Error al agregar el item al localStorage:', error);
      return null;
    }
  }  

  updateLocalCartItem(itemToUpdate: ICartItem): void {
    try {
      const storedItems = this.getILocaltems();
      if (storedItems) {
        const updatedItems = storedItems.map((item) => {
          if (item.product.identifier === itemToUpdate.product.identifier && item.product.size === itemToUpdate.product.size) {
            // Actualiza la propiedad deseada (size o cantidad)
            item.quantity = itemToUpdate.quantity;
            // Opcionalmente, también puedes actualizar el size:
            // item.product.size = itemToUpdate.product.size;
          }
          return item;
        });
        this.saveLocalItems(updatedItems);
      }
    } catch (error) {
      console.error('Error al actualizar el item en el localStorage:', error);
    }
  }

  deleteLocalItemFromCart(newItem: ICartItem): ICartItem[] | null  {
    try {
      const storedItems = this.getILocaltems();
      if (storedItems) {
        // const updatedItems = storedItems.filter((item) => item.product.identifier !== item.product.identifier)
        const updatedItems = storedItems.filter((item) => item.product.identifier !== newItem.product.identifier || item.product.size !== newItem.product.size || item.product.color?.id !== newItem.product.color?.id)
        
        this.saveLocalItems(updatedItems);
        return updatedItems;
      }
      return null;
    } catch (error) {
      console.error('Error al eliminar el item del localStorage:', error);
      return null;
    }
  }

  subtractItem(itemId: string): ICartItem[] | null {
    try {
      const storedItems = this.getILocaltems();
      if (storedItems) {

        const itemToRemoveIndex = storedItems.findIndex((item) => item.product.identifier === itemId);
        // const existingItemIndex = storedItems.findIndex((item) => item.product.identifier === newItem.product.identifier);

        if (itemToRemoveIndex !== -1) {
          // Si la cantidad es mayor a uno, simplemente resta uno
          if (storedItems[itemToRemoveIndex].quantity > 1) {
            storedItems[itemToRemoveIndex].quantity -= 1;
          } else {
            // Si la cantidad es uno o menos, elimina el artículo del carrito
            const updatedItems = storedItems.filter((item) => item.product.identifier !== itemId);
            this.saveLocalItems(updatedItems);
            return updatedItems;
          }
          this.saveLocalItems(storedItems); // Actualiza el array con los cambios
        }
      }
      return storedItems;
    } catch (error) {
      console.error('Error al eliminar el item del localStorage:', error);
      return null;
    }
  }

  resetService() {
    // Restablece las propiedades a sus valores iniciales
    this.itemSubject.next([]);
    this.notifyNewItem.next(null);
    // Restablece cualquier otra propiedad que necesites
  }
}
