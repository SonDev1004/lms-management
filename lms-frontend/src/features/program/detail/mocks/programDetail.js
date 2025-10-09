const programDetailMock = {
  id: 1,
  title: "IELTS Intensive",
  code: "IELTS-INT",
  description:
      "Comprehensive IELTS preparation program designed to help students achieve their target band scores. Our intensive course covers all four skills: Listening, Reading, Writing, and Speaking with expert instructors and proven methodologies.",
  fee: 8_500_000,
  minStudents: 6,
  maxStudents: 12,
  image:
      "https://images.unsplash.com/photo-1523246191167-6f4546b14880?q=80&w=1600&auto=format&fit=crop",
  duration: "8–12 weeks",
  sessionsPerWeek: 3,
  target: "6.5+",
  tracks: [
    { code: "GEN", label: "General" },
    { code: "ACA", label: "Academic" },
  ],

  // >>> THAY ĐOẠN subjects Ở DƯỚI
  subjects: [
    {
      id: 201,
      title: "IELTS-2025-A",
      order: 1,
      courses: [
        {
          id: 6001,
          title: "IELTS-2025-A",      // để header + dialog hiển thị đúng
          code: "IELTS-2025-A",       // dùng cho "Mã lịch: …"
          status: "open",
          startDate: "2025-10-12",
          scheduleText: "Tue-Thu 19:00",
          sessions: 12,
          capacity: 12,
          // (tuỳ chọn) nếu bạn đã gắn dialog Xem lớp, thêm classes để hiện bảng:
          classes: [
            {
              id: "A1",
              title: "IELTS Reading & Listening – Track A Evening",
              code: "COURSE-20250916-5971158C",
              startDate: "2025-10-01",
              scheduleText: "Thứ 2–Thứ 4–Thứ 6 18:00–20:00",
              sessions: 20,
              capacity: 15,
              status: "open",
            },
            {
              id: "A2",
              title: "IELTS Speaking & Writing – Track A Evening",
              code: "COURSE-20250916-3AF6C657",
              startDate: "2025-11-04",
              scheduleText: "Thứ 2–Thứ 4–Thứ 6 18:00–20:00",
              sessions: 20,
              capacity: 25,
              status: "upcoming",
            },
          ],
        },
      ],
    },
    {
      id: 202,
      title: "IELTS-2025-B",
      order: 2,
      courses: [
        {
          id: 6002,
          title: "IELTS-2025-B",
          code: "IELTS-2025-B",
          status: "pending",
          startDate: "2025-10-15",
          scheduleText: "Sat-Sun 09:00",
          sessions: 10,
          capacity: 12,
          classes: [
            {
              id: "B1",
              title: "IELTS Track B Morning",
              code: "COURSE-20251015-1B",
              startDate: "2025-10-15",
              scheduleText: "Thứ 7–CN 09:00–11:00",
              sessions: 10,
              capacity: 20,
              status: "upcoming",
            },
          ],
        },
      ],
    },
    {
      id: 203,
      title: "IELTS-2025-C",
      order: 3,
      courses: [
        {
          id: 6003,
          title: "IELTS-2025-C",
          code: "IELTS-2025-C",
          status: "open",
          startDate: "2025-10-20",
          scheduleText: "Mon-Wed 20:00",
          sessions: 8,
          capacity: 10,
          classes: [
            {
              id: "C1",
              title: "IELTS Track C Evening",
              code: "COURSE-20251020-1C",
              startDate: "2025-10-20",
              scheduleText: "Thứ 2–Thứ 4 20:00–22:00",
              sessions: 8,
              capacity: 18,
              status: "open",
            },
          ],
        },
      ],
    },
  ],
};

export default programDetailMock;
export { programDetailMock };
