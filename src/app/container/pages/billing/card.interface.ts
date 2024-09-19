export interface ICard{
    cardNumber: string;
    expirationDate: string;
    cardCVV: string;
    added?: boolean;
    deleted?: boolean;
    declined?: boolean;
    entryDate?: Date;
}