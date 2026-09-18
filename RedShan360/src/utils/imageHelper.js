const BACKEND_BASE_URL = "http://localhost:8080";

import A1 from '../assets/A1.jpg';
import A2 from '../assets/A2.jpg';
import A3 from '../assets/A3.jpg';
import A4 from '../assets/A4.jpg';
import A5 from '../assets/A5.jpg';
import A6 from '../assets/A6.jpg';

import AI1 from '../assets/AI1.jpg';
import AI2 from '../assets/AI2.jpg';
import AI3 from '../assets/AI3.jpg';
import AI4 from '../assets/AI4.jpg';
import AI5 from '../assets/AI5.jpg';
import AI6 from '../assets/AI6.jpg';
import AI7 from '../assets/AI7.jpg';

import ABB1 from '../assets/ABB1.jpg';
import ABB2 from '../assets/ABB2.jpg';
import ABB3 from '../assets/ABB3.jpg';
import ABB4 from '../assets/ABB4.jpg';
import ABB5 from '../assets/ABB5.jpg';
import ABB6 from '../assets/ABB6.jpg';

import BI1 from '../assets/BI1.jpg';
import BI2 from '../assets/BI2.jpg';
import BI3 from '../assets/BI3.jpg';
import BI4 from '../assets/BI4.jpg';
import BI5 from '../assets/BI5.jpg';

import BH1 from '../assets/BH1.jpg';
import BH2 from '../assets/BH2.jpg';
import BH3 from '../assets/BH3.jpg';
import BH4 from '../assets/BH4.jpg';
import BH5 from '../assets/BH5.jpg';

import C1 from '../assets/C1.jpg';
import C2 from '../assets/C2.jpg';
import C3 from '../assets/C3.jpg';
import C4 from '../assets/C4.jpg';
import C5 from '../assets/C5.jpg';
import C6 from '../assets/C6.jpg';
import C7 from '../assets/C7.jpg';
import C8 from '../assets/C8.jpg';

import CI1 from '../assets/CI1.jpg';
import CI2 from '../assets/CI2.jpg';
import CI3 from '../assets/CI3.jpg';
import CI4 from '../assets/CI4.jpg';
import CI5 from '../assets/CI5.jpg';
import CI6 from '../assets/CI6.jpg';
import CI7 from '../assets/CI7.jpg';

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

export const getProductImage = (product) => {
  if (!product) return '/images/product-placeholder.png';
  if (product.imageUrl) {
    return getProductImageUrl(product.imageUrl);
  }

  const name = (product.productName || product.title || '').toLowerCase();

  // Anniversary Bouquets
  if (name.includes("crimson romance")) return A1;
  if (name.includes("pastel dream")) return A2;
  if (name.includes("velvet blush")) return A3;
  if (name.includes("golden grace")) return A4;
  if (name.includes("lily white")) return A5;
  if (name.includes("garden bloom")) return A6;

  // Anniversary Individual Flowers
  if (name.includes("rose stem") && name.includes("crimson")) return AI1;
  if (name.includes("lily stem") && name.includes("white")) return AI2;
  if (name.includes("peony stem") && name.includes("blush")) return AI3;
  if (name.includes("tulip stem") && name.includes("golden")) return AI4;
  if (name.includes("hydrangea stem") && name.includes("serene")) return AI5;
  if (name.includes("orchid splendor")) return AI6;
  if (name.includes("mystique iris")) return AI7;

  // Birthday Bouquets
  if (name.includes("rose stem") && name.includes("birthday")) return ABB1;
  if (name.includes("lily stem") && name.includes("birthday")) return ABB2;
  if (name.includes("peony stem") && name.includes("birthday")) return ABB3;
  if (name.includes("tulip stem") && name.includes("birthday")) return ABB4;
  if (name.includes("hydrangea stem") && name.includes("birthday")) return ABB5;
  if (name.includes("orchid splendor") && name.includes("birthday")) return ABB6;

  // Birthday Individual Flowers
  if (name.includes("yellow daisy")) return BI1;
  if (name.includes("pink grace rose")) return BI2;
  if (name.includes("purple magic")) return BI3;
  if (name.includes("blushing tulip")) return BI4;
  if (name.includes("white celebration")) return BI5;

  // Birthday Headdresses
  if (name.includes("queen crown")) return BH1;
  if (name.includes("petal tiara")) return BH2;
  if (name.includes("headband elegance")) return BH3;
  if (name.includes("dream wreath")) return BH4;
  if (name.includes("lily halo")) return BH5;

  // Convocation Bouquets
  if (name.includes("achievement bloom")) return C1;
  if (name.includes("golden glory")) return C2;
  if (name.includes("sapphire sparkle")) return C3;
  if (name.includes("crimson pride")) return C4;
  if (name.includes("violet dream")) return C5;
  if (name.includes("sunflower burst")) return C6;
  if (name.includes("lavender elegance")) return C7;
  if (name.includes("pastel harmony")) return C8;

  // Convocation Individual Flowers
  if (name.includes("scholar's crimson rose")) return CI1;
  if (name.includes("success golden lily")) return CI2;
  if (name.includes("academic orchid")) return CI3;
  if (name.includes("triumphant tulip")) return CI4;
  if (name.includes("graduation hydrangea")) return CI5;
  if (name.includes("honors lavender")) return CI6;
  if (name.includes("valedictorian iris")) return CI7;

  return '/images/product-placeholder.png';
};
