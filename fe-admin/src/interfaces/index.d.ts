import exp from "constants";
import { Status, TypeProduct } from "./enum";

export interface IBaseSEO{
  seoTitle: string;
  seoDescription: string;
  seoKeyword: string; 
}

export interface ICategory {
  id: string;
  name: string;
  icon:string;
  slug: string;
  
}
export interface IPost extends IBaseSEO{
  id: number;
  title: string;
  slug: string;
  isActive: boolean;
  content: string;
  thumbnail: string;
  detailInfomation: string;
  createdAt: Date;
  categoryPostIds: string ;
  categoryPosts: ICategoryPost;
  name: string;
}

export interface ICategoryPost {
  id: string ;
  name: string;
  slug: string;
}
export interface IProduct extends IBaseSEO{
  id: number;
  name: string;
  slug: string;
  star: number;
  isActive: boolean;
  description: string;
  thumbnail: string;
  detailInfomation: string;
  Stock :boolean;
  price: number;
  productPackage: string;
  categories: List<ICategory>;
  isPaymentBefore: boolean;
  TypeProduct : TypeProduct;
}
export interface ITopsSellingProduct {
  id: number;
  product: IProduct;
}

export interface IListProduct {
  products: IProduct[];
  page: number;
  size  : number;
  totalPage: number;
}

export interface IGlobalConfig extends IBaseSEO{
  id: string;
  numberPhone: string;
  Zalo: string;
  Message: string;
  address: string;
  description: string;
  emailContact: string;
  facebookLink: string;
  logo: string | null;
  nameWeb: string;
  slideObject: string;
  advertisement : string;
  advertisementLink : string;
  isShowTopbarNotice : boolean;
  topbarNoticeContent : string;
  logoFooter : string;
  telegramToken : string;
  telegramChatId : string;
}
export interface IOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string; // Optional field
  zaloName: string;
  totalAmount: number;
  status: Status;
  createdAt: Date;
  orderDetails: OrderDetail[];
}



export interface OrderDetail {
  id: number;
  order: IOrder; // Reference to the Order interface
  product: IProduct; // Reference to the Product interface
  quantity: number;
  price: number;
  productPackage?: string; // Optional field
}

export interface IUser {
  id: string;
  fullName: string; // Backend uses fullName
  email: string;
  phone?: string;
  dateOfBirth?: string;
  role: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  bookings?: IBooking[]; // Backend uses bookings instead of orders
}
export interface IUserResponse {
  status: string;
  data: IUser;
  bookings?: IBooking[];
}

export interface IMovie {
  id: number;
  slug: string;
  title: string;
  image?: string;
  duration?: string;
  rating?: string;
  releaseDate?: string;
  country?: string;
  producer?: string;
  genre?: string;
  director?: string;
  cast?: string;
  tagline?: string;
  subtitle?: string;
  trailerUrl?: string;
  content?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICinema {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  city?: string;
  totalRooms?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRoom {
  id: number;
  name: string;
  cinemaId?: number;
  cinemaName?: string;
  cinema?: ICinema;
  totalRows?: number;
  seatsPerRow?: number;
  vipRows?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IShowtime {
  id: number;
  movieId?: number;
  movieTitle?: string;
  movieSlug?: string;
  cinemaId?: number;
  cinemaName?: string;
  roomId?: number;
  roomName?: string;
  movie?: IMovie;
  cinema?: ICinema;
  room?: IRoom;
  showTime: string;
  endTime?: string;
  format?: string;
  price?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBookedSeat {
  id: number;
  booking?: IBooking;
  showtime?: IShowtime;
  seatCode: string;
}

export interface IBooking {
  id: number;
  bookingCode: string;
  user?: IUser;
  userId?: string;
  showtimeId?: number;
  showTime?: string;
  movieTitle?: string;
  seatCodes?: string[];
  bookedSeats?: IBookedSeat[];
  totalPrice?: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
} 

