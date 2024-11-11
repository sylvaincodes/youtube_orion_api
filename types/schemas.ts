import { descriptionFormat, nameFormat, slugFormat } from "@/lib/regex";
import { z, ZodType } from "zod";
import {
  AddressFormData,
  BrandFormData,
  CartFormData,
  CategoryFormData,
  CheckoutFormData,
  CollectionFormData,
  DiscountFormData,
  ImageFormData,
  NewsletterFormData,
  OrderFormData,
  PageFormData,
  PmethodFormData,
  ProductFormData,
  ReviewFormData,
  ShippingFormData,
  SlideFormData,
  SlideitemFormData,
  StatusFormData,
  storeAdminFormData,
  StoreFormData,
  StoreTrackOrderData,
  SubcategoryFormData,
  SubscriptionFormData,
  TagFormData,
  TokenFormData,
  WithdrawalFormData,
} from "./forms";
import { TypeColorModel, TypeSizeModel } from "./models";

export const tokenValidationSchema: ZodType<TokenFormData> = z.object({
  template: z.string(),
  token: z.string(),
  user_id: z.string(),
  status: z.enum(["draft", "publish", "archive"]).optional(),
});

export const addressValidationSchema: ZodType<AddressFormData> = z.object({
  firstName: z.string().min(5).max(255),
  lastName: z.string().min(5).max(255),
  phone: z.string().min(5).max(255),
  email: z.string().email(),
  zipCode: z.string().min(5).max(20),
  country: z.string().min(5).max(255).optional(),
  city: z.string().min(5).max(255),
  state: z.string().min(5).max(255),
  address: z.string().min(5).max(255),
  user_id: z.string(),
  status: z.enum(["draft", "archive"]).optional(),
});

export const withdrawalValidationSchema: ZodType<WithdrawalFormData> = z.object(
  {
    status: z.enum(["pending", "paid", "draft", "publish"]),
    amount: z.coerce.number().min(100).max(1000),
    paypal: z.string().email(),
  }
);

export const newsletterValidationSchema: ZodType<NewsletterFormData> = z.object(
  {
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
  }
);

export const trackOrderValidationSchema: ZodType<StoreTrackOrderData> =
  z.object({
    order: z.string().min(20).max(30),
    user_id: z.string().optional().nullable(),
  });

export const discountValidationSchema: ZodType<DiscountFormData> = z.object({
  discount: z.string().min(6).max(255),
});

export const statusValidationSchema: ZodType<StatusFormData> = z.object({
  status: z.enum([
    "pending",
    "processing",
    "onhold",
    "completed",
    "refunded",
    "failed",
  ]),
});

export const cartValidationSchema: ZodType<CartFormData> = z.object({
  cartItems: z.array(
    z.object({
      variant: z.string(),
      productName: z.string(),
      productImage: z.string(),
      qty: z.coerce.number().min(1).max(9),
      store: z.string(),
    })
  ),
  subTotal: z.coerce.number().min(0).max(10000000),
  user_id: z.string(),
});

export const OrderValidationSchema: ZodType<OrderFormData> = z.object({
  pmethod: z.string(),
  discount: z.coerce.number().min(0).max(100000),
  shipping: z.coerce.number().min(0).max(100000),
  subTotal: z.coerce.number().min(0).max(100000),
  tax: z.coerce.number().min(0).max(100000),
  total: z.coerce.number().min(0).max(100000),
  user_id: z.string().optional(),
  cartItems: z
    .object({
      cart: z.string(),
      productImage: z.string(),
      productName: z.string(),
      qty: z.number(),
      shipping: z.string(),
      shippingAmount: z.number(),
      store: z.string(),
      variant: z.string(),
      _id: z.string(),
    })
    .array()
    .min(1)
    .max(10),
  status: z
    .enum([
      "pending",
      "processing",
      "onhold",
      "completed",
      "refunded",
      "failed",
    ])
    .optional(),
});

export const storeValidationSchema: ZodType<StoreFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,) min 4 and max 60 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  user_id: z.string().optional(),
  status: z.enum(["online", "pending", "suspended"]).optional(),
});

export const ColorValidationSchema: ZodType<TypeColorModel> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  images: z.object({ url: z.string() }).array().max(2),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string(),
  value: z.string().optional(),
});

export const SizeValidationSchema: ZodType<TypeSizeModel> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  images: z.object({ url: z.string() }).array().max(2),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string(),
  value: z.string().optional(),
});

export const productValidationSchema: ZodType<ProductFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,) min 4 and max 60 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  additionnal: z.string().max(2000),
  specification: z.string().max(2000),
  images: z
    .object({ url: z.string() })
    .array()
    .min(2, "Product should have at least 2 images")
    .max(20),
  user_id: z.string().optional().nullable(),
  status: z.enum(["draft", "publish", "archive"]),
  inventory: z.enum(["instock", "outstock"]),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  price: z.coerce.number().min(0).max(100000),
  discount: z.coerce.number().min(0).max(100),
  unit: z.string(),
  weight: z.coerce.number().min(0).max(100),
  sku: z.string().max(30),
  seoTitle: z
    .string()
    .regex(nameFormat, {
      message: "format: no special (&/,) min 4 and max 60 characters",
    })
    .optional(),
  seoDescription: z
    .string()
    .regex(descriptionFormat, {
      message: "format:min 4 and max 500 characters",
    })
    .optional(),
  seoSlug: z
    .string()
    .regex(slugFormat, {
      message:
        "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
    })
    .optional(),
  // category: z.string(),
  // brand: z.string(),
  // subCategories: z.string().array(),
});

export const categoryValidationSchema: ZodType<CategoryFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  // image: z.object({ url: z.string() }).array(),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string().optional().nullable(),
});

export const reviewValidationSchema: ZodType<ReviewFormData> = z.object({
  review: z.string().regex(descriptionFormat, {
    message: "format: no special (&/,), min 4 and max 2500 characters",
  }),
  rating: z.coerce.number().min(1).max(5),
  user: z.object({
    _id: z.string(),
    imageUrl: z.string(),
    fullName: z.string(),
  }),
});

export const slideValidationSchema: ZodType<SlideFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  // image: z.object({ url: z.string() }).array(),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string().optional().nullable(),
});

export const tagValidationSchema: ZodType<TagFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  // image: z.object({ url: z.string() }).array(),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string().optional().nullable(),
});

export const collectionValidationSchema: ZodType<CollectionFormData> = z.object(
  {
    name: z.string().regex(nameFormat, {
      message: "format: no special (&/,), min 4 and max 60 characters",
    }),
    slug: z.string().regex(slugFormat, {
      message:
        "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
    }),
    color: z.string(),
    description: z.string().regex(descriptionFormat, {
      message: "format:min 4 and max 500 characters",
    }),
    image: z.string().url("Image url is invalid"),
    // image: z.object({ url: z.string() }).array(),
    status: z.enum(["draft", "publish", "archive"]),
    user_id: z.string().optional().nullable(),
  }
);

export const brandValidationSchema: ZodType<BrandFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  // image: z.object({ url: z.string() }).array(),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string().optional().nullable(),
});

export const shippingValidationSchema: ZodType<ShippingFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string().optional().nullable(),
  delay: z.coerce.number().min(0).max(360, "less than 360 days"),
  fees: z.coerce.number().min(0).max(100000),
  region: z.string().array(),
  fixed_amount: z.coerce.number().min(0).max(100000),
  unit_price_weight: z.coerce.number().min(0).max(100000),
  price_range_start: z.coerce.number().min(0).max(100000),
  price_range_end: z.coerce.number().min(0).max(100000),
  store: z.string().optional(),
});
// .refine((schema) => schema.price_range_end < schema.price_range_start, {
//   message: "price range end must be greater than price range start",
// });

export const pmethodValidationSchema: ZodType<PmethodFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  // image: z.object({ url: z.string() }).array(),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string().optional().nullable(),
});

export const subscriptionValidationSchema: ZodType<SubscriptionFormData> =
  z.object({
    startDate: z.date(),
    endDate: z.date(),
    status: z.enum(["active", "ended", "cancelled"]),
    type: z.enum(["free", "pro"]),
    user_id: z.string().nullable(),
    store: z.string(),
  });

export const pageValidationSchema: ZodType<PageFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  // image: z.object({ url: z.string() }).array(),
  status: z.enum(["draft", "publish", "archive"]),
  user_id: z.string().optional().nullable(),
});

export const SubcategoryValidationSchema: ZodType<SubcategoryFormData> =
  z.object({
    name: z.string().regex(nameFormat, {
      message: "format: no special (&/,), min 4 and max 60 characters",
    }),
    slug: z.string().regex(slugFormat, {
      message:
        "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
    }),
    description: z.string().regex(descriptionFormat, {
      message: "format:min 4 and max 500 characters",
    }),
    image: z.string().url("Image url is invalid"),
    // image: z.object({ url: z.string() }).array(),
    status: z.enum(["draft", "publish", "archive"]),
    user_id: z.string().optional().nullable(),
    category: z.string(),
  });

export const SlideitemValidationSchema: ZodType<SlideitemFormData> = z.object({
  name: z.string().regex(nameFormat, {
    message: "format: no special (&/,), min 4 and max 60 characters",
  }),
  slug: z.string().regex(slugFormat, {
    message:
      "format: no blank space (_), no special character (&,',/|...), min 4 and max 20 characters",
  }),
  description: z.string().regex(descriptionFormat, {
    message: "format:min 4 and max 500 characters",
  }),
  image: z.string().url("Image url is invalid"),
  // image: z.object({ url: z.string() }).array(),
  status: z.enum(["draft", "publish", "approve", "reject", "archive"]),
  user_id: z.string().optional().nullable(),
  slide: z.string(),
  product: z.string(),
  store: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  btn: z.string().optional(),
  textColor: z.string().optional(),
});

export const ImageValidationSchema: ZodType<ImageFormData> = z.object({
  user_id: z.string(),
  url: z.string(),
  store: z.string(),
});

export const checkoutValidationSchema: ZodType<CheckoutFormData> = z.object({
  user_id: z.string(),
  amount: z.number().min(1),
});

export const SubcategoryArrayValidationSchema: ZodType<{
  subCategory: string[];
}> = z.object({
  subCategory: z.array(z.string()),
});

export const storeAdminValidationSchema: ZodType<storeAdminFormData> = z.object(
  {
    status: z.enum(["online", "pending", "suspended"]),
  }
);
