package com.studygroup.service;

import com.studygroup.dto.DiscussionDTOs;
import com.studygroup.dto.ReplyDTOs;
import com.studygroup.entity.Discussion;
import com.studygroup.entity.GroupMember;
import com.studygroup.entity.Reply;
import com.studygroup.entity.User;
import com.studygroup.exception.ResourceNotFoundException;
import com.studygroup.repository.DiscussionRepository;
import com.studygroup.repository.ReplyRepository;
import com.studygroup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DiscussionService {

    @Autowired private DiscussionRepository discussionRepository;
    @Autowired private ReplyRepository replyRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private StudyGroupService studyGroupService;
    @Autowired private UserService userService;

    public DiscussionDTOs.DiscussionResponse createDiscussion(Long groupId, DiscussionDTOs.CreateDiscussionRequest request, String email) {
        User user = getUserByEmail(email);
        GroupMember member = studyGroupService.verifyGroupMembership(groupId, email);

        Discussion discussion = Discussion.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .author(user)
                .group(member.getGroup())
                .isAnonymous(request.getIsAnonymous())
                .build();

        discussion = discussionRepository.save(discussion);
        return mapToResponse(discussion);
    }

    public Page<DiscussionDTOs.DiscussionResponse> getDiscussions(Long groupId, String query, Boolean isSolved, int page, int size, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Discussion> discussionsPage;

        if (query != null && !query.trim().isEmpty()) {
            discussionsPage = discussionRepository.searchInGroup(groupId, query.trim(), pageable);
        } else if (isSolved != null) {
            discussionsPage = discussionRepository.findByGroupIdAndIsSolved(groupId, isSolved, pageable);
        } else {
            discussionsPage = discussionRepository.findByGroupId(groupId, pageable);
        }

        return discussionsPage.map(this::mapToResponse);
    }

    public DiscussionDTOs.DiscussionDetailResponse getDiscussionDetails(Long groupId, Long discussionId, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        Discussion discussion = getDiscussionByIdAndGroupId(discussionId, groupId);
        
        List<Reply> replies = replyRepository.findByDiscussionIdOrderByUpvotesDescCreatedAtAsc(discussionId);

        DiscussionDTOs.DiscussionDetailResponse response = new DiscussionDTOs.DiscussionDetailResponse();
        response.setId(discussion.getId());
        response.setTitle(discussion.getTitle());
        response.setContent(discussion.getContent());
        response.setIsAnonymous(discussion.getIsAnonymous());
        response.setIsSolved(discussion.getIsSolved());
        response.setUpvotes(discussion.getUpvotes());
        response.setCreatedAt(discussion.getCreatedAt());

        if (discussion.getIsAnonymous()) {
            response.setAuthor(null);
        } else {
            response.setAuthor(userService.mapToSummary(discussion.getAuthor()));
        }

        List<ReplyDTOs.ReplyResponse> replyResponses = replies.stream()
                .map(this::mapToReplyResponse)
                .collect(Collectors.toList());
        response.setReplies(replyResponses);
        return response;
    }

    public void deleteDiscussion(Long groupId, Long discussionId, String email) {
        GroupMember member = studyGroupService.verifyGroupMembership(groupId, email);
        Discussion discussion = getDiscussionByIdAndGroupId(discussionId, groupId);

        if (!discussion.getAuthor().getEmail().equals(email) && 
            member.getRole() == GroupMember.GroupRole.MEMBER) {
            throw new com.studygroup.exception.AccessDeniedException("You don't have permission to delete this discussion");
        }

        discussionRepository.delete(discussion);
    }

    public DiscussionDTOs.DiscussionResponse voteDiscussion(Long groupId, Long discussionId, DiscussionDTOs.VoteRequest request, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        Discussion discussion = getDiscussionByIdAndGroupId(discussionId, groupId);

        if ("UPVOTE".equalsIgnoreCase(request.getVoteType())) {
            discussion.setUpvotes(discussion.getUpvotes() + 1);
        } else {
            throw new com.studygroup.exception.BadRequestException("Invalid vote type");
        }

        discussion = discussionRepository.save(discussion);
        return mapToResponse(discussion);
    }

    // Replies

    public ReplyDTOs.ReplyResponse addReply(Long groupId, Long discussionId, ReplyDTOs.CreateReplyRequest request, String email) {
        User user = getUserByEmail(email);
        studyGroupService.verifyGroupMembership(groupId, email);
        Discussion discussion = getDiscussionByIdAndGroupId(discussionId, groupId);

        Reply reply = Reply.builder()
                .discussion(discussion)
                .author(user)
                .content(request.getContent().trim())
                .build();

        reply = replyRepository.save(reply);
        return mapToReplyResponse(reply);
    }

    public ReplyDTOs.ReplyResponse acceptReply(Long groupId, Long discussionId, Long replyId, String email) {
        studyGroupService.verifyGroupMembership(groupId, email);
        Discussion discussion = getDiscussionByIdAndGroupId(discussionId, groupId);
        
        if (!discussion.getAuthor().getEmail().equals(email)) {
            throw new com.studygroup.exception.AccessDeniedException("Only the author of the discussion can mark a reply as solved");
        }

        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found with id " + replyId));

        if (!reply.getDiscussion().getId().equals(discussionId)) {
            throw new com.studygroup.exception.BadRequestException("Reply does not belong to this discussion");
        }

        reply.setIsAccepted(true);
        discussion.setIsSolved(true);
        
        discussionRepository.save(discussion);
        return mapToReplyResponse(replyRepository.save(reply));
    }
    
    public void deleteReply(Long groupId, Long discussionId, Long replyId, String email) {
        GroupMember member = studyGroupService.verifyGroupMembership(groupId, email);
        Discussion discussion = getDiscussionByIdAndGroupId(discussionId, groupId);
        
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found with id " + replyId));

        if (!reply.getDiscussion().getId().equals(discussionId)) {
            throw new com.studygroup.exception.BadRequestException("Reply does not belong to this discussion");
        }

        if (!reply.getAuthor().getEmail().equals(email) && 
            member.getRole() == GroupMember.GroupRole.MEMBER &&
            !discussion.getAuthor().getEmail().equals(email)) {
             throw new com.studygroup.exception.AccessDeniedException("You don't have permission to delete this reply");
        }
        
        replyRepository.delete(reply);
    }

    // Helpers

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Discussion getDiscussionByIdAndGroupId(Long discussionId, Long groupId) {
        Discussion discussion = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id " + discussionId));
        if (!discussion.getGroup().getId().equals(groupId)) {
            throw new com.studygroup.exception.BadRequestException("Discussion does not belong to this group");
        }
        return discussion;
    }

    private DiscussionDTOs.DiscussionResponse mapToResponse(Discussion discussion) {
        DiscussionDTOs.DiscussionResponse response = new DiscussionDTOs.DiscussionResponse();
        response.setId(discussion.getId());
        response.setTitle(discussion.getTitle());
        response.setContent(discussion.getContent());
        response.setIsAnonymous(discussion.getIsAnonymous());
        response.setIsSolved(discussion.getIsSolved());
        response.setUpvotes(discussion.getUpvotes());
        response.setCreatedAt(discussion.getCreatedAt());
        response.setReplyCount(replyRepository.countByDiscussionId(discussion.getId()));
        
        if (discussion.getIsAnonymous()) {
            response.setAuthor(null);
        } else {
            response.setAuthor(userService.mapToSummary(discussion.getAuthor()));
        }

        return response;
    }

    private ReplyDTOs.ReplyResponse mapToReplyResponse(Reply reply) {
        ReplyDTOs.ReplyResponse response = new ReplyDTOs.ReplyResponse();
        response.setId(reply.getId());
        response.setAuthor(userService.mapToSummary(reply.getAuthor()));
        response.setContent(reply.getContent());
        response.setUpvotes(reply.getUpvotes());
        response.setIsAccepted(reply.getIsAccepted());
        response.setCreatedAt(reply.getCreatedAt());
        return response;
    }
}
