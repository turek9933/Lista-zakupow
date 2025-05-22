import { Product } from "@/src/types/Product";

export const exampleProducts: Product[] = [
        {
        id: '1',
        name: 'Jabłko',
        price: 2.50,
        originStore: 'Supermarket',
        imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb',
        description: 'Apples are the best fruit ever, right eve?',
        bought: true,
    },
    {
        id: '2',
        name: 'Chleb',
        price: 3.50,
        originStore: 'Buda z chlebem',
        bought: false
    }
];