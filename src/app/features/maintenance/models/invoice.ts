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
  invoice_date?: string;
  date: string;
  total: number;
  tax: number;
  customer?: Customer;
  grand_total: number;
  payment_method: string;
  invoice_type: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  models: Models[];
  items: Invoice_items[];
}

interface Customer {
  id: number;
  name_ar: string;
  phone1: string;
  status: string;
  tax_card: string;
  branch_id: string;
  customer_category_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
export interface GetInvoice {
  current_page: number;
  data: Invoice[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}
// {
//   "current_page": 1,
//   "data": [
//       {
//           "id": 1,
//           "customer_id": "1",
//           "invoice_date": "0000-00-00 00:00:00",
//           "total": "600.00",
//           "tax": "75.00",
//           "grand_total": "675.00",
//           "payment_method": "cash/network",
//           "invoice_type": "cash/credit",
//           "status": "in progress",
//           "created_at": "2023-04-02 22:41:57",
//           "updated_at": "2023-04-02 22:41:57",
//           "deleted_at": null,
//           "customer": {
//               "id": 1,
//               "name_ar": "مصطفي",
//               "phone1": "111111",
//               "status": "1",
//               "tax_card": null,
//               "branch_id": "1",
//               "customer_category_id": "1",
//               "created_at": "2023-04-08 06:06:10",
//               "updated_at": "2023-04-08 06:06:10",
//               "deleted_at": null
//           }
//       },
//       {
//           "id": 2,
//           "customer_id": "1",
//           "invoice_date": "0000-00-00 00:00:00",
//           "total": "600.00",
//           "tax": "75.00",
//           "grand_total": "675.00",
//           "payment_method": "cash/network",
//           "invoice_type": "cash/credit",
//           "status": "in progress",
//           "created_at": "2023-04-02 22:42:00",
//           "updated_at": "2023-04-02 22:42:00",
//           "deleted_at": null,
//           "customer": {
//               "id": 1,
//               "name_ar": "مصطفي",
//               "phone1": "111111",
//               "status": "1",
//               "tax_card": null,
//               "branch_id": "1",
//               "customer_category_id": "1",
//               "created_at": "2023-04-08 06:06:10",
//               "updated_at": "2023-04-08 06:06:10",
//               "deleted_at": null
//           }
//       },
//       {
//           "id": 3,
//           "customer_id": "1",
//           "invoice_date": "0000-00-00 00:00:00",
//           "total": "600.00",
//           "tax": "75.00",
//           "grand_total": "675.00",
//           "payment_method": "cash/network",
//           "invoice_type": "cash/credit",
//           "status": "in progress",
//           "created_at": "2023-04-02 22:42:19",
//           "updated_at": "2023-04-02 22:42:19",
//           "deleted_at": null,
//           "customer": {
//               "id": 1,
//               "name_ar": "مصطفي",
//               "phone1": "111111",
//               "status": "1",
//               "tax_card": null,
//               "branch_id": "1",
//               "customer_category_id": "1",
//               "created_at": "2023-04-08 06:06:10",
//               "updated_at": "2023-04-08 06:06:10",
//               "deleted_at": null
//           }
//       },
//       {
//           "id": 4,
//           "customer_id": "1",
//           "invoice_date": "0000-00-00 00:00:00",
//           "total": "800.00",
//           "tax": "77.00",
//           "grand_total": "666.00",
//           "payment_method": "cash/network",
//           "invoice_type": "cash/credit",
//           "status": "in progress",
//           "created_at": "2023-04-06 01:45:22",
//           "updated_at": "2023-04-06 01:45:22",
//           "deleted_at": null,
//           "customer": {
//               "id": 1,
//               "name_ar": "مصطفي",
//               "phone1": "111111",
//               "status": "1",
//               "tax_card": null,
//               "branch_id": "1",
//               "customer_category_id": "1",
//               "created_at": "2023-04-08 06:06:10",
//               "updated_at": "2023-04-08 06:06:10",
//               "deleted_at": null
//           }
//       },
//       {
//           "id": 5,
//           "customer_id": "1",
//           "invoice_date": "0000-00-00 00:00:00",
//           "total": "800.00",
//           "tax": "77.00",
//           "grand_total": "666.00",
//           "payment_method": "cash/network",
//           "invoice_type": "cash/credit",
//           "status": "in progress",
//           "created_at": "2023-04-06 01:45:40",
//           "updated_at": "2023-04-06 01:45:40",
//           "deleted_at": null,
//           "customer": {
//               "id": 1,
//               "name_ar": "مصطفي",
//               "phone1": "111111",
//               "status": "1",
//               "tax_card": null,
//               "branch_id": "1",
//               "customer_category_id": "1",
//               "created_at": "2023-04-08 06:06:10",
//               "updated_at": "2023-04-08 06:06:10",
//               "deleted_at": null
//           }
//       }
//   ],
//   "first_page_url": "https://www.maintainence.asr2-languages.com/api/maintainance/invoices?page=1",
//   "from": 1,
//   "last_page": 1,
//   "last_page_url": "https://www.maintainence.asr2-languages.com/api/maintainance/invoices?page=1",
//   "next_page_url": null,
//   "path": "https://www.maintainence.asr2-languages.com/api/maintainance/invoices",
//   "per_page": 10,
//   "prev_page_url": null,
//   "to": 5,
//   "total": 5
// }
