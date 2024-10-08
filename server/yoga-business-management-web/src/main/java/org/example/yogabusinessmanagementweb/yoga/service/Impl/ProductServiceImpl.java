package org.example.yogabusinessmanagementweb.yoga.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.yoga.dto.request.product.AddProductRequest;
import org.example.yogabusinessmanagementweb.yoga.dto.response.product.AddProductResponse;
import org.example.yogabusinessmanagementweb.yoga.exception.AppException;
import org.example.yogabusinessmanagementweb.yoga.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.yoga.repositories.*;
import org.example.yogabusinessmanagementweb.yoga.service.ProductService;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
    public Page<Product> getAllProduct(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    @Override
    public Product getProductById(String id) {
        return productRepository.findProductById(Long.valueOf(id))
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }
    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isEmpty()) {
            return productRepository.findAll(pageable); // Nếu không có keyword, trả về tất cả sản phẩm
        } else {
            return productRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        }
    }

    @Override
    public AddProductResponse addProduct(AddProductRequest addProductRequest)  {
        Product product = new Product();
        product =  Mappers.convertToEntity(addProductRequest, Product.class);
        System.out.println(product.getId());
        // Xử lý ProductDetail
        ProductDetail productDetail= Mappers.convertToEntity(addProductRequest.getProductDetail(), ProductDetail.class);
        product.setProductDetail(productDetail);

        //xử lý SubCategory
        SubCategory subCategory = subCategoryRepository.findById(addProductRequest.getSubCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.SUBCATEGORY_NOT_FOUND));

        product.setSubCategory(subCategory);
        //Lưu product
        productRepository.save(product);
        AddProductResponse addProductResponse = Mappers.convertToDto(product, AddProductResponse.class);

        return addProductResponse;
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
