"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <header className="mb-8">
            <h1 className="text-heading-1 text-dark-900 mb-2">Shopping Cart</h1>
            <p className="text-body text-dark-700">Your cart is empty</p>
          </header>

          <div className="text-center py-12">
            <div className="mb-6">
              <svg 
                className="mx-auto h-24 w-24 text-light-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
                />
              </svg>
            </div>
            <h2 className="text-heading-2 text-dark-900 mb-4">Your cart is empty</h2>
            <p className="text-body text-dark-700 mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:opacity-90"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <header className="mb-8">
          <h1 className="text-heading-1 text-dark-900 mb-2">Shopping Cart</h1>
          <p className="text-body text-dark-700">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-light-300 bg-light-100 p-4"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-light-200">
                    <Image
                      src={item.image || "/shoes/shoe-1.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-medium text-dark-900 truncate">{item.name}</h3>
                    <p className="text-body text-dark-700">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-light-300 bg-light-100 text-dark-700 hover:bg-light-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="w-12 text-center text-body-medium text-dark-900">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-light-300 bg-light-100 text-dark-700 hover:bg-light-200 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-body-medium text-dark-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-caption text-dark-700 hover:text-dark-900 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={clearCart}
                className="text-body text-dark-700 hover:text-dark-900 transition-colors underline"
              >
                Clear Cart
              </button>
              <Link
                href="/products"
                className="text-body text-dark-700 hover:text-dark-900 transition-colors underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-light-300 bg-light-100 p-6">
              <h2 className="text-heading-3 text-dark-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-body text-dark-700">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-body text-dark-700">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-light-300 pt-3">
                  <div className="flex justify-between text-body-medium text-dark-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:opacity-90 disabled:opacity-50"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>

              <p className="mt-3 text-center text-caption text-dark-700">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
