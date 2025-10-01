import React from 'react';
import { Tag, Edit, Trash2 } from 'lucide-react';
import { Gauge, Zap, EvCharger, Cog, Drill, Droplet, Factory, FireExtinguisher, Settings } from 'lucide-react';

interface Category {
  id?: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: string;
  productsCount?: number;
  createdAt?: string;
}

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Gauge,
  Zap,
  EvCharger,
  Cog,
  Drill,
  Droplet,
  Factory,
  FireExtinguisher,
  Settings,
};

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  onAdd: () => void;
  deletingId?: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete, searchTerm, onAdd, deletingId }) => {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
        </h3>
        <p className="text-gray-600 mb-6">
          {searchTerm
            ? 'Tente buscar por outros termos ou limpe o filtro de busca'
            : 'Comece criando sua primeira categoria para organizar melhor seus produtos'}
        </p>
        {!searchTerm && (
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <Tag className="h-4 w-4 mr-2" />
            Criar Primeira Categoria
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon];
        return (
          <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `#101828 `, color: '#ffff' }}
                >
                  {IconComponent ? <IconComponent className="w-6 h-6" /> : category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(category)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                  disabled={!!deletingId}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(category.id!)}
                  className={`p-1 text-gray-400 hover:text-red-600 ${deletingId === category.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={deletingId === category.id}
                  title={deletingId === category.id ? 'Excluindo...' : 'Excluir'}
                >
                  {deletingId === category.id ? (
                    <span className="flex items-center"><Trash2 className="h-4 w-4 animate-spin mr-1" />Excluindo...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{category.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{category.productsCount || 0} produtos</span>
              <span className="text-gray-500">
                Criada em {category.createdAt ? new Date(category.createdAt).toLocaleDateString('pt-BR') : '-'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;