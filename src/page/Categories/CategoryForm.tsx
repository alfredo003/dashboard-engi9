import React, { useState } from 'react';
import { X, Save, AlertCircle, Gauge, Zap, EvCharger, Cog, Drill, Droplet, Factory, FireExtinguisher, Settings } from 'lucide-react';

interface Category {
  id?: string;
  name: string;
  description: string;
  icon: string;
  status: string;
}

interface CategoryFormProps {
  category: Category | null;
  onSubmit: (category: Category) => void;
  onCancel: () => void;
  errors: { name?: string; description?: string };
  loading?: boolean;
}

const iconOptions = [
  { name: 'Gauge', component: Gauge },
  { name: 'Zap', component: Zap },
  { name: 'EvCharger', component: EvCharger },
  { name: 'Cog', component: Cog },
  { name: 'Drill', component: Drill },
  { name: 'Droplet', component: Droplet },
  { name: 'Factory', component: Factory },
  { name: 'FireExtinguisher', component: FireExtinguisher },
  { name: 'Settings', component: Settings },
];

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel, errors, loading = false }) => {
  const [formData, setFormData] = useState<Category>(
    category || {
      name: '',
      description: '',
      icon: '',
      status: 'active',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{category ? 'Editar Categoria' : 'Nova Categoria'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Categoria *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Eletrônicos"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descreva a categoria..."
            disabled={loading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
  {iconOptions.map((Icon, index) => (
    <button
      key={index}
      type="button"
      onClick={() => setFormData({ ...formData, icon: Icon.name })}
      className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-200
        ${
          formData.icon === Icon.name
            ? 'border-blue-500 bg-blue-100 shadow-md scale-105'
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
        }`}
    >
      <Icon.component
        className={`w-6 h-6 ${
          formData.icon === Icon.name ? 'text-blue-600' : 'text-gray-600'
        }`}
      />
    </button>
  ))}
</div>

        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center"><Save className="h-4 w-4 mr-2 animate-spin" /> Salvando...</span>
          ) : (
            <><Save className="h-4 w-4 mr-2" />{category ? 'Atualizar' : 'Salvar'}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;