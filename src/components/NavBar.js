import React from "react";
import { Navbar, Container, Nav, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
      aria-label="Add Post"
    >
      <i className="far fa-plus-square"></i> Add Post
    </NavLink>
  );

  const addChannelIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/channel/create"
      aria-label="Add Channel"
    >
      <i className="far fa-plus-square"></i> Add Channel
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="feed-tooltip">Profiles you follow</Tooltip>}
      >
        <NavLink
          className={styles.NavLink}
          activeClassName={styles.Active}
          to="/feed"
          aria-label="Profiles you follow"
        >
          <i className="fas fa-stream"></i>
        </NavLink>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="likes-tooltip">Your Likes</Tooltip>}
      >
        <NavLink
          className={styles.NavLink}
          activeClassName={styles.Active}
          to="/liked"
          aria-label="Your Likes"
        >
          <i className="fas fa-heart"></i>
        </NavLink>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="channels-tooltip">Channels You Follow</Tooltip>}
      >
        <NavLink
          className={styles.NavLink}
          activeClassName={styles.Active}
          to="/channels/followed"
          aria-label="Channels You Follow"
        >
          <i className="fa-solid fa-tv"></i>
        </NavLink>
      </OverlayTrigger>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut} aria-label="Sign Out">
        <i className="fas fa-sign-out-alt"></i>
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
        aria-label="Your Profile"
      >
        <Avatar src={currentUser?.profile_image} text="" height={40} />
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
        aria-label="Sign In"
      >
        <i className="fas fa-sign-in-alt"></i>
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
        aria-label="Sign Up"
      >
        <i className="fas fa-user-plus"></i>
      </NavLink>
    </>
  );

  return (
    <>
      <Navbar expanded={expanded} className={styles.NavBar} expand="md">
        <Container>
          <NavLink to="/">
            <Navbar.Brand>
              <img src={logo} alt="logo" height="45" />
            </Navbar.Brand>
          </NavLink>
          {currentUser && (
            <Dropdown>
              <Dropdown.Toggle className={styles.CustomDropdownToggle} id="dropdown-basic">
                <i className="far fa-plus-square"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu className={styles.CustomDropdownMenu}>
                <Dropdown.Item as="div">{addPostIcon}</Dropdown.Item>
                <Dropdown.Item as="div">{addChannelIcon}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink exact className={styles.NavLink} activeClassName={styles.Active} to="/" aria-label="Home">
                <i className="fas fa-home"></i>
              </NavLink>

              {currentUser ? loggedInIcons : loggedOutIcons}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
