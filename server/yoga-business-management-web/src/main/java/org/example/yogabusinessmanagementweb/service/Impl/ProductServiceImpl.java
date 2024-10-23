package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.mapper.ProductMapper;
import org.example.yogabusinessmanagementweb.dto.request.product.ProductCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.product.AddProductResponse;
import org.example.yogabusinessmanagementweb.dto.response.product.ProductResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.ProductDetailRepository;
import org.example.yogabusinessmanagementweb.repositories.ProductRepository;
import org.example.yogabusinessmanagementweb.repositories.SubCategoryRepository;
import org.example.yogabusinessmanagementweb.repositories.TempRepository;
import org.example.yogabusinessmanagementweb.service.ProductService;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
import org.example.yogabusinessmanagementweb.common.entities.SubCategory;
import org.example.yogabusinessmanagementweb.common.mapper.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceImpl implements ProductService {
    ProductRepository productRepository;
    SubCategoryRepository subCategoryRepository;
    ProductDetailRepository productDetailRepository;
    TempRepository tempRepository;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public Page<Product> getAllProduct(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    @Override
    public Product getProductById(String id) {
        return productRepository.findProductById(Long.valueOf(id))
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    @Override
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> productPage;

        if (keyword == null || keyword.isEmpty()) {
            productPage = productRepository.findAll(pageable); // Lấy tất cả sản phẩm
        } else {
            productPage = productRepository.findByTitleContainingIgnoreCase(keyword, pageable); // Tìm kiếm theo từ khóa
        }

        // Chuyển đổi từ Page<Product> sang Page<ProductResponse>
        List<ProductResponse> productResponses = productPage.getContent().stream()
                .map(product -> new ProductResponse(product.getId(), product.getTitle(), product.getPrice(), product.getAverageRating(),product.getImagePath(),product.getStatus()))
                .collect(Collectors.toList());

        return new PageImpl<>(productResponses, pageable, productPage.getTotalElements());
    }


    @Override
    public AddProductResponse addProduct(ProductCreationRequest productCreationRequest)  {
//        product =  Mappers.convertToEntity(productCreationRequest, Product.class);
        Product product = productMapper.toProduct(productCreationRequest);
        // Xử lý ProductDetail
        ProductDetail productDetail= Mappers.convertToEntity(productCreationRequest.getProductDetail(), ProductDetail.class);

        product.setProductDetail(productDetail);

        //xử lý SubCategory
        SubCategory subCategory = subCategoryRepository.findById(productCreationRequest.getSubCategoryId())
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
