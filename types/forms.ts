export type statusEnum = "draft" | "publish" | "archive";

export type TokenFormData = {
  template: string;
  token: string;
  user_id: string;
};

import { statusAddress } from "./models";

export type OrderFormData = {
  _id?: string;
  cartItems: CartItemForm[];
  discount: number;
  pmethod: string;
  shipping: number;
  subTotal: number;
  tax: number;
  total: number;
  status?:
    | "pending"
    | "processing"
    | "onhold"
    | "completed"
    | "refunded"
    | "failed";
  user_id?: string | null | undefined;
};

export type WithdrawlFormData = {
  id?: string;
  name: string;
};

export type StatusFormData = {
  status:
    | "pending"
    | "processing"
    | "onhold"
    | "completed"
    | "refunded"
    | "failed";
};

export type AddressFormData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  country?: string;
  zipCode: string;
  email: string;
  status?: statusAddress;
};

export type CartFormData = {
  _id?: string;
  cartItems: CartItemForm[];
  subTotal: number;
  user_id: string;
};

export type DiscountFormData = {
  discount: string;
};

export type WithdrawalFormData = {
  amount: number;
  paypal: string;
  store?: string;
  status: "pending" | "paid" | "publish" | "draft";
};

export type NewsletterFormData = {
  email: string;
  subject: string;
  message: string;
};

export type StoreTrackOrderData = {
  order: string;
  user_id?: string | null | undefined;
};
export type CartItemForm = {
  _id?: string;
  variant: string;
  productName: string;
  productImage: string;
  store: string;
  qty: number;
};

export type StoreFormData = {
  _id?: string;
  name?: string;
  description?: string;
  status?: "online" | "pending" | "suspended";
  user_id?: string | null | undefined;
};
export type CheckoutFormData = {
  user_id: string;
  amount: number;
};

export type ImageFormData = {
  user_id: string;
  store: string;
  url: string;
};

export type ReviewFormData = {
  review: string;
  rating: number;
  user: User;
};

export type User = {
  _id: string;
  imageUrl: string;
  fullName: string;
};

export type CategoryFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  createdAt?: string;
  subCategory?: string[];
};

export type SubcategoryFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
};

export type SlideFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  createdAt?: string;
};

export type SlideitemFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  title?: string;
  subtitle?: string;
  btn?: string;
  textColor?: string;
  product: string;
  slide: string;
  status: "draft" | "publish" | "approve" | "reject" | "archive";
  store?: string;
  user_id?: string | null | undefined;
};

export type TagFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  createdAt?: string;
};

export type CollectionFormData = {
  _id?: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  createdAt?: string;
};

export type BrandFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  createdAt?: string;
};

export type ShippingFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  delay: number;
  fixed_amount: number;
  unit_price_weight: number;
  price_range_start: number;
  price_range_end: number;
  fees: number;
  region: string[];
  createdAt?: string;
  store?: string;
};

// export type TypeFormRegion = {
//   image: string;
//   name: string;
// };

export type PmethodFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  createdAt?: string;
};

export type PageFormData = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "draft" | "publish" | "archive";
  user_id?: string | null | undefined;
  createdAt?: string;
};

export type storeAdminFormData = {
  status: "online" | "pending" | "suspended";
};

export type ImageUrl = {
  url: string;
};

export type NotificationFormData = {
  name: string;
  description: string;
  slug: string;
  store?: string;
  user_id?: string;
  status: "read" | "unread";
};

export type ProductFormData = {
  _id?: string;
  name: string;
  description: string;
  additionnal: string;
  specification: string;
  slug: string;
  category?: string;
  // subCategories: string[];
  brand?: string;
  images: Image[];
  status: "draft" | "publish" | "archive";
  price: number;
  discount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoSlug?: string;
  unit: string;
  sku: string;
  weight: number;
  user_id?: string | null;
  inventory: "instock" | "outstock";
};

export type Image = {
  url: string;
};

export type ColorFormData = {
  name: string;
  description: string;
  slug: string;
  images: Image[];
  user_id: string | null | undefined;
  value: string | null;
  store: string;
  status: "draft" | "publish" | "archive";
};

export type SubscriptionFormData = {
  store: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "ended" | "cancelled";
  type: "free" | "pro";
  user_id?: string | null | undefined;
};

export type SizeFormData = {
  name: string;
  description: string;
  slug: string;
  images: Image[];
  user_id: string | null | undefined;
  value: string;
  store: string;
  status: "draft" | "publish" | "archive";
};

export type ProductVariationFormData = {
  name: string;
  color: string;
  colorImages: ImageUrl[];
  size: string;
  sizeImages: ImageUrl[];
  weight: number;
  inventory: "instock" | "outstock";
  sku: string;
  price: number;
  discount: number;
  status: "publish" | "draft" | "archive";
  product: string;
};
