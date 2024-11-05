package org.example.yogabusinessmanagementweb.common.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Courses;
import org.example.yogabusinessmanagementweb.dto.request.course.CourseCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.course.CourseResponse;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public CourseResponse toCoursesResponse(Courses courses) {
        if ( courses == null ) {
            return null;
        }

        CourseResponse courseResponse = new CourseResponse();

        courseResponse.setId( courses.getId() );
        courseResponse.setName( courses.getName() );
        courseResponse.setInstruction( courses.getInstruction() );
        courseResponse.setDescription( courses.getDescription() );
        courseResponse.setDuration( courses.getDuration() );
        courseResponse.setImagePath( courses.getImagePath() );
        courseResponse.setLevel( courses.getLevel() );
        courseResponse.setVideoPath( courses.getVideoPath() );
        courseResponse.setPrice( courses.getPrice() );
        courseResponse.setTeacher( courses.getTeacher() );
        courseResponse.setTopic( courses.getTopic() );

        return courseResponse;
    }

    @Override
    public Courses toCourses(CourseCreationRequest courseCreationRequest) {
        if ( courseCreationRequest == null ) {
            return null;
        }

        Courses.CoursesBuilder courses = Courses.builder();

        courses.name( courseCreationRequest.getName() );
        courses.instruction( courseCreationRequest.getInstruction() );
        courses.description( courseCreationRequest.getDescription() );
        courses.duration( courseCreationRequest.getDuration() );
        courses.imagePath( courseCreationRequest.getImagePath() );
        courses.level( courseCreationRequest.getLevel() );
        courses.videoPath( courseCreationRequest.getVideoPath() );
        courses.price( courseCreationRequest.getPrice() );

        return courses.build();
    }

    @Override
    public void updateCourses(Courses courses, CourseCreationRequest courseCreationRequest) {
        if ( courseCreationRequest == null ) {
            return;
        }

        courses.setName( courseCreationRequest.getName() );
        courses.setInstruction( courseCreationRequest.getInstruction() );
        courses.setDescription( courseCreationRequest.getDescription() );
        courses.setDuration( courseCreationRequest.getDuration() );
        courses.setImagePath( courseCreationRequest.getImagePath() );
        courses.setLevel( courseCreationRequest.getLevel() );
        courses.setVideoPath( courseCreationRequest.getVideoPath() );
        courses.setPrice( courseCreationRequest.getPrice() );
    }

    @Override
    public List<CourseResponse> toCoursesResponseList(List<Courses> courses) {
        if ( courses == null ) {
            return null;
        }

        List<CourseResponse> list = new ArrayList<CourseResponse>( courses.size() );
        for ( Courses courses1 : courses ) {
            list.add( toCoursesResponse( courses1 ) );
        }

        return list;
    }
}
