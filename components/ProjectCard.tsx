import Image from 'next/image';
import {
  TbSquareRoundedLetterAFilled,
  TbSquareRoundedLetterDFilled,
  TbSquareRoundedLetterRFilled,
} from 'react-icons/tb';
import { VscLinkExternal } from 'react-icons/vsc';

import { Project } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

/* Letter badges (Tabler Icons, MIT). Colour follows the theme accent. */
const letterIcons: Record<string, typeof TbSquareRoundedLetterAFilled> = {
  A: TbSquareRoundedLetterAFilled,
  D: TbSquareRoundedLetterDFilled,
  R: TbSquareRoundedLetterRFilled,
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const LetterIcon = project.icon
    ? letterIcons[project.icon.toUpperCase()]
    : undefined;

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.number}>
        <span>{String(index).padStart(2, '0')}</span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              {LetterIcon ? (
                <LetterIcon size={18} className={styles.logoIcon} aria-hidden />
              ) : project.logo ? (
                <Image
                  src={project.logo}
                  alt={`${project.title} logo`}
                  width={18}
                  height={18}
                  className={styles.logo}
                />
              ) : null}
            </div>
            <h3 className={styles.title}>{project.title}</h3>
          </div>
          
          <p className={styles.description}>{project.description}</p>
        </div>

        <div className={styles.action}>
          <span className={styles.link}>
            View Project
            <VscLinkExternal size={12} />
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
