import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

export default function UserLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar></Navbar>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
           <Footer></Footer>
        </main>
       
      </div>
    </div>
  );
}
