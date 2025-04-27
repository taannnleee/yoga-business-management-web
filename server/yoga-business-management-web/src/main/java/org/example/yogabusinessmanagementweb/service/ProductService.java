package org.example.yogabusinessmanagementweb.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.yogabusinessmanagementweb.dto.request.product.ProductCreationRequest;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.dto.response.ListDto;
import org.example.yogabusinessmanagementweb.dto.response.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    Page<Product>getAllProduct(Pageable pageable);

    Product getProductById(String id);
    ProductResponse getById(String id);
    Product addProduct(ProductCreationRequest productCreationRequest);
    @Transactional
    void importProductsByExcel(MultipartFile file);
    public void updateProduct(Product product,Double rating,Double sold);

    boolean delete(String productId);
    Page<ProductResponse> searchProducts(Boolean status,String keyword, Pageable pageable);

    Page<ProductResponse> getAllProductBySubcategory(String id,String keyword, Pageable pageable);
    ListDto<List<ProductResponse>> filterProducts(Long subCategoryId, Long categoryId, String keyword, Pageable pageable);
    List<Product> getTop10BestSellingProducts();

    void changeProductWithStatus(@Valid String productId);
}
