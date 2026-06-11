/**
 * API Client for public_site to communicate with admin_site backend
 * All requests go to admin_site API routes
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ============================================
// TYPES
// ============================================

export interface Venue {
  id: string;
  vendorId: string; // Needed for click tracking
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  address: string;
  city: string;
  postalCode: string; // ZIP Code
  latitude: number | null;
  longitude: number | null;
  startingPrice: number | null;
  discountPrice?: number | null;
  isFeatured: boolean;
  specialOffer: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  images: VenueImage[];
  packages: VenuePackage[];
  reviews?: VenueReview[];
}

export interface VenueReview {
  id: string;
  authorName: string;
  rating: number;
  text: string | null;
  reviewDate: string;
  source: string;
}

export interface VenueImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface VenuePackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discountPrice?: number | null;
  minKids: number;
  maxKids: number;
  ageMin: number;
  ageMax: number;
  gender_focus: string;
  themes: VenuePackageTheme[];
}

export interface VenuePackageTheme {
  theme: {
    id: string;
    name: string;
    slug: string;
  };
}

// Deprecated - keeping for backward compatibility
export interface VenueTheme {
  theme: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface VenueFilters {
  search?: string;
  city?: string;
  postalCode?: string; // ZIP Code - optional, used for scoring
  isFeatured?: boolean;
  kids?: number;
  age?: number;
  gender?: string;
  themes?: string;
  page?: number;
  limit?: number;
}

export interface VenuesResponse {
  success: boolean;
  data: {
    venues: Venue[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface SearchData {
  kidsAge: number;
  numberOfKids: number;
  eventDate?: string; // ISO date string
  preferences?: string;
  postalCode?: string;
  userEmail?: string;
  firstName?: string;
  location?: string;
  additionalMessage?: string;
}

export interface SearchResponse {
  success: boolean;
  data: {
    searchId: string;
    venues: Venue[];
    total: number;
    message: string;
  };
}

export interface VendorClaimData {
  // Contact Information
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  businessName?: string;
  // Venue Information (proposed by vendor)
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  venueState?: string;
  venuePostalCode?: string;
  venuePhone?: string;
  venueWebsite?: string;
  venueDescription?: string;
  message?: string;
  proofDocument?: string;
}

export interface VendorClaimResponse {
  success: boolean;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  data?: {
    claimRequestId: string;
    message: string;
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch venues with optional filters
 */
export async function getVenues(
  filters?: VenueFilters
): Promise<VenuesResponse> {
  try {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_URL}/api/public/venues${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use force-cache to prevent repeated requests in development
      cache: "force-cache",
      next: { revalidate: process.env.NODE_ENV === "production" ? 60 : 0 },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Error response body:", text);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${text.substring(
          0,
          200
        )}`
      );
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Response is not JSON:", text.substring(0, 500));
      throw new Error(
        `Expected JSON but got ${contentType}. Response: ${text.substring(
          0,
          200
        )}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("❌ Error fetching venues:", error);
    throw error;
  }
}

/**
 * Fetch featured venues (helper)
 */
export async function getFeaturedVenues(): Promise<Venue[]> {
  const response = await getVenues({ isFeatured: true, limit: 6 });
  return response.data.venues;
}

/**
 * Fetch venues by city (helper)
 */
export async function getVenuesByCity(city: string): Promise<Venue[]> {
  const response = await getVenues({ city, limit: 50 });
  return response.data.venues;
}

/**
 * Fetch a single venue by slug
 */
export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  try {
    const url = `${API_URL}/api/public/venues/${slug}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 1 minute in production
      next: { revalidate: process.env.NODE_ENV === "production" ? 60 : 0 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText.substring(
          0,
          200
        )}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Response is not JSON:", text.substring(0, 500));
      throw new Error(
        `Expected JSON but got ${contentType}. Response: ${text.substring(
          0,
          200
        )}`
      );
    }

    const data = await response.json();

    if (!data || !data.data || !data.data.venue) {
      console.error("❌ Invalid API response structure:", data);
      return null;
    }

    return data.data.venue;
  } catch (error) {
    console.error("❌ Error fetching venue by slug:", error);
    throw error;
  }
}

/**
 * Create a search and get matching venues
 */
export async function createSearch(
  searchData: SearchData
): Promise<SearchResponse> {
  try {
    const response = await fetch(`${API_URL}/api/public/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchData),
      // Don't cache POST requests
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText.substring(
          0,
          200
        )}`
      );
    }

    const data = await response.json();

    if (!data || !data.data) {
      console.error("❌ Invalid API response structure:", data);
      throw new Error("Invalid search response");
    }

    return data;
  } catch (error) {
    console.error("❌ Error creating search:", error);
    throw error;
  }
}

/**
 * Submit a vendor claim request
 */
export async function submitVendorClaim(
  claimData: VendorClaimData
): Promise<VendorClaimResponse> {
  try {
    const response = await fetch(`${API_URL}/api/public/vendor-claims`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(claimData),
      // Don't cache POST requests
      cache: "no-store",
    });

    if (!response.ok) {
      // Try to parse JSON error response
      try {
        const errorData = await response.json();
        console.log("ℹ️ Server error response:", errorData);

        // Return the parsed error response instead of throwing
        return {
          success: false,
          error: errorData.error || "Failed to submit vendor claim",
          errors: errorData.errors,
        };
      } catch {
        // If response is not JSON, fallback to text
        const errorText = await response.text();
        console.log("ℹ️ Server error response (not JSON):", errorText);

        return {
          success: false,
          error: "Failed to submit vendor claim",
        };
      }
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("ℹ️ Network error submitting vendor claim:", error);
    // Return error response instead of throwing
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Get all themes for filtering
 */
export async function getThemes(): Promise<
  { id: string; name: string; slug: string }[]
> {
  try {
    const response = await fetch(`${API_URL}/api/public/themes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60, // Cache for 1 min
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("❌ Error fetching themes:", error);
    throw error;
  }
}

// ============================================
// SERVICES API
// ============================================

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  startingPrice: number | null;
  discountPrice?: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  specialOffer: string | null;
  createdAt: string;
  updatedAt: string;
  images: ServiceImage[];
  packages: ServicePackage[];
  reviews?: ServiceReview[];
}

export interface ServiceReview {
  id: string;
  authorName: string;
  rating: number;
  text: string | null;
  reviewDate: string;
  source: string;
}

export interface ServiceImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discountPrice?: number | null;
  minKids: number;
  maxKids: number;
  ageMin: number;
  ageMax: number;
  gender_focus: string;
  themes: ServicePackageTheme[];
}

export interface ServicePackageTheme {
  theme: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ServiceFilters {
  search?: string;
  isFeatured?: boolean;
  kids?: number;
  age?: number;
  gender?: string;
  themes?: string;
  page?: number;
  limit?: number;
}

export interface ServicesResponse {
  success: boolean;
  data: {
    services: Service[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface ServiceDetailResponse {
  success: boolean;
  data: {
    service: Service;
  };
}

/**
 * Fetch all services with filters
 */
export async function getServices(
  filters: ServiceFilters = {}
): Promise<ServicesResponse> {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.isFeatured !== undefined)
      queryParams.append("isFeatured", String(filters.isFeatured));
    if (filters.kids) queryParams.append("kids", String(filters.kids));
    if (filters.age) queryParams.append("age", String(filters.age));
    if (filters.gender) queryParams.append("gender", filters.gender);
    if (filters.themes) queryParams.append("themes", filters.themes);
    if (filters.page) queryParams.append("page", String(filters.page));
    if (filters.limit) queryParams.append("limit", String(filters.limit));

    const queryString = queryParams.toString();
    const url = `${API_URL}/api/public/services${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60, // Cache for 1 minute (services update frequently)
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    throw error;
  }
}

/**
 * Fetch a single service by slug
 */
export async function getServiceBySlug(
  slug: string
): Promise<ServiceDetailResponse> {
  try {
    const response = await fetch(`${API_URL}/api/public/services/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60, // Cache for 1 minute
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Service not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching service ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch featured services (for homepage)
 */
export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const response = await getServices({
      isFeatured: true,
      limit: 6,
    });

    return response.data.services;
  } catch (error) {
    console.error("❌ Error fetching featured services:", error);
    return [];
  }
}
