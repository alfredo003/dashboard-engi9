import React from 'react';
import { Tag, Award } from 'lucide-react';

interface TabsProps {
  activeTab: 'categories' | 'brands';
  setActiveTab: (tab: 'categories' | 'brands') => void;
  categoriesCount: number;
  brandsCount: number;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, categoriesCount, brandsCount }) => {
  return (
    <div className="bg-white shadow-lg overflow-hidden mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-8 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'categories'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            Categorias ({categoriesCount})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`py-4 px-8 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'brands'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Award className="h-4 w-4 inline mr-2" />
            Marcas ({brandsCount})
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Tabs;