import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { navItems } from '../data';
import { Link } from "react-router-dom";
 

const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };



  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 p-5 bg-gray-700 shadow-lg `}
    >
      <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-32">
        <div className="flex items-center justify-between h-16">
       <img src="/logo-engi9-white.png" alt="" width={150}/>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center uppercase space-x-1 px-3 py-2 font-normal text-sm duration-200 text-white`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
             <Link 
                  to={'/'}
                  className={`flex items-center uppercase space-x-1 px-3 py-2 font-normal text-sm duration-200 text-white bg-red-500`}
                >
                  <LogOut />
                  <span>Sair</span>
                </Link>
          </nav>

         

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 text-white hover:bg-white/10`}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 space-y-2 bg-white rounded-lg mt-2 shadow-lg border">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })} 
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;