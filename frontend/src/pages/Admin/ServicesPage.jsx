import { useState } from "react";
import { LuPlus, LuTag, LuX } from "react-icons/lu";
import categoriesData from "../../data/categories";
import servicesData from "../../data/services";
import PrimaryBtn from "../../components/ui/PrimaryBtn";
import SecondaryBtn from "../../components/ui/SecondaryBtn";

function ServicesPage() {
  const [categories, setCategories] = useState(categoriesData);
  const [servicesList, setServicesList] = useState(servicesData);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");

  const categoryCount = (category) =>
    servicesList.filter((s) => s.category === category).length;

  // add category and service funtions
  const addCategory = () => {
    const name = categoryName.trim();
    if (!name) return;
    setCategories((prev) => [...prev, name]);
    setCategoryName("");
    setShowCategoryModal(false);
  };

  const addService = () => {
    const name = serviceName.trim();
    if (!name || !serviceCategory) return;
    setServicesList((prev) => [
      ...prev,
      { name, category: serviceCategory, status: "active" },
    ]);
    setServiceName("");
    setServiceCategory("");
    setShowServiceModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div className="rounded-2xl bg-blue-600 px-6 py-8 lg:px-10">
        <h1 className="text-2xl font-bold text-white">
          Services &amp; Categories
        </h1>
        <p className="mt-1 text-sm text-blue-100">
          Manage the service categories and services listed on the platform.
        </p>
      </div>

      {/* Categories */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-block h-5 w-1 rounded-full bg-violet-500"></span>
            CATEGORIES
          </h2>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <LuPlus size={14} />
            Add Category
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <LuTag size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {cat}
                </p>
                <p className="text-xs text-gray-500">
                  {categoryCount(cat)} services
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-block h-5 w-1 rounded-full bg-blue-600"></span>
            SERVICES
          </h2>
          <button
            onClick={() => setShowServiceModal(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <LuPlus size={14} />
            Add Service
          </button>
        </div>

        {/* Desktop table */}
        <div className="mt-5 hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  Service Name
                </th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {servicesList.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`border-b border-gray-100 last:border-0 transition hover:bg-blue-50/40 ${idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"}`}
                >
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-900 whitespace-nowrap">
                    {s.name}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-600 whitespace-nowrap">
                    {s.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-5 flex flex-col gap-3 md:hidden">
          {servicesList.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300"
            >
              <p className="truncate text-sm font-semibold text-gray-900">
                {s.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {s.category}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Add Category
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <LuX size={18} />
              </button>
            </div>
            <label className="mt-4 block text-xs font-medium text-gray-600">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Gardening"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-50"
            />
            <div className="mt-6 flex justify-end gap-3">
              <SecondaryBtn
                btn="Cancel"
                onclick={() => setShowCategoryModal(false)}
                className="text-gray-600! border-gray-200! bg-gray-50! hover:bg-gray-100! hover:text-gray-800!"
              />
              <PrimaryBtn btn="Add Category" onclick={addCategory} />
            </div>
          </div>
        </div>
      )}

      {/* Add Service modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Add Service
              </h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <LuX size={18} />
              </button>
            </div>
            <label className="mt-4 block text-xs font-medium text-gray-600">
              Service Name
            </label>
            <input
              type="text"
              placeholder="e.g. Car Wash"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-50"
            />
            <label className="mt-4 block text-xs font-medium text-gray-600">
              Category
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-50"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <SecondaryBtn
                btn="Cancel"
                onclick={() => setShowServiceModal(false)}
                className="text-gray-600! border-gray-200! bg-gray-50! hover:bg-gray-100! hover:text-gray-800!"
              />
              <PrimaryBtn btn="Add Service" onclick={addService} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesPage;
