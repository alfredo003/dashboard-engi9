import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Search, Upload, Camera, AlertCircle, Save } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import { getBrands } from '../../api/brands';

type Product = {
  id?: string;
  name: string;
  category: string;
  brand: string;
  image: any;
  description?: string;
};

const ProductTableManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'image'>>({
    name: '',
    category: '',
    brand: '',
    description: ''
  });
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const filteredProducts = products.filter(product =>
    (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = async (file: File) => {
    if (image && image.url) {
      URL.revokeObjectURL(image.url);
    }
    setUploading(true);
    setLoading(true); // Set loading for image upload
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'engi9_cloudinary');
    data.append('cloud_name', 'dernmyl0i');
    try {
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL || '', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      setImage({
        file,
        url: json.secure_url,
        name: file.name
      });
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    } catch (error) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
      setLoading(false); // Clear loading after upload
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    if (image && image.url) {
      URL.revokeObjectURL(image.url);
      setImage(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description || ''
    });
    if (product.image) {
      setImage(product.image);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setLoading(true); // Set loading for delete
      try {
        await deleteProduct(id);
        const prods: Product[] = [];
        const snap = await getProducts();
        snap.forEach((doc: any) => {
          const data = doc.data();
          prods.push({
            id: doc.id,
            name: data.name || '',
            category: data.category || '',
            brand: data.brand || '',
            image: data.image || null,
            description: data.description || ''
          });
        });
        setProducts(prods);
      } catch (error) {
        alert('Erro ao excluir produto');
      } finally {
        setLoading(false); // Clear loading after delete
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData.brand) newErrors.brand = 'Marca é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (uploading) return;
    setLoading(true); // Set loading for submit
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id!, {
          ...formData,
          image: image ? image.url : ''
        });
      } else {
        await addProduct({
          ...formData,
          image: image ? image.url : ''
        });
      }

      const prods: Product[] = [];
      const snap = await getProducts();
      snap.forEach((doc: any) => {
        const data = doc.data();
        prods.push({
          id: doc.id,
          name: data.name || '',
          category: data.category || '',
          brand: data.brand || '',
          image: data.image || null,
          description: data.description || ''
        });
      });
      setProducts(prods);
      closeModal();
    } catch (err) {
      alert('Erro ao salvar produto');
    } finally {
      setLoading(false); // Clear loading after submit
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      description: ''
    });
    if (image && image.url) {
      URL.revokeObjectURL(image.url);
      setImage(null);
    }
    setErrors({});
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      description: ''
    });
    setImage(null);
    setErrors({});
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchAll() {
      setLoading(true); // Set loading for initial fetch
      try {
        const prods: Product[] = [];
        const snap = await getProducts();
        snap.forEach((doc: any) => {
          const data = doc.data();
          prods.push({
            id: doc.id,
            name: data.name || '',
            category: data.category || '',
            brand: data.brand || '',
            image: data.image || null,
            description: data.description || ''
          });
        });
        setProducts(prods);

        const catSnap = await getCategories();
        const catList: string[] = [];
        catSnap.forEach((doc: any) => {
          const data = doc.data();
          if (data.name) catList.push(data.name);
        });
        setCategories(catList);

        const brandSnap = await getBrands();
        const brandList: string[] = [];
        brandSnap.forEach((doc: any) => {
          const data = doc.data();
          if (data.name) brandList.push(data.name);
        });
        setBrands(brandList);
      } catch (error) {
        alert('Erro ao carregar dados');
      } finally {
        setLoading(false); // Clear loading after fetch
      }
    }
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-28">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciamento de Produtos</h1>
          <p className="text-gray-600">Visualize, edite e gerencie todos os seus produtos</p>
        </div>

        {/* Loading Spinner for Fetch and Delete Operations */}
        {loading && (
          <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700 font-medium">Carregando...</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={loading} // Disable search input during loading
              />
            </div>
            <button
              onClick={openAddModal}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              disabled={loading} // Disable button during loading
            >
              <Plus className="h-5 w-5" />
              <span>Adicionar Produto</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FOTO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <img src={product.image} alt="" width={0} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Activo
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                            disabled={loading} 
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => product.id && handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                            disabled={loading} 
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} produtos
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                disabled={loading} // Disable close button during loading
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Camera className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Imagem do Produto</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                      dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload className="mx-auto h-9 w-9 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Arraste uma imagem ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500 mb-4">PNG, JPG até 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          await handleImageUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading || loading} // Disable input during loading
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block text-sm font-medium"
                    >
                      Selecionar Imagem
                    </label>
                  </div>

                  {image ? (
                    <div className="space-y-3">
                      <div className="relative group">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                          disabled={uploading || loading} // Disable remove button during loading
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 text-center">{image.name}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Nenhuma imagem selecionada</p>
                      </div>
                    </div>
                  )}
                </div>

                {errors.image && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Informações do Produto</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Produto *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Digite o nome do produto"
                      disabled={loading} // Disable input during loading
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value });
                        if (errors.category) setErrors({ ...errors, category: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.category ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={loading} // Disable select during loading
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Marca *</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => {
                        setFormData({ ...formData, brand: e.target.value });
                        if (errors.brand) setErrors({ ...errors, brand: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.brand ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={loading} // Disable select during loading
                    >
                      <option value="">Selecione uma marca</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                    {errors.brand && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.brand}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrição detalhada do produto..."
                    disabled={loading} // Disable textarea during loading
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-8 py-4 rounded-b-xl flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                disabled={loading} // Disable cancel button during loading
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:opacity-60"
                disabled={uploading || loading} // Disable submit button during loading
              >
                {uploading ? (
                  <span className="flex items-center"><Save className="h-5 w-5 mr-2 animate-spin" /> Salvando imagem...</span>
                ) : loading ? (
                  <span className="flex items-center"><Save className="h-5 w-5 mr-2 animate-spin" /> Salvando...</span>
                ) : (
                  <><Save className="h-5 w-5 mr-2" />{editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTableManager;