package org.example.yogabusinessmanagementweb.common.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.common.entities.Sections;
import org.example.yogabusinessmanagementweb.dto.request.section.SectionCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;
import org.example.yogabusinessmanagementweb.dto.response.section.SectionResponse;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class SectionMapperImpl implements SectionMapper {

    @Override
    public SectionResponse toSectionResponse(Sections section) {
        if ( section == null ) {
            return null;
        }

        SectionResponse sectionResponse = new SectionResponse();

        sectionResponse.setId( section.getId() );
        sectionResponse.setTitle( section.getTitle() );
        sectionResponse.setLectures( lecturesListToLectureResponseList( section.getLectures() ) );

        return sectionResponse;
    }

    @Override
    public Sections toSection(SectionCreationRequest sectionCreationRequest) {
        if ( sectionCreationRequest == null ) {
            return null;
        }

        Sections.SectionsBuilder sections = Sections.builder();

        sections.title( sectionCreationRequest.getTitle() );

        return sections.build();
    }

    @Override
    public void updateSection(Sections sections, SectionCreationRequest sectionCreationRequest) {
        if ( sectionCreationRequest == null ) {
            return;
        }

        sections.setTitle( sectionCreationRequest.getTitle() );
    }

    @Override
    public List<SectionResponse> toSectionResponseList(List<Sections> sections) {
        if ( sections == null ) {
            return null;
        }

        List<SectionResponse> list = new ArrayList<SectionResponse>( sections.size() );
        for ( Sections sections1 : sections ) {
            list.add( toSectionResponse( sections1 ) );
        }

        return list;
    }

    protected LectureResponse lecturesToLectureResponse(Lectures lectures) {
        if ( lectures == null ) {
            return null;
        }

        LectureResponse lectureResponse = new LectureResponse();

        lectureResponse.setId( lectures.getId() );
        lectureResponse.setTitle( lectures.getTitle() );
        lectureResponse.setContent( lectures.getContent() );
        lectureResponse.setVideo_url( lectures.getVideo_url() );

        return lectureResponse;
    }

    protected List<LectureResponse> lecturesListToLectureResponseList(List<Lectures> list) {
        if ( list == null ) {
            return null;
        }

        List<LectureResponse> list1 = new ArrayList<LectureResponse>( list.size() );
        for ( Lectures lectures : list ) {
            list1.add( lecturesToLectureResponse( lectures ) );
        }

        return list1;
    }
}
