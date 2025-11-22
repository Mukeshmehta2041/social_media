// User types
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role?: {
    id: number;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  phone?: string;
  avatar?: Media;
  bio?: string;
  city?: City;
  isVerified: boolean;
  whatsappNumber?: string;
  dateOfBirth?: string;
  ageVerified: boolean;
}

// Advertisement types
export interface Advertisement {
  id: number;
  title: string;
  description: string | { [key: string]: any };
  price?: number;
  category?: Category;
  city?: City;
  user?: User;
  owner?: User; // Alias for user
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  isPremium: boolean;
  contactPhone?: string;
  contactEmail?: string;
  whatsappNumber?: string;
  viewCount: number;
  expiresAt?: string;
  images?: Media[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent?: Category;
  isActive: boolean;
  sortOrder: number;
}

// City types
export interface City {
  id: number;
  name: string;
  slug: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

// Media types
export interface Media {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ApiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

// Search and Filter types
export interface SearchFilters {
  q?: string;
  category?: number | string;
  city?: number | string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

// Report types
export interface Report {
  id: number;
  advertisement: Advertisement;
  reporter: User;
  reason: 'spam' | 'inappropriate' | 'fraud' | 'duplicate' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: User;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Saved Search types
export interface SavedSearch {
  id: number;
  user: User;
  name: string;
  searchQuery: SearchFilters;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Contact Form types
export interface ContactForm {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  user?: User;
  createdAt: string;
  updatedAt: string;
}

