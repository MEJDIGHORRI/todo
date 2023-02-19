package com.myapp.repository;

import com.myapp.domain.UserStory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserStory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, Long> {}
