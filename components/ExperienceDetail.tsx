import type { RefObject } from 'react';
import {
  VscArrowRight,
  VscCalendar,
  VscLocation,
} from 'react-icons/vsc';

import type { Experience } from '@/data/experiences';
import styles from '@/styles/ExperiencePage.module.css';

interface ExperienceDetailProps {
  experience: Experience;
  onOpen: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const ExperienceDetail = ({
  experience,
  onOpen,
  triggerRef,
}: ExperienceDetailProps) => (
  <article
    id="experience-panel"
    className={styles.detail}
    role="tabpanel"
    aria-labelledby={`experience-tab-${experience.id}`}
  >
    <div className={styles.detailHeader}>
      <div>
        <h2 className={styles.role}>{experience.role}</h2>
        <p className={styles.company}>@ {experience.company}</p>
      </div>
      <span className={styles.status}>experience</span>
    </div>

    <div className={styles.meta}>
      <span>
        <VscCalendar aria-hidden="true" />
        {experience.period}
      </span>
      {experience.location && (
        <span>
          <VscLocation aria-hidden="true" />
          {experience.location}
        </span>
      )}
    </div>

    <p className={styles.summary}>{experience.summary}</p>

    {experience.highlights && experience.highlights.length > 0 && (
      <ul className={styles.highlights}>
        {experience.highlights
          .filter((item) => item.trim().length > 0)
          .map((item, index) => (
            <li key={`${experience.id}-highlight-${index}`}>{item.trim()}</li>
          ))}
      </ul>
    )}

    <button
      ref={triggerRef}
      type="button"
      className={styles.viewButton}
      onClick={onOpen}
    >
      <span>View Experience</span>
      <VscArrowRight aria-hidden="true" />
    </button>
  </article>
);

export default ExperienceDetail;
