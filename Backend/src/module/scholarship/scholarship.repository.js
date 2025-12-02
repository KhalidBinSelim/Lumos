const Scholarship = require('./scholarship.model');

class ScholarshipRepository {
  /**
   * Create a new scholarship
   */
  async create(scholarshipData) {
    const scholarship = new Scholarship(scholarshipData);
    return await scholarship.save();
  }

  /**
   * Find scholarship by ID
   */
  async findById(id) {
    return await Scholarship.findById(id);
  }

  /**
   * Find all scholarships with filters and pagination
   */
  async findAll(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'deadline',
      sortOrder = 'asc',
    } = options;

    const query = this.buildQuery(filters);
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [scholarships, total] = await Promise.all([
      Scholarship.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Scholarship.countDocuments(query),
    ]);

    return {
      scholarships,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Build query from filters
   */
  buildQuery(filters) {
    const query = { active: true };

    // Search query
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Amount filter
    if (filters.minAmount) {
      query.amount = { ...query.amount, $gte: parseInt(filters.minAmount) };
    }
    if (filters.maxAmount) {
      query.amount = { ...query.amount, $lte: parseInt(filters.maxAmount) };
    }
    
    // Amount ranges (from frontend)
    if (filters.amountRanges?.length > 0) {
      const amountConditions = [];
      filters.amountRanges.forEach(range => {
        switch (range) {
          case '$500-1K':
            amountConditions.push({ amount: { $gte: 500, $lte: 1000 } });
            break;
          case '$1K-2.5K':
            amountConditions.push({ amount: { $gte: 1000, $lte: 2500 } });
            break;
          case '$2.5K-5K':
            amountConditions.push({ amount: { $gte: 2500, $lte: 5000 } });
            break;
          case '$5K+':
            amountConditions.push({ amount: { $gte: 5000 } });
            break;
        }
      });
      if (amountConditions.length > 0) {
        query.$or = amountConditions;
      }
    }

    // Deadline filter
    if (filters.deadline) {
      const now = new Date();
      let deadlineDate;
      
      switch (filters.deadline) {
        case 'Next 7d':
          deadlineDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          query.deadline = { $gte: now, $lte: deadlineDate };
          break;
        case 'Next 30d':
          deadlineDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          query.deadline = { $gte: now, $lte: deadlineDate };
          break;
        case 'Next 60d':
          deadlineDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
          query.deadline = { $gte: now, $lte: deadlineDate };
          break;
        case '60+ days':
          deadlineDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
          query.deadline = { $gt: deadlineDate };
          break;
      }
    }

    // Category filter
    if (filters.categories?.length > 0) {
      query.categories = { $in: filters.categories };
    }

    // Demographics filter
    if (filters.demographics?.length > 0) {
      query.demographics = { $in: filters.demographics };
    }

    // Eligibility level filter
    if (filters.eligibility?.length > 0) {
      const levelMap = {
        'HS Only': 'High School',
        'College': 'College',
        'Graduate': 'Graduate',
        'International': 'International',
      };
      const levels = filters.eligibility.map(e => levelMap[e] || e);
      query.eligibilityLevel = { $in: levels };
    }

    // Location filter
    if (filters.location && filters.location !== 'National') {
      query.location = filters.location;
    }

    // No essay filter
    if (filters.noEssay) {
      query.essayRequired = false;
    }

    // Featured filter
    if (filters.featured) {
      query.featured = true;
    }

    // High match filter (will be applied in service layer)

    return query;
  }

  /**
   * Search scholarships
   */
  async search(searchQuery, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = {
      active: true,
      $text: { $search: searchQuery },
    };

    const [scholarships, total] = await Promise.all([
      Scholarship.find(query)
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Scholarship.countDocuments(query),
    ]);

    return {
      scholarships,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get featured scholarships
   */
  async getFeatured(limit = 5) {
    return await Scholarship.find({ active: true, featured: true })
      .sort({ deadline: 1 })
      .limit(limit)
      .lean();
  }

  /**
   * Get scholarships by IDs
   */
  async findByIds(ids) {
    return await Scholarship.find({ _id: { $in: ids }, active: true }).lean();
  }

  /**
   * Get upcoming deadlines
   */
  async getUpcomingDeadlines(days = 30, limit = 10) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return await Scholarship.find({
      active: true,
      deadline: { $gte: now, $lte: futureDate },
    })
      .sort({ deadline: 1 })
      .limit(limit)
      .lean();
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id) {
    return await Scholarship.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
  }

  /**
   * Increment save count
   */
  async incrementSaveCount(id) {
    return await Scholarship.findByIdAndUpdate(
      id,
      { $inc: { saveCount: 1 } },
      { new: true }
    );
  }

  /**
   * Decrement save count
   */
  async decrementSaveCount(id) {
    return await Scholarship.findByIdAndUpdate(
      id,
      { $inc: { saveCount: -1 } },
      { new: true }
    );
  }

  /**
   * Update scholarship
   */
  async updateById(id, updateData) {
    return await Scholarship.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete scholarship
   */
  async deleteById(id) {
    return await Scholarship.findByIdAndDelete(id);
  }

  /**
   * Get distinct categories
   */
  async getDistinctCategories() {
    return await Scholarship.distinct('categories', { active: true });
  }

  /**
   * Get distinct demographics
   */
  async getDistinctDemographics() {
    return await Scholarship.distinct('demographics', { active: true });
  }

  /**
   * Get scholarship statistics
   */
  async getStatistics() {
    const stats = await Scholarship.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: null,
          totalScholarships: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' },
          maxAmount: { $max: '$amount' },
          minAmount: { $min: '$amount' },
        },
      },
    ]);

    return stats[0] || {
      totalScholarships: 0,
      totalAmount: 0,
      avgAmount: 0,
      maxAmount: 0,
      minAmount: 0,
    };
  }
}

module.exports = new ScholarshipRepository();

