
export interface ISelectedCartProduct {
    product: any,
    quantity: unknown,
}
export interface ICustomer {
    billing_address_id?: any;
    created_at?: any;
    deleted_at?: any;
    email?: any;
    first_name?: any;
    has_account?: any;
    id?: any;
    last_name?: any;
    metadata?: any;
    orders?: any;
    phone?: any;
    updated_at?: any;
}

export interface IStrapiRegisterData {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: any;
    phone?: number;
}

export interface ICustomerRegisterData {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: any;
    phone?: number;
}

export interface ICustomer {
    billing_address_id?: any;
    created_at?: any;
    deleted_at?: any;
    email?: any;
    first_name?: any;
    has_account?: any;
    id?: any;
    last_name?: any;
    metadata?: any;
    orders?: any;
    phone?: any;
    updated_at?: any;
}

export interface IRegisterAddress {
    id?: any;
    first_name?: any;
    last_name?: any;
    address_1?: any;
    address_2?: any;
    city?: any;
    region_code?: any;
    country?: any;
    country_code?: any;
    postal_code?: any;
    region_id?: any;
    phone?: any;
    company?: any;
    province?: any;
    metadata?: any;
}
export interface ICustomerLoginData {
    email: string | any;
    password: string | any;
}
export interface IStrapiLoginData {
    identifier: string | any;
    password: any | any;
}
export interface AppStateModel {
    authState?: any;
    formsState?: any;
    languageState?: any;
    medusaState?: any;
}

export type AppAuthRoutes = {
    login?: string;
    logout?: string;
    register?: string;
    requestPassword?: string;
    resetPassword?: string;
    loginRedirect?: string;
    logoutRedirect?: string;
    requestPasswordRedirect?: string;
    profile?: string;
};

export const authFlow = 'auth/';

export const AUTH_ROUTES: AppAuthRoutes = {
    login: 'login',
    logout: 'logout',
    register: 'register',
    requestPassword: 'request-password',
    resetPassword: 'reset-password',
    loginRedirect: '/',
    logoutRedirect: 'login',
    requestPasswordRedirect: 'login',
    profile: '/profile'
};

export interface ISelectedProduct {
    title: null,
    description: null,
    thumbnail: null,
    price: null,
    size: null,
}
export interface ICartItem {
    quantity: any,
    variant: any,
    selectedProduct: any,
    thumbnail: any,
}