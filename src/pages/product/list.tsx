import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
  type Product,
} from "../../api/product";
import { useProductCategoryOptions } from "../../api/productCategory";
import ProductTableRow from "../../components/product/ProductTableRow";
import ProductDetailDrawer from "../../components/product/ProductDetailDrawer";
import ProductSalesAnalyticsDrawer from "../../components/product/ProductSalesAnalyticsDrawer";
import ConfirmDeleteModal from "../../components/global/ConfirmDeleteModal";
import DashboardLayout from "../../components/global/DashboardLayout";
import FilterDropdown, {
  type FilterDropdownOption,
} from "../../components/global/FilterDropdown";
import DynamicLucideIcon from "../../icon/DynamicLucideIcon";
import PageHeader from "../../components/global/PageHeader";

const PAGE_SIZE = 15;

type ProductStatusValue = "active" | "inactive";

const STATUS_OPTIONS: FilterDropdownOption<ProductStatusValue>[] = [
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

export default function ProductList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProductStatusValue | null>(null);
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToView, setProductToView] = useState<Product | null>(null);
  const [productToAnalyze, setProductToAnalyze] = useState<Product | null>(
    null,
  );

  const { data, isLoading } = useProducts({
    search: search.trim() || undefined,
    filter: [
      ...(categoryId
        ? [
            {
              key: "category_id" as const,
              operator: "equal" as const,
              value: categoryId,
            },
          ]
        : []),
      ...(status
        ? [
            {
              key: "active" as const,
              operator: "equal" as const,
              value: status === "active",
            },
          ]
        : []),
    ],
    sort: "created_at",
    order: "desc",
    page,
    limit: PAGE_SIZE,
  });

  const categoryOptions = useProductCategoryOptions();

  const products = data?.data ?? [];
  const totalProducts = (data?.total_active ?? 0) + (data?.total_inactive ?? 0);
  const activeProducts = data?.total_active ?? 0;
  const inactiveProducts = data?.total_inactive ?? 0;

  const deleteProductMutation = useDeleteProduct();

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        setProductToDelete(null);
        setProductToView((current) =>
          current?.id === productToDelete.id ? null : current,
        );
      },
    });
  };

  const updateProductMutation = useUpdateProduct();

  const handleToggleActive = (product: Product) => {
    updateProductMutation.mutate(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        category_id: product.category_id,
        unit: product.unit,
        cost_price: Number(product.cost_price),
        sell_price: Number(product.sell_price),
        stock: product.stock,
        description: product.description ?? undefined,
        active: !product.active,
      },
      {
        onSuccess: (response) => {
          setProductToView((current) =>
            current?.id === product.id ? response.data : current,
          );
        },
      },
    );
  };

  const totalPages = data?.meta.total_pages ?? 1;
  const currentPage = data?.meta.page ?? page;
  const rangeStart =
    products.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = rangeStart === 0 ? 0 : rangeStart + products.length - 1;

  return (
    <DashboardLayout pageTitle="Produk">
      <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
        <PageHeader
          title="Produk"
          description="Kelola produk yang tersedia di bisnis Anda."
          actionLabel="Tambah Produk"
          onAction={() => navigate("/product/create")}
        />

        <div className="flex w-full items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e9e9ea] bg-white p-3">
            <DynamicLucideIcon
              name="search"
              size={18}
              className="text-[#8f99a7]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama produk atau SKU...."
              className="w-full text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:outline-none"
            />
          </div>

          <FilterDropdown
            allLabel="Semua Kategori"
            searchPlaceholder="Cari kategori..."
            options={categoryOptions}
            value={categoryId}
            onChange={(value) => {
              setCategoryId(value);
              setPage(1);
            }}
          />

          <FilterDropdown
            allLabel="Semua Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex w-full items-center gap-2">
          <p className="text-[13px] leading-[1.4] font-medium whitespace-nowrap text-[#4e5bd6]">
            {totalProducts} Produk
          </p>
          <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
          <p className="text-[13px] leading-[1.4] whitespace-nowrap text-[#1fa971]">
            {activeProducts} Aktif
          </p>
          <span className="size-[5px] shrink-0 rounded-full bg-[#d0d5dc]" />
          <p className="text-[13px] leading-[1.4] whitespace-nowrap text-[#94a3b8]">
            {inactiveProducts} Nonaktif
          </p>
        </div>

        <div className="flex w-full flex-col items-start overflow-hidden rounded-xl border border-[#ebedf1] bg-white">
          <div className="flex w-full items-center border-b border-[#ebedf1] bg-[#fafafb]">
            <div className="flex-1 px-4 py-2.5">
              <p className="text-xs font-medium text-[#797c81]">Produk</p>
            </div>
            <div className="w-[130px] shrink-0 px-4 py-2.5">
              <p className="text-xs font-medium text-[#797c81]">Kategori</p>
            </div>
            <div className="w-[120px] shrink-0 px-4 py-2.5">
              <p className="text-xs font-medium text-[#797c81]">Harga</p>
            </div>
            <div className="w-[90px] shrink-0 px-4 py-2.5">
              <p className="text-xs font-medium text-[#797c81]">Stok</p>
            </div>
            <div className="w-[120px] shrink-0 px-4 py-2.5">
              <p className="text-xs font-medium text-[#797c81]">Status</p>
            </div>
            <div className="w-[56px] shrink-0 px-4 py-2.5 text-right">
              <p className="text-xs font-medium text-[#797c81]">Aksi</p>
            </div>
          </div>

          {!isLoading && products.length === 0 && (
            <p className="w-full py-10 text-center text-sm text-[#8f99a7]">
              Tidak ada produk ditemukan
            </p>
          )}

          {products.map((product, index) => (
            <ProductTableRow
              key={product.id}
              product={product}
              isAlternate={index % 2 === 1}
              onEdit={() => navigate(`/product/${product.id}/update`)}
              onViewDetail={() => setProductToView(product)}
              onViewSalesAnalytics={() => setProductToAnalyze(product)}
              onDelete={() => setProductToDelete(product)}
            />
          ))}
        </div>

        <div className="flex w-full items-center justify-between pt-1">
          <p className="text-[13px] leading-[normal] whitespace-nowrap text-[#6a7789]">
            Menampilkan {rangeStart}–{rangeEnd} dari {data?.meta.total ?? 0}{" "}
            produk
          </p>

          <div className="flex items-stretch overflow-hidden rounded-[10px] border border-[#ebedf1] bg-white">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber, i) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`flex items-center justify-center px-3 py-2 text-[12.5px] whitespace-nowrap ${
                    i > 0 ? "border-l border-[#ebedf1]" : ""
                  } ${
                    pageNumber === currentPage
                      ? "bg-[#eff0f3] font-semibold text-[#a6abb4]"
                      : "font-medium text-[#4e5bd6] hover:bg-[#f7f8fc]"
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <ProductDetailDrawer
        product={productToView}
        onClose={() => setProductToView(null)}
        onToggleActive={() =>
          productToView && handleToggleActive(productToView)
        }
        onEdit={() =>
          productToView && navigate(`/product/${productToView.id}/update`)
        }
        onDelete={() => productToView && setProductToDelete(productToView)}
      />

      <ProductSalesAnalyticsDrawer
        product={productToAnalyze}
        onClose={() => setProductToAnalyze(null)}
      />

      <ConfirmDeleteModal
        open={productToDelete !== null}
        itemName={productToDelete?.name ?? ""}
        entityLabel="produk"
        description={
          <>
            Produk <span className="font-medium">{productToDelete?.name}</span>{" "}
            akan dihapus secara permanen dari katalog, tindakan ini tidak dapat
            dibatalkan.
          </>
        }
        isLoading={deleteProductMutation.isPending}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
}
