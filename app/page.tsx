import CollectionsDash from './(home-components)/collectionsdash'

export default function Home() {
  // Desktop - Side By Side
  // Tablet and below - Stacked, with analytics collapsed and fetched when needed
  return (
    <div>
      <CollectionsDash/>
      {/** Analytics Pane */}
    </div>  
  )
}
