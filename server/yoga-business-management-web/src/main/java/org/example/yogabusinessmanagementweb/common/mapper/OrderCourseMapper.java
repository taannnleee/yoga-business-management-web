package org.example.yogabusinessmanagementweb.common.mapper;

import org.example.yogabusinessmanagementweb.common.entities.CourseCart;
import org.example.yogabusinessmanagementweb.common.entities.OrderCourse;
import org.example.yogabusinessmanagementweb.dto.response.coursecart.CourseCartResponse;
import org.example.yogabusinessmanagementweb.dto.response.orderCourse.OrderCourseResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderCourseMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "idCourse", source = "course.id")
    @Mapping(target = "imagePath", source = "course.imagePath")
    @Mapping(target = "name", source = "course.name")
    OrderCourseResponse toOrderCourseResponse(OrderCourse orderCourse);


}
