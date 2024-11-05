package org.example.yogabusinessmanagementweb.common.mapper;

import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Lectures;
import org.example.yogabusinessmanagementweb.dto.request.lecture.LectureCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.lecture.LectureResponse;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class LectureMapperImpl implements LectureMapper {

    @Override
    public LectureResponse toLectureResponse(Lectures lectures) {
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

    @Override
    public Lectures toLecture(LectureCreationRequest lectureCreationRequest) {
        if ( lectureCreationRequest == null ) {
            return null;
        }

        Lectures.LecturesBuilder lectures = Lectures.builder();

        lectures.title( lectureCreationRequest.getTitle() );
        lectures.content( lectureCreationRequest.getContent() );
        lectures.video_url( lectureCreationRequest.getVideo_url() );

        return lectures.build();
    }

    @Override
    public void updateLecture(Lectures lectures, LectureCreationRequest lectureCreationRequest) {
        if ( lectureCreationRequest == null ) {
            return;
        }

        lectures.setTitle( lectureCreationRequest.getTitle() );
        lectures.setContent( lectureCreationRequest.getContent() );
        lectures.setVideo_url( lectureCreationRequest.getVideo_url() );
    }
}
