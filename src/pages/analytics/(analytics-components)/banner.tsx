const Banner: React.FC<{imageUrl: string}> = ({imageUrl}) =>{
  return (
  <img
    src= {imageUrl}
    alt= "NFTBannerImage"
  />
  )
}

export default Banner;