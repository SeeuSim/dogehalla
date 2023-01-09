import * as React from 'react';

interface NFT {
  name: string;
  currency: string;
  description: string;
}

interface Props {
}

const Header: React.FC<Props> = () => {
  const [nft, setNFT] = React.useState<NFT | null>(null);

  React.useEffect(() => {
    const fetchNFTData = async () => {
      const response = await fetch('#'); // TBD: Endpoint for NFT 
      const nftData = await response.json();
      setNFT(nftData);
    };

    fetchNFTData();
  }, []);

  if (!nft) {
    return <div>Loading...</div>;
  }

  return (
    <div className="header-container">
      <div className="nft-card">
        <h1>{nft.name}</h1>
        <p>{nft.currency}</p>
        <p>{nft.description}</p>
        {/* Render other properties of the NFT here */}
      </div>
    </div>
  );
};

export default Header;
