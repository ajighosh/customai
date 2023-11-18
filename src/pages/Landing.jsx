import React from "react";
import { NavLink } from "react-router-dom";
import backgroundImage from "./../assets/back2.jpg";
import TypewriterComponent from "typewriter-effect";

const Landing = () => {
  return (
    <div
      className="bg-cover bg-center h-screen w-full overflow-x-hidden custom-scrollbar]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="mt-[30px] flex justify-between mx-[40px]">
        <div className="text-white text-[20px]">Custom GPT</div>
        <div className="right-[40px]">
          <div className="w-[200px] flex space-x-[40px] items-center">
            <NavLink to="https://twitter.com/ajyghosh">
              <i className="fa fa-twitter text-[#0088cc] text-[40px] cursor-pointer hover:scale-110"></i>
            </NavLink>
            <NavLink to="https://www.linkedin.com/in/ajyghosh/">
              <i className="fa fa-brands fa-linkedin text-[#0088cc] text-[40px] cursor-pointer hover:scale-110"></i>
            </NavLink>
            <NavLink to="mailto:help@customgpts.in" className="group">
              <span className="p-[10px] rounded-full bg-[#d44638] flex items-center group-hover:space-x-2 hover:scale-110">
                {/* <span className="hidden group-hover:flex   font-bold text-white">
                  help@customgpts.in
                </span> */}
                <i className="fa fa-envelope text-[#ffffff] text-[20px] cursor-pointer"></i>
              </span>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="justfiy-center items-center mt-[30px] text-[50px] sm:absolute sm:left-[80px] lg:left-[200px] sm:top-[270px] md:top-[200px] text-white sm:text-[30px] md:text-[45px] lg:text-[59px] font-[700] flex flex-col space-x-0">
        <div>SHAPING</div>
        <div className="font-[800] text-[#d44638]">
          <TypewriterComponent
            options={{
              strings: ["GPT'S"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
        <div>TO FIT</div>
        <div className="font-[800] text-[#0088cc]">YOUR WORLD</div>
      </div>

      <div className="justify-center flex-col items-center flex text-[40px] sm:absolute sm:top-[330px] sm:text-[30px] sm:right-[80px] lg:right-[115px] text-white font-md md:text-[30px]">
        EVERYTHING IS
        <div>
          ABOUT TO <span className="text-[#d44638]">CHANGE</span>
        </div>
      </div>

      <div className="w-full flex justify-center absolute bottom-[50px] cursor-pointer">
        <NavLink to="/list">
          <i class="fa-regular fa-circle-play text-[80px] text-[#0088cc] hover:scale-110"></i>
        </NavLink>
      </div>
    </div>
  );
};

export default Landing;
