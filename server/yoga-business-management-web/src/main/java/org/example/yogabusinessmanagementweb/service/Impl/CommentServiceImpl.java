package org.example.yogabusinessmanagementweb.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.yogabusinessmanagementweb.common.entities.Comment;
import org.example.yogabusinessmanagementweb.common.entities.Product;
import org.example.yogabusinessmanagementweb.common.mapper.CommentMapper;
import org.example.yogabusinessmanagementweb.dto.response.comment.CommentResponse;
import org.example.yogabusinessmanagementweb.exception.AppException;
import org.example.yogabusinessmanagementweb.exception.ErrorCode;
import org.example.yogabusinessmanagementweb.repositories.CommentRepository;
import org.example.yogabusinessmanagementweb.repositories.ProductRepository;
import org.example.yogabusinessmanagementweb.service.CommentService;
import org.example.yogabusinessmanagementweb.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class CommentServiceImpl implements CommentService {
    CommentRepository commentRepository;
    CommentMapper commentMapper;
    ProductService productService;
    @Override
    public List<CommentResponse> all(Pageable pageable) {
        Page<Comment> commentPage = commentRepository.findAll(pageable);
        return commentMapper.toCommentResponses(commentPage.getContent());
    }

    @Override
    public List<CommentResponse> byProduct(Pageable pageable,String id,int ratePoint) {
        Product product = productService.getProductById(id);
        Page<Comment> commentPage = commentRepository.findByProductAndRatePointGreaterThan(pageable, product, ratePoint);
        List<CommentResponse> topLevelComments = commentMapper.toCommentResponses(commentPage.getContent());
        for (CommentResponse commentResponse : topLevelComments) {
            setReplies(commentResponse);
        }
        return topLevelComments;
    }
    private void setReplies(CommentResponse commentResponse) {
        // Assuming you have a method in the repository to fetch replies based on the parent comment's ID
        List<Comment> replies = commentRepository.findByParentCommentId(commentResponse.getId());

        // If there are replies, map them and set them as the replies of the current comment
        if (replies != null && !replies.isEmpty()) {
            List<CommentResponse> replyResponses = commentMapper.toCommentResponses(replies);
            commentResponse.setReplies(replyResponses); // Assuming setReplies method exists in CommentResponse
            // Recursively set replies for each child comment
            for (CommentResponse replyResponse : replyResponses) {
                setReplies(replyResponse);
            }
        }
    }
    @Override
    public Comment findById(String id) {
        return commentRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
    }

    @Override
    public CommentResponse getById(String id) {
        return commentMapper.toCommentResponse(findById(id));
    }


    @Override
    public boolean delete(String id) {
        Comment comment = findById(id);
        commentRepository.delete(comment);
        return true;
    }
}
