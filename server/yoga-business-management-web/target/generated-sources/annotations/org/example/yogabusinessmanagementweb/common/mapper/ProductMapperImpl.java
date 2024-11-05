package org.example.yogabusinessmanagementweb.common.mapper;

import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.entities.ProductDetail;
import org.example.yogabusinessmanagementweb.dto.request.product.ProductCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.product.ProductDetailCreationRequest;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public Product toProduct(ProductCreationRequest productCreationRequest) {
        if ( productCreationRequest == null ) {
            return null;
        }

        Product.ProductBuilder product = Product.builder();

        product.productDetail( productDetailCreationRequestToProductDetail( productCreationRequest.getProductDetail() ) );
        product.imagePath( productCreationRequest.getImagePath() );
        product.price( productCreationRequest.getPrice() );
        product.title( productCreationRequest.getTitle() );
        product.averageRating( productCreationRequest.getAverageRating() );

        return product.build();
    }

    protected ProductDetail productDetailCreationRequestToProductDetail(ProductDetailCreationRequest productDetailCreationRequest) {
        if ( productDetailCreationRequest == null ) {
            return null;
        }

        ProductDetail.ProductDetailBuilder productDetail = ProductDetail.builder();

        productDetail.color( productDetailCreationRequest.getColor() );
        productDetail.size( productDetailCreationRequest.getSize() );
        productDetail.code( productDetailCreationRequest.getCode() );
        productDetail.brand( productDetailCreationRequest.getBrand() );
        productDetail.description( productDetailCreationRequest.getDescription() );

        return productDetail.build();
    }
}
