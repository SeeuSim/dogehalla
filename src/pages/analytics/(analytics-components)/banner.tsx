
const banner: React.FC<{
}> = (props) => {
  return (
    <section className="relative py-24 px-4">
    <div className="z-20 relative text-white container mx-auto">
      <h1 className="mb-4">Tailwind Banner with Object Fit Image</h1>
      <p className="leading-normal">This is a banner that can be resized to your heart’s content without using a background image property.</p>
      <p className="leading-normal">Integer eu massa ipsum. Quisque dui purus, congue in urna sed, volutpat condimentum nisi. Ut elementum tellus quam, sit amet congue ante tempus id. Phasellus ultricies enim in est posuere, quis semper urna consequat.</p>
      <a href="#" className="inline-block bg-blue-500 text-white no-underline hover:bg-blue-800 mt-4 p-4 rounded">A Call to Action</a>
    </div>
    <div className="absolute inset-0 h-auto z-10">
      <img src="https://images.unsplash.com/photo-1509315047084-af74f1192bee" alt="" className="h-full w-full object-fit-cover"/>
    </div>
  </section>
  );
};

export default banner;

