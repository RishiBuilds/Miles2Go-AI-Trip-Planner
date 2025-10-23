"use client";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Building2, DollarSign, MapPin, Phone, Mail, Image as ImageIcon, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Upload } from "lucide-react";

const VendorRegisterPage = () => {
  const router = useRouter();
  const registerVendor = useMutation(api.VendorSchema.RegisterVendor);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorType: "hotel",
    email: "",
    phone: "",
    city: "",
    country: "",
    latitude: 0,
    longitude: 0,
    description: "",
    amenities: "",
    imageUrl: "",
    basePrice: 0,
    currency: "USD",
    capacity: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "basePrice" || name === "capacity" || name === "latitude" || name === "longitude" 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amenitiesArray = formData.amenities
        .split(",")
        .map(a => a.trim())
        .filter(a => a.length > 0);

      await registerVendor({
        vendorName: formData.vendorName,
        vendorType: formData.vendorType,
        email: formData.email,
        phone: formData.phone,
        location: {
          city: formData.city,
          country: formData.country,
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        description: formData.description,
        amenities: amenitiesArray,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        basePrice: formData.basePrice,
        currency: formData.currency,
        capacity: formData.capacity,
        rating: 0,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/vendors");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6 relative" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Aboard! 🎉</h1>
          <p className="text-xl text-gray-600 mb-2">Your business is now registered</p>
          <p className="text-sm text-gray-500 mb-6">Redirecting to your dashboard...</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">AI-Powered Platform</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Register Your Business
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Join thousands of vendors and reach travelers worldwide with intelligent pricing
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[
              { num: 1, label: "Basic Info" },
              { num: 2, label: "Location" },
              { num: 3, label: "Pricing" }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      step >= s.num
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? <CheckCircle className="h-6 w-6" /> : s.num}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= s.num ? "text-blue-600" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`w-12 sm:w-20 h-1 mx-2 transition-all duration-300 ${
                      step > s.num ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="inline h-4 w-4 mr-2" />
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="vendorName"
                    value={formData.vendorName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Grand Plaza Hotel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="vendorType"
                    value={formData.vendorType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hotel">Hotel</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="transport">Transportation</option>
                    <option value="guide">Tour Guide</option>
                    <option value="activity">Activity/Experience</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your business, what makes it special..."
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                  size="lg"
                  disabled={!formData.vendorName || !formData.email || !formData.phone || !formData.description}
                >
                  Next: Location & Details
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Step 2: Location & Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Location & Details</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Paris"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., France"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="48.8566"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2.3522"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="WiFi, Breakfast, Pool, Gym, Parking"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="inline h-4 w-4 mr-2" />
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 py-6 text-lg"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-lg"
                    size="lg"
                    disabled={!formData.city || !formData.country}
                  >
                    Next: Pricing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Pricing */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Pricing Setup</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-900 text-sm">
                    💡 <strong>Smart Pricing:</strong> Our AI will automatically optimize your prices based on demand, seasonality, and market conditions. You set the base price, and we'll help you maximize revenue!
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="inline h-4 w-4 mr-2" />
                      Base Price *
                    </label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="150.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your standard price per night/service
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total rooms/seats/capacity available
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Estimated Smart Pricing Range</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-green-700">Low Season</p>
                      <p className="text-xl font-bold text-green-900">
                        ${(formData.basePrice * 0.75).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Base Price</p>
                      <p className="text-xl font-bold text-green-900">
                        ${formData.basePrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Peak Season</p>
                      <p className="text-xl font-bold text-green-900">
                        ${(formData.basePrice * 1.5).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 py-6 text-lg"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.basePrice || !formData.capacity}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 py-6 text-lg font-semibold shadow-lg"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Pricing</h3>
            <p className="text-sm text-gray-600">
              AI optimizes your prices automatically for maximum revenue
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">More Visibility</h3>
            <p className="text-sm text-gray-600">
              Reach thousands of travelers looking for experiences like yours
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Management</h3>
            <p className="text-sm text-gray-600">
              Simple dashboard to manage bookings and track performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
