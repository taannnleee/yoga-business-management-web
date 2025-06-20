package org.example.yogabusinessmanagementweb.controller.admin.roadmap;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.yogabusinessmanagementweb.dto.request.category.CategoryCreationRequest;
import org.example.yogabusinessmanagementweb.dto.request.roadmap.RoadmapRequest;
import org.example.yogabusinessmanagementweb.dto.response.ApiResponse;
import org.example.yogabusinessmanagementweb.dto.response.ListDto;
import org.example.yogabusinessmanagementweb.dto.response.address.AddressResponse;
import org.example.yogabusinessmanagementweb.dto.response.category.CategoryResponse;
import org.example.yogabusinessmanagementweb.dto.response.category.CategoryResponseAndQuantityProduct;
import org.example.yogabusinessmanagementweb.dto.response.roadmap.RoadmapResponse;
import org.example.yogabusinessmanagementweb.service.CategoryService;
import org.example.yogabusinessmanagementweb.service.RoadmapService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/admin/roadmap")
@Slf4j
public class AdminRoadMapController {
    RoadmapService roadmapService;
    @PostMapping("/create")
    public ApiResponse<?> create(@RequestBody RoadmapRequest roadmapRequest) {
        RoadmapResponse response = roadmapService.create(roadmapRequest);
        return new ApiResponse<>(HttpStatus.OK.value(), "create roadmap success",response);
    }

    @GetMapping()
    public ApiResponse<?> getRoadmapsPaged(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy, // Field to sort by
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Pageable pageable = PageRequest.of(page - 1, size,
                sortDir.equalsIgnoreCase("asc")
                        ? Sort.by(sortBy).ascending()
                        : Sort.by(sortBy).descending());

        ListDto<List<RoadmapResponse>> result = roadmapService.getRoadmapsPaged(pageable); // Trả về object chứa content + totalPages
        return new ApiResponse<>(HttpStatus.OK.value(), "show roadmap success", result);
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<?> deleteRoadMap(@PathVariable String id) {
        RoadmapResponse roadmapResponse =  roadmapService.deleteRoadMap(id);
        return new ApiResponse<>(HttpStatus.OK.value(), "Delete roadmap success",roadmapResponse);
    }

    @PutMapping("/update/{id}")
    public ApiResponse<?> updateRoadmap(@PathVariable Long id, @RequestBody RoadmapRequest request) {
        RoadmapResponse updated = roadmapService.updateRoadmap(id, request);
        return new ApiResponse<>(HttpStatus.OK.value(), "Update success", updated);
    }
//
}
