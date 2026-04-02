package com.studygroup.repository;

import com.studygroup.entity.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    List<Reply> findByDiscussionIdOrderByUpvotesDescCreatedAtAsc(Long discussionId);

    Page<Reply> findByDiscussionId(Long discussionId, Pageable pageable);

    long countByDiscussionId(Long discussionId);
}
