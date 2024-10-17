import React from "react";
import LeftSide from "../LeftSide";
import RightSide from "../RightSide";

interface IProductDetailTemplateProps {
  product: any;
}

const ProductDetailTemplate: React.FC<IProductDetailTemplateProps> = (
  props
) => {
  const { product } = props;

  console.log("product", product);

  return (
    <>
      <div className="py-10 bg-white desktop:min-w-[1200px] laptop:min-w-[960px] mx-auto min-h-[800px]">
        <div className="flex gap-y-8 gap-x-[80px] justify-center flex-col laptop:flex-row">
          <div className="desktop:w-[480px] w-[480px]">
            <LeftSide product={product} />
          </div>
          <div className="w-[480px]">
            {!!product ? <RightSide product={product} /> : null}
          </div>
        </div>
        {/* {!!productDetail && (
            <ProductDescription productDetail={productDetail} />
          )} */}
      </div>

      {/* <div className="w-5/6 mx-auto flex">
        {!!productDetail && <ProductComment productDetail={productDetail} />}
      </div> */}

      {/* <div className="w-5/6 mx-auto flex">
        {!!productDetail && <SimilarProduct productDetail={productDetail} />}
      </div> */}
    </>
  );
};

export default ProductDetailTemplate;
