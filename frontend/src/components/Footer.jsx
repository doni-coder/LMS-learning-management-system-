import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 w-full text-white pt-10 pb-5">
      <div className="container mx-auto items-center px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {/* Section 1: Logo & Description */}
        <div>
          <div className="md:w-[110px] w-[100px]">
          <img
            className="w-full"
            src="https://freelogopng.com/images/all_img/1683006915udemy-logo-white.png"
            alt=""
          />
        </div>
          <p className="text-gray-400 mt-2">
            Learn at your own pace with expert-created courses for all levels.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/courses" className="hover:text-white">
                Courses
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-white">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Social Links */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <ul className="flex space-x-4 text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} MyLMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
