export const ADMIN_DASHBOARD = '/admin/dashboard'

//media page route
export const ADMIN_MEDIA_SHOW = '/admin/media'
export const ADMIN_MEDIA_EDIT = (id: string) => `/admin/media/edit/${id}`;


//category page routes
export const ADMIN_CATEGORY_SHOW = '/admin/category';
export const ADMIN_CATEGORY_ADD = '/admin/category/add';
export const ADMIN_CATEGORY_EDIT = (id: string) => `/admin/category/edit/${id}`;

//trash route
export const ADMIN_TRASH = '/admin/trash'

// product pages routes
export const ADMIN_PRODUCT_SHOW = '/admin/product';
export const ADMIN_PRODUCT_ADD = '/admin/product/add';
export const ADMIN_PRODUCT_EDIT = (id: string) => `/admin/product/edit/${id}`;

// product varient pages routes
export const ADMIN_PRODUCT_VARIENT_SHOW = '/admin/varient';
export const ADMIN_PRODUCT_VARIENT_ADD = '/admin/varient/add';
export const ADMIN_PRODUCT_VARIENT_EDIT = (id: string) => `/admin/varient/edit/${id}`;

//coupon routes
export const ADMIN_COUPON_SHOW = '/admin/coupon';
export const ADMIN_COUPON_ADD = '/admin/coupon/add';
export const ADMIN_COUPON_EDIT = (id: string) => `/admin/coupon/edit/${id}`;

// customers routes
export const ADMIN_CUSTOMERS_SHOW = '/admin/customers'

//review routes
export const ADMIN_REVIEW_SHOW = '/admin/review'

//order routes
export const ADMIN_ORDERS_SHOW = '/admin/order'