package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseTimeslot extends EntityAbstract {
    /** Khóa học sở hữu timeslot (bắt buộc) */
    @ManyToOne()
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    /** Thứ trong tuần: 1 = Mon ... 7 = Sun */
    @Column(name = "day_of_week", nullable = false)
    Integer dayOfWeek;

    /** Giờ bắt đầu / kết thúc ca học */
    @Column(name = "start_time", nullable = false)
    LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    LocalTime endTime;

    /** Phòng mặc định cho slot này (có thể null) */
    @ManyToOne()
    @JoinColumn(name = "room_id")
    Room room;

    /** Slot còn hiệu lực hay không (mặc định true) */
    @Column(name = "is_active", nullable = false)
    Boolean isActive = true;

    /** Ghi chú (online, thay phòng tuần đầu, ...) */
    @Column(name = "note", length = 255)
    String note;
}
