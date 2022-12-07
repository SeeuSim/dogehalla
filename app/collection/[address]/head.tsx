export default function Head({ params }: {params: {address: string}}) {
  let tempVar: unknown = params.address;
  const collectAddr = tempVar as number;
  
  //Fake Database - To be changed
  const dataBase = ["Hamburger","Mcspicy","Cheeseburger","Filet-o-fish","Quarter Pounder","Big Mac","McWings","McNuggets","McCrispy","Hotcakes"]
  const collectionName = dataBase[collectAddr] + " - Collection | DogeTTM";

  return (
    <>
      <title>{collectionName}</title>
    </>
  )
}