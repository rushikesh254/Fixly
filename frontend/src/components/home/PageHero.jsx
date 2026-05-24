function PageHero({ img, title, subtitle, position }) {
  return (
    <div
      className="relative h-[35vh] w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${img}')`,
        backgroundPositionY: `${position}`,
        backgroundPositionX: "50%",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-black/80 to-black/60"></div>
      <div className="absolute inset-0 flex  items-center justify-center p-4">
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-white text-center">
            {title}
          </h1>
          <p className="text-gray-300 text-center">
            Home / <span className="text-blue-600 font-medium">{subtitle}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageHero;
