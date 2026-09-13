import { CheckCircle,FileText } from "lucide-react";
import HeaderSection from "../../components/HeaderSection/HeaderSection";
import { useCallback, useEffect, useState } from "react";
import SectionCards from "../../components/SectionCards/SectionCards";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination/Pagination";
import {
  activateProduct,
  createProduct,
  deactivateProduct,
  getProductIndicators,
  getProducts,
  updateProduct,
} from "../../services/productService";
import ProductTable from "./Components/ProductTable";
import ProductFormDrawer from "./Components/ProductFormDrawer";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState();
  const [productIndicators, setProductIndicators] = useState({});
  const [fieldErrors, setFieldErrors] = useState();
  const [loadingStatusIds, setLoadingStatusIds] = useState([]);
  const [search, setSearch] = useState({
    search: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const INITIAL_FORM = {
    name: "",
    type: "SERVICE",
    price: "",
  };

  const [form, setForm] = useState(INITIAL_FORM);

  const cleanForm = () => {
    setForm(INITIAL_FORM);
    setEditingProduct(null);
    setIsDrawerOpen(false);
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
     
      const cleanValue = value.replace(/\D/g, "");
      const numericValue = cleanValue ? Number(cleanValue) / 100 : "";

      setForm((prev) => ({
        ...prev,
        price: numericValue,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name ?? "",
      type: product.type ?? "SERVICE",
      price: product.price,
    });

    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await updateProduct(form, editingProduct.id);
        toast.success("Produto/servico alterado com sucesso!");
      } else {
        await createProduct(form);
        toast.success("Produto/servico criado com sucesso!");
      }

      cleanForm();
      loadProducts();
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
      setFieldErrors(error.response?.data.fieldErrors);
    }
  };

  const handleSearch = async (currentFilters) => {
    setSearch(currentFilters);
    setPage(0);
  };

  const loadProducts = useCallback(async () => {
    try {
      const productResponse = await getProducts({
        search,
        size,
        page,
      });
      const indicatorsResponse = await getProductIndicators();

      setProducts(productResponse?.content || productResponse || []);
      setTotalPages(productResponse?.totalPages || 0);
      setProductIndicators(indicatorsResponse || 0);
    } catch (error) {
      console.log(error);
    }
  }, [search, page, size]);;

  const handleToggleStatus = async (id, currentActiveState) => {
    setLoadingStatusIds((prev) => [...prev, id]);

    try {
      if (currentActiveState) {
        await deactivateProduct(id);
      } else {
        await activateProduct(id);
      }
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id ? { ...prod, active: !currentActiveState } : prod,
        ),
      );
    } catch (error) {
      const mensagemDoBackend = error.response?.data?.message || error.message;
      toast.error(mensagemDoBackend || "Erro ao conectar com o servidor.");
    } finally {
      setLoadingStatusIds((prev) =>
        prev.filter((loadingId) => loadingId !== id),
      );
    }
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts, loadingStatusIds]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-sidebar-background">
      <HeaderSection
        title={"Serviços e Produtos"}
        subtile={
          "Gerencie os serviços oferecidos e produtos utilizados no seu negócio"
        }
        buttonText={"Novo item"}
        onClick={() => {
          setIsDrawerOpen(true);
        }}
        onChange={handleSearch}
      />

      <section className="flex flex-1 flex-col gap-12 p-6 rounded-t-2xl bg-background">
        <SectionCards
          cards={[
            {
              label: "Total de items",
              data: productIndicators.totalProducts,
              icon: <FileText />,
            },
            {
              label: "Itens ativos",
              data: productIndicators.totalActive,
              icon: <CheckCircle />,
            },
          ]}
        />
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onStatusChange={handleToggleStatus}
          loadingIds={loadingStatusIds}
          onSearch={handleSearch}
        />
        <ProductFormDrawer
          open={isDrawerOpen}
          form={form}
          onSubmit={handleSubmit}
          editing={editingProduct}
          onChange={handleChange}
          onClose={() => {
            cleanForm();
          }}
          errors={fieldErrors}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onSizeChange={setSize}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
