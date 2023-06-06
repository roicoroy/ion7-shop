
export enum IFlow {
    AUTH = '/auth/pages',
    START = '/start/tabs',
    SHOP = '/shop/tabs',
    PROFILE = '/start/tabs',
    CHECKOUT = '/checkout/pages',
}

export enum AppRoutePath {
    AUTH_HOME = `/auth/pages/auth-home`,
    AUTH_FORGOT_PASSWORD = 'auth/pages/email/flow/forgot-password',
    AUTH_REGISTER = '/auth/pages/email/flow/register',

    START_HOME = `/start/tabs/home`,
    START_PROFILE_PAGES = `/start/tabs/profile`,
    START_PROFILE_ADDRESSES = `/start/tabs/profile`,
    START_PROFILE_ORDERS = `/start/tabs/profile`,
    START_PROFILE_USER = `/start/tabs/profile`,

    SHOP_PRODUCTS_LIST = `/shop/tabs/products-list`,
    SHOP_DETAILS_PAGE = `/shop/tabs/products-list`,

    CHECKOUT_HOME = '',
    CHECKOUT_ADDRESSES = '',
    CHECKOUT_PAYMENT = '',
    CHECKOUT_SHIPPING = '',
    CHECKOUT_ORDER_REVIEW = '',
    CHECKOUT_CART_REVIEW = '',
}