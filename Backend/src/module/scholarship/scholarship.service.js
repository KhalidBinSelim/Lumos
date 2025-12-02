const scholarshipRepository = require('./scholarship.repository');
const userRepository = require('../user/user.repository');

class ScholarshipService {
  /**
   * Get all scholarships with filters
   */
  async getScholarships(filters = {}, options = {}, userId = null) {
    const result = await scholarshipRepository.findAll(filters, options);
    
    // If user is logged in, add match scores and saved status
    if (userId) {
      const user = await userRepository.findById(userId);
      const savedIds = user?.savedScholarships?.map(id => id.toString()) || [];
      
      result.scholarships = result.scholarships.map(scholarship => {
        const scholarshipModel = require('./scholarship.model');
        const scholarshipDoc = new scholarshipModel(scholarship);
        const matchScore = scholarshipDoc.calculateMatchScore(user);
        
        return {
          ...scholarship,
          match: matchScore,
          saved: savedIds.includes(scholarship._id.toString()),
        };
      });

      // Sort by match if requested
      if (options.sortBy === 'match') {
        result.scholarships.sort((a, b) => 
          options.sortOrder === 'desc' ? b.match - a.match : a.match - b.match
        );
      }

      // Filter by high match if requested
      if (filters.highMatch) {
        result.scholarships = result.scholarships.filter(s => s.match >= 80);
      }
    }

    return result;
  }

  /**
   * Get scholarship by ID
   */
  async getScholarshipById(id, userId = null) {
    const scholarship = await scholarshipRepository.findById(id);
    if (!scholarship) {
      throw new Error('Scholarship not found');
    }

    // Increment view count
    await scholarshipRepository.incrementViewCount(id);

    const result = scholarship.toObject();

    // Add match score and saved status if user is logged in
    if (userId) {
      const user = await userRepository.findById(userId);
      result.match = scholarship.calculateMatchScore(user);
      result.saved = user?.savedScholarships?.some(
        sId => sId.toString() === id.toString()
      ) || false;
    }

    return result;
  }

  /**
   * Search scholarships
   */
  async searchScholarships(query, options = {}, userId = null) {
    const result = await scholarshipRepository.search(query, options);

    if (userId) {
      const user = await userRepository.findById(userId);
      const savedIds = user?.savedScholarships?.map(id => id.toString()) || [];
      
      result.scholarships = result.scholarships.map(scholarship => {
        const scholarshipModel = require('./scholarship.model');
        const scholarshipDoc = new scholarshipModel(scholarship);
        const matchScore = scholarshipDoc.calculateMatchScore(user);
        
        return {
          ...scholarship,
          match: matchScore,
          saved: savedIds.includes(scholarship._id.toString()),
        };
      });
    }

    return result;
  }

  /**
   * Get recommended scholarships for a user
   */
  async getRecommendedScholarships(userId, limit = 10) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all active scholarships
    const { scholarships } = await scholarshipRepository.findAll(
      {},
      { limit: 100, sortBy: 'deadline', sortOrder: 'asc' }
    );

    // Calculate match scores
    const scholarshipModel = require('./scholarship.model');
    const savedIds = user.savedScholarships?.map(id => id.toString()) || [];

    const scoredScholarships = scholarships.map(scholarship => {
      const scholarshipDoc = new scholarshipModel(scholarship);
      const matchScore = scholarshipDoc.calculateMatchScore(user);
      
      return {
        ...scholarship,
        match: matchScore,
        saved: savedIds.includes(scholarship._id.toString()),
      };
    });

    // Sort by match score and return top matches
    scoredScholarships.sort((a, b) => b.match - a.match);

    return scoredScholarships.slice(0, limit);
  }

  /**
   * Get featured scholarships
   */
  async getFeaturedScholarships(userId = null, limit = 5) {
    const scholarships = await scholarshipRepository.getFeatured(limit);

    if (userId) {
      const user = await userRepository.findById(userId);
      const savedIds = user?.savedScholarships?.map(id => id.toString()) || [];
      const scholarshipModel = require('./scholarship.model');

      return scholarships.map(scholarship => {
        const scholarshipDoc = new scholarshipModel(scholarship);
        return {
          ...scholarship,
          match: scholarshipDoc.calculateMatchScore(user),
          saved: savedIds.includes(scholarship._id.toString()),
        };
      });
    }

    return scholarships;
  }

  /**
   * Get upcoming deadlines
   */
  async getUpcomingDeadlines(userId = null, days = 30, limit = 10) {
    const scholarships = await scholarshipRepository.getUpcomingDeadlines(days, limit);

    if (userId) {
      const user = await userRepository.findById(userId);
      const savedIds = user?.savedScholarships?.map(id => id.toString()) || [];
      const scholarshipModel = require('./scholarship.model');

      return scholarships.map(scholarship => {
        const scholarshipDoc = new scholarshipModel(scholarship);
        return {
          ...scholarship,
          match: scholarshipDoc.calculateMatchScore(user),
          saved: savedIds.includes(scholarship._id.toString()),
        };
      });
    }

    return scholarships;
  }

  /**
   * Save scholarship
   */
  async saveScholarship(userId, scholarshipId) {
    const scholarship = await scholarshipRepository.findById(scholarshipId);
    if (!scholarship) {
      throw new Error('Scholarship not found');
    }

    await userRepository.saveScholarship(userId, scholarshipId);
    await scholarshipRepository.incrementSaveCount(scholarshipId);

    return { saved: true };
  }

  /**
   * Unsave scholarship
   */
  async unsaveScholarship(userId, scholarshipId) {
    await userRepository.unsaveScholarship(userId, scholarshipId);
    await scholarshipRepository.decrementSaveCount(scholarshipId);

    return { saved: false };
  }

  /**
   * Get saved scholarships for user
   */
  async getSavedScholarships(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.savedScholarships?.length) {
      return [];
    }

    const scholarships = await scholarshipRepository.findByIds(user.savedScholarships);
    const scholarshipModel = require('./scholarship.model');

    return scholarships.map(scholarship => {
      const scholarshipDoc = new scholarshipModel(scholarship);
      return {
        ...scholarship,
        match: scholarshipDoc.calculateMatchScore(user),
        saved: true,
      };
    });
  }

  /**
   * Check if scholarship is saved
   */
  async isScholarshipSaved(userId, scholarshipId) {
    return await userRepository.isScholarshipSaved(userId, scholarshipId);
  }

  /**
   * Get filter options (for dropdowns)
   */
  async getFilterOptions() {
    const [categories, demographics, stats] = await Promise.all([
      scholarshipRepository.getDistinctCategories(),
      scholarshipRepository.getDistinctDemographics(),
      scholarshipRepository.getStatistics(),
    ]);

    return {
      categories,
      demographics,
      amountRanges: ['$500-1K', '$1K-2.5K', '$2.5K-5K', '$5K+'],
      deadlineRanges: ['Next 7d', 'Next 30d', 'Next 60d', '60+ days'],
      eligibilityLevels: ['High School', 'College', 'Graduate'],
      locations: ['National', 'State', 'Local', 'International'],
      stats,
    };
  }

  /**
   * Create scholarship (admin)
   */
  async createScholarship(scholarshipData) {
    return await scholarshipRepository.create(scholarshipData);
  }

  /**
   * Update scholarship (admin)
   */
  async updateScholarship(id, updateData) {
    const scholarship = await scholarshipRepository.updateById(id, updateData);
    if (!scholarship) {
      throw new Error('Scholarship not found');
    }
    return scholarship;
  }

  /**
   * Delete scholarship (admin)
   */
  async deleteScholarship(id) {
    const scholarship = await scholarshipRepository.deleteById(id);
    if (!scholarship) {
      throw new Error('Scholarship not found');
    }
    return { deleted: true };
  }
}

module.exports = new ScholarshipService();

