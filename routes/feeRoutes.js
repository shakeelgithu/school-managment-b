
const express = require('express');
const router  = express.Router();


const {
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  getFeeSummary,
  searchStudents,
} = require('../controllers/feeController');


const protect = require('../middleware/authMiddleware');


const handlers = { getAllFees, getFeeById, createFee, updateFee, deleteFee, getFeeSummary, searchStudents, protect };
Object.entries(handlers).forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    throw new Error(
      `[feeRoutes] "${name}" is not a function (got ${typeof fn}). ` +
      `Check your import paths in feeRoutes.js.\n` +
      `  - Controller: ../controllers/feeController\n` +
      `  - Auth middleware: ../middleware/authMiddleware`
    );
  }
});


router.get('/students/search', protect, searchStudents);

router.get('/summary', protect, getFeeSummary);

router.route('/')
  .get(protect, getAllFees)
  .post(protect, createFee);

router.route('/:id')
  .get(protect, getFeeById)
  .put(protect, updateFee)
  .delete(protect, deleteFee);

module.exports = router;