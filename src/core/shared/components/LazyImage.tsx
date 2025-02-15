import {useState, useEffect} from 'react';
import {Image, View} from 'react-native';

type LazyImageProps = {
  src?: string;
  placeholderSource: 'circle' | 'square' | 'tall' | 'wide';
  style?: any;
};

const LazyImage = ({src, placeholderSource, style}: LazyImageProps) => {
  const [placeholder, setPlaceholder] = useState<any>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    switch (placeholderSource) {
      case 'square':
        setPlaceholder(
          require('../../../../assets/images/placeholders/square.jpg'),
        );
      case 'tall':
        setPlaceholder(
          require('../../../../assets/images/placeholders/tall.jpg'),
        );
      case 'wide':
        setPlaceholder(
          require('../../../../assets/images/placeholders/wide.jpg'),
        );
      default:
        setPlaceholder(
          require('../../../../assets/images/placeholders/square.jpg'),
        );
    }
  }, [src]);

  return (
    <Image
      source={showPlaceholder ? placeholder : {uri: src}}
      onError={() => setShowPlaceholder(true)}
      resizeMode="cover"
      style={style}
    />
  );
};

export default LazyImage;
