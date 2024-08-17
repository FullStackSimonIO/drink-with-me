import React from "react";

const Hero = () => {
  return (
    <div className="flex justify-center items-center pt-36 background-light800_dark300">
      <div className="text-center text-3xl font-bold">
        <h1>
          {
            // TODO: Dynamically render the user's name here
          }
          <p className="text-dark-100 dark:text-white">
            Hallo, <span className="text-primary-500">Simon</span>.<br />
            Willkommen zurück!
          </p>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
