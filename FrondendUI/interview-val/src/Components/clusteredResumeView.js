import React from 'react'
import useResume from './context/resumeContext'
import { Card } from '@mui/joy'
const ClusteredResumeView = () => {
    const {selectedResume} = useResume()

  return (
    <div>
      <Card variant='plain'>
        {selectedResume.personal_info.email}
      </Card>
    </div>
  )
}

export default ClusteredResumeView
