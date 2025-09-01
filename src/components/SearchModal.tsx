"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components";
import { getAllProducts } from "@/lib/actions/product";
import { parseFilterParams } from "@/lib/utils/query";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{
    id: string;
    name: string;
    subtitle?: string;
    imageUrl?: string;
    minPrice?: number;
    maxPrice?: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const filters = parseFilterParams({ search: searchQuery });
      const { products } = await getAllProducts(filters);
      setResults(products.slice(0, 6)); // Limit to 6 results for the modal
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl mt-20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-2 text-dark-900">Search Products</h2>
            <button
              onClick={onClose}
              className="text-dark-700 hover:text-dark-900 transition-colors"
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for products..."
                className="w-full px-4 py-3 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-dark-700 hover:text-dark-900 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900 mx-auto"></div>
                <p className="text-body text-dark-700 mt-2">Searching...</p>
              </div>
            )}

            {!isLoading && hasSearched && results.length === 0 && query.trim() && (
              <div className="text-center py-8">
                <p className="text-body text-dark-700">No products found for "{query}"</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div>
                <h3 className="text-body-medium text-dark-900 mb-4">
                  Quick Results ({results.length})
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {results.map((product) => {
                    const price =
                      product.minPrice !== null && product.maxPrice !== null && product.minPrice !== product.maxPrice
                        ? `$${product.minPrice.toFixed(2)} - $${product.maxPrice.toFixed(2)}`
                        : product.minPrice !== null
                        ? product.minPrice
                        : undefined;
                    
                    return (
                      <Card
                        key={product.id}
                        title={product.name}
                        subtitle={product.subtitle ?? undefined}
                        imageSrc={product.imageUrl ?? "/shoes/shoe-1.jpg"}
                        price={price}
                        href={`/products/${product.id}`}
                        className="!ring-1 !ring-light-300 hover:!ring-dark-500"
                      />
                    );
                  })}
                </div>
                {results.length >= 6 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                        onClose();
                      }}
                      className="text-body-medium text-dark-900 hover:text-dark-700 underline"
                    >
                      View all results
                    </button>
                  </div>
                )}
              </div>
            )}

            {!hasSearched && !isLoading && (
              <div className="text-center py-8">
                <p className="text-body text-dark-700">Start typing to search for products</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
