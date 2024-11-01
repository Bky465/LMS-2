import { Poppins } from '@next/font/google';
import "./globals.css";
import ReduxWrapper from '../../provider/redux/ReduxWrapper';
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "LMS",
  description: "A learning manage system",
};

// Set up Poppins with the necessary weights
const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap', // improves page load performance
});


export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
      <ReduxWrapper>
        {children}
        <Toaster/>
        </ReduxWrapper>
      </body>
    </html>
    

  );
}
