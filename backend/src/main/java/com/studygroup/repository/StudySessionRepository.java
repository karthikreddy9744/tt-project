package com.studygroup.repository;

import com.studygroup.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    List<StudySession> findByGroupIdOrderByStartTimeAsc(Long groupId);

    List<StudySession> findByGroupIdAndStartTimeAfterOrderByStartTimeAsc(Long groupId, LocalDateTime now);

    List<StudySession> findByGroupIdAndStartTimeBetween(Long groupId, LocalDateTime from, LocalDateTime to);
}
