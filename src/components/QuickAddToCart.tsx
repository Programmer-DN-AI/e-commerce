"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface QuickAddToCartProps {
  productId: string;
  productName: string;
  price: number | string;
  image?: string;
  disabled?: boolean;
  className?: string;
}

export default function QuickAddToCart({ 
  productId, 
  productName, 
  price, 
  image, 
  disabled = false,
  className = ""
}: QuickAddToCartProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsAdding(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    
    addItem({
      id: productId,
      name: productName,
      price: numericPrice,
      image: image,
    });
    
    setIsAdding(false);
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={`absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-dark-900 text-light-100 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={`Add ${productName} to cart`}
    >
      <ShoppingBag className="h-5 w-5" />
    </button>
  );
}
