import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-product-modal',
  standalone: true,
  imports: [],
  templateUrl: './detail-product-modal.component.html',
  styleUrl: './detail-product-modal.component.scss'
})
export class DetailProductModalComponent {
  // implements OnInit, OnDestroy
  // suscriptionModalState!: Subscription;
  // showDetailModal: boolean = false;

  // constructor(private modalSrv: ModalService){

  // }

  // ngOnInit(){
  //   this.suscriptionModalState = this.modalSrv.getModalDetailStatus().subscribe((data) => {
  //     // console.log("MODAL DETAIL DATA => ", data);
  //   })
  // }

  // ngOnDestroy(){
  //   if(this.suscriptionModalState){
  //     this.suscriptionModalState.unsubscribe();
  //   }
  // }
}
