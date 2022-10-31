export interface IHotel{
  id:number,
  hotelName:string,
  description:string,
  price:number,
  ancienPrice?:number,
  imageUrl:string,
  rating:number;
  tags:string[],
  categoryId?:number,
  categoryName?:string,
  menu?:number[]
}
