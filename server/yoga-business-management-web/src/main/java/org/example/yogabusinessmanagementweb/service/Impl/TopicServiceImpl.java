package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Teacher;
import org.example.yogabusinessmanagementweb.common.entities.Topic;
import org.example.yogabusinessmanagementweb.common.mapper.TopicMapper;
import org.example.yogabusinessmanagementweb.dto.request.topic.TopicCreationRequest;
import org.example.yogabusinessmanagementweb.dto.response.topic.TopicResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.TopicRepository;
import org.example.yogabusinessmanagementweb.service.TopicService;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Service
public class TopicServiceImpl implements TopicService {
    TopicRepository topicRepository;
    TopicMapper topicMapper;

    @Override
    public TopicResponse create(TopicCreationRequest topicCreationRequest) {
        Topic topic = topicMapper.toTopic(topicCreationRequest);
        topicRepository.save(topic);
        return topicMapper.toTopicResponse(topic);
    }

    @Override
    public List<TopicResponse> getAllTopic() {
        List<Topic> topics = topicRepository.findAll();
        List<TopicResponse> list =  topicMapper.toTopicResponseList(topics);
        return list;
    }

    @Override
    public Topic getTopicByid(String id) {
        return topicRepository.findById(Long.valueOf(id)).orElseThrow(()-> new AppException(ErrorCode.TOPIC_NOT_FOUND));
    }
}
