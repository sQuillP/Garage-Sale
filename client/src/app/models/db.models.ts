export interface Sale {
    _id?:string
    name?:string
    start_date:Date,
    end_date: Date,
    address:string,
    description: string,
    terms_conditions:string,
    userId: any,
    gallery:string[],
    location:  {
        type: 'Point',
        coordinates: number[]
    },
    expireAt: Date,
    viewCount:number,
    createdAt?:Date,
    updatedAt?:Date,
    itemCount:Number,
}


export interface Chat {
    senderId: string;
    receiverId: string;
    content?: string,
    createdAt: Date;
    updatedAt:Date;
};


export interface Item {
    name:string,
    price:number,
    gallery: string[],
    saleId: string,
    description: string,
    terms:string,
    highestBidder?:string,
    expireAt:Date,
    purchased?:boolean,
    start_date:Date,
    end_date:Date,
};


export interface User {
    fullName:string,
    email:string,
    password:string,
    phone:string,
    profileImg:string,
    conversations:string[];
}