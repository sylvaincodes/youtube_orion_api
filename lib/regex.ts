// slug validation
export const slugFormat = new RegExp(/^[a-z-0-9]{2,80}$/);

// price validation
export const amountFormat = new RegExp(/^[0-9]{0,6}$/);

// Short name validation
export const nameFormat = new RegExp(/^[a-zA-Z0-9 ]{2,80}$/);

// Link validation
export const linkFormat = new RegExp(/^[/][a-z]{4,20}$/);

// Description validation
export const descriptionFormat = new RegExp(
  /^[a-zA-Z0-9 -./';,:?<>é&|() "]{10,2500}$/
);

// phone validation
export const phoneValidation = new RegExp(
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
);

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
export const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

// Clerk UserId format
export const clerkUserIdFormat = new RegExp(/^user_[a-zA-Z]$/);
