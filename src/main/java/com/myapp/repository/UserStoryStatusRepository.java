package com.myapp.repository;

import com.myapp.domain.UserStoryStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserStoryStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserStoryStatusRepository extends JpaRepository<UserStoryStatus, Long> {}
