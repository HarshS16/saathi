const express = require('express');
const router = express.Router();
const {
  searchMedicines,
  requestRestock,
  getPharmacyMedicines,
  addMedicine,
  updateMedicineQuantity
} = require('../controllers/medicineController');

// Search medicines across all pharmacies
router.get('/search', searchMedicines);

// Request medicine restock
router.post('/request-restock', requestRestock);

// Get all medicines from a specific pharmacy
router.get('/pharmacy/:pharmacyId', getPharmacyMedicines);

// Add new medicine (for pharmacy use)
router.post('/add', addMedicine);

// Update medicine quantity
router.put('/:medicineId/quantity', updateMedicineQuantity);

module.exports = router;