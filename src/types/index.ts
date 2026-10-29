export type ProductCategory = 'men' | 'women' | 'unisex' | 'private_collection' | 'offers';

export type ScentFamily = 'oud' | 'amber' | 'musk' | 'leather' | 'oriental_floral' | 'spicy_woody';

export type PerfumeConcentration = 'Extrait de Parfum' | 'Eau de Parfum' | 'Pure Dehn Oud Oil';

export interface ScentNotes {
  top: string[];    // الافتتاحية
  heart: string[];  // قلب العطر
  base: string[];   // قاعدة العطر
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  tagline: string;
  description: string;
  story: string;
  category: ProductCategory;
  price: number;              // EGP
  originalPrice?: number;     // EGP
  discountPercentage?: number;
  stock: number;
  images: string[];
  bottleStyle?: 'obsidian' | 'amber' | 'emerald' | 'crystal' | 'royal_leather' | 'rose_frost';
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  isBestseller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  volume: string;             // e.g. "100 مل / 3.4 FL.OZ."
  concentration: PerfumeConcentration;
  longevity: string;          // e.g. "أكثر من 36 ساعة"
  sillage: string;            // e.g. "فوحان أصيل واسع الانتشار"
  notes: ScentNotes;
  scentFamily: ScentFamily;
  scentFamilyAr: string;
  occasion: string;
  season: string;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
}

export type PaymentMethod = 'cod' | 'card' | 'vodafone_cash' | 'instapay';
export type PaymentStatus = 'pending' | 'paid' | 'verified';
export type ShippingStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedSize: string;
}

export interface TrackingStep {
  status: ShippingStatus;
  label: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. HURR-EG-58491
  trackingToken?: string; // returned once at checkout; never stored in the database as plaintext
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  governorate: string; // Egyptian Governorate
  city: string;
  detailedAddress: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  trackingHistory: TrackingStep[];
  paymentReference?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15% or 200 for 200 EGP
  minOrderAmount: number;
  isActive: boolean;
  usageCount: number;
  maxUses?: number | null;
  expiresAt?: string;
  description: string;
}

export interface GovernorateShipping {
  id: string;
  nameAr: string;
  nameEn: string;
  fee: number;
  estimatedDelivery: string;
}
