package org.example.yogabusinessmanagementweb.common.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.yogabusinessmanagementweb.common.entities.Topic;
import org.example.yogabusinessmanagementweb.dto.request.topic.TopicCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.topic.TopicResponse;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-04T11:30:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class TopicMapperImpl implements TopicMapper {

    @Override
    public TopicResponse toTopicResponse(Topic topic) {
        if ( topic == null ) {
            return null;
        }

        TopicResponse topicResponse = new TopicResponse();

        topicResponse.setId( topic.getId() );
        topicResponse.setName( topic.getName() );
        topicResponse.setDescription( topic.getDescription() );

        return topicResponse;
    }

    @Override
    public Topic toTopic(TopicCreationRequest topic) {
        if ( topic == null ) {
            return null;
        }

        Topic.TopicBuilder topic1 = Topic.builder();

        topic1.name( topic.getName() );
        topic1.description( topic.getDescription() );

        return topic1.build();
    }

    @Override
    public void updateTopic(Topic topic, TopicCreationRequest topicRequest) {
        if ( topicRequest == null ) {
            return;
        }

        topic.setName( topicRequest.getName() );
        topic.setDescription( topicRequest.getDescription() );
    }

    @Override
    public List<TopicResponse> toTopicResponseList(List<Topic> topicList) {
        if ( topicList == null ) {
            return null;
        }

        List<TopicResponse> list = new ArrayList<TopicResponse>( topicList.size() );
        for ( Topic topic : topicList ) {
            list.add( toTopicResponse( topic ) );
        }

        return list;
    }
}
