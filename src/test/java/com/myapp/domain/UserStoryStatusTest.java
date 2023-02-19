package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserStoryStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserStoryStatus.class);
        UserStoryStatus userStoryStatus1 = new UserStoryStatus();
        userStoryStatus1.setId(1L);
        UserStoryStatus userStoryStatus2 = new UserStoryStatus();
        userStoryStatus2.setId(userStoryStatus1.getId());
        assertThat(userStoryStatus1).isEqualTo(userStoryStatus2);
        userStoryStatus2.setId(2L);
        assertThat(userStoryStatus1).isNotEqualTo(userStoryStatus2);
        userStoryStatus1.setId(null);
        assertThat(userStoryStatus1).isNotEqualTo(userStoryStatus2);
    }
}
