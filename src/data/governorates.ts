import { GovernorateShipping } from '../types';

export const EGYPTIAN_GOVERNORATES: GovernorateShipping[] = [
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', fee: 45, estimatedDelivery: 'خلال 24 ساعة' },
  { id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza', fee: 45, estimatedDelivery: 'خلال 24 ساعة' },
  { id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria', fee: 55, estimatedDelivery: 'خلال 24-48 ساعة' },
  { id: 'qalyubia', nameAr: 'القليوبية', nameEn: 'Qalyubia', fee: 55, estimatedDelivery: 'خلال 24-48 ساعة' },
  { id: 'sharqia', nameAr: 'الشرقية', nameEn: 'Sharqia', fee: 60, estimatedDelivery: 'خلال يومين' },
  { id: 'dakahlia', nameAr: 'الدقهلية (المنصورة)', nameEn: 'Dakahlia', fee: 60, estimatedDelivery: 'خلال يومين' },
  { id: 'gharbia', nameAr: 'الغربية (طنطا)', nameEn: 'Gharbia', fee: 60, estimatedDelivery: 'خلال يومين' },
  { id: 'monufia', nameAr: 'المنوفية', nameEn: 'Monufia', fee: 60, estimatedDelivery: 'خلال يومين' },
  { id: 'beheira', nameAr: 'البحيرة', nameEn: 'Beheira', fee: 65, estimatedDelivery: 'خلال 2-3 أيام' },
  { id: 'kafr_el_sheikh', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', fee: 65, estimatedDelivery: 'خلال 2-3 أيام' },
  { id: 'damietta', nameAr: 'دمياط', nameEn: 'Damietta', fee: 65, estimatedDelivery: 'خلال 2-3 أيام' },
  { id: 'port_said', nameAr: 'بورسعيد', nameEn: 'Port Said', fee: 65, estimatedDelivery: 'خلال يومين' },
  { id: 'ismailia', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', fee: 65, estimatedDelivery: 'خلال يومين' },
  { id: 'suez', nameAr: 'السويس', nameEn: 'Suez', fee: 65, estimatedDelivery: 'خلال يومين' },
  { id: 'fayoum', nameAr: 'الفيوم', nameEn: 'Fayoum', fee: 70, estimatedDelivery: 'خلال 2-3 أيام' },
  { id: 'beni_suef', nameAr: 'بني سويف', nameEn: 'Beni Suef', fee: 70, estimatedDelivery: 'خلال 2-3 أيام' },
  { id: 'minya', nameAr: 'المنيا', nameEn: 'Minya', fee: 75, estimatedDelivery: 'خلال 3-4 أيام' },
  { id: 'assiut', nameAr: 'أسيوط', nameEn: 'Assiut', fee: 75, estimatedDelivery: 'خلال 3-4 أيام' },
  { id: 'sohag', nameAr: 'سوهاج', nameEn: 'Sohag', fee: 80, estimatedDelivery: 'خلال 3-4 أيام' },
  { id: 'qena', nameAr: 'قنا', nameEn: 'Qena', fee: 80, estimatedDelivery: 'خلال 3-4 أيام' },
  { id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor', fee: 85, estimatedDelivery: 'خلال 3-5 أيام' },
  { id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan', fee: 85, estimatedDelivery: 'خلال 3-5 أيام' },
  { id: 'red_sea', nameAr: 'البحر الأحمر (الغردقة)', nameEn: 'Red Sea', fee: 90, estimatedDelivery: 'خلال 3-5 أيام' },
  { id: 'south_sinai', nameAr: 'جنوب سيناء (شرم الشيخ)', nameEn: 'South Sinai', fee: 95, estimatedDelivery: 'خلال 3-5 أيام' },
  { id: 'north_sinai', nameAr: 'شمال سيناء', nameEn: 'North Sinai', fee: 95, estimatedDelivery: 'خلال 4-6 أيام' },
  { id: 'matrouh', nameAr: 'مطروح والساحل الشمالي', nameEn: 'Matrouh', fee: 90, estimatedDelivery: 'خلال 3-5 أيام' },
  { id: 'new_valley', nameAr: 'الوادي الجديد', nameEn: 'New Valley', fee: 100, estimatedDelivery: 'خلال 4-6 أيام' },
];

export const FREE_SHIPPING_THRESHOLD = 1000; // Free delivery in Egypt for orders >= 1000 EGP
