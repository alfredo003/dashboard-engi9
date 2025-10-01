import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-white shadow-lg overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-gray-600 to-red-700 px-6 py-8">
        <h1 className="text-2xl font-bold text-white">Gerenciar Categorias e Marcas</h1>
        <p className="text-blue-100 mt-2 text-sm">Organize e gerencie as categorias e marcas dos seus produtos</p>
      </div>
    </div>
  );
};

export default Header;