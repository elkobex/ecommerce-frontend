import { IProduct } from "./product.interface";

export interface IProductPagination {
    isOk: boolean;
    products: IProduct[];
    totalPages: number;
    totalProducts: number;
    pageNumber: number;
    pageSize: number;
    filterMessage: string;
}