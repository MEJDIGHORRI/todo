package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.UserStoryStatus;
import com.myapp.repository.UserStoryStatusRepository;
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
 * Integration tests for the {@link UserStoryStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserStoryStatusResourceIT {

    private static final Integer DEFAULT_USER_ID = 1;
    private static final Integer UPDATED_USER_ID = 2;

    private static final String DEFAULT_STATUS_STATE = "AAAAAAAAAA";
    private static final String UPDATED_STATUS_STATE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-story-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserStoryStatusRepository userStoryStatusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserStoryStatusMockMvc;

    private UserStoryStatus userStoryStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStoryStatus createEntity(EntityManager em) {
        UserStoryStatus userStoryStatus = new UserStoryStatus().userId(DEFAULT_USER_ID).statusState(DEFAULT_STATUS_STATE);
        return userStoryStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStoryStatus createUpdatedEntity(EntityManager em) {
        UserStoryStatus userStoryStatus = new UserStoryStatus().userId(UPDATED_USER_ID).statusState(UPDATED_STATUS_STATE);
        return userStoryStatus;
    }

    @BeforeEach
    public void initTest() {
        userStoryStatus = createEntity(em);
    }

    @Test
    @Transactional
    void createUserStoryStatus() throws Exception {
        int databaseSizeBeforeCreate = userStoryStatusRepository.findAll().size();
        // Create the UserStoryStatus
        restUserStoryStatusMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isCreated());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeCreate + 1);
        UserStoryStatus testUserStoryStatus = userStoryStatusList.get(userStoryStatusList.size() - 1);
        assertThat(testUserStoryStatus.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserStoryStatus.getStatusState()).isEqualTo(DEFAULT_STATUS_STATE);
    }

    @Test
    @Transactional
    void createUserStoryStatusWithExistingId() throws Exception {
        // Create the UserStoryStatus with an existing ID
        userStoryStatus.setId(1L);

        int databaseSizeBeforeCreate = userStoryStatusRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserStoryStatusMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUserIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = userStoryStatusRepository.findAll().size();
        // set the field null
        userStoryStatus.setUserId(null);

        // Create the UserStoryStatus, which fails.

        restUserStoryStatusMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isBadRequest());

        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusStateIsRequired() throws Exception {
        int databaseSizeBeforeTest = userStoryStatusRepository.findAll().size();
        // set the field null
        userStoryStatus.setStatusState(null);

        // Create the UserStoryStatus, which fails.

        restUserStoryStatusMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isBadRequest());

        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserStoryStatuses() throws Exception {
        // Initialize the database
        userStoryStatusRepository.saveAndFlush(userStoryStatus);

        // Get all the userStoryStatusList
        restUserStoryStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userStoryStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].statusState").value(hasItem(DEFAULT_STATUS_STATE)));
    }

    @Test
    @Transactional
    void getUserStoryStatus() throws Exception {
        // Initialize the database
        userStoryStatusRepository.saveAndFlush(userStoryStatus);

        // Get the userStoryStatus
        restUserStoryStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, userStoryStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userStoryStatus.getId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.statusState").value(DEFAULT_STATUS_STATE));
    }

    @Test
    @Transactional
    void getNonExistingUserStoryStatus() throws Exception {
        // Get the userStoryStatus
        restUserStoryStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserStoryStatus() throws Exception {
        // Initialize the database
        userStoryStatusRepository.saveAndFlush(userStoryStatus);

        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();

        // Update the userStoryStatus
        UserStoryStatus updatedUserStoryStatus = userStoryStatusRepository.findById(userStoryStatus.getId()).get();
        // Disconnect from session so that the updates on updatedUserStoryStatus are not directly saved in db
        em.detach(updatedUserStoryStatus);
        updatedUserStoryStatus.userId(UPDATED_USER_ID).statusState(UPDATED_STATUS_STATE);

        restUserStoryStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserStoryStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserStoryStatus))
            )
            .andExpect(status().isOk());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
        UserStoryStatus testUserStoryStatus = userStoryStatusList.get(userStoryStatusList.size() - 1);
        assertThat(testUserStoryStatus.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserStoryStatus.getStatusState()).isEqualTo(UPDATED_STATUS_STATE);
    }

    @Test
    @Transactional
    void putNonExistingUserStoryStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();
        userStoryStatus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStoryStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userStoryStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserStoryStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();
        userStoryStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserStoryStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();
        userStoryStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryStatusMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserStoryStatusWithPatch() throws Exception {
        // Initialize the database
        userStoryStatusRepository.saveAndFlush(userStoryStatus);

        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();

        // Update the userStoryStatus using partial update
        UserStoryStatus partialUpdatedUserStoryStatus = new UserStoryStatus();
        partialUpdatedUserStoryStatus.setId(userStoryStatus.getId());

        restUserStoryStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStoryStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStoryStatus))
            )
            .andExpect(status().isOk());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
        UserStoryStatus testUserStoryStatus = userStoryStatusList.get(userStoryStatusList.size() - 1);
        assertThat(testUserStoryStatus.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserStoryStatus.getStatusState()).isEqualTo(DEFAULT_STATUS_STATE);
    }

    @Test
    @Transactional
    void fullUpdateUserStoryStatusWithPatch() throws Exception {
        // Initialize the database
        userStoryStatusRepository.saveAndFlush(userStoryStatus);

        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();

        // Update the userStoryStatus using partial update
        UserStoryStatus partialUpdatedUserStoryStatus = new UserStoryStatus();
        partialUpdatedUserStoryStatus.setId(userStoryStatus.getId());

        partialUpdatedUserStoryStatus.userId(UPDATED_USER_ID).statusState(UPDATED_STATUS_STATE);

        restUserStoryStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStoryStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStoryStatus))
            )
            .andExpect(status().isOk());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
        UserStoryStatus testUserStoryStatus = userStoryStatusList.get(userStoryStatusList.size() - 1);
        assertThat(testUserStoryStatus.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserStoryStatus.getStatusState()).isEqualTo(UPDATED_STATUS_STATE);
    }

    @Test
    @Transactional
    void patchNonExistingUserStoryStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();
        userStoryStatus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStoryStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userStoryStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserStoryStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();
        userStoryStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserStoryStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStoryStatusRepository.findAll().size();
        userStoryStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStoryStatusMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStoryStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStoryStatus in the database
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserStoryStatus() throws Exception {
        // Initialize the database
        userStoryStatusRepository.saveAndFlush(userStoryStatus);

        int databaseSizeBeforeDelete = userStoryStatusRepository.findAll().size();

        // Delete the userStoryStatus
        restUserStoryStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, userStoryStatus.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserStoryStatus> userStoryStatusList = userStoryStatusRepository.findAll();
        assertThat(userStoryStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
