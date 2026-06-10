import SaveBtn from "./saveBtn";
import Lightbox from "yet-another-react-lightbox";

function Gallery({ p, images, galleryImages, open, setOpen, index, setIndex }) {
  return (
    <>
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-4 gap-2 sm:gap-1 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
          <div className="group relative col-span-2 row-span-2 h-40 sm:h-64 md:h-107.5 overflow-hidden rounded-l-xl">
            <img
              src={images[0]}
              alt={p.title}
              className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
              onClick={() => (setOpen(true), setIndex(0))}
            />
          </div>
          {/* save button  */}
          <SaveBtn />
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="group col-span-2 h-19 sm:h-30.5 md:h-52 overflow-hidden rounded-r-xl"
            >
              <img
                src={img}
                alt={`${p.title} gallery ${i + 1}`}
                loading="lazy"
                className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={() => (setIndex(i + 1), setOpen(true))}
              />
            </div>
          ))}
        </div>
      </div>
      {/* lightbox for gallery images */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((img) => ({ src: img }))}
        index={index}
      />
    </>
  );
}

export default Gallery;
