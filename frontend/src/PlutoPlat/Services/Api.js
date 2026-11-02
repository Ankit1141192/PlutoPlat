import { PROPERTIES } from '../../data/propertiesData';
import { CATEGORIES } from '../../data/categoriesData';
import { AGENTS, TESTIMONIALS, STATS, FAQS } from '../../data/testimonialsData';

/**
 * PlutoPlat Service Client
 * Provides modular data access and simulated async network latency.
 */
export const Api = {
  // Properties
  async getProperties(filter = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...PROPERTIES];
        if (filter.type && filter.type !== 'All') {
          results = results.filter((p) => p.type === filter.type);
        }
        if (filter.purpose && filter.purpose !== 'All') {
          results = results.filter((p) => p.purpose === filter.purpose);
        }
        if (filter.query) {
          const q = filter.query.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.location.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          );
        }
        resolve(results);
      }, 150);
    });
  },

  async getPropertyById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = PROPERTIES.find((p) => p.id === parseInt(id, 10)) || null;
        resolve(found);
      }, 100);
    });
  },

  async getFeaturedProperties() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PROPERTIES.filter((p) => p.featured));
      }, 100);
    });
  },

  // Categories
  async getCategories() {
    return Promise.resolve(CATEGORIES);
  },

  // Inquiries & Tours
  async submitEnquiry(payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[API] Enquiry Dispatched to Lead Advisor:', payload);
        resolve({ success: true, referenceId: `PLP-ENQ-${Date.now().toString().slice(-4)}` });
      }, 300);
    });
  },

  async scheduleTour(payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[API] Tour Itinerary Confirmed:', payload);
        resolve({ success: true, referenceId: `PLP-TOUR-${Date.now().toString().slice(-4)}` });
      }, 300);
    });
  },

  // Advisory & Intelligence
  async getAgents() {
    return Promise.resolve(AGENTS);
  },

  async getTestimonials() {
    return Promise.resolve(TESTIMONIALS);
  },

  async getFaqs() {
    return Promise.resolve(FAQS);
  },

  async getStats() {
    return Promise.resolve(STATS);
  }
};

export default Api;
