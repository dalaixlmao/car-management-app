interface GetCarType{
    id: number;
    title: string;
    description: string;
    images: {
        id: number;
        url: string;
    }[];
    user: {
        id: number;
        name: string;
    };
    tags: {
        id: number;
        name: string;
    }[];
};



export type {GetCarType}