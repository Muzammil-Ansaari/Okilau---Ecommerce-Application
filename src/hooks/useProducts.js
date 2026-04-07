import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.size) params.append("size", filters.size);
        if (filters.color) params.append("color", filters.color);
        if (filters.sort) params.append("sort", filters.sort);

        const { data } = await axiosInstance.get(`/products?${params}`);
        console.log("fetched Products: ", data);
        setProducts(data);
      } catch (error) {
        console.error("error: ", error);
        setError(
          error.response?.data?.message || "Failed to fetch the products",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.size, filters.color, filters.sort]);

  return { products, loading, error };
};

export default useProducts;
