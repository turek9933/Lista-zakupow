export interface Product {
    id: string;
    name: string;
    price: number;
    originStore: string;
    imageUrl?: string;
    description?: string;
    bought: boolean;
    ownerId: string;
    createdAt?: Date; 
}