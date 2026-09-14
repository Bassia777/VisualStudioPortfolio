'use client';

import { useMemo, useRef, useState } from 'react';
import { VscBriefcase } from 'react-icons/vsc';

import ExperienceDetail from '@/components/ExperienceDetail';
import ExperienceModal from '@/components/ExperienceModal';
import {
  experiences,
  getVisibleExperiences,
  type Experience,
} from '@/data/experiences';
import styles from '@/styles/ExperiencePage.module.css';

interface ExperiencePageProps {
  items?: Experience[];
}

const ExperiencePage = ({ items = experiences }: ExperiencePageProps) => {
  const visibleItems = useMemo(() => getVisibleExperiences(items), [items]);
  const [selectedId, setSelectedId] = useState(
    () => visibleItems[0]?.id ?? ''
  );
  const [modalExperience, setModalExperience] = useState<Experience | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedExperience =
    visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.iconWrapper}>
              <VscBriefcase className={styles.headerIcon} aria-hidden="true" />
            </div>
            <span className={styles.count}>
              {visibleItems.length} Experience
            </span>
          </div>
          <h1 className={styles.title}>Work Experience</h1>
          <p className={styles.subtitle}>
            从质量保障到效能工程，记录每一段工作经历中的职责、实践与交付成果。
          </p>
        </header>

        {selectedExperience ? (
          <div className={styles.workspace}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="Work experience"
            >
              {visibleItems.map((item) => {
                const isSelected = item.id === selectedExperience.id;

                return (
                  <button
                    key={item.id}
                    id={`experience-tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-label={item.company}
                    aria-selected={isSelected}
                    aria-controls={`experience-panel-${item.id}`}
                    className={`${styles.tab} ${
                      isSelected ? styles.activeTab : ''
                    }`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className={styles.tabCompany}>{item.company}</span>
                    <span className={styles.tabPeriod}>{item.period}</span>
                  </button>
                );
              })}
            </div>

            <ExperienceDetail
              key={selectedExperience.id}
              experience={selectedExperience}
              onOpen={() => setModalExperience(selectedExperience)}
              triggerRef={triggerRef}
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyPrompt}>&gt;</span>
            <p>No experience configured yet.</p>
          </div>
        )}
      </div>

      {modalExperience && (
        <ExperienceModal
          experience={modalExperience}
          onClose={() => setModalExperience(null)}
          returnFocusRef={triggerRef}
        />
      )}
    </div>
  );
};

export default ExperiencePage;
