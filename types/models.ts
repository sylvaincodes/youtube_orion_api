//Models types

export type statusStoreEnum = "online" | "pending" | "suspended";
export type statusAddress = "draft" | "archive";
export type statusCartEnum = "draft" | "abandoned" | "completed";
export type badge = "hot" | "bestdeals" | "sale" | "off" | "soldout" | "none";
export type Image = {
  url: string;
};

export type TypeNewsletterModel = {
  email: string;
};

export type TypeTokenModel = {
  template: string;
  token: string;
  status: "draft" | "publish" | "archive";
  user_id: string;
};

export type TypeDiscountModel = {
  _id: string;
  code: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  validity: "once";
  discount: number;
  status: "available" | "expired";
};

export type TypeAddressModel = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  country?: string;
  zipCode: string;
  email: string;
  user_id: string;
  status: statusAddress;
};

export type TypeCartItemModel = {
  cart: TypeCartModel;
  variant: TypeProductVariantModel;
  productName: string;
  productImage: string;
  store: TypeStoreModel;
  qty: number;
};

export type TypeCartModel = {
  cartItems: TypeCartItemModel[];
  subTotal: number;
  coupon: number;
  shipping: TypeShippingModel;
  user_id: string;
  status: statusCartEnum;
};

export type TypeStoreModel = {
  _id: string;
  user_id: string; //clerk user_id
  name: string;
  description: string;
  logo: string;
  products: TypeProductModel[];
  orderitems: TypeOrderItemModel[];
  slides: TypeSlideModel[];
  subscription: TypeSubscriptionModel;
  status: statusStoreEnum;
  createdAt: Date;
};

export type TypeTrackOrderModel = {
  _id: string;
  orderitem: TypeOrderModel;
  trackactivity: TypeTrackActivityModel[];
  status: "open" | "packaging" | "onroad" | "delivered" | "failed";
  user_id: string;
};

export type TypeTrackActivityModel = {
  _id: string;
  trackorder: TypeTrackOrderModel;
  activity: string;
  user_id: string;
};

export type TypeImageModel = {
  url: string;
  store: TypeStoreModel;
  user_id: string;
};

export type TypeProductModel = {
  _id: string;
  featured?: boolean;
  badge?: badge;
  name: string;
  slug: string;
  description: string;
  additionnal: string;
  specification: string;
  store: TypeStoreModel;
  collections: TypeCollectionModel;
  tags: TypeCollectionModel;
  category: TypeCategoryModel;
  subCategories: TypeSubCategoryModel[];
  brand: TypeBrandModel;
  details: TypeDetailModel[];
  questions: TypeQuestionModel[];
  reviews: TypeReviewModel[];
  productVariants: TypeProductVariantModel[];
  images: string[];
  price: number;
  discount: number;
  seoSlug?: string;
  seoDescription?: string;
  seoTitle?: string;
  status: "draft" | "publish" | "archive";
  inventory: "instock" | "outstock";
  weight: number;
  sku: string;
  unit: string;
  user_id: string;
  views: number;
  createdAt?: Date;
};

export type TypeProductVariantModel = {
  productId: TypeProductModel;
  name: string;
  color: TypeColorModel;
  colorImages: Image[];
  size?: TypeSizeModel;
  sizeImages?: Image[];
  weight: number;
  inventory: "instock" | "outstock";
  sku: string;
  price: number;
  discount: number;
  colorValue?: string;
  status: "draft" | "publish" | "archive";
};

export type TypeReviewModel = {
  _id: string;
  product: TypeProductModel;
  store: TypeStoreModel;
  rating: number;
  review: string;
  likes: string[];
  user: {
    _id: string;
    imageUrl: string;
    fullName: string;
  };
};

export type TypeCategoryModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  createdAt: Date;
  subCategories: string[];
};

export type TypeTagModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  createdAt: Date;
};

export type TypeCollectionModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  createdAt: Date;
};

export type TypeColorModel = {
  _id?: string;
  name: string;
  description: string;
  slug: string;
  images: Image[];
  user_id: string | null | undefined;
  value?: string;
  store?: TypeStoreModel;
  status: "draft" | "publish" | "archive";
  createdAt?: Date;
};

export type TypeSizeModel = {
  _id?: string;
  name: string;
  description: string;
  slug: string;
  images: Image[];
  user_id: string | null | undefined;
  value?: string;
  store?: TypeStoreModel;
  status: "draft" | "publish" | "archive";
  createdAt?: Date;
};

export type TypeSubCategoryModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  category: TypeCategoryModel;
};

export type TypeBrandModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  createdAt: Date;
};

export type TypeShippingModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  delay: number;
  fixed_amount: number;
  fees: number;
  region: string[];
  unit_price_weight: number;
  price_range_start: number;
  price_range_end: number;
  createdAt: Date;
  store: TypeStoreModel;
};

// export type TypeRegionModels = {
//   image: string;
//   name: string;
// };

export type TypePmethodModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  createdAt: Date;
};

export type TypeSlideItemModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  title: string;
  subtitle: string;
  textColor: string;
  btn: string;
  views: number;
  user_id: string;
  status: "draft" | "publish" | "approve" | "reject" | "archive";
  slide: TypeSlideModel;
  product: TypeProductModel;
  store: TypeStoreModel;
  createdAt: Date;
  updatedAt?: Date;
  approvedAt?: Date;
};

export type TypeSlideModel = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  slideItem: string[];
  createdAt: Date;
};

export type TypePageModel = {
  _id: string;
  icon: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  user_id: string;
  status: "draft" | "publish" | "archive";
  createdAt: Date;
};

export type TypeDetailModel = {
  _id: string;
};
export type TypeSubProductModel = {
  _id: string;
  sku: string;
  style: TypeStyleModel;
  options: TypeOptionsModel[];
  subProduct: TypeSubProductModel;
};

export type TypeQuestionModel = { _id: string };
export type TypeOrderModel = {
  _id: string;
  subTotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  pmethod: TypePmethodModel;
  discountItem: TypeDiscountModel;
  delivered: boolean;
  earning: number;
  status:
    | "pending"
    | "processing"
    | "onhold"
    | "completed"
    | "refunded"
    | "failed";
  orderitems: TypeOrderItemModel[];
  customer: string;
};
export type TypeOrderItemModel = {
  _id: string;
  status:
    | "pending"
    | "processing"
    | "onhold"
    | "completed"
    | "refunded"
    | "failed";
  cartItem: TypeCartItemModel;
  order: TypeOrderModel;
  shipping: TypeShippingModel;
  address: TypeAddressModel;
  store: TypeStoreModel;
  shippingAmount: number;
  delivered: boolean;
  earning: number;
  paidAmount: number;
  trackorder: TypeTrackOrderModel;
  createdAt: Date;
};
export type TypeOptionsModel = { _id: string };
export type TypeStyleModel = {
  _id: string;
  color: string;
  image: string;
};

export type TypeSubscriptionModel = {
  store: TypeStoreModel;
  payments: string[];
  startDate: Date;
  endDate?: Date | undefined;
  status: "active" | "ended" | "cancelled";
  type: "free" | "pro";
  user_id: string;
};

export type TypeWithdrawalModel = {
  _id: string;
  amount: number;
  status: "pending" | "paid" | "draft" | "publish";
  paypal: string;
  store: TypeStoreModel;
  user_id: string;
};

export type TypePaymentModel = {
  _id: string;
  subscription: TypeSubscriptionModel;
  checkout_id: string;
  checkout_status: string;
  payment_intent: TypePaymentIntent;
  payment_status: string;
  amount_subtotal: number;
  amount_total: number;
  amount_discount: number;
  amount_tax: number;
  amount_shipping: number;
  type: string;
  createdAt?: Date;
};

export type TypeNotificationModel = {
  name: string;
  description: string;
  slug: string;
  status: "unread" | "read";
  user_id?: string;
  store?: TypeStoreModel;
  orderitem?: TypeStoreModel;
  createdAt: Date;
};

export type TypePaymentIntent = {
  id: {
    type: string;
  };
  amount: {
    type: string;
  };
  amount_received: {
    type: string;
  };
  client_secret: {
    type: string;
  };
  created: {
    type: string;
  };
  currency: {
    type: string;
  };
  shipping: {
    address: {
      city: {
        type: string;
      };
      country: { type: string };
      line1: { type: string };
      line2: { type: string };
      postal_code: { type: string };
      state: { type: string };
    };
  };
};
