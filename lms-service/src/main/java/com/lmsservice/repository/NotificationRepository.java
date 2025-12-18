package com.lmsservice.repository;

import com.lmsservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("""
           select n from Notification n
           where n.user.id = :userId
           order by n.postedDate desc nulls last, n.id desc
           """)
    List<Notification> findAllByUserId(@Param("userId") Long userId);

    @Query("""
           select n from Notification n
           where n.user.id = :userId
             and n.isSeen = false
           order by n.postedDate desc nulls last, n.id desc
           """)
    List<Notification> findUnseenByUserId(@Param("userId") Long userId);

    // Đếm unseen đúng chuẩn, không kéo cả list về
    @Query("""
           select count(n)
           from Notification n
           where n.user.id = :userId
             and n.isSeen = false
           """)
    long countUnseenByUserId(@Param("userId") Long userId);

    // Đánh dấu 1 bản ghi thuộc đúng user (tránh đọc hộ người khác)
    @Modifying
    @Query("""
           update Notification n
           set n.isSeen = true
           where n.id = :id
             and n.user.id = :userId
           """)
    int markSeenByIdAndUser(@Param("id") Long id, @Param("userId") Long userId);

    // Đánh dấu tất cả của user
    @Modifying
    @Query("""
           update Notification n
           set n.isSeen = true
           where n.user.id = :userId
             and n.isSeen = false
           """)
    int markAllSeenByUser(@Param("userId") Long userId);

    // Những noti đã lên lịch, tới giờ để job bắn đi
    @Query("""
           select n
           from Notification n
           where n.scheduledDate is not null
             and n.postedDate is null
             and n.scheduledDate <= :now
           """)
    List<Notification> findPendingScheduledNotifications(@Param("now") LocalDateTime now);

    // Hàng chờ: đã lên lịch, chưa gửi – cho admin xem queue
    @Query("""
           select n
           from Notification n
           where n.scheduledDate is not null
             and n.postedDate is null
           order by n.scheduledDate asc, n.id asc
           """)
    List<Notification> findScheduledNotifications();

    // Lịch sử: tất cả noti đã gửi
    @Query("""
           select n
           from Notification n
           where n.postedDate is not null
           order by n.postedDate desc, n.id desc
           """)
    List<Notification> findSentNotifications();
}
