const Teacher = require('../models/Teacher');
const SalaryPayment = require('../models/SalaryPayment');
const Expense = require('../models/Expense');
const FeeCollection = require('../models/FeeCollection');


exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    const saved = await teacher.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getSalaryPayments = async (req, res) => {
  try {
    const payments = await SalaryPayment.find()
      .populate('teacher', 'name subject monthlySalary')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSalaryPayment = async (req, res) => {
  try {
    const payment = new SalaryPayment(req.body);
    const saved = await payment.save();
    const populated = await saved.populate('teacher', 'name subject monthlySalary');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSalaryPayment = async (req, res) => {
  try {
    await SalaryPayment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getFeeCollections = async (req, res) => {
  try {
    const fees = await FeeCollection.find()
      .populate('student', 'name admissionNumber currentClass')
      .sort({ paidOn: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFeeCollection = async (req, res) => {
  try {
    const fee = new FeeCollection(req.body);
    const saved = await fee.save();
    const populated = await saved.populate('student', 'name admissionNumber currentClass');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFeeCollection = async (req, res) => {
  try {
    await FeeCollection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const feeIncome = await FeeCollection.find({ month, year: parseInt(year) })
      .populate('student', 'name admissionNumber currentClass');

    const salaries = await SalaryPayment.find({ month, year: parseInt(year) })
      .populate('teacher', 'name subject monthlySalary');

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const totalIncome = feeIncome.reduce((sum, f) => sum + f.amount, 0);
    const totalSalaries = salaries.reduce((sum, s) => sum + s.netPaid, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalSalaries - totalExpenses;

    res.json({
      month, year,
      totalIncome,
      totalSalaries,
      totalExpenses,
      netBalance,
      feeIncome,
      salaries,
      expenses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};