import PageHero from "../components/home/PageHero";
function ServicesPage() {
  return (
    <div>
      <PageHero
        img="https://plus.unsplash.com/premium_photo-1661963478928-2d2d3e9b1e25?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Our Services"
        subtitle="Services"
        position="100%"
      />
      <div className="min-h-screen flex">
        <div className="min-w-[30vw] bg-gray-600">
          <h2 className="text-white text-2xl font-bold p-4">Categories</h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default ServicesPage;
