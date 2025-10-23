import React from 'react'
import PricingTable from './components/PricingTable'

function Pricing() {
  return (
    <div className='mt-20 pb-20'>
      <div className='max-w-7xl mx-auto px-4 text-center'>
        <h2 className='font-bold text-3xl mb-3'>Choose Your Perfect <span className='text-primary'>Plan</span></h2>
        <p className='text-gray-600 max-w-2xl mx-auto mb-10'>Get exactly what you need for your travel planning - from free basic plans to premium features for frequent travelers</p>
        <PricingTable />
        
        <div className='mt-16 p-6 bg-gray-50 rounded-xl'>
          <h3 className='font-semibold text-xl mb-4'>All Plans Include</h3>
          <div className='grid md:grid-cols-3 gap-4 text-left'>
            <div className='p-4'>
              <p className='font-medium'>✓ AI Trip Generation</p>
              <p className='text-sm text-gray-600'>Create personalized itineraries</p>
            </div>
            <div className='p-4'>
              <p className='font-medium'>✓ Smart Recommendations</p>
              <p className='text-sm text-gray-600'>Get tailored suggestions</p>
            </div>
            <div className='p-4'>
              <p className='font-medium'>✓ Mobile Access</p>
              <p className='text-sm text-gray-600'>Take your plans anywhere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing