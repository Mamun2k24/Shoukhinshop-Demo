const DEFAULT_CURRENCY = "BDT";

const isBrowser = typeof window !== "undefined";

export const trackPixel = (eventName, data = {}) => {
  if (!isBrowser) return;

  const payload = {
    currency: DEFAULT_CURRENCY,
    ...data,
  };

  console.log("PIXEL EVENT:", eventName, payload);

  if (window.fbq) {
    window.fbq("track", eventName, payload);
  } else {
    console.warn("Meta Pixel fbq not found");
  }
};

export const trackViewContent = (product) => {
  if (!product?._id) return;

  const price = Number(product.price || product.finalPrice || 0);

  trackPixel("ViewContent", {
    content_name: product.productName,
    content_ids: [product._id],
    content_type: "product",
    value: price,
    contents: [
      {
        id: product._id,
        quantity: 1,
        item_price: price,
      },
    ],
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  if (!product?._id) return;

  const price = Number(product.price || product.finalPrice || 0);

  trackPixel("AddToCart", {
    content_name: product.productName,
    content_ids: [product._id],
    content_type: "product",
    value: price * quantity,
    num_items: quantity,
    contents: [
      {
        id: product._id,
        quantity,
        item_price: price,
      },
    ],
  });
};

export const trackInitiateCheckout = (items = [], total = 0) => {
  const safeItems = Array.isArray(items) ? items : [];

  trackPixel("InitiateCheckout", {
    value: Number(total) || 0,
    content_ids: safeItems.map((item) => item._id || item.productId || item.productId?._id),
    content_type: "product",
    num_items: safeItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0
    ),
    contents: safeItems.map((item) => {
      const id = item._id || item.productId || item.productId?._id;
      const price = Number(item.price || item.itemPrice || 0);
      const quantity = Number(item.quantity) || 1;

      return {
        id,
        quantity,
        item_price: price,
      };
    }),
  });
};

export const trackPurchase = (items = [], total = 0) => {
  const safeItems = Array.isArray(items) ? items : [];

  trackPixel("Purchase", {
    value: Number(total) || 0,
    content_ids: safeItems.map((item) => item._id || item.productId || item.productId?._id),
    content_type: "product",
    num_items: safeItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0
    ),
    contents: safeItems.map((item) => {
      const id = item._id || item.productId || item.productId?._id;
      const price = Number(item.price || item.itemPrice || 0);
      const quantity = Number(item.quantity) || 1;

      return {
        id,
        quantity,
        item_price: price,
      };
    }),
  });
};