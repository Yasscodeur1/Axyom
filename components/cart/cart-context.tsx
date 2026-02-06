"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isSubscriber: boolean;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { product: Product; quantity: number; size: string; color: string };
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size: string; color: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; size: string; color: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_SUBSCRIPTION" }
  | { type: "LOAD_CART"; payload: CartState };

const CART_STORAGE_KEY = "axyom_cart";

// Fonction pour charger le panier depuis localStorage
function loadCartFromStorage(): CartState {
  if (typeof window === "undefined") return initialState;
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return initialState;
    
    const parsed = JSON.parse(stored);
    return {
      items: parsed.items || [],
      isSubscriber: parsed.isSubscriber || false,
    };
  } catch (error) {
    console.error("Erreur lors du chargement du panier:", error);
    return initialState;
  }
}

// Fonction pour sauvegarder le panier dans localStorage
function saveCartToStorage(state: CartState): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du panier:", error);
  }
}

const initialState: CartState = {
  items: [],
  isSubscriber: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.payload.product,
            quantity: action.payload.quantity,
            size: action.payload.size,
            color: action.payload.color,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product.id === action.payload.productId &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            )
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === action.payload.productId &&
                item.size === action.payload.size &&
                item.color === action.payload.color
              )
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_SUBSCRIPTION":
      return { ...state, isSubscriber: !state.isSubscriber };
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isSubscriber: boolean;
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleSubscription: () => void;
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  amountUntilFreeShipping: number;
  hasFreeShipping: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.items.length > 0 || savedCart.isSubscriber) {
      dispatch({ type: "LOAD_CART", payload: savedCart });
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  const addItem = useCallback(
    (product: Product, quantity: number, size: string, color: string) => {
      dispatch({ type: "ADD_ITEM", payload: { product, quantity, size, color } });
    },
    []
  );

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, size, color } });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, color, quantity } });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const toggleSubscription = useCallback(() => {
    dispatch({ type: "TOGGLE_SUBSCRIPTION" });
  }, []);

  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [state.items]
  );

  const hasFreeShipping = state.isSubscriber || subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = hasFreeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const value = useMemo(
    () => ({
      items: state.items,
      isSubscriber: state.isSubscriber,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleSubscription,
      subtotal,
      shippingCost,
      total,
      itemCount,
      amountUntilFreeShipping,
      hasFreeShipping,
    }),
    [
      state.items,
      state.isSubscriber,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleSubscription,
      subtotal,
      shippingCost,
      total,
      itemCount,
      amountUntilFreeShipping,
      hasFreeShipping,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
