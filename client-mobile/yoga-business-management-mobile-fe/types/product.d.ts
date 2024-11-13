import { SubCategory } from "@/types/sub-category";
import { Variants } from "@/types/variant";

export interface Product {
  id: number;
  imagePath: string;
  status: string | null;
  price: number;
  title: string;
  subCategory: SubCategory;
  code: string;
  brand: string;
  description: string;
  averageRating: number;
  variants: Variants;
}
