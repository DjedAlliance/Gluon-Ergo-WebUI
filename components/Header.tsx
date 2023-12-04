import { Nav, Navbar } from 'react-bootstrap';
import styles from '../styles/navbar.module.css';
import logo from '../assest/images/logo-tranparent.png';
import lightIcon from '../assest/images/light_mode.png';
import walletButton from '../assest/images/wallet-button.png';
import Image from 'next/image';
import Link from 'next/link';

const MyNavbar = () => {
  return (
    <Navbar bg='transparent' expand='lg' className={styles.container}>
      <Navbar.Brand>
        <Link href='/' className={styles.navLinks}>
          <Image
            src={logo}
            alt='logo'
            width={300}
            height={50}
          />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav' className='d-flex justify-content-end'>
        <Nav className='ml-auto d-flex align-items-center'>
          <Nav.Item className={styles.navContainer}>
            <Link href='/' className={styles.navLinks}>
              <Image
                src={lightIcon}
                alt='Picture of the author'
                className={styles.lightIconStyle}
                width={32}
                height={32}
              />
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href='#about' className={styles.navLinks}>
              <Image
                src={walletButton}
                alt='Picture of the author'
                className={styles.walletButton}
                width={300}
              />
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  );
};

export default MyNavbar;
