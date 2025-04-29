import React from 'react'
import FeaturedAssistants from './_components/FeaturedAssistants'
import PreviousHistroy from './_components/PreviousHistroy'
import FeedbackByAI from './_components/FeedbackByAI'

function Dashboard() {
  return (
    <div>
      <FeaturedAssistants/>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-20'>
        <PreviousHistroy/>
        <FeedbackByAI/>
      </div>
    </div>
  )
}

export default Dashboard
