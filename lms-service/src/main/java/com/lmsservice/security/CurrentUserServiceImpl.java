package com.lmsservice.security;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lmsservice.entity.Student;
import com.lmsservice.entity.Teacher;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.repository.TeacherRepository;
import com.lmsservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImpl implements CurrentUserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    private Authentication auth() {
        var a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !a.isAuthenticated()) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        }
        return a;
    }

    @Override
    public Long requireUserId() {
        return getUserId().orElseThrow(() -> new UnAuthorizeException(ErrorCode.UNAUTHENTICATED));
    }

    @Override
    public Optional<Long> getUserId() {
        var principal = auth().getPrincipal();
        if (principal instanceof CustomUserDetails cud) {
            var u = cud.getUser();
            return (u != null && u.getId() != null) ? Optional.of(u.getId()) : Optional.empty();
        }
        return Optional.empty();
    }

    @Override
    public Long requireStudentId() {
        return getStudentId().orElseThrow(() -> new UnAuthorizeException(ErrorCode.UNAUTHENTICATED));
    }

    @Override
    public Optional<Long> getStudentId() {
        var principal = auth().getPrincipal();
        if (principal instanceof CustomUserDetails cud) {
            var u = cud.getUser();
            if (u == null || u.getId() == null) return Optional.empty();
            // tra theo userId
            return studentRepository.findByUserId(u.getId()).map(Student::getId);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Long> getTeacherId() {
        var principal = auth().getPrincipal();
        if (principal instanceof CustomUserDetails cud) {
            var u = cud.getUser();
            if (u == null || u.getId() == null) return Optional.empty();

            return teacherRepository.findByUser_Id(u.getId()).map(Teacher::getId);
        }
        return Optional.empty();
    }

    @Override
    public Long requireTeacherId() {
        return getTeacherId().orElseThrow(() -> new UnAuthorizeException(ErrorCode.UNAUTHENTICATED));
    }

    @Override
    public String getUsername() {
        var principal = auth().getPrincipal();
        if (principal instanceof CustomUserDetails cud) return cud.getUsername();
        throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
    }

    @Override
    public CustomUserDetails requireUserDetails() {
        var principal = auth().getPrincipal();
        if (principal instanceof CustomUserDetails cud) return cud;
        throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
    }

    @Override
    public User requireUserEntity(boolean reloadFromDb) {
        var cud = requireUserDetails();
        var snap = cud.getUser();
        if (snap == null) throw new UnAuthorizeException(ErrorCode.UNAUTHENTICATED);
        if (!reloadFromDb) return snap;
        return userRepository.findById(snap.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
