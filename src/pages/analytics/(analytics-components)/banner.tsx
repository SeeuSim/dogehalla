import * as React from 'react';

interface Props {
  bannerImageUrl: string; 
  logoImageUrl: string; 
}

const Banner: React.FC<Props> = ({ bannerImageUrl, logoImageUrl }) => {
  return (
    <div className="banner" style={{ backgroundImage: `url(${bannerImageUrl})`, backgroundSize: 'cover' }}>
      <div className="logo" style={{ backgroundImage: `url(${logoImageUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
    </div>
  );
};

export default Banner;