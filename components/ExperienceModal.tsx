'use client';

import { useEffect, useRef } from 'react';
import { VscClose, VscLocation, VscCalendar } from 'react-icons/vsc';

import {
  Experience,
  getRenderableSections,
} from '@/data/experiences';
import styles from '@/styles/ExperienceModal.module.css';

interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

const getFocusableElements = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );

const ExperienceModal = ({
  experience,
  onClose,
  returnFocusRef,
}: ExperienceModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = `experience-modal-title-${experience.id}`;
  const sections = getRenderableSections(experience.sections);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef?.current?.focus();
    };
  }, [onClose, returnFocusRef]);

  return (
    <div
      className={styles.backdrop}
      data-testid="experience-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>{experience.company}</span>
            <h2 id={titleId} className={styles.title}>
              {experience.role}
            </h2>
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
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            aria-label="Close experience details"
            onClick={onClose}
          >
            <VscClose aria-hidden="true" />
          </button>
        </header>

        <div className={styles.body}>
          {/* Longer copy for the modal; falls back to the card line when omitted */}
          <p className={styles.summary}>
            {experience.detailSummary ?? experience.summary}
          </p>

          {sections.map((section) => (
            <section className={styles.section} key={section.id}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionLine} />
                <h3>{section.title}</h3>
              </div>

              {section.type === 'text' && (
                <p className={styles.paragraph}>{section.content.trim()}</p>
              )}

              {section.type === 'list' && (
                <ul className={styles.list}>
                  {section.content
                    .filter((item) => item.trim().length > 0)
                    .map((item, index) => (
                      <li key={`${section.id}-item-${index}`}>{item.trim()}</li>
                    ))}
                </ul>
              )}

              {section.type === 'tags' && (
                <div className={styles.tags}>
                  {section.content
                    .filter((item) => item.trim().length > 0)
                    .map((item, index) => (
                      <span className={styles.tag} key={`${section.id}-tag-${index}`}>
                        {item.trim()}
                      </span>
                    ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;
