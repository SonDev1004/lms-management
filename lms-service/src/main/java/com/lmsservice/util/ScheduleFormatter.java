package com.lmsservice.util;

import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.lmsservice.entity.CourseTimeslot;

public final class ScheduleFormatter {
    private ScheduleFormatter() {}

    public static String format(List<CourseTimeslot> active) {
        if (active == null || active.isEmpty()) return null;

        // Ngày học (distinct + sort)
        String daysText = active.stream()
                .map(CourseTimeslot::getDayOfWeek)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .map(d -> "Thứ " + d)
                .collect(Collectors.joining("-"));

        // Thời gian học
        String timeText = buildTimeText(active);

        return daysText + " " + timeText;
    }

    private static String buildTimeText(List<CourseTimeslot> active) {
        if (active.isEmpty()) return null;
        LocalTime s0 = active.get(0).getStartTime();
        LocalTime e0 = active.get(0).getEndTime();

        boolean allSame = active.stream()
                .allMatch(ts -> Objects.equals(ts.getStartTime(), s0) && Objects.equals(ts.getEndTime(), e0));
        if (allSame) return fmt(s0) + "-" + fmt(e0);

        return active.stream()
                .map(ts -> fmt(ts.getStartTime()) + "-" + fmt(ts.getEndTime()))
                .distinct()
                .collect(Collectors.joining("/"));
    }

    private static String fmt(LocalTime t) {
        if (t == null) return "";
        return String.format("%02d:%02d", t.getHour(), t.getMinute());
    }
}
