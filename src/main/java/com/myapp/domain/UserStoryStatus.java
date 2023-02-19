package com.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserStoryStatus.
 */
@Entity
@Table(name = "user_story_status")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserStoryStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @NotNull
    @Column(name = "status_state", nullable = false)
    private String statusState;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserStoryStatus id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public UserStoryStatus userId(Integer userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getStatusState() {
        return this.statusState;
    }

    public UserStoryStatus statusState(String statusState) {
        this.setStatusState(statusState);
        return this;
    }

    public void setStatusState(String statusState) {
        this.statusState = statusState;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserStoryStatus)) {
            return false;
        }
        return id != null && id.equals(((UserStoryStatus) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserStoryStatus{" +
            "id=" + getId() +
            ", userId=" + getUserId() +
            ", statusState='" + getStatusState() + "'" +
            "}";
    }
}
