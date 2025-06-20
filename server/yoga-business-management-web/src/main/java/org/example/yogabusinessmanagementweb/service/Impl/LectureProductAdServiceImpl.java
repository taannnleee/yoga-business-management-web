package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.LectureProductAd;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureProductAdDTO;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureProductAdResponse;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;
import org.example.yogabusinessmanagementweb.repositories.LectureProductAdRepository;
import org.example.yogabusinessmanagementweb.repositories.LecturesRepository;
import org.example.yogabusinessmanagementweb.service.LectureProductAdService;
import org.example.yogabusinessmanagementweb.service.LecturesService;
import org.example.yogabusinessmanagementweb.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class LectureProductAdServiceImpl implements LectureProductAdService {
    LectureProductAdRepository adRepository;
    LecturesRepository lectureRepository;
    ProductService productService;
    LecturesService lecturesService;

    @Override
    public List<LectureProductAdResponse> getAdsByLectureId(String lectureId) {
        Lectures lecture = lectureRepository.findById(Long.valueOf(lectureId))
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<LectureProductAd> ads = adRepository.findByLecture(lecture);
        return ads.stream().map(ad -> LectureProductAdResponse.builder()
                .productId(ad.getProduct().getId())
                .title(ad.getProduct().getTitle())
                .imagePath(ad.getProduct().getImagePath())
                .price(ad.getProduct().getPrice())
                .startSecond(ad.getStartSecond())
                .endSecond(ad.getEndSecond())
                .build()).collect(Collectors.toList());
    }

    @Override
    public void addLectureProductAds(LectureProductAdDTO dto) {
        Lectures lecture = lecturesService.getLectureEntityById(String.valueOf(dto.getLectureId()));

        for (Long productId : dto.getProductIds()) {
            Product product = productService.getProductById(String.valueOf(productId));

            LectureProductAd ad = new LectureProductAd();
            ad.setLecture(lecture);
            ad.setProduct(product);
            ad.setStartSecond(dto.getStartSecond());
            ad.setEndSecond(dto.getEndSecond());

            adRepository.save(ad);
        }
    }

}
