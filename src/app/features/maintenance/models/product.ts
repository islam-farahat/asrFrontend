export interface Api_prices {
  id: number;
  unit_ar: string;
  barcode: string;
}
export interface Product {
  id: number;
  name_ar: string;
  quantity: string;
  type: string;
  api_prices: Api_prices[];
}
