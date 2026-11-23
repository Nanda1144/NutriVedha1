// ============================================================================
// NutriVedha User Frontend Domain Types
// ============================================================================

export type UserRole = 'User' | 'Admin' | 'Doctor' | 'Trainer' | 'Farmer' | 'Delivery';

export type DoshaType = 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  dateOfBirth?: string;
  heightCm?: number;
  weightKg?: number;
  primaryDosha?: DoshaType;
  secondaryDosha?: DoshaType;
  bloodGroup?: string;
  avatarUrl?: string;
  emergencyContact?: EmergencyContact;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  dietaryPreference: 'Vegetarian' | 'Vegan' | 'Sattvic' | 'Ayurvedic-Balanced' | 'Non-Vegetarian';
  allergies: string[];
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// Authentication Types
// ----------------------------------------------------------------------------
export interface LoginCredentials {
  identifier: string; // email or mobile
  password?: string;
  otp?: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// ----------------------------------------------------------------------------
// AI Disease & Symptom Scan Types
// ----------------------------------------------------------------------------
export interface HealthScanResult {
  id: string;
  userId?: string;
  imageUrl?: string;
  symptoms: string;
  conditionAssessment: string;
  doshaImbalance: {
    primary: DoshaType;
    severity: 'Mild' | 'Moderate' | 'Noticeable';
    description: string;
  };
  recommendations: {
    herbs: string[];
    lifestyleTips: string[];
    dietAdjustments: string[];
  };
  urgencyLevel: 'Home Care / Routine' | 'Consultation Recommended' | 'Urgent Medical Attention';
  confidenceScore: number;
  isFallback: boolean;
  safetyDisclaimer: string;
  createdAt: string;
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  condition: string;
  dosha: DoshaType;
  severity: string;
  summary: string;
}

// ----------------------------------------------------------------------------
// Encrypted Medical Reports Types
// ----------------------------------------------------------------------------
export interface MedicalReport {
  id: string;
  userId: string;
  reportTitle: string;
  reportType: 'Blood Test' | 'Dermatology' | 'Ayurvedic Consultation' | 'General Diagnostic' | 'Prescription';
  dateUploaded: string;
  fileSizeBytes: number;
  fileName: string;
  isEncrypted: boolean;
  encryptionAlgorithm: 'AES-256-GCM';
  previewSnippet?: string;
  tags: string[];
}

// ----------------------------------------------------------------------------
// Diet Planner Types
// ----------------------------------------------------------------------------
export interface MealItem {
  id: string;
  name: string;
  timeSlot: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  description: string;
  calories: number;
  herbsUsed: string[];
  doshaSuitability: DoshaType[];
  prepTimeMinutes: number;
}

export interface DayPlan {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  meals: MealItem[];
  totalCalories: number;
  waterIntakeLiters: number;
  dailyHerbalTea: string;
}

export interface DietPlan {
  id: string;
  userId: string;
  title: string;
  targetDosha: DoshaType;
  budgetWeeklyINR: number;
  weeklyPlan: DayPlan[];
  groceryList: string[];
  doctorVerified: boolean;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Recipes Types
// ----------------------------------------------------------------------------
export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  doshaAffinity: DoshaType[];
  category: 'Herbal Infusion' | 'Sattvic Main' | 'Digestive Soup' | 'Breakfast Porridge' | 'Kitchari & Grains';
  ingredients: { name: string; amount: string; optional?: boolean }[];
  instructions: string[];
  ayurvedicBenefits: string[];
  imageUrl: string;
  isFavorite?: boolean;
}

// ----------------------------------------------------------------------------
// Food Intelligence Types
// ----------------------------------------------------------------------------
export interface FoodItem {
  id: string;
  name: string;
  sanskritName?: string;
  category: 'Herbs & Spices' | 'Grains & Pulses' | 'Fruits' | 'Vegetables' | 'Oils & Ghee' | 'Dairy Alternatives';
  ayurvedicProperties: {
    rasa: string;     // Taste (Sweet, Sour, Salty, Bitter, Pungent, Astringent)
    virya: 'Cooling' | 'Heating'; // Potency
    vipaka: string;   // Post-digestive effect
    doshaEffect: string; // e.g. "Pacifies Vata and Pitta, may increase Kapha"
  };
  nutritionalFacts: {
    servingSize: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams: number;
    keyVitamins: string[];
  };
  therapeuticUses: string[];
  relatedRecipes: string[];
}

// ----------------------------------------------------------------------------
// Fitness & Yoga Types
// ----------------------------------------------------------------------------
export interface YogaAsana {
  id: string;
  sanskritName: string;
  englishName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetDosha: DoshaType[];
  primaryBenefit: string;
  durationMinutes: number;
  steps: string[];
  contraindications: string[];
  imageUrl: string;
}

export interface Workout {
  id: string;
  title: string;
  category: 'Circadian Flow' | 'Vata Balancing Yoga' | 'Pitta Cooling Flow' | 'Kapha Energizing Workout' | 'Pranayama & Meditation';
  durationMinutes: number;
  caloriesBurnEstimate: number;
  intensity: 'Gentle' | 'Moderate' | 'Invigorating';
  asanasIncluded: string[];
  targetGoal: 'Weight Balance' | 'Digestive Agni' | 'Stress Relief' | 'Strength & Posture';
}

export interface FitnessLog {
  id: string;
  date: string;
  workoutTitle: string;
  durationMinutes: number;
  caloriesBurned: number;
  perceivedExertion: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface FitnessProfile {
  goal: string;
  preferredActivity: string;
  currentStreakDays: number;
  longestStreakDays: number;
  totalWorkoutsCompleted: number;
  weeklyLogs: FitnessLog[];
}

// ----------------------------------------------------------------------------
// Telemedicine Types
// ----------------------------------------------------------------------------
export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g., "B.A.M.S., M.D. (Ayurveda)"
  specialization: 'Kaya Chikitsa (General Medicine)' | 'Panchakarma Specialist' | 'Twak Roga (Dermatology)' | 'Prasuti & Stri Roga' | 'Ayurvedic Dietetics';
  experienceYears: number;
  registrationNumber: string;
  consultationFeeINR: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  about: string;
  clinicAddress: string;
  avatarUrl: string;
  availableDays: string[];
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatarUrl: string;
  date: string;
  timeSlot: string;
  consultationMode: 'Video Consultation' | 'In-Clinic Visit' | 'Audio/Chat';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  feePaidINR: number;
  meetingLink?: string;
  notes?: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Marketplace & Products Types
// ----------------------------------------------------------------------------
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  priceINR: number;
  originalPriceINR?: number;
  stockQuantity: number;
  unit: string; // e.g. "100g", "250ml", "1kg"
  originRegion: string; // e.g. "Kolar, Karnataka", "Wayanad, Kerala"
  farmerName?: string;
  isOrganicCertified: boolean;
  doshaRecommendation: DoshaType[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
  ingredients: string[];
  harvestDate?: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

// ----------------------------------------------------------------------------
// Orders & Tracking Types
// ----------------------------------------------------------------------------
export type OrderStatus = 'Order Placed' | 'Quality Verified' | 'Dispatched from Farm Hub' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  unitPriceINR: number;
  quantity: number;
  subtotalINR: number;
}

export interface TrackingEvent {
  milestone: OrderStatus;
  timestamp: string;
  location: string;
  notes: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  deliveryAddress: UserAddress;
  totalAmountINR: number;
  discountINR: number;
  deliveryFeeINR: number;
  finalAmountINR: number;
  paymentMethod: 'UPI' | 'NetBanking' | 'Card' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  transactionReference?: string;
  orderStatus: OrderStatus;
  trackingTimeline: TrackingEvent[];
  estimatedDeliveryDate: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Notification & Communication Types
// ----------------------------------------------------------------------------
export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'Order' | 'Appointment' | 'Health Alert' | 'System';
  isRead: boolean;
  linkRoute?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; route: string }[];
}

export interface SignLanguageResult {
  detectedGesture: string;
  translatedText: string;
  confidence: number;
  timestamp: string;
}
