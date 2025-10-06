import { useState, useEffect } from 'react';
import { getCategories, addCategory, updateItem as updateCategory, deleteItem as deleteCategory } from '../../../api/categories';
import { getBrands, addBrands, updateBrands, deleteBrands } from '../../../api/brands';
import Header from './Header';
import Tabs from './Tabs';
import CategoryForm from '../../components/CategoryForm';
import BrandForm from '../../components/BrandForm';
import CategoryList from '../../components/CategoryList';
import BrandList from '../../components/BrandList';
import SearchBar from './SearchBar';

type Category = {
  id?: string;
  name: string;
  description: string;
  icon: string; 
  status: string;
  productsCount?: number;
  createdAt?: string;
};

type Brand = {
  id?: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  country: string;
  status: string;
  productsCount?: number;
  createdAt?: string;
};

const CategoryBrandManagement = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<string | null>(null);

const fetchCategories = async () => {
  setLoadingCategories(true);
  try {

    const cached = localStorage.getItem("categories");
    if (cached) {
      setCategories(JSON.parse(cached));
    }

    const cats: Category[] = [];
    const catSnap = await getCategories();
    catSnap.forEach((doc: any) => {
      cats.push({ id: doc.id, ...doc.data() });
    });
    setCategories(cats);
    localStorage.setItem("categories", JSON.stringify(cats));
  } finally {
    setLoadingCategories(false);
  }
};

const fetchBrands = async () => {
  setLoadingBrands(true);
  try {
    const cached = localStorage.getItem("brands");
    if (cached) {
      setBrands(JSON.parse(cached));
    }

    // busca da API e atualiza cache
    const brs: Brand[] = [];
    const brandSnap = await getBrands();
    brandSnap.forEach((doc: any) => {
      brs.push({ id: doc.id, ...doc.data() });
    });
    setBrands(brs);
    localStorage.setItem("brands", JSON.stringify(brs));
  } finally {
    setLoadingBrands(false);
  }
};


  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const handleCategorySubmit = async (category: Category) => {
    const newErrors: { name?: string; description?: string } = {};
    if (!category.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!category.description.trim()) newErrors.description = 'Descrição é obrigatória';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSavingCategory(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id!, category);
      } else {
        await addCategory(category);
      }
      await fetchCategories();
      setEditingCategory(null);
      setShowCategoryForm(false);
      setErrors({});
    } catch (err) {
      alert('Erro ao salvar categoria');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleBrandSubmit = async (brand: Brand) => {
    const newErrors: { name?: string; description?: string } = {};
    if (!brand.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!brand.description.trim()) newErrors.description = 'Descrição é obrigatória';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSavingBrand(true);
    try {
      if (editingBrand) {
        await updateBrands(editingBrand.id!, brand);
      } else {
        await addBrands(brand);
      }
      await fetchBrands();
      setEditingBrand(null);
      setShowBrandForm(false);
      setErrors({});
    } catch (err) {
      alert('Erro ao salvar marca');
    } finally {
      setSavingBrand(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setDeletingCategory(id);
      try {
        await deleteCategory(id);
        await fetchCategories();
      } finally {
        setDeletingCategory(null);
      }
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta marca?')) {
      setDeletingBrand(id);
      try {
        await deleteBrands(id);
        await fetchBrands();
      } finally {
        setDeletingBrand(null);
      }
    }
  };

  const handleCancel = () => {
    setShowCategoryForm(false);
    setShowBrandForm(false);
    setEditingCategory(null);
    setEditingBrand(null);
    setErrors({});
  };

  const filteredCategories = categories.filter(category =>
    (category.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBrands = brands.filter(brand =>
    (brand.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categoriesCount={categories.length}
          brandsCount={brands.length}
        />

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Buscar categorias..."
              onAdd={() => setShowCategoryForm(true)}
              addLabel="Nova Categoria"
            />

            {loadingCategories ? (
              <p className="text-gray-500">Carregando categorias...</p>
            ) : (
              <>
                {showCategoryForm && (
                  <CategoryForm
                    category={editingCategory}
                    onSubmit={handleCategorySubmit}
                    onCancel={handleCancel}
                    errors={errors}
                    loading={savingCategory}
                  />
                )}
                <CategoryList
                  categories={filteredCategories}
                  onEdit={setEditingCategory}
                  onDelete={handleDeleteCategory}
                  searchTerm={searchTerm}
                  onAdd={() => setShowCategoryForm(true)}
                  deletingId={deletingCategory}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'brands' && (
          <div className="space-y-6">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Buscar marcas..."
              onAdd={() => setShowBrandForm(true)}
              addLabel="Nova Marca"
            />

            {loadingBrands ? (
              <p className="text-gray-500">Carregando marcas...</p>
            ) : (
              <>
                {showBrandForm && (
                  <BrandForm
                    brand={editingBrand}
                    onSubmit={handleBrandSubmit}
                    onCancel={handleCancel}
                    errors={errors}
                    loading={savingBrand}
                  />
                )}
                <BrandList
                  brands={filteredBrands}
                  onEdit={setEditingBrand}
                  onDelete={handleDeleteBrand}
                  searchTerm={searchTerm}
                  onAdd={() => setShowBrandForm(true)}
                  deletingId={deletingBrand}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBrandManagement;