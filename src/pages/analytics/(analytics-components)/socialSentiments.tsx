import * as React from 'react';

interface Props {
  nftAddress: string; 
}

interface SocialMediaMention {
  id: string;
  username: string;
  text: string;
  createdAt: string;
  platform: 'twitter' | 'instagram' | 'facebook'| 'reddit' | 'discord';
}

const SocialMediaMentions: React.FC<Props> = ({ nftAddress }) => {
  const [mentions, setMentions] = React.useState<SocialMediaMention[]>([]);

  const fetchMentions = async () => {
    const response = await fetch(`/api/mentions?nftId=${nftAddress}`); // Fetch the mentions for the NFT
    const fetchedMentions = await response.json();
    setMentions(fetchedMentions);
  };

  React.useEffect(() => {
    fetchMentions();
  }, [nftAddress]); 

  return (
    <div className="mentions-container">
      {mentions.map(mention => (
        <div className="mention-card" key={mention.id}>
          <div className="username">{mention.username}</div>
          <div className="text">{mention.text}</div>
          <div className="created-at">{mention.createdAt}</div>
          <div className="platform">{mention.platform}</div>
        </div>
      ))}
    </div>
  );
};

export default SocialMediaMentions;
