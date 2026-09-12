import { 
  CreateRatingPayload, 
  RatingEligibilityResponse, 
  RatingReview, 
  ParticipantRatingSummary,
  UserRole
} from '@/types/review';
import { reviewsStore } from '@/lib/ratingsStore';
import { getStoredData, setStoredData } from '@/data/demoData';

const REVIEWS_STORAGE_KEY = 'agriflow_reviews_store';

export const ratingService = {
  /**
   * Check if user is eligible to rate a transaction participant
   */
  async checkEligibility(
    transactionId: string, 
    _raterUserId: string, 
    targetUserId?: string, 
    targetRole: UserRole = 'FARMER'
  ): Promise<RatingEligibilityResponse> {
    return {
      eligible: true,
      transactionId,
      targetUserId: targetUserId || 'farmer_01',
      targetRole,
      targetName: targetRole === 'FARMER' ? 'Ramesh Reddy (Shadnagar FPO)' : targetRole === 'LOGISTICS' ? 'Mohammed Ismail (Tata Reefer)' : 'Verified Participant',
      badgeType: 'VERIFIED_TRANSACTION',
      alreadyRated: false,
    };
  },

  /**
   * Submit a verified rating and review
   */
  async submitRating(payload: CreateRatingPayload): Promise<{ success: boolean; review?: RatingReview; message?: string; error?: string }> {
    try {
      const currentReviews = getStoredData<RatingReview[]>(REVIEWS_STORAGE_KEY, reviewsStore);
      const newReview: RatingReview = {
        id: `REV-${Date.now().toString().slice(-6)}`,
        transactionId: payload.transactionId,
        productId: payload.productId,
        productName: payload.productId ? 'Verified Agricultural Produce' : undefined,
        raterUserId: payload.raterUserId,
        raterRole: payload.raterRole,
        raterDisplayName: payload.raterDisplayName,
        ratedUserId: payload.ratedUserId,
        ratedRole: payload.ratedRole,
        rating: payload.rating,
        categoryRatings: payload.categoryRatings,
        review: payload.review,
        verificationBadge: 'VERIFIED_PURCHASE',
        isVerified: true,
        moderationStatus: 'PUBLISHED',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      const updated = [newReview, ...currentReviews];
      setStoredData(REVIEWS_STORAGE_KEY, updated);

      return {
        success: true,
        review: newReview,
        message: 'Rating and review submitted successfully!',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Unable to submit rating.',
      };
    }
  },

  /**
   * Fetch reviews for a specific produce product
   */
  async getReviewsForProduct(productId: string): Promise<{ reviews: RatingReview[]; summary: ParticipantRatingSummary }> {
    const currentReviews = getStoredData<RatingReview[]>(REVIEWS_STORAGE_KEY, reviewsStore);
    const filtered = currentReviews.filter((r) => r.productId === productId || !productId);
    const totalReviews = filtered.length;
    let averageRating = 0;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
      averageRating = Number((sum / totalReviews).toFixed(1));
      filtered.forEach((r) => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
        ratingDistribution[star] = (ratingDistribution[star] || 0) + 1;
      });
    }

    return {
      reviews: filtered,
      summary: {
        userId: productId,
        role: 'FARMER',
        averageRating: averageRating || 4.8,
        totalReviews: totalReviews || 1,
        ratingDistribution: totalReviews > 0 ? ratingDistribution : { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedTransactionsCount: totalReviews || 1,
      },
    };
  },

  /**
   * Fetch rating summary & reviews for a Farmer, Buyer, or Logistics Operator
   */
  async getReviewsForUser(userId: string, role?: UserRole): Promise<{ reviews: RatingReview[]; summary: ParticipantRatingSummary }> {
    const currentReviews = getStoredData<RatingReview[]>(REVIEWS_STORAGE_KEY, reviewsStore);
    const targetRole = role ? role.toUpperCase() : undefined;
    const filtered = currentReviews.filter((r) => {
      const matchRole = !targetRole || r.ratedRole === targetRole;
      const matchUser = !userId || r.ratedUserId === userId;
      return matchRole || matchUser;
    });

    const totalReviews = filtered.length;
    let averageRating = 0;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
      averageRating = Number((sum / totalReviews).toFixed(1));
      filtered.forEach((r) => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
        ratingDistribution[star] = (ratingDistribution[star] || 0) + 1;
      });
    }

    return {
      reviews: filtered,
      summary: {
        userId: userId || 'demo_user',
        role: (role ? role.toUpperCase() : 'FARMER') as any,
        averageRating: averageRating || 4.9,
        totalReviews: totalReviews || 2,
        ratingDistribution: totalReviews > 0 ? ratingDistribution : { 5: 2, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedTransactionsCount: totalReviews || 2,
      },
    };
  },
};
