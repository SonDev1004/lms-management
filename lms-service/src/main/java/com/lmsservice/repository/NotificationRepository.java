package com.lmsservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("select n from Notification n where n.user.id = :userId order by n.postedDate desc nulls last, n.id desc")
    List<Notification> findAllByUserId(@Param("userId") Long userId);

    @Query(
            "select n from Notification n where n.user.id = :userId and n.isSeen = false order by n.postedDate desc nulls last, n.id desc")
    List<Notification> findUnseenByUserId(@Param("userId") Long userId);

    // Đếm unseen đúng chuẩn, không kéo cả list về
    @Query("select count(n) from Notification n where n.user.id = :userId and n.isSeen = false")
    long countUnseenByUserId(@Param("userId") Long userId);

    // Đánh dấu 1 bản ghi thuộc đúng user (tránh đọc hộ người khác)
    @Modifying
    @Query("update Notification n set n.isSeen = true where n.id = :id and n.user.id = :userId")
    int markSeenByIdAndUser(@Param("id") Long id, @Param("userId") Long userId);

    // Đánh dấu tất cả của user
    @Modifying
    @Query("update Notification n set n.isSeen = true where n.user.id = :userId and n.isSeen = false")
    int markAllSeenByUser(@Param("userId") Long userId);

    @Query(
            """
				SELECT n FROM Notification n
				WHERE n.scheduledDate IS NOT NULL
				AND n.postedDate IS NULL
				AND n.scheduledDate <= :now
			""")
    List<Notification> findPendingScheduledNotifications(@Param("now") LocalDateTime now);

    @Query(
            """
	SELECT n FROM Notification n
	WHERE n.scheduledDate IS NOT NULL
	AND n.postedDate IS NULL
	ORDER BY n.scheduledDate ASC
""")
    List<Notification> findScheduledNotifications();
}
