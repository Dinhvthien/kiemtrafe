import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4 sm:px-6 lg:px-10">
      {/* <div className="max-w-7xl mx-auto"> */}
        {/* Grid layout for responsive column arrangement */}

        {/* Bottom Copyright Section */}
        <div className="text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Viện Ứng dụng công nghệ và đào tạo phát triển nguồn nhân lực. All rights reserved.
          </p>
        </div>
      {/* </div> */}
    </footer>
  );
};

export default Footer;


        // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        //   <div>
        //     <h3 className="text-xl font-semibold mb-3">
        //       Viện Ứng dụng công nghệ và đào tạo phát triển nguồn nhân lực
        //     </h3>
        //     <p className="text-red-500 text-base mb-2">
        //       Email: <a href="mailto:cskh.itat@gmail.com">cskh.itat@gmail.com</a>
        //     </p>
        //     <p className="text-base">
        //       Website: <a href="https://itat.vn" target="_blank" rel="noopener noreferrer">itat.vn</a>
        //     </p>
        //   </div>


        //   <nav aria-label="Footer Navigation">
        //     <h3 className="text-xl font-semibold mb-3">Trang</h3>
        //     <ul className="space-y-2">
        //       <li>
        //         <a href="/gioi-thieu" className="text-base hover:text-gray-300">
        //           Giới thiệu
        //         </a>
        //       </li>
        //       <li>
        //         <a href="/lien-he" className="text-base hover:text-gray-300">
        //           Liên hệ
        //         </a>
        //       </li>
        //       <li>
        //         <a href="/chuong-trinh" className="text-base hover:text-gray-300">
        //           Chương trình
        //         </a>
        //       </li>
        //       <li>
        //         <a href="/thu-vien" className="text-base hover:text-gray-300">
        //           Thư viện tài liệu
        //         </a>
        //       </li>
        //     </ul>
        //   </nav>
        //   <nav aria-label="External Links">
        //     <h3 className="text-xl font-semibold mb-3">Liên kết</h3>
        //     <ul className="space-y-2">
        //       <li>
        //         <a href="/tai-lieu" className="text-base hover:text-gray-300">
        //           Tài liệu
        //         </a>
        //       </li>
        //       <li>
        //         <a href="/lab-blog" className="text-base hover:text-gray-300">
        //           Lab blog
        //         </a>
        //       </li>
        //     </ul>
        //   </nav>

        //   <nav aria-label="Fields of Work">
        //     <h3 className="text-xl font-semibold mb-3">Lĩnh Vực</h3>
        //     <ul className="space-y-2">
        //       <li>
        //         <a href="/ve-chung-toi" className="text-base hover:text-gray-300">
        //           Về Chúng Tôi
        //         </a>
        //       </li>
        //       <li>
        //         <a href="/tin-tuc" className="text-base hover:text-gray-300">
        //           Tin Tức - Hoạt Động
        //         </a>
        //       </li>
        //     </ul>
        //   </nav>
        // </div>