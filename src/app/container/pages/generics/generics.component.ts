import { Component, Input, OnInit } from '@angular/core';
import { ShippingComponent } from "./components/shipping.component";
import { PrivacityComponent } from "./components/privacity.component";
import { ReturnsComponent } from "./components/returns.component";
import { ContactComponent } from "./components/contact.component";

@Component({
    selector: 'app-generics',
    standalone: true,
    templateUrl: './generics.component.html',
    styleUrl: './generics.component.scss',
    imports: [ShippingComponent, PrivacityComponent, ReturnsComponent, ContactComponent]
})
export class GenericsComponent implements OnInit{

  @Input() current: string = "shipping"


  ngOnInit(): void {
    // console.log("CURRENT => ", this.current);

  }
}
