export default function RootLayout({ children }) {
  return (

    <div className='min-h-screen bg-background w-full flex items-center justify-center md:py-5 py-2 sm:px-0 px-2'>
      {children}
    </div>

  );
}
