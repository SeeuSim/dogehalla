import Collections from './collectionsdash'

export default function Home() {
  // Desktop - Side By Side
  // Tablet and below - Stacked, with analytics collapsed and fetched when needed
  return (
    <div>
      <Collections/>
      {/** Analytics Pane */}
    </div>  
  )
}
