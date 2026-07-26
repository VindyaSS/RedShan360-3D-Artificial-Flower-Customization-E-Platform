const BACKEND_BASE_URL = "http://localhost:8080";

export const getProductImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "/images/product-placeholder.png";
  }

  const normalizedPath = imageUrl.replace(/\\/g, "/").trim();

  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://")
  ) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith("/uploads/")) {
    return `${BACKEND_BASE_URL}${normalizedPath}`;
  }

  if (normalizedPath.startsWith("/images/")) {
    return normalizedPath;
  }

  return `${BACKEND_BASE_URL}/${normalizedPath.replace(/^\/+/, "")}`;
};
