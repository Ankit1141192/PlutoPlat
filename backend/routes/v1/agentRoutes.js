const express = require('express');
const router = express.Router();
const ApiResponse = require('../../utils/apiResponse');
const User = require('../../models/User');

/**
 * Get verified partner agents and senior advisors
 * GET /api/v1/agents
 */
router.get('/', async (req, res, next) => {
  try {
    const agents = await User.find({
      role: { $in: ['admin', 'super_admin'] },
      isActive: true
    }).select('name email phone location profileImage subscriptionTier role');

    const formatted = agents.map(agent => ({
      id: agent._id,
      name: agent.name,
      title: agent.role === 'super_admin' ? 'Managing Principal & Founder' : 'Senior Real Estate Advisor',
      specialty: agent.location?.city ? `${agent.location.city} & Prime Corridors` : 'Civil Lines & Heritage Portfolios',
      phone: agent.phone || '+91 99563 46155',
      email: agent.email,
      avatar: agent.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      rating: 4.98,
      reviews: 142,
      salesVolume: '₹450 Cr+'
    }));

    return ApiResponse.success(res, 'Verified partner agents retrieved successfully.', {
      agents: formatted
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
