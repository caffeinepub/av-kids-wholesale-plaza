import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: ProductId;
    name: string;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
    image: string;
    price: bigint;
}
export interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
    fullAddress: string;
}
export interface OrderItem {
    unitPriceAtOrder: bigint;
    productId: ProductId;
    quantity: bigint;
}
export type ProductId = bigint;
export interface Order {
    id: OrderId;
    customer: CustomerDetails;
    createdAt: bigint;
    totalEstimate: bigint;
    items: Array<OrderItem>;
}
export type OrderId = bigint;
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / **************************************
     * /    *             Product CRUD             *
     * /    ***************************************
     */
    addProduct(name: string, price: bigint, image: string, description: string): Promise<ProductId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    /**
     * / **************************************
     * /    *           Admin Order Review         *
     * /    ***************************************
     */
    getAllOrders(): Promise<Array<Order>>;
    /**
     * / **************************************
     * /    *         User Profile Functions       *
     * /    ***************************************
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: ProductId): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / **************************************
     * /    *            Order Placement           *
     * /    ***************************************
     */
    placeOrder(items: Array<OrderItem>, customer: CustomerDetails): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(id: ProductId, name: string, price: bigint, image: string, description: string): Promise<void>;
}
