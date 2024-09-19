// import { Component, OnInit } from '@angular/core';
// import { CardsService } from './cards.service';

// @Component({
//   selector: 'app-cards',
//   templateUrl: './cards.component.html',
//   styleUrls: ['./cards.component.css']
// })
// export class CardsComponent implements OnInit {
//   userId = 'your-user-id'; // Reemplaza con el ID de usuario correspondiente

//   constructor(private cardsService: CardsService) {}

//   ngOnInit(): void {
//     this.addCard();
//     this.getLastCard();
//     this.getAllCards();
//   }

//   addCard(): void {
//     const cardDetails = {
//       // Detalles de la tarjeta
//     };
//     this.cardsService.addCard(this.userId, cardDetails).subscribe({
//       next: (card) => console.log('Card added:', card),
//       error: (error) => console.error('There was an error adding the card:', error)
//     });
//   }

//   getLastCard(): void {
//     this.cardsService.getLastCard(this.userId).subscribe({
//       next: (card) => console.log('Last card:', card),
//       error: (error) => console.error('There was an error getting the last card:', error)
//     });
//   }

//   getAllCards(): void {
//     this.cardsService.getAllCards(this.userId).subscribe({
//       next: (cards) => console.log('All cards:', cards),
//       error: (error) => console.error('There was an error getting all cards:', error)
//     });
//   }
// }
