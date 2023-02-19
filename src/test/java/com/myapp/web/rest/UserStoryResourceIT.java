package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.UserStory;
import com.myapp.repository.UserStoryRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserStoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserStoryResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-stories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserStoryMockMvc;

    private UserStory userStory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStory createEntity(EntityManager em) {
        UserStory userStory = new UserStory().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION);
        return userStory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStory createUpdatedEntity(EntityManager em) {
        UserStory userStory = new UserStory().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);
        return userStory;
    }

    @BeforeEach
    public void initTest() {
        userStory = createEntity(em);
    }

    @Test
    @Transactional
    void createUserStory() throws Exception {
        int databaseSizeBeforeCreate = userStoryRepository.findAll().size();
        // Create the UserStory
        restUserStoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStory)))
            .andExpect(status().isCreated());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeCreate + 1);
        UserStory testUserStory = userStoryList.get(userStoryList.size() - 1);
        assertThat(testUserStory.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testUserStory.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createUserStoryWithExistingId() throws Exception {
        // Create the UserStory with an existing ID
        userStory.setId(1L);

        int databaseSizeBeforeCreate = userStoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserStoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStory)))
            .andExpect(status().isBadRequest());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = userStoryRepository.findAll().size();
        // set the field null
        userStory.setTitle(null);

        // Create the UserStory, which fails.

        restUserStoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStory)))
            .andExpect(status().isBadRequest());

        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserStories() throws Exception {
        // Initialize the database
        userStoryRepository.saveAndFlush(userStory);

        // Get all the userStoryList
        restUserStoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userStory.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getUserStory() throws Exception {
        // Initialize the database
        userStoryRepository.saveAndFlush(userStory);

        // Get the userStory
        restUserStoryMockMvc
            .perform(get(ENTITY_API_URL_ID, userStory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userStory.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingUserStory() throws Exception {
        // Get the userStory
        restUserStoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserStory() throws Exception {
        // Initialize the database
        userStoryRepository.saveAndFlush(userStory);

        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();

        // Update the userStory
        UserStory updatedUserStory = userStoryRepository.findById(userStory.getId()).get();
        // Disconnect from session so that the updates on updatedUserStory are not directly saved in db
        em.detach(updatedUserStory);
        updatedUserStory.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restUserStoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserStory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserStory))
            )
            .andExpect(status().isOk());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
        UserStory testUserStory = userStoryList.get(userStoryList.size() - 1);
        assertThat(testUserStory.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testUserStory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingUserStory() throws Exception {
        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();
        userStory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userStory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserStory() throws Exception {
        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();
        userStory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserStory() throws Exception {
        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();
        userStory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserStoryWithPatch() throws Exception {
        // Initialize the database
        userStoryRepository.saveAndFlush(userStory);

        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();

        // Update the userStory using partial update
        UserStory partialUpdatedUserStory = new UserStory();
        partialUpdatedUserStory.setId(userStory.getId());

        partialUpdatedUserStory.description(UPDATED_DESCRIPTION);

        restUserStoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStory))
            )
            .andExpect(status().isOk());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
        UserStory testUserStory = userStoryList.get(userStoryList.size() - 1);
        assertThat(testUserStory.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testUserStory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateUserStoryWithPatch() throws Exception {
        // Initialize the database
        userStoryRepository.saveAndFlush(userStory);

        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();

        // Update the userStory using partial update
        UserStory partialUpdatedUserStory = new UserStory();
        partialUpdatedUserStory.setId(userStory.getId());

        partialUpdatedUserStory.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restUserStoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStory))
            )
            .andExpect(status().isOk());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
        UserStory testUserStory = userStoryList.get(userStoryList.size() - 1);
        assertThat(testUserStory.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testUserStory.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingUserStory() throws Exception {
        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();
        userStory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userStory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserStory() throws Exception {
        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();
        userStory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStory))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserStory() throws Exception {
        int databaseSizeBeforeUpdate = userStoryRepository.findAll().size();
        userStory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userStory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStory in the database
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserStory() throws Exception {
        // Initialize the database
        userStoryRepository.saveAndFlush(userStory);

        int databaseSizeBeforeDelete = userStoryRepository.findAll().size();

        // Delete the userStory
        restUserStoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, userStory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserStory> userStoryList = userStoryRepository.findAll();
        assertThat(userStoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
