const Signature = require('../models/Signature');

// יצירת חתימה חדשה
const createSignature = async (req, res, next) => {
    try {
        const { signatureData, documentId } = req.body;
        
        const signature = await Signature.create({
            signatureData,
            documentId,
            userId: req.user.id
        });

        res.status(201).json({
            success: true,
            data: signature
        });
    } catch (error) {
        next(error);
    }
};

// קבלת חתימה ספציפית
const getSignature = async (req, res, next) => {
    try {
        const signature = await Signature.findById(req.params.id);
        
        if (!signature) {
            return res.status(404).json({
                success: false,
                message: 'החתימה לא נמצאה'
            });
        }

        res.json({
            success: true,
            data: signature
        });
    } catch (error) {
        next(error);
    }
};

// עדכון חתימה
const updateSignature = async (req, res, next) => {
    try {
        const { signatureData } = req.body;
        
        const signature = await Signature.findByIdAndUpdate(
            req.params.id,
            { signatureData },
            { new: true, runValidators: true }
        );

        if (!signature) {
            return res.status(404).json({
                success: false,
                message: 'החתימה לא נמצאה'
            });
        }

        res.json({
            success: true,
            data: signature
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSignature,
    getSignature,
    updateSignature
}; 