package com.lmsservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.postedDate DESC")
    List<Notification> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isSeen = false ORDER BY n.postedDate DESC")
    List<Notification> findUnseenByUserId(@Param("userId") Long userId);

    @Query("""
                SELECT n FROM Notification n
                WHERE n.scheduledDate IS NOT NULL
                AND n.postedDate IS NULL
                AND n.scheduledDate <= :now
            """)
    List<Notification> findPendingScheduledNotifications(@Param("now") LocalDateTime now);

    @Query("""
    SELECT n FROM Notification n
    WHERE n.scheduledDate IS NOT NULL
    AND n.postedDate IS NULL
    ORDER BY n.scheduledDate ASC
""")
    List<Notification> findScheduledNotifications();
}
