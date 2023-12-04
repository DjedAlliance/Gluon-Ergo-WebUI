import { useRouter } from 'next/router';
import submitStyles from '../../styles/Submit.module.css';
import navStyle from '../../styles/navbar.module.css';

const SideBar = () => {
  const { pathname } = useRouter();
  return (
    <div className="col-6 col-md-3">
      <ul className={submitStyles.list}>
        <li className={submitStyles.listLinks}>
          {pathname === '/create-collection' ? (
            <p className={navStyle.sideBarLink} style={{ color: '#FFD363' }}>
              CREATE COLLECTION
            </p>
          ) : (
            <p className={navStyle.sideBarLink}>CREATE COLLECTION</p>
          )}
        </li>
        <li className={submitStyles.listLinks}>
          {pathname === '/uploads' ? (
            <p className={navStyle.sideBarLink} style={{ color: '#FFD363' }}>
              Upload files
            </p>
          ) : (
            <span>
              <p className={navStyle.sideBarLink}>Upload files</p>
            </span>
          )}
        </li>
        <li className={submitStyles.listLinks}>
          {pathname === '/payment' ? (
            <p className={navStyle.sideBarLink} style={{ color: '#FFD363' }}>
              PAYMENT
            </p>
          ) : (
            <span>
              <p className={navStyle.sideBarLink}>PAYMENT</p>
            </span>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
