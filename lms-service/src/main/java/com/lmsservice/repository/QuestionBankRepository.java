package com.lmsservice.repository;

import com.lmsservice.entity.QuestionBank;
import com.lmsservice.entity.Subject;
import com.lmsservice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionBankRepository extends JpaRepository<QuestionBank, Long> {

    List<QuestionBank> findBySubjectAndIsActiveTrue(Subject subject);

    List<QuestionBank> findByCreatedByAndIsActiveTrue(User createdBy);

    List<QuestionBank> findBySubjectAndTypeAndIsActiveTrue(Subject subject, Integer type);

    @Query("""
            SELECT q
            FROM QuestionBank q
            WHERE (:subjectId IS NULL OR q.subject.id = :subjectId)
              AND (:type IS NULL OR q.type = :type)
              AND (:active IS NULL OR q.isActive = :active)
              AND (
                    :keyword IS NULL
                 OR  :keyword = ''
                 OR  LOWER(q.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            """)

    Page<QuestionBank> search(
            @Param("subjectId") Long subjectId,
            @Param("type") Integer type,
            @Param("active") Boolean active,
            @Param("keyword") String keyword,
            Pageable pageable
    );
    @Query("""
    select q from QuestionBank q
    where q.isActive = true
      and (:subjectId is null or q.subject.id = :subjectId)
      and (:keyword is null 
           or lower(q.content) like lower(concat('%', :keyword, '%')))
""")
    Page<QuestionBank> filterBySubjectAndKeyword(
            @Param("subjectId") Long subjectId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

}
