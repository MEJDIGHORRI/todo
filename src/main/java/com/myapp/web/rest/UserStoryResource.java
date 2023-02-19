package com.myapp.web.rest;

import com.myapp.domain.UserStory;
import com.myapp.repository.UserStoryRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.myapp.domain.UserStory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserStoryResource {

    private final Logger log = LoggerFactory.getLogger(UserStoryResource.class);

    private static final String ENTITY_NAME = "userStory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserStoryRepository userStoryRepository;

    public UserStoryResource(UserStoryRepository userStoryRepository) {
        this.userStoryRepository = userStoryRepository;
    }

    /**
     * {@code POST  /user-stories} : Create a new userStory.
     *
     * @param userStory the userStory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userStory, or with status {@code 400 (Bad Request)} if the userStory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-stories")
    public ResponseEntity<UserStory> createUserStory(@Valid @RequestBody UserStory userStory) throws URISyntaxException {
        log.debug("REST request to save UserStory : {}", userStory);
        if (userStory.getId() != null) {
            throw new BadRequestAlertException("A new userStory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserStory result = userStoryRepository.save(userStory);
        return ResponseEntity
            .created(new URI("/api/user-stories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-stories/:id} : Updates an existing userStory.
     *
     * @param id the id of the userStory to save.
     * @param userStory the userStory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStory,
     * or with status {@code 400 (Bad Request)} if the userStory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userStory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-stories/{id}")
    public ResponseEntity<UserStory> updateUserStory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserStory userStory
    ) throws URISyntaxException {
        log.debug("REST request to update UserStory : {}, {}", id, userStory);
        if (userStory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserStory result = userStoryRepository.save(userStory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userStory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-stories/:id} : Partial updates given fields of an existing userStory, field will ignore if it is null
     *
     * @param id the id of the userStory to save.
     * @param userStory the userStory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStory,
     * or with status {@code 400 (Bad Request)} if the userStory is not valid,
     * or with status {@code 404 (Not Found)} if the userStory is not found,
     * or with status {@code 500 (Internal Server Error)} if the userStory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-stories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserStory> partialUpdateUserStory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserStory userStory
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserStory partially : {}, {}", id, userStory);
        if (userStory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserStory> result = userStoryRepository
            .findById(userStory.getId())
            .map(existingUserStory -> {
                if (userStory.getTitle() != null) {
                    existingUserStory.setTitle(userStory.getTitle());
                }
                if (userStory.getDescription() != null) {
                    existingUserStory.setDescription(userStory.getDescription());
                }

                return existingUserStory;
            })
            .map(userStoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userStory.getId().toString())
        );
    }

    /**
     * {@code GET  /user-stories} : get all the userStories.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userStories in body.
     */
    @GetMapping("/user-stories")
    public List<UserStory> getAllUserStories(@RequestParam(required = false) String filter) {
        if ("status-is-null".equals(filter)) {
            log.debug("REST request to get all UserStorys where status is null");
            return StreamSupport
                .stream(userStoryRepository.findAll().spliterator(), false)
                .filter(userStory -> userStory.getStatus() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all UserStories");
        return userStoryRepository.findAll();
    }

    /**
     * {@code GET  /user-stories/:id} : get the "id" userStory.
     *
     * @param id the id of the userStory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userStory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-stories/{id}")
    public ResponseEntity<UserStory> getUserStory(@PathVariable Long id) {
        log.debug("REST request to get UserStory : {}", id);
        Optional<UserStory> userStory = userStoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userStory);
    }

    /**
     * {@code DELETE  /user-stories/:id} : delete the "id" userStory.
     *
     * @param id the id of the userStory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-stories/{id}")
    public ResponseEntity<Void> deleteUserStory(@PathVariable Long id) {
        log.debug("REST request to delete UserStory : {}", id);
        userStoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
