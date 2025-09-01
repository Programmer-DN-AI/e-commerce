"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  image?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ 
  productId, 
  productName, 
  price, 
  image, 
  disabled = false 
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled) return;
    
    setIsAdding(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addItem({
      id: productId,
      name: productName,
      price: price,
      image: image,
    });
    
    setIsAdding(false);
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className="flex items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingBag className="h-5 w-5" />
      {isAdding ? "Adding..." : "Add to Bag"}
    </button>
  );
}
