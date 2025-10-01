import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";

interface Brand {
  id?: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  country: string;
  status: string;
}

interface BrandFormProps {
  brand: Brand | null;
  onSubmit: (brand: Brand) => void;
  onCancel: () => void;
  errors: { name?: string; description?: string };
  loading?: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
  brand,
  onSubmit,
  onCancel,
  errors,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Brand>(
    brand || {
      name: "",
      description: "",
      logo: "",
      website: "",
      country: "",
      status: "active",
    }
  );

  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) onSubmit(formData);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "engi9_cloudinary");
    data.append("cloud_name", "dernmyl0i");

    try {
      const res = await fetch(
        import.meta.env.VITE_CLOUDINARY_URL || "",
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      setFormData({ ...formData, logo: json.secure_url });
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {brand ? "Editar Marca" : "Nova Marca"}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Marca *
          </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ex: Apple"
              disabled={loading}
            />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://exemplo.com"
            disabled={loading}
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Descreva a marca..."
            disabled={loading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Upload da Logo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo da Marca
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
              disabled={uploading || loading}
            />
            {uploading && (
              <span className="text-blue-600 text-sm animate-pulse">A carregar...</span>
            )}
          </div>
          {formData.logo && (
            <div className="mt-3 flex items-center space-x-3">
              <img
            src={formData.logo}
            alt="Logo Preview"
            className="w-20 h-20 object-contain border rounded-md bg-gray-50"
              />
              <button
            type="button"
            onClick={() => setFormData({ ...formData, logo: "" })}
            className="text-red-500 hover:text-red-700 text-xs underline"
            title="Remover logo"
              >
            Remover
              </button>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="md:col-span-2 flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center"><Save className="h-4 w-4 mr-2 animate-spin" /> Salvando...</span>
            ) : (
              <><Save className="h-4 w-4 mr-2" />{brand ? "Atualizar" : "Salvar"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandForm;
