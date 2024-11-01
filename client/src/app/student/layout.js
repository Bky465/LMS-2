import Navbar from "@/components/student/Navbar";
export default function RootLayout({ children }) {
    return (
      <div>
       <Navbar/>
       <div className="px-10 py-10">
       {children}
       </div>
      </div>
  
    );
  }
  