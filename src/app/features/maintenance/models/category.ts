import { Api_prices } from './product';
export interface Category {
  id: number;
  name_ar: string;
  quantity: string;
  pieces: Api_prices[];
  total: string;
  price: string;
}
// id: number;
//   name_ar: string;
//   quantity: string;
//   type: string;
//   api_prices?: Api_prices[];
