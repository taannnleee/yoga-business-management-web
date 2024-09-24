package org.example.yogabusinessmanagementweb.authentication.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.authentication.dto.request.AddProductRequest;
import org.example.yogabusinessmanagementweb.authentication.repositories.CategoryRepository;
import org.example.yogabusinessmanagementweb.authentication.repositories.ProductDetailRepository;
import org.example.yogabusinessmanagementweb.authentication.repositories.ProductRepository;
import org.example.yogabusinessmanagementweb.authentication.repositories.TempRepository;
import org.example.yogabusinessmanagementweb.authentication.service.ProductDetailService;
import org.example.yogabusinessmanagementweb.authentication.service.ProductService;
import org.example.yogabusinessmanagementweb.common.entities.Category;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
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
    CategoryRepository categoryRepository;
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
            Category category = categoryRepository.findById(addProductRequest.getCategoryId())
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setId(addProductRequest.getCategoryId());
                        newCategory.setCategoryName("Default Category");
                        newCategory.setStatus("active");
                        return categoryRepository.save(newCategory);
                    });
            product.setCategory(category);

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
