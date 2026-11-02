const express = require('express');
const router = express.Router();
const propertyController = require('../../controllers/propertyController');
const { authenticate } = require('../../middlewares/auth');

// Public listing & search
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// Authenticated property management
router.post('/', authenticate, propertyController.createProperty);
router.put('/:id', authenticate, propertyController.updateProperty);
router.delete('/:id', authenticate, propertyController.deleteProperty);

module.exports = router;
