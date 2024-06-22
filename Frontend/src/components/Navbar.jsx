import React,{useState,useEffect} from 'react';
import image from "../assets/image.png";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineShare } from "react-icons/md";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [darkmode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme=="true") {
      setDarkMode(!darkmode);
      let element = document.body;
      element.classList.add("dark");
    }
  }, []);

    const handledarkMode = (e) => {
        e.preventDefault();
        setDarkMode(!darkmode);
        let element = document.body;
      element.classList.toggle("dark");
      localStorage.setItem('theme', !darkmode);
    }
  return (
    <>
      <div className="flex items-center justify-between bg-purple-400 px-6 py-6 h-38 w-full">
        <Link to="/" className="w-13 h-8">
          <img src={image} className="w-full h-full  drop-shadow" />
        </Link>
        <div className="flex items-center justify-around gap-8">
          <div className="cursor-pointer" onClick={(e) => handledarkMode(e)}>
            {" "}
            {darkmode ? (
              <MdDarkMode className="text-4xl" />
            ) : (
              <MdOutlineLightMode className="text-4xl text-white" />
            )}
          </div>

          <MdOutlineShare className="text-4xl" />
        </div>
      </div>
    </>
  );
}

export default Navbar