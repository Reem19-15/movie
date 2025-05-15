const Footer = () => {
  return (
    <footer className="bg-[#141414] text-[#808080] py-6 text-center">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-center md:space-x-6 mb-2">
          <a
            href="#"
            className="hover:underline text-[#808080] hover:text-[#b3b3b3] transition-colors duration-200 mb-1 md:mb-0"
          >
            About
          </a>
          <a
            href="#"
            className="hover:underline text-[#808080] hover:text-[#b3b3b3] transition-colors duration-200 mb-1 md:mb-0"
          >
            Contact
          </a>
        </div>
        <p className="text-[#ff0101] text-sm mt-4">
          Created By the best team in DEPI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
