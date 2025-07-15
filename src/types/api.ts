
export interface Service {
  id_service: string;
  public_name: string;
  platform: string;
  amount_minimum: string;
  amount_increment: string;
  is_geo: string;
  is_retention: string;
  is_drip: string;
  drip_cost: string;
  example: string;
  type_name: string;
  description?: string;
  start_time?: string;
  speed?: string;
  prices: Array<{
    minimum: string;
    maximum: string;
    pricing_per: string;
    price: string;
  }>;
  params?: Array<{
    field_label: string;
    field_descr: string;
    field_placeholder: string;
    field_name: string;
    field_validators: string;
    is_price_modifier: string;
    options?: Array<{
      name: string;
      value: string;
      error_selection: string;
    }>;
  }>;
}

export interface OrderResponse {
  status: string;
  id_service_submission?: string;
  short_url?: string;
  long_url?: string;
  start_count?: number;
  wanted_count?: number;
  current_count?: number;
  message?: Array<{
    id: number;
    message: string;
  }>;
}

export interface OrderStatus {
  id_service_submission: string;
  short_url: string;
  long_url: string;
  start_count: string;
  wanted_count: string;
  current_count: string;
  sent_count?: string;
  total_cost: string;
  status: {
    id_status: string;
    name: string;
    type: string;
    description: string;
  };
  refund_total?: string;
  refund_time?: string;
}

export interface Submission {
  id_service_submission: string;
  short_url: string;
  id_status: string;
  id_service: string;
  start_count: string;
  wanted_count: string;
  current_count: string;
  total_cost: string;
  date_added: string;
}
