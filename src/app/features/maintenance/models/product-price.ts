export interface ProductPrice {
  id?: number;
  part_id?: string;
  unit_id?: string;
  barcode?: string;
  selling_price?: string;
  less_selling_price?: string;
  service_selling_price?: string;
  less_service_selling_price?: string;
  quantity?: string;
  last_selling_price?: string;
  last_purchase_price?: string;
  deleted_at?: string;
}
