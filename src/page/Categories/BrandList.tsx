import React from 'react';
import { Award, Edit, Trash2 } from 'lucide-react';

interface Brand {
  id?: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  country: string;
  status: string;
  productsCount?: number;
  createdAt?: string;
}

interface BrandListProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  onAdd: () => void;
  deletingId?: string | null;
}

const BrandList: React.FC<BrandListProps> = ({ brands, onEdit, onDelete, searchTerm, onAdd, deletingId }) => {
  if (brands.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm ? 'Nenhuma marca encontrada' : 'Nenhuma marca cadastrada'}
        </h3>
        <p className="text-gray-600 mb-6">
          {searchTerm
            ? 'Tente buscar por outros termos ou limpe o filtro de busca'
            : 'Comece criando sua primeira marca para organizar melhor seus produtos'}
        </p>
        {!searchTerm && (
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <Award className="h-4 w-4 mr-2" />
            Criar Primeira Marca
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand) => (
        <div key={brand.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                ) : (
                  <Award className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    brand.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {brand.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(brand)}
                className="p-1 text-gray-400 hover:text-blue-600"
                disabled={!!deletingId}
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(brand.id!)}
                className={`p-1 text-gray-400 hover:text-red-600 ${deletingId === brand.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={deletingId === brand.id}
                title={deletingId === brand.id ? 'Excluindo...' : 'Excluir'}
              >
                {deletingId === brand.id ? (
                  <span className="flex items-center"><Trash2 className="h-4 w-4 animate-spin mr-1" />Excluindo...</span>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{brand.description}</p>
          <div className="space-y-2 mb-4">
            {brand.country && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">País:</span>
                <span className="ml-2">{brand.country}</span>
              </div>
            )}
            {brand.website && (
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-600">Website:</span>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 truncate"
                >
                  {brand.website.replace('https://', '')}
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm border-t pt-3">
            <span className="text-gray-500">{brand.productsCount} produtos</span>
            <span className="text-gray-500">
              Criada em {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandList;