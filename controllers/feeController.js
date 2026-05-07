const Fee = require('../models/Fee');
const Student = require('../models/Student');


const sendResponse = (res, statusCode, success, message, data = null) => {
  const payload = { success, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};


const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 1) {
      return sendResponse(res, 400, false, 'Search query is required');
    }

    const students = await Student.find({
      $or: [
        { name:            { $regex: q.trim(), $options: 'i' } },
        { rollNumber:      { $regex: q.trim(), $options: 'i' } },
        { admissionNumber: { $regex: q.trim(), $options: 'i' } },
      ],
    })
      .select('_id name rollNumber admissionNumber className')
      .limit(10)
      .lean();

    return sendResponse(res, 200, true, 'Students fetched', students);
  } catch (error) {
    console.error('searchStudents error:', error);
    return sendResponse(res, 500, false, 'Server error while searching students');
  }
};

const getAllFees = async (req, res) => {
  try {
    const { className, feePeriod, status, search } = req.query;

    const filter = {};
    if (className) filter.className = { $regex: className.trim(), $options: 'i' };
    if (feePeriod) filter.feePeriod = { $regex: feePeriod.trim(), $options: 'i' };
    if (search) {
      filter.$or = [
        { studentName: { $regex: search.trim(), $options: 'i' } },
        { rollNumber:  { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const fees = await Fee.find(filter)
      .populate('student',  'name rollNumber admissionNumber className')
      .populate('addedBy',  'name email')
      .sort({ createdAt: -1 });

    const filtered = status ? fees.filter((f) => f.status === status) : fees;

    const summary = {
      totalRecords:   filtered.length,
      totalFeeAmount: filtered.reduce((sum, f) => sum + f.totalFee,    0),
      totalSubmitted: filtered.reduce((sum, f) => sum + f.submittedFee, 0),
      totalPending:   filtered.reduce((sum, f) => sum + f.pendingDues,  0),
      completeCount:  filtered.filter((f) => f.status === 'Complete').length,
      pendingCount:   filtered.filter((f) => f.status === 'Pending').length,
    };

    return sendResponse(res, 200, true, 'Fee records fetched successfully', { fees: filtered, summary });
  } catch (error) {
    console.error('getAllFees error:', error);
    return sendResponse(res, 500, false, 'Server error while fetching fees');
  }
};


const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student', 'name rollNumber admissionNumber className')
      .populate('addedBy', 'name email');

    if (!fee) return sendResponse(res, 404, false, 'Fee record not found');

    return sendResponse(res, 200, true, 'Fee record fetched', fee);
  } catch (error) {
    console.error('getFeeById error:', error);
    if (error.name === 'CastError') return sendResponse(res, 400, false, 'Invalid fee record ID');
    return sendResponse(res, 500, false, 'Server error');
  }
};


const createFee = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      rollNumber,
      className,
      totalFee,
      submittedFee = 0,
      feePeriod,
      notes,
    } = req.body;

    if (!studentName || !className || totalFee == null || !feePeriod) {
      return sendResponse(res, 400, false,
        'Missing required fields: studentName, className, totalFee, feePeriod'
      );
    }

    if (Number(totalFee) < 0)
      return sendResponse(res, 400, false, 'Total fee cannot be negative');

    if (Number(submittedFee) < 0)
      return sendResponse(res, 400, false, 'Submitted fee cannot be negative');

    if (Number(submittedFee) > Number(totalFee))
      return sendResponse(res, 400, false, 'Submitted fee cannot exceed total fee');

    let studentDoc = null;

    if (studentId) {
      studentDoc = await Student.findById(studentId).lean();
      if (!studentDoc) {
        return sendResponse(res, 404, false,
          'Selected student not found. Please search and select again.'
        );
      }
    } else {
      const rollQuery = rollNumber  ? rollNumber.trim()  : '';
      const nameQuery = studentName ? studentName.trim() : '';

      const orConditions = [];
      if (rollQuery) {
        orConditions.push({ rollNumber: rollQuery });
        orConditions.push({ admissionNumber: rollQuery });
      }
      if (nameQuery) {
        orConditions.push({ name: { $regex: `^${nameQuery}$`, $options: 'i' } });
      }

      if (orConditions.length === 0) {
        return sendResponse(res, 400, false, 'Provide studentId, rollNumber, or studentName to identify the student');
      }

      studentDoc = await Student.findOne({ $or: orConditions }).lean();

      if (!studentDoc) {
        return sendResponse(res, 404, false,
          'Student not found. Please search and select the student from the list, or register the student first.'
        );
      }
    }

    const fee = await Fee.create({
      student:      studentDoc._id,
      studentName:  studentDoc.name                                     || studentName?.trim()  || '',
      rollNumber:   studentDoc.rollNumber || studentDoc.admissionNumber  || rollNumber?.trim()   || '',
      className:    className?.trim()   || '',
      totalFee:     Number(totalFee),
      submittedFee: Number(submittedFee),
      feePeriod:    feePeriod?.trim()   || '',
      notes:        notes?.trim()       || '',
      addedBy:      req.user?._id,
    });

    await fee.populate('student', 'name rollNumber admissionNumber className');

    return sendResponse(res, 201, true, 'Fee record created successfully', fee);
  } catch (error) {
    console.error('createFee error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendResponse(res, 400, false, messages.join('. '));
    }
    return sendResponse(res, 500, false, 'Server error while creating fee record');
  }
};


const updateFee = async (req, res) => {
  try {
    const existingFee = await Fee.findById(req.params.id);
    if (!existingFee) return sendResponse(res, 404, false, 'Fee record not found');

    const {
      studentId, totalFee, submittedFee,
      feePeriod, notes, studentName, rollNumber, className,
    } = req.body;

    const newTotalFee     = totalFee     !== undefined ? Number(totalFee)     : existingFee.totalFee;
    const newSubmittedFee = submittedFee !== undefined ? Number(submittedFee) : existingFee.submittedFee;

    if (newTotalFee     < 0) return sendResponse(res, 400, false, 'Total fee cannot be negative');
    if (newSubmittedFee < 0) return sendResponse(res, 400, false, 'Submitted fee cannot be negative');
    if (newSubmittedFee > newTotalFee) return sendResponse(res, 400, false, 'Submitted fee cannot exceed total fee');

    const updates = {};

    if (studentId && studentId !== String(existingFee.student)) {
      const studentDoc = await Student.findById(studentId).lean();
      if (!studentDoc) return sendResponse(res, 404, false, 'Selected student not found');
      updates.student     = studentDoc._id;
      updates.studentName = studentDoc.name;
      updates.rollNumber  = studentDoc.rollNumber || '';
    } else {
      if (studentName !== undefined) updates.studentName = studentName?.trim() || '';
      if (rollNumber  !== undefined) updates.rollNumber  = rollNumber?.trim()  || '';
    }

    if (className    !== undefined) updates.className    = className?.trim()  || '';
    if (totalFee     !== undefined) updates.totalFee     = Number(totalFee);
    if (submittedFee !== undefined) updates.submittedFee = Number(submittedFee);
    if (feePeriod    !== undefined) updates.feePeriod    = feePeriod?.trim()  || '';
    if (notes        !== undefined) updates.notes        = notes?.trim()      || '';

    const updatedFee = await Fee.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('student', 'name rollNumber admissionNumber className');

    return sendResponse(res, 200, true, 'Fee record updated successfully', updatedFee);
  } catch (error) {
    console.error('updateFee error:', error);
    if (error.name === 'CastError') return sendResponse(res, 400, false, 'Invalid fee record ID');
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendResponse(res, 400, false, messages.join('. '));
    }
    return sendResponse(res, 500, false, 'Server error while updating fee record');
  }
};

const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return sendResponse(res, 404, false, 'Fee record not found');
    return sendResponse(res, 200, true, 'Fee record deleted successfully');
  } catch (error) {
    console.error('deleteFee error:', error);
    if (error.name === 'CastError') return sendResponse(res, 400, false, 'Invalid fee record ID');
    return sendResponse(res, 500, false, 'Server error while deleting fee record');
  }
};


const getFeeSummary = async (req, res) => {
  try {
    const { feePeriod, className } = req.query;
    const matchStage = {};
    if (feePeriod) matchStage.feePeriod = feePeriod;
    if (className) matchStage.className = className;

    const stats = await Fee.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRecords:     { $sum: 1 },
          totalFeeAssigned: { $sum: '$totalFee' },
          totalSubmitted:   { $sum: '$submittedFee' },
          totalPending:     { $sum: { $subtract: ['$totalFee', '$submittedFee'] } },
        },
      },
    ]);

    const result = stats[0] || {
      totalRecords: 0, totalFeeAssigned: 0, totalSubmitted: 0, totalPending: 0,
    };

    return sendResponse(res, 200, true, 'Fee summary fetched', result);
  } catch (error) {
    console.error('getFeeSummary error:', error);
    return sendResponse(res, 500, false, 'Server error while fetching summary');
  }
};

module.exports = {
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  getFeeSummary,
  searchStudents,
};