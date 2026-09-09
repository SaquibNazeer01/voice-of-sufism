import React from 'react';
import { AboutUs } from './AboutUs';

export const BehindTheMission: React.FC<{ themeMode?: 'ivory' | 'sepia' | 'dark' }> = (props) => {
  return <AboutUs {...props} />;
};

export default BehindTheMission;
