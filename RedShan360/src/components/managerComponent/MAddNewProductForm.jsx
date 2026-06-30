import React, { useState, useEffect } from 'react';
import { X, Upload, AlertCircle, CheckCircle2, Box } from 'lucide-react';

export default function MAddNewProductForm({ onClose, onSubmit }) {
    // Form fields state
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        subcategory: '',
        price: '',
        stockQuantity: '',
        description: ''
    });

    // Image upload state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Validation & touched states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Subcategory options based on selected Category
    const [availableSubcategories, setAvailableSubcategories] = useState(['Boquet', 'Individual Flowers', 'Headdress']);

    // Update available subcategories when category changes
    useEffect(() => {
        if (formData.category === 'Anniversary' || formData.category === 'Convocation') {
            // Anniversary & Convocation cards only show Boquets & Individual Flowers in mock data
            setAvailableSubcategories(['Boquet', 'Individual Flowers']);
            // Reset subcategory if it is Headdress, which is no longer valid
            if (formData.subcategory === 'Headdress') {
                setFormData(prev => ({ ...prev, subcategory: '' }));
            }
        } else {
            // Birthday (and default) shows all three
            setAvailableSubcategories(['Boquet', 'Individual Flowers', 'Headdress']);
        }
    }, [formData.category]);

    // Validation logic for a single field
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'productName':
                if (!value.trim()) {
                    error = 'Product name is required';
                } else if (value.trim().length < 3) {
                    error = 'Product name must be at least 3 characters';
                }
                break;
            case 'category':
                if (!value) {
                    error = 'Please select a category';
                }
                break;
            case 'subcategory':
                if (!value) {
                    error = 'Please select a subcategory';
                }
                break;
            case 'price':
                if (!value) {
                    error = 'Price is required';
                } else {
                    const priceNum = parseFloat(value);
                    if (isNaN(priceNum) || priceNum <= 0) {
                        error = 'Price must be a valid positive number';
                    }
                }
                break;
            case 'stockQuantity':
                if (!value && value !== 0) {
                    error = 'Stock quantity is required';
                } else {
                    const stockNum = Number(value);
                    if (!Number.isInteger(stockNum) || stockNum < 0) {
                        error = 'Stock quantity must be a non-negative integer';
                    }
                }
                break;
            case 'description':
                if (!value.trim()) {
                    error = 'Description is required';
                } else if (value.trim().length < 10) {
                    error = 'Description must be at least 10 characters';
                }
                break;
            default:
                break;
        }
        return error;
    };

    // Run validation whenever inputs change if they have been touched
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const fieldError = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: fieldError }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const fieldError = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: fieldError }));
    };

    // Handle Image upload selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = {};
        const validationErrors = {};
        
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
            const error = validateField(key, formData[key]);
            if (error) {
                validationErrors[key] = error;
            }
        });

        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // Focus on first error element
            const firstErrorKey = Object.keys(validationErrors)[0];
            const element = document.getElementsByName(firstErrorKey)[0];
            if (element) {
                element.focus();
            }
            return;
        }

        // Success - trigger callback
        if (onSubmit) {
            onSubmit({
                ...formData,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity, 10),
                image: imagePreview || null
            });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-[#e5e4e7] shadow-xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#e5e4e7] flex items-center justify-between bg-gradient-to-r from-[#744F51]/5 to-transparent">
                <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                        Add New Product
                    </h2>
                    <p className="text-sm text-[#666] mt-1 font-sans">
                        Fill in the details below to add a new flower bouquet, individual stem, or headdress to the catalog.
                    </p>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Product Details */}
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. Lavender Dream Bouquet"
                                    className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none transition-all duration-200 ${
                                        errors.productName && touched.productName
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50/10'
                                            : 'border-[#e5e4e7] focus:border-[#744F51] focus:ring-1 focus:ring-[#744F51]/20'
                                    }`}
                                />
                                {touched.productName && !errors.productName && formData.productName && (
                                    <CheckCircle2 size={16} className="absolute right-3.5 top-3.5 text-green-600" />
                                )}
                            </div>
                            {errors.productName && touched.productName && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-semibold">
                                    <AlertCircle size={12} />
                                    {errors.productName}
                                </p>
                            )}
                        </div>

                        {/* Category & Subcategory Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm font-sans bg-white focus:outline-none transition-all duration-200 ${
                                        errors.category && touched.category
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                                            : 'border-[#e5e4e7] focus:border-[#744F51] focus:ring-1 focus:ring-[#744F51]/20'
                                    }`}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Birthday">Birthday</option>
                                    <option value="Convocation">Convocation</option>
                                    <option value="Anniversary">Anniversary</option>
                                </select>
                                {errors.category && touched.category && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle size={12} />
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Subcategory */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                                    Subcategory <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    disabled={!formData.category}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm font-sans bg-white focus:outline-none transition-all duration-200 ${
                                        !formData.category ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-[#e5e4e7]' : ''
                                    } ${
                                        errors.subcategory && touched.subcategory
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                                            : 'border-[#e5e4e7] focus:border-[#744F51] focus:ring-1 focus:ring-[#744F51]/20'
                                    }`}
                                >
                                    <option value="">Select Subcategory</option>
                                    {availableSubcategories.map(sub => (
                                        <option key={sub} value={sub}>{sub === 'Boquet' ? 'Bouquet' : sub}</option>
                                    ))}
                                </select>
                                {errors.subcategory && touched.subcategory && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle size={12} />
                                        {errors.subcategory}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Price & Stock Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Price */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                                    Price (Rs) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-3 flex items-center justify-center font-bold text-xs pointer-events-none text-gray-400 h-8">
                                        Rs
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="0.00"
                                        className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-sans focus:outline-none transition-all duration-200 ${
                                            errors.price && touched.price
                                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50/10'
                                                : 'border-[#e5e4e7] focus:border-[#744F51] focus:ring-1 focus:ring-[#744F51]/20'
                                        }`}
                                    />
                                </div>
                                {errors.price && touched.price && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle size={12} />
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Stock Quantity */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        min="0"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="0"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none transition-all duration-200 ${
                                            errors.stockQuantity && touched.stockQuantity
                                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50/10'
                                                : 'border-[#e5e4e7] focus:border-[#744F51] focus:ring-1 focus:ring-[#744F51]/20'
                                        }`}
                                    />
                                </div>
                                {errors.stockQuantity && touched.stockQuantity && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle size={12} />
                                        {errors.stockQuantity}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Description & Product Image */}
                    <div className="space-y-6 flex flex-col justify-between">
                        {/* Description */}
                        <div className="flex flex-col gap-1.5 h-full">
                            <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                rows={4}
                                placeholder="Describe the materials, colors, flower types, and customization options..."
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none transition-all duration-200 flex-1 resize-none ${
                                    errors.description && touched.description
                                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-50/10'
                                        : 'border-[#e5e4e7] focus:border-[#744F51] focus:ring-1 focus:ring-[#744F51]/20'
                                }`}
                            />
                            <div className="flex items-center justify-between text-[11px] text-[#666] font-medium mt-1">
                                <span>Minimum 10 characters</span>
                                <span className={formData.description.trim().length >= 10 ? 'text-green-600 font-semibold' : ''}>
                                    {formData.description.trim().length} chars
                                </span>
                            </div>
                            {errors.description && touched.description && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-semibold">
                                    <AlertCircle size={12} />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Product Image Upload */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                                Product Image
                            </label>
                            <div className="relative border-2 border-dashed border-[#e5e4e7] hover:border-[#744F51] rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-[#744F51]/5 transition-all duration-300 group min-h-[145px]">
                                {imagePreview ? (
                                    <div className="relative w-full h-full flex flex-col items-center gap-2">
                                        <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-[#e5e4e7] bg-white">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow-md hover:bg-red-700 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <span className="text-xs text-[#666] truncate max-w-[200px] font-sans font-medium">
                                            {imageFile?.name}
                                        </span>
                                    </div>
                                ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2 py-4">
                                        <div className="p-3 bg-white rounded-full border border-[#e5e4e7] text-gray-400 group-hover:text-[#744F51] group-hover:border-[#744F51]/30 transition-all duration-300 shadow-sm">
                                            <Upload size={18} />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-xs font-bold text-[#744F51] hover:underline block">
                                                Click to upload
                                            </span>
                                            <span className="text-[10px] text-[#666] font-medium mt-0.5 block">
                                                PNG, JPG or JPEG (Max 5MB)
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-6 border-t border-[#e5e4e7] flex flex-wrap items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-[#e5e4e7] text-sm font-bold text-[#666] hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#744F51] hover:bg-[#5e3f41] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-1.5"
                    >
                        <span>Add Product</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
