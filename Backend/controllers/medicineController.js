const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// Search medicines across all pharmacies
const searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search medicines by name (case-insensitive)
    const medicines = await Medicine.find({
      name: { $regex: query, $options: 'i' }
    }).populate('pharmacy', 'name location');

    // Format response with availability info
    const results = medicines.map(medicine => ({
      id: medicine._id,
      name: medicine.name,
      category: medicine.category,
      quantity: medicine.quantity,
      price: medicine.price,
      pharmacyName: medicine.pharmacy.name,
      pharmacyLocation: medicine.pharmacy.location,
      available: medicine.quantity > 0,
      expiryDate: medicine.expiryDate
    }));

    res.json({
      success: true,
      count: results.length,
      medicines: results
    });
  } catch (error) {
    console.error('Medicine search error:', error);
    res.status(500).json({ message: 'Failed to search medicines' });
  }
};

// Request medicine restock
const requestRestock = async (req, res) => {
  try {
    const { medicineId, pharmacyId, patientId } = req.body;

    const medicine = await Medicine.findById(medicineId).populate('pharmacy');
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Create restock request (you can create a RestockRequest model)
    const restockRequest = {
      medicine: medicineId,
      pharmacy: pharmacyId,
      patient: patientId,
      requestDate: new Date(),
      status: 'pending'
    };

    // For now, just log the request (implement notification system later)
    console.log('Restock request:', restockRequest);

    res.json({
      success: true,
      message: `Restock request sent to ${medicine.pharmacy.name}`
    });
  } catch (error) {
    console.error('Restock request error:', error);
    res.status(500).json({ message: 'Failed to send restock request' });
  }
};

// Get all medicines from a specific pharmacy
const getPharmacyMedicines = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const medicines = await Medicine.find({ pharmacy: pharmacyId });

    res.json({
      success: true,
      medicines
    });
  } catch (error) {
    console.error('Get pharmacy medicines error:', error);
    res.status(500).json({ message: 'Failed to get pharmacy medicines' });
  }
};

// Add new medicine (for pharmacy use)
const addMedicine = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      price,
      expiryDate,
      supplier,
      batchNumber,
      pharmacyId
    } = req.body;

    const medicine = new Medicine({
      name,
      category,
      quantity,
      price,
      expiryDate,
      supplier,
      batchNumber,
      pharmacy: pharmacyId
    });

    await medicine.save();

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      medicine
    });
  } catch (error) {
    console.error('Add medicine error:', error);
    res.status(500).json({ message: 'Failed to add medicine' });
  }
};

// Update medicine quantity
const updateMedicineQuantity = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { quantity } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      medicineId,
      { quantity },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({
      success: true,
      message: 'Medicine quantity updated',
      medicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({ message: 'Failed to update medicine' });
  }
};

module.exports = {
  searchMedicines,
  requestRestock,
  getPharmacyMedicines,
  addMedicine,
  updateMedicineQuantity
};