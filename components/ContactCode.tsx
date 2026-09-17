import { profile } from '@/data/profile';
import styles from '@/styles/ContactCode.module.css';

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {profile.contact.map((item) => (
        <p className={styles.line} key={item.social}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          {/* Items without an href (Wechat / QQ) stay plain text */}
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener">
              {item.link}
            </a>
          ) : (
            <span className={styles.plain}>{item.link}</span>
          )}
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
