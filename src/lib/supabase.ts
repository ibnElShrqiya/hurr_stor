
import { createClient } from '@supabase/supabase-js';

const url = (
  import.meta.env.VITE_SUPABASE_URL as string | undefined
)?.trim();

const key = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
)?.trim();

export const supabase =
  url && key && url.startsWith('https://')
    ? createClient(url, key)
    : null;

export const hasSupabaseConfig = Boolean(supabase);

/** Maps the currently deployed compact products table plus the category migration. */
export function fromDbProduct(row: any) {
  const imageCandidate =
    row.image_url ??
    (Array.isArray(row.images)
      ? row.images.find(
          (x: unknown) => typeof x === 'string' && x.trim()
        )
      : '');

  const image =
    typeof imageCandidate === 'string'
      ? imageCandidate.trim()
      : '';

  const category = [
    'men',
    'women',
    'unisex',
    'private_collection',
    'offers',
  ].includes(row.category)
    ? row.category
    : 'unisex';

  return {
    id: String(row.id),
    name: row.name_ar ?? row.name ?? '',
    nameAr: row.name_ar ?? row.name ?? '',
    slug: row.slug ?? '',
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    story: row.story ?? '',
    category,
    price: Number(row.price ?? 0),
    originalPrice:
      row.original_price == null
        ? undefined
        : Number(row.original_price),
    discountPercentage:
      Number(row.discount_percentage ?? 0) || undefined,
    stock: Number(row.stock ?? 0),
    images: image
      ? [
          image,
          ...(Array.isArray(row.images)
            ? row.images.filter(
                (x: unknown) =>
                  typeof x === 'string' && x !== image
              )
            : []),
        ]
      : [],
    bottleStyle: row.bottle_style ?? 'obsidian',
    rating: Number(row.rating ?? 0),
    reviewsCount: Number(row.reviews_count ?? 0),
    isBestseller: Boolean(row.is_bestseller),
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    volume: row.volume ?? '',
    concentration: row.concentration ?? 'Extrait de Parfum',
    longevity: row.longevity ?? '',
    sillage: row.sillage ?? '',
    notes:
      row.notes && typeof row.notes === 'object'
        ? {
            top: Array.isArray(row.notes.top)
              ? row.notes.top
              : [],
            heart: Array.isArray(row.notes.heart)
              ? row.notes.heart
              : [],
            base: Array.isArray(row.notes.base)
              ? row.notes.base
              : [],
          }
        : { top: [], heart: [], base: [] },
    scentFamily: row.scent_family ?? 'oud',
    scentFamilyAr: row.scent_family_ar ?? '',
    occasion: row.occasion ?? '',
    season: row.season ?? '',
    status:
      row.is_active === false || row.status === 'draft'
        ? 'draft'
        : Number(row.stock ?? 0) <= 0
          ? 'out_of_stock'
          : 'active',
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

/** Writes only columns supported by the deployed compact products schema. */
export function toDbProduct(p: any) {
  const image = Array.isArray(p.images)
    ? p.images.find(
        (item: unknown) =>
          typeof item === 'string' && item.trim()
      )
    : null;

  return {
    id: String(
      p.id ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `hurr-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 10)}`)
    ),
    name: String(p.nameAr || p.name || '').trim(),
    slug: String(p.slug || '').trim() || `hurr-${Date.now()}`,
    description: String(p.description || ''),
    price: Number(p.price) || 0,
    original_price:
      p.originalPrice != null &&
      Number(p.originalPrice) >= Number(p.price)
        ? Number(p.originalPrice)
        : null,
    discount_percentage:
      p.originalPrice &&
      Number(p.originalPrice) > Number(p.price)
        ? Math.round(
            ((Number(p.originalPrice) - Number(p.price)) /
              Number(p.originalPrice)) *
              100
          )
        : 0,
    image_url: image || null,
    stock: Math.max(0, Math.trunc(Number(p.stock) || 0)),
    is_active: p.status !== 'draft',
    category: [
      'men',
      'women',
      'unisex',
      'private_collection',
      'offers',
    ].includes(p.category)
      ? p.category
      : 'unisex',
  };
}

/**
 * Maps the currently deployed coupons schema:
 * id, code, discount_percent, is_active, expires_at, created_at.
 */
export function fromDbCoupon(row: any) {
  const discountType = row.discount_type === 'fixed' ? 'fixed' : 'percentage';
  const value = Number(row.value ?? row.discount_percent ?? 0);
  return {
    code: String(row.code ?? ''),
    discountType,
    value,
    minOrderAmount: Number(row.min_order_amount ?? 0),
    isActive: Boolean(row.is_active),
    usageCount: Number(row.usage_count ?? 0),
    maxUses: row.max_uses == null ? null : Number(row.max_uses),
    expiresAt: row.expires_at ?? undefined,
    description: row.description || `خصم ${discountType === 'percentage' ? `${value}%` : `${value} ج.م`}`,
    createdAt: row.created_at ?? undefined,
  };
}

export function fromDbOrder(row: any) {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || undefined,
    governorate: row.governorate,
    city: row.city,
    detailedAddress: row.detailed_address,
    notes: row.notes || undefined,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    shippingStatus: row.shipping_status,
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee),
    discountAmount: Number(row.discount_amount),
    couponCode: row.coupon_code || undefined,
    totalAmount: Number(row.total_amount),
    items: (row.order_items || []).map((i: any) => ({
      productId: i.product_id,
      productName: i.product_name,
      productImage: i.product_image || '',
      quantity: i.quantity,
      unitPrice: Number(i.unit_price),
      totalPrice: Number(i.total_price),
      selectedSize: i.selected_size,
    })),
    createdAt: row.created_at,
    trackingHistory: row.tracking_history || [],
  };
}
