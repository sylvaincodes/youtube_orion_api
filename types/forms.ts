export type statusEnum = "draft" | "publish" | "archive";

export type TokenFormData = {
  template: string;
  token: string;
  user_id: string;
};

export type brandFormData = {
  name: string;
  description?: string;
  slug: string;
  image: string;
  user_id: string;
  status?: statusEnum;
};
