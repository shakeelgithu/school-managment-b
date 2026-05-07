const express = require('express');
const router = express.Router();
const fc = require('../controllers/financeController');

router.get('/teachers', fc.getTeachers);
router.post('/teachers', fc.createTeacher);
router.put('/teachers/:id', fc.updateTeacher);
router.delete('/teachers/:id', fc.deleteTeacher);

router.get('/salaries', fc.getSalaryPayments);
router.post('/salaries', fc.createSalaryPayment);
router.delete('/salaries/:id', fc.deleteSalaryPayment);

router.get('/expenses', fc.getExpenses);
router.post('/expenses', fc.createExpense);
router.put('/expenses/:id', fc.updateExpense);
router.delete('/expenses/:id', fc.deleteExpense);

router.get('/fees', fc.getFeeCollections);
router.post('/fees', fc.createFeeCollection);
router.delete('/fees/:id', fc.deleteFeeCollection);

router.get('/summary', fc.getMonthlySummary);

module.exports = router;