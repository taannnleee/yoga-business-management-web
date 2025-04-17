package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.dto.response.coursecart.CourseCartResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CourseCartMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "idCourse", source = "course.id")
    @Mapping(target = "imagePath", source = "course.imagePath")
    @Mapping(target = "name", source = "course.name")
    CourseCartResponse courseCartToCourseCartResponse(CourseCart courseCart);
//
//    CourseCart courseCartResponseToCourseCart(CourseCartResponse courseCartResponse);
//
}
