'use client'

import { useEffect, useState } from 'react';

import './styles.scss';

export default function ProgressBar({ percentage }: { percentage: number } = { percentage: 0 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(percentage);
  }, [percentage]);

  return (
    <div className='styled-progress-bar'>
      <div className='progress-bar-line' style={{ width: `${progress}%` }}></div>
    </div>
  )
}