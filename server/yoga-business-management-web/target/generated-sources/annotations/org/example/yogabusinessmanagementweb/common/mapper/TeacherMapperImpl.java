package org.example.yogabusinessmanagementweb.common.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Teacher;
import org.example.yogabusinessmanagementweb.dto.request.teacher.TeacherCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.teacher.TeacherResponse;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class TeacherMapperImpl implements TeacherMapper {

    @Override
    public TeacherResponse toTeacherResponse(Teacher teacher) {
        if ( teacher == null ) {
            return null;
        }

        TeacherResponse teacherResponse = new TeacherResponse();

        teacherResponse.setId( teacher.getId() );
        teacherResponse.setFullName( teacher.getFullName() );
        teacherResponse.setEmail( teacher.getEmail() );
        teacherResponse.setPhoneNumber( teacher.getPhoneNumber() );
        teacherResponse.setExperienceYears( teacher.getExperienceYears() );
        teacherResponse.setProfilePicture( teacher.getProfilePicture() );

        return teacherResponse;
    }

    @Override
    public Teacher toTeacher(TeacherCreationRequest teacher) {
        if ( teacher == null ) {
            return null;
        }

        Teacher.TeacherBuilder teacher1 = Teacher.builder();

        teacher1.fullName( teacher.getFullName() );
        teacher1.email( teacher.getEmail() );
        teacher1.phoneNumber( teacher.getPhoneNumber() );
        teacher1.experienceYears( teacher.getExperienceYears() );
        teacher1.profilePicture( teacher.getProfilePicture() );

        return teacher1.build();
    }

    @Override
    public void updateTeacher(Teacher teacher, TeacherCreationRequest teacherRequest) {
        if ( teacherRequest == null ) {
            return;
        }

        teacher.setFullName( teacherRequest.getFullName() );
        teacher.setEmail( teacherRequest.getEmail() );
        teacher.setPhoneNumber( teacherRequest.getPhoneNumber() );
        teacher.setExperienceYears( teacherRequest.getExperienceYears() );
        teacher.setProfilePicture( teacherRequest.getProfilePicture() );
    }

    @Override
    public List<TeacherResponse> toTeacherResponseList(List<Teacher> teachers) {
        if ( teachers == null ) {
            return null;
        }

        List<TeacherResponse> list = new ArrayList<TeacherResponse>( teachers.size() );
        for ( Teacher teacher : teachers ) {
            list.add( toTeacherResponse( teacher ) );
        }

        return list;
    }

    @Override
    public List<Teacher> toTeacherList(List<TeacherCreationRequest> teacherRequests) {
        if ( teacherRequests == null ) {
            return null;
        }

        List<Teacher> list = new ArrayList<Teacher>( teacherRequests.size() );
        for ( TeacherCreationRequest teacherCreationRequest : teacherRequests ) {
            list.add( toTeacher( teacherCreationRequest ) );
        }

        return list;
    }
}
