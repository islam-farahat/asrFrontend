import { ProductModel } from './product-model';

export interface Invoice_items {
  part_id: number;
  unit_id: number;
  selling_price: number;
  quantity: number;
}
export interface Models {
  model_id: number;
  description: string;
  attachments: string;
}

export interface Invoice {
  id?: number;
  customer_id: number;
  date: string;
  total: number;
  tax: number;
  grand_total: number;
  payment_method: string;
  invoice_type: string;
  models: Models[];
  invoice_items: Invoice_items[];
}
