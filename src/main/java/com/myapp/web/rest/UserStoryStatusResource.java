package com.myapp.web.rest;

import com.myapp.domain.UserStoryStatus;
import com.myapp.repository.UserStoryStatusRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.UserStoryStatus}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserStoryStatusResource {

    private final Logger log = LoggerFactory.getLogger(UserStoryStatusResource.class);

    private static final String ENTITY_NAME = "userStoryStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserStoryStatusRepository userStoryStatusRepository;

    public UserStoryStatusResource(UserStoryStatusRepository userStoryStatusRepository) {
        this.userStoryStatusRepository = userStoryStatusRepository;
    }

    /**
     * {@code POST  /user-story-statuses} : Create a new userStoryStatus.
     *
     * @param userStoryStatus the userStoryStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userStoryStatus, or with status {@code 400 (Bad Request)} if the userStoryStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-story-statuses")
    public ResponseEntity<UserStoryStatus> createUserStoryStatus(@Valid @RequestBody UserStoryStatus userStoryStatus)
        throws URISyntaxException {
        log.debug("REST request to save UserStoryStatus : {}", userStoryStatus);
        if (userStoryStatus.getId() != null) {
            throw new BadRequestAlertException("A new userStoryStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserStoryStatus result = userStoryStatusRepository.save(userStoryStatus);
        return ResponseEntity
            .created(new URI("/api/user-story-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-story-statuses/:id} : Updates an existing userStoryStatus.
     *
     * @param id the id of the userStoryStatus to save.
     * @param userStoryStatus the userStoryStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStoryStatus,
     * or with status {@code 400 (Bad Request)} if the userStoryStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userStoryStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-story-statuses/{id}")
    public ResponseEntity<UserStoryStatus> updateUserStoryStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserStoryStatus userStoryStatus
    ) throws URISyntaxException {
        log.debug("REST request to update UserStoryStatus : {}, {}", id, userStoryStatus);
        if (userStoryStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStoryStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStoryStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserStoryStatus result = userStoryStatusRepository.save(userStoryStatus);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userStoryStatus.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-story-statuses/:id} : Partial updates given fields of an existing userStoryStatus, field will ignore if it is null
     *
     * @param id the id of the userStoryStatus to save.
     * @param userStoryStatus the userStoryStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStoryStatus,
     * or with status {@code 400 (Bad Request)} if the userStoryStatus is not valid,
     * or with status {@code 404 (Not Found)} if the userStoryStatus is not found,
     * or with status {@code 500 (Internal Server Error)} if the userStoryStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-story-statuses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserStoryStatus> partialUpdateUserStoryStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserStoryStatus userStoryStatus
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserStoryStatus partially : {}, {}", id, userStoryStatus);
        if (userStoryStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStoryStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStoryStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserStoryStatus> result = userStoryStatusRepository
            .findById(userStoryStatus.getId())
            .map(existingUserStoryStatus -> {
                if (userStoryStatus.getUserId() != null) {
                    existingUserStoryStatus.setUserId(userStoryStatus.getUserId());
                }
                if (userStoryStatus.getStatusState() != null) {
                    existingUserStoryStatus.setStatusState(userStoryStatus.getStatusState());
                }

                return existingUserStoryStatus;
            })
            .map(userStoryStatusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userStoryStatus.getId().toString())
        );
    }

    /**
     * {@code GET  /user-story-statuses} : get all the userStoryStatuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userStoryStatuses in body.
     */
    @GetMapping("/user-story-statuses")
    public List<UserStoryStatus> getAllUserStoryStatuses() {
        log.debug("REST request to get all UserStoryStatuses");
        return userStoryStatusRepository.findAll();
    }

    /**
     * {@code GET  /user-story-statuses/:id} : get the "id" userStoryStatus.
     *
     * @param id the id of the userStoryStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userStoryStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-story-statuses/{id}")
    public ResponseEntity<UserStoryStatus> getUserStoryStatus(@PathVariable Long id) {
        log.debug("REST request to get UserStoryStatus : {}", id);
        Optional<UserStoryStatus> userStoryStatus = userStoryStatusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userStoryStatus);
    }

    /**
     * {@code DELETE  /user-story-statuses/:id} : delete the "id" userStoryStatus.
     *
     * @param id the id of the userStoryStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-story-statuses/{id}")
    public ResponseEntity<Void> deleteUserStoryStatus(@PathVariable Long id) {
        log.debug("REST request to delete UserStoryStatus : {}", id);
        userStoryStatusRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
