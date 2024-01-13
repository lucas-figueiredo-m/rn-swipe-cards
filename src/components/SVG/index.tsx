import React from 'react';
import { SvgXml, XmlProps } from 'react-native-svg';

export const SVG: React.FC<XmlProps> = props => {
  return <SvgXml {...props} />;
};
