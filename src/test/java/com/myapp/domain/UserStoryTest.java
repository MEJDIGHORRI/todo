package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserStoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserStory.class);
        UserStory userStory1 = new UserStory();
        userStory1.setId(1L);
        UserStory userStory2 = new UserStory();
        userStory2.setId(userStory1.getId());
        assertThat(userStory1).isEqualTo(userStory2);
        userStory2.setId(2L);
        assertThat(userStory1).isNotEqualTo(userStory2);
        userStory1.setId(null);
        assertThat(userStory1).isNotEqualTo(userStory2);
    }
}
