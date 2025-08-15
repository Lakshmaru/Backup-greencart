// components/Footer.jsx
import React from "react";
import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
 

  return (
    <div className="px-6 mt-24 md:px-16 lg:px-24 xl:px-32 bg-primary/10">
      <div className="flex flex-col items-start justify-between gap-10 py-10 text-gray-500 border-b md:flex-row border-gray-500/30">
        <div>
          <img className="w-34 md:w-32" src={assets.logo} alt="Logo" />
          <p className="max-w-[410px] mt-6">
            We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footerLinks.map((section, index) => (
            <div key={section.title || index}>
              <h3 className="mb-2 text-base font-semibold text-gray-900 md:mb-5">
                {section.title}
              </h3>
              <ul className="space-y-1 text-sm">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="transition hover:underline">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-sm text-center md:text-base text-gray-500/80">
        Copyright {new Date().getFullYear()} © <a href="https://prebuiltui.com">GreatStack.dev</a> All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
