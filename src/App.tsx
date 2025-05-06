import React, { useState, useEffect } from "react";
import "./App.css";
import HomePageContainer from "./components/HomePageContainer";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading (e.g., fetching data, images, etc.)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Adjust the duration of loading as needed

    // Disable scroll when loading starts
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // Re-enable scroll after loading
    }

    return () => {
      document.body.style.overflow = "auto"; // Ensure scroll is re-enabled on cleanup
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <>
      {/* Black loading screen with spinning loader */}
      {isLoading && (
        <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
          <div className="spinner"></div>
        </div>
      )}

      <HomePageContainer />
    </>
  );
}

export default App;
