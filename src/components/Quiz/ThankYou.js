import React from "react";

const ThankYouPage = () => {
  const gradientBackground = {
    background: "linear-gradient(30deg, rgb(36, 243, 91),  #034926)",
  };
  return (
    <div
      className="lg:w-140 lg:h-80 h-64 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 rounded  transition-transform transform hover:scale-90"
      style={gradientBackground}
    >
      <img
        src="https://imgs.search.brave.com/EhJ5FYYjVIzaV-HO2I2l25ckDf0mfJa70MICXxRdyjY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jbGlw/YXJ0LWxpYnJhcnku/Y29tL2ltYWdlcy82/VHI2UjVCbmMucG5n"
        alt="Thank You Image"
        className="w-10 h-auto mb-9"
      />
      <div className="max-w-md w-full space-y-8 transition-transform">
        <h1
          className="lg:text-3xl font-bold text-center text-white"
          style={{ fontSize: "33px" }}
        >
          Thank You for Your Responses
        </h1>
      </div>
    </div>
  );
};

export default ThankYouPage;
