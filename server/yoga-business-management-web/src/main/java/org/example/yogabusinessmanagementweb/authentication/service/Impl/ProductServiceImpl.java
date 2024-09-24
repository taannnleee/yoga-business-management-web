package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.authentication.dto.request.AddProductRequest;
import org.example.yogabusinessmanagementweb.authentication.repositories.*;
import org.example.yogabusinessmanagementweb.authentication.service.ProductDetailService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.common.entities.Category;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    SubCategoryRepository subCategoryRepository;
    ProductDetailRepository productDetailRepository;
    TempRepository tempRepository;

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }
    @Override
    public Product getProductById(String id) {
        Optional<Product>  productOptional =  productRepository.findProductById(Long.valueOf(id));
        if(productOptional.isPresent()){
            return productOptional.get();
        }
        return null;
    }

    @Override
    public boolean addProduct(AddProductRequest addProductRequest)  {
        try {
            Product product =  Mappers.convertToEntity(addProductRequest, Product.class);

            // Xử lý ProductDetail
            ProductDetail productDetail= Mappers.convertToEntity(addProductRequest.getProductDetail(), ProductDetail.class);
            product.setProductDetail(productDetail);

            //xử lý Category
            SubCategory subCategory = subCategoryRepository.findById(addProductRequest.getCategoryId())
                    .orElseGet(() -> {
                        SubCategory newSubCategory = new SubCategory();
                        newSubCategory.setId(addProductRequest.getCategoryId());
                        newSubCategory.setName("Default Category");
                        newSubCategory.setStatus("active");
                        return subCategoryRepository.save(newSubCategory);
                    });
            product.setSubCategory(subCategory);

            //Lưu product
            productRepository.save(product);

            return true;
        }catch (Exception e){
            return false;
        }
    }

    @Override
    public boolean delete(String id) {
        try {
            Optional<Product> product = productRepository.findById(Long.valueOf(id));
            if (product.isPresent()) {
                Product productEntity = product.get();
                productRepository.deleteById(productEntity.getId());
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
